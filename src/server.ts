import handler from '@tanstack/react-start/server-entry'
import * as Sentry from '@sentry/tanstackstart-react'

Sentry.init({
  dsn: 'https://19a6903c06caab9b71b5fcd5e30d796e@o4510005971058688.ingest.de.sentry.io/4510005973811280',
  sendDefaultPii: true,
  enableLogs: true,
  integrations: [
    // send console.log, console.warn, and console.error calls as logs to Sentry
    Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
  ],
  enabled: import.meta.env.PROD,
})

export default {
  fetch(request: Request) {
    return handler.fetch(request)
  },
}
