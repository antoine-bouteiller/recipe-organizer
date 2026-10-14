import type { Component } from 'svelte'

import { ingredientListQuery } from '@/features/ingredients/client/api/get-all'
import { recipeListQuery } from '@/features/recipe/client/api/get-all'
import { recipeDetailQuery } from '@/features/recipe/client/api/get-one'
import { userListQuery } from '@/features/users/client/api/get-all'
import { queryClient } from '@/lib/client/query-client'

import type { Access } from './guard'

// Screens either take the matched `params` or no props at all.
export type RouteComponent = Component<{ params: Record<string, string> }> | Component<Record<string, never>>

export interface RouteDefinition {
  readonly pattern: `/${string}`
  readonly access?: Access
  readonly component: () => Promise<{ default: RouteComponent }>
  readonly preload?: (params: Record<string, string>) => Promise<unknown>
}

// `/recipe/new` and `/recipe/edit/:id` must precede `/recipe/:id`.
export const routes: readonly RouteDefinition[] = [
  { component: () => import('@/pages/index.svelte'), pattern: '/', preload: () => queryClient.query({ ...recipeListQuery(), staleTime: 'static' }) },
  {
    component: () => import('@/pages/search/index.svelte'),
    pattern: '/search',
    preload: () => queryClient.query({ ...recipeListQuery(), staleTime: 'static' }),
  },
  { component: () => import('@/pages/shopping-list/index.svelte'), pattern: '/shopping-list' },
  {
    access: 'member',
    component: () => import('@/pages/recipe/new/index.svelte'),
    pattern: '/recipe/new',
    preload: () =>
      Promise.all([
        queryClient.query({ ...ingredientListQuery(), staleTime: 'static' }),
        queryClient.query({ ...recipeListQuery(), staleTime: 'static' }),
      ]),
  },
  {
    access: 'member',
    component: () => import('@/pages/recipe/edit/[id]/index.svelte'),
    pattern: '/recipe/edit/:id',
    preload: ({ id }) =>
      Promise.all([
        queryClient.query({ ...recipeDetailQuery(Number(id)), staleTime: 'static' }),
        queryClient.query({ ...ingredientListQuery(), staleTime: 'static' }),
        queryClient.query({ ...recipeListQuery(), staleTime: 'static' }),
      ]),
  },
  {
    component: () => import('@/pages/recipe/[id]/index.svelte'),
    pattern: '/recipe/:id',
    preload: ({ id }) => queryClient.query({ ...recipeDetailQuery(Number(id)), staleTime: 'static' }),
  },
  { access: 'guest', component: () => import('@/pages/auth/login/index.svelte'), pattern: '/auth/login' },
  { access: 'member', component: () => import('@/pages/settings/index.svelte'), pattern: '/settings' },
  { access: 'member', component: () => import('@/pages/settings/account/index.svelte'), pattern: '/settings/account' },
  {
    access: 'member',
    component: () => import('@/pages/settings/ingredients/index.svelte'),
    pattern: '/settings/ingredients',
    preload: () => queryClient.query({ ...ingredientListQuery(), staleTime: 'static' }),
  },
  {
    access: 'admin',
    component: () => import('@/pages/settings/users/index.svelte'),
    pattern: '/settings/users',
    preload: () =>
      Promise.all([
        queryClient.query({ ...userListQuery('active'), staleTime: 'static' }),
        queryClient.query({ ...userListQuery('pending'), staleTime: 'static' }),
        queryClient.query({ ...userListQuery('blocked'), staleTime: 'static' }),
      ]),
  },
]
