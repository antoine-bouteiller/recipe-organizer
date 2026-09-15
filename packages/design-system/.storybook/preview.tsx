import { type Preview } from '@storybook/react-vite'
import { useEffect } from 'react'
import { MINIMAL_VIEWPORTS } from 'storybook/viewport'

import '../src/styles.css'

const preview: Preview = {
  decorators: [
    function Theme(Story, context) {
      const { theme } = context.globals
      useEffect(() => {
        // Apply to the document so portaled dialogs, drawers and toasts inherit the theme too.
        document.documentElement.classList.toggle('dark', theme === 'dark')
      }, [theme])
      return <Story />
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
