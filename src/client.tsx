import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/react-start'
import { createRouter } from './router'
import * as Sentry from '@sentry/tanstackstart-react'

const router = createRouter()

Sentry.init({
  dsn: 'https://19a6903c06caab9b71b5fcd5e30d796e@o4510005971058688.ingest.de.sentry.io/4510005973811280',
  sendDefaultPii: true,
  integrations: [],
  enableLogs: true,
  enabled: import.meta.env.PROD,
})

hydrateRoot(document, <StartClient router={router} />)
