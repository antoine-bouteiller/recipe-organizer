import { defineHandler } from 'void'

import { getAuth } from '@/lib/server/auth/auth-server'

const handleAuth = defineHandler((context) => getAuth().handler(context.req.raw))

export const GET = handleAuth
export const POST = handleAuth
