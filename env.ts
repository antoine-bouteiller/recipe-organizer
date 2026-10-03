import { defineEnv, string } from 'void/env'

// Scaffolded from .env. Inference is conservative — review each
// Entry and tighten types as needed (e.g. oneOf([...]), url(), .optional(),
// .default(value), or a Standard Schema validator from valibot/zod/arktype).
export default defineEnv({
  BETTER_AUTH_SECRET: string(),
  GOOGLE_CLIENT_ID: string(),
  GOOGLE_CLIENT_SECRET: string(),
})
