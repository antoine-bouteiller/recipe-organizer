import { RouterProvider } from '@tanstack/react-router'
import { createRoot } from 'react-dom/client'

import { getTheme } from '@/lib/theme'
import { getRouter } from '@/router'

import '@/styles/app.css'

document.documentElement.className = getTheme()

const root = document.getElementById('root')

if (root) {
  createRoot(root).render(<RouterProvider router={getRouter()} />)
}
