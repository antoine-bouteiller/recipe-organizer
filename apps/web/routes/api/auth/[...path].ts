import { defineHandler } from 'void'

import { getAuth } from '#server/lib/auth/auth-server'

const handleAuth = defineHandler((context) => getAuth().handler(context.req.raw))

export const GET = handleAuth
export const POST = handleAuth
