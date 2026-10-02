import type { RouteMap } from 'void/routes'

export type ReducedRecipe = RouteMap['/api/recipes']['GET']['output'][number]
