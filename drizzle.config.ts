import { defineConfig } from 'drizzle-kit'

const drizzleConfig = defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
})

export default drizzleConfig
