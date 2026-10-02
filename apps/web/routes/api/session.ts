import { defineHandler } from 'void'

import { getApiUser } from '#server/lib/auth/api-user'
import { jsonNullable } from '#server/lib/json-nullable'

export const GET = defineHandler(async (context) => jsonNullable(await getApiUser(context)))
