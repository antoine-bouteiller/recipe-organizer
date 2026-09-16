const path = require('node:path')
const panda = require('@pandacss/postcss').default

module.exports = {
  plugins: [panda({ configPath: path.join(__dirname, 'panda.config.ts'), cwd: __dirname })],
}
