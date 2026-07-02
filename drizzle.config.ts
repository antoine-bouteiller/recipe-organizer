import { defineConfig } from 'drizzle-kit'

const drizzleConfig = defineConfig({
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID,
    token: process.env.CLOUDFLARE_D1_TOKEN,
  },
  dialect: 'sqlite',
  driver: 'd1-http',
  out: './db/migrations',
  schema: './db/schema/index.ts',
})

export default drizzleConfig
