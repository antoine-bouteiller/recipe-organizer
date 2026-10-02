import { getDb } from '@recipe-organizer/server/lib/db'
import { listRecipes } from '@recipe-organizer/server/recipe/queries'
import { defineHandler } from 'void'

export const GET = defineHandler(() => listRecipes(getDb()))
