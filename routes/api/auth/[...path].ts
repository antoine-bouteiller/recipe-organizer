import { getAuth } from '@recipe-organizer/server/lib/auth/auth-server'
import { defineHandler } from 'void'

const handleAuth = defineHandler((context) => getAuth().handler(context.req.raw))

export const GET = handleAuth
export const POST = handleAuth
