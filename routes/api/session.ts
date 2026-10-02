import { getApiUser } from '@recipe-organizer/server/lib/auth/api-user'
import { jsonNullable } from '@recipe-organizer/server/lib/json-nullable'
import { defineHandler } from 'void'

export const GET = defineHandler(async (context) => jsonNullable(await getApiUser(context)))
