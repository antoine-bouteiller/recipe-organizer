import { getTheme } from '@client/lib/theme'
import { getRouter } from '@client/router'
import { RouterProvider } from '@tanstack/react-router'
import { createRoot } from 'react-dom/client'
import '@recipe-organizer/design-system/tokens'

import '@client/styles/app.css'

document.documentElement.className = getTheme()

const root = document.getElementById('root')

if (root) {
  createRoot(root).render(<RouterProvider router={getRouter()} />)
}

if ('serviceWorker' in navigator) {
  void navigator.serviceWorker.register('/sw.js', { scope: '/', type: 'module' }).catch(() => undefined)
}
