import { execFile as execFileCallback } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { basename, extname, resolve } from 'node:path'
import { promisify } from 'node:util'

const execFile = promisify(execFileCallback)
const root = resolve(import.meta.dirname, '../../apps/web/dist')
const requests = new Map<string, number>()
let offline = false
const mime = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}
const mimeByExtension = new Map(Object.entries(mime))
const instructions = JSON.stringify({
  root: {
    children: [
      { program: 'expert', rotationSpeed: 'auto', temperature: 80, time: 60, type: 'magimixProgram', version: 1 },
      {
        children: [{ detail: 0, format: 0, mode: 'normal', style: '', text: 'Mélanger.', type: 'text', version: 1 }],
        direction: null,
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
})
const recipes = Array.from({ length: 8 }, (_ignored, index) => ({
  cuisineTypes: [],
  id: index + 1,
  image: '/icon-192.png',
  isMagimix: false,
  isSpice: false,
  isVegetarian: false,
  meals: [],
  name: `Recette ${index + 1}`,
  servings: 2,
}))
const detail = { ...recipes[0], ingredientGroups: [], instructions, linkedRecipes: [], video: null }

const json = (body: unknown) => JSON.stringify(body)
const fixtureApi = new Map([
  ['/api/ingredients', json([])],
  ['/api/session', json(null)],
  ['/api/recipes', json(recipes)],
  ['/api/recipes/1', json(detail)],
  ['/api/shopping-list/recipes', json([])],
])
const server = createServer((request, response) => {
  void (async () => {
    const url = new URL(request.url ?? '/', 'http://localhost')
    requests.set(url.pathname, (requests.get(url.pathname) ?? 0) + 1)
    const api = fixtureApi.get(url.pathname)
    if (request.method !== 'GET') {
      response.writeHead(405).end()
      return
    }
    if (api && offline) {
      response.destroy()
      return
    }
    if (api) {
      response.writeHead(200, { 'content-type': 'application/json' })
      response.end(api)
    } else {
      const file = resolve(root, `.${url.pathname === '/' ? '/index.html' : url.pathname}`)
      try {
        if (!file.startsWith(`${root}/`)) {
          throw new Error('outside dist')
        }
        const body = await readFile(file)
        response.writeHead(200, { 'content-type': mimeByExtension.get(extname(file)) ?? 'application/octet-stream' })
        response.end(body)
      } catch {
        // The production SPA owns client routes; only assets must exist on disk.
        try {
          response.writeHead(200, { 'content-type': 'text/html' })
          response.end(await readFile(resolve(root, 'index.html')))
        } catch {
          response.writeHead(404).end(`Missing production build asset: ${basename(file)}`)
        }
      }
    }
  })()
})

const listen = () =>
  new Promise<number>((done) =>
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      if (!address || typeof address === 'string') {
        throw new Error('Fixture server did not bind a TCP port')
      }
      done(address.port)
    })
  )
const close = () => new Promise<void>((done) => server.close(() => done()))
const must = (condition: unknown, message: string) => {
  if (!condition) {
    throw new Error(message)
  }
}

const main = async () => {
  must(await readFile(resolve(root, 'index.html')).catch(() => undefined), 'Run the web production build before this check.')
  const { stdout } = await execFile('agent-browser', ['session', 'id', '--scope', 'worktree', '--prefix', `web-smoke-${process.pid}`])
  const temporary = await mkdtemp(resolve(tmpdir(), 'recipe-smoke-'))
  const initScript = resolve(temporary, 'offline.js')
  // Keep the offline signal across reloads, which can reset CDP network emulation.
  await writeFile(initScript, "Object.defineProperty(navigator, 'onLine', { get: () => sessionStorage.getItem('smoke-offline') !== 'true' })")
  const env = { ...process.env, AGENT_BROWSER_INIT_SCRIPTS: initScript, AGENT_BROWSER_SESSION: stdout.trim() }
  const browser = async (command: string, args: string[] = []) => execFile('agent-browser', [command, ...args], { env, maxBuffer: 1024 * 1024 })
  const evaluate = (script: string) => browser('eval', ['--base64', Buffer.from(`(async () => { ${script}\n })()`).toString('base64')])
  const port = await listen()
  const origin = `http://127.0.0.1:${port}`
  const count = (path: string) => requests.get(path) ?? 0
  const clearRequests = () => requests.clear()

  try {
    await browser('set', ['viewport', '1440', '900'])
    await browser('open', [origin])
    await browser('wait', ['--fn', "document.querySelectorAll('main img').length >= 8"])
    await evaluate(`
      const fail = message => { throw new Error(message) }
      const images = [...document.querySelectorAll('main img')]
      if (images.length < 8 || images.slice(0, 6).some(image => image.loading !== 'eager') || images.slice(6).some(image => image.loading !== 'lazy')) fail('recipe image loading priorities changed')
      if (document.querySelector('input[placeholder="Rechercher une recette"]')) fail('search palette eagerly rendered')
      const urls = performance.getEntriesByType('resource').map(entry => entry.name)
      if (urls.some(url => url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) || urls.filter(url => ['.woff', '.woff2', '.ttf', '.otf'].some(extension => new URL(url).pathname.endsWith(extension))).some(url => new URL(url).origin !== location.origin)) fail('fonts are not fully local')
    `)
    await browser('wait', ['button[aria-label="Rechercher une recette"]'])
    await browser('press', ['Meta+k'])
    await browser('wait', ['input[placeholder="Rechercher une recette"]'])
    await browser('press', ['Escape'])
    await evaluate(
      `if (document.activeElement?.getAttribute('aria-label') !== 'Rechercher une recette') throw new Error('Escape did not restore search trigger focus')`
    )

    clearRequests()
    await browser('set', ['viewport', '390', '844'])
    await browser('open', [`${origin}/recipe/1`])
    await browser('wait', ['--fn', "document.querySelectorAll('[data-lexical-editor]').length === 1"])
    await evaluate(`if (document.querySelector('input[placeholder="Rechercher une recette"]')) throw new Error('mobile search palette rendered')`)
    must(count('/api/recipes') === 0, 'direct recipe view fetched the recipe catalogue')
    must(
      ![...requests.keys()].some((path) => /(?:form-dialog|subrecipe-dialog|magimix-program-dialog|editor-field)-/.test(path)),
      'read-only recipe view loaded editing code'
    )
    await evaluate(`
      if (performance.getEntriesByType('resource').some(entry => entry.name.includes('search-command-palette-'))) throw new Error('mobile loaded the desktop command palette')
    `)
    await browser('set', ['viewport', '1440', '900'])
    await browser('wait', ['--fn', "document.querySelectorAll('[data-lexical-editor]').length === 1"])

    await browser('open', [`${origin}/recipe/new`])
    await browser('wait', ['--url', '**/auth/login'])

    // Seed public recipe data under SW control, then prove it remains available offline.
    await browser('open', [`${origin}/recipe/1`])
    await browser('wait', ['--fn', 'navigator.serviceWorker?.controller'])
    await browser('wait', ['--fn', "document.querySelectorAll('[data-lexical-editor]').length === 1"])
    offline = true
    await evaluate("sessionStorage.setItem('smoke-offline', 'true')")
    await browser('set', ['offline', 'on'])
    await browser('reload')
    await browser('wait', ['--text', 'Recette 1'])
    await browser('wait', ['--fn', "document.querySelectorAll('[data-lexical-editor]').length === 1"])
    await evaluate(`
      const cached = await Promise.all((await caches.keys()).map(async key => (await caches.open(key)).match('/api/session')))
      if (cached.some(Boolean)) throw new Error('session API was cached')
    `)
    offline = false
    await evaluate("sessionStorage.removeItem('smoke-offline')")
    await browser('set', ['offline', 'off'])

    await evaluate(`localStorage.setItem('shopping-list', '[1]')`)
    clearRequests()
    await browser('open', [`${origin}/shopping-list`])
    await browser('wait', ['--text', 'Votre liste de courses est vide'])
    must(count('/api/shopping-list/recipes') > 0, 'shopping-list prefetch did not request selected recipes')
    offline = true
    await evaluate("sessionStorage.setItem('smoke-offline', 'true')")
    await browser('set', ['offline', 'on'])
    await browser('reload')
    await browser('wait', ['--text', 'Votre liste de courses est vide'])
    await evaluate("localStorage.setItem('shopping-list', '[2]')")
    await browser('reload')
    await browser('wait', ['--text', 'Une erreur est survenue'])
    offline = false
    await evaluate("sessionStorage.removeItem('smoke-offline')")
    await browser('set', ['offline', 'off'])
    await browser('wait', ['--load', 'networkidle'])
    await evaluate(`localStorage.setItem('shopping-list', '[]')`)
    clearRequests()
    await browser('open', [`${origin}/shopping-list`])
    await browser('wait', ['--text', 'Votre liste de courses est vide'])
    must(count('/api/shopping-list/recipes') === 0, 'shopping-list requested recipes for an empty selection')
    fixtureApi.set('/api/session', json({ email: 'test@example.com', id: 'test', name: 'Test', role: 'admin' }))
    await browser('open', [`${origin}/recipe/edit/1`])
    await browser('wait', ['[contenteditable="true"]'])
    await browser('wait', ['button[aria-haspopup="dialog"]:has(img[alt="Magimix Program Icon"])'])
    await browser('click', ['button[aria-haspopup="dialog"]:has(img[alt="Magimix Program Icon"])'])
    await browser('wait', ['--text', 'Modifier le programme Magimix'])
    await browser('press', ['Escape'])
    await browser('open', [`${origin}/recipe/new`])
    await browser('wait', ['[contenteditable="true"]'])
    process.stdout.write('web production smoke/performance checks passed\n')
  } catch (error) {
    const diagnostics = await browser('console').catch(() => ({ stdout: '' }))
    const snapshot = await browser('snapshot').catch(() => ({ stdout: '' }))
    const state = await browser('eval', [
      '(async () => ({ online: navigator.onLine, url: location.href, caches: await Promise.all((await caches.keys()).map(async name => ({name, urls: (await (await caches.open(name)).keys()).map(r => r.url)}))) }))()',
    ]).catch(() => ({ stdout: '' }))
    process.stderr.write(`${diagnostics.stdout}\n${snapshot.stdout}\n${state.stdout}\n`)
    throw error
  } finally {
    await browser('set', ['offline', 'off']).catch(() => undefined)
    await browser('close').catch(() => undefined)
    await close()
    await rm(temporary, { force: true, recursive: true })
  }
}

void main().catch((error: unknown) => {
  process.stderr.write(`${String(error)}\n`)
  process.exitCode = 1
})
