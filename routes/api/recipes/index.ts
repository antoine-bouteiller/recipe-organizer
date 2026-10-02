import { defineHandler } from 'void'

import { listRecipes } from '@/features/recipe/server/queries'
import { getDb } from '@/lib/server/db'

export const GET = defineHandler(() => listRecipes(getDb()))
