import { defineHandler } from 'void'
import type { InferProps } from 'void'

import { listRecipes } from '@/features/recipe/server/queries'
import { getDb } from '@/lib/server/db'

export type Props = InferProps<typeof loader>

export const loader = defineHandler(async () => ({ recipes: await listRecipes(getDb()) }))
