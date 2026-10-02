import { getDb } from '@recipe-organizer/server/lib/db'
import { listRecipes } from '@recipe-organizer/server/recipe/queries'
import { defineHandler } from 'void'
import type { InferProps } from 'void'

export type Props = InferProps<typeof loader>

export const loader = defineHandler(async () => ({ recipes: await listRecipes(getDb()) }))
