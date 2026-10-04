import type { Preview } from '@storybook/svelte-vite'
import { MINIMAL_VIEWPORTS } from 'storybook/viewport'

import '@/styles/global.css'
import '@/styles/styles.css'

const preview: Preview = {
  decorators: [
    (story, context) => {
      // Apply to the document so portaled dialogs, drawers and toasts inherit the theme too.
      document.documentElement.classList.toggle('dark', context.globals.theme === 'dark')
      return story()
    },
  ],
  globalTypes: {
    theme: {
      description: 'Component color theme',
      toolbar: {
        dynamicTitle: true,
        icon: 'circlehollow',
        items: ['light', 'dark'],
      },
    },
  },
  initialGlobals: { theme: 'light' },
  parameters: {
    controls: { matchers: { color: /(?:background|color)$/i, date: /Date$/i } },
    layout: 'centered',
    viewport: { options: MINIMAL_VIEWPORTS },
  },
}

export default preview
