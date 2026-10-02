import type { RouteMap } from 'void/routes'

export type Ingredient = RouteMap['/api/ingredients']['GET']['output'][number]
