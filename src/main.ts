import '@/styles/global.css'
import '@/styles/styles.css'
import { mount } from 'svelte'
import { config, locales } from 'zod'

import App from './app.svelte'

config(locales.fr())

const target = document.querySelector('#app')
if (target) {
  mount(App, { target })
}
