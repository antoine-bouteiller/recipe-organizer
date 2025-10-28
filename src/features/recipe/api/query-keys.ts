export const recipesQueryKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipesQueryKeys.all, 'list'] as const,
  list: (search?: string) => [...recipesQueryKeys.lists(), 'all', search] as const,
  listByIds: (ids: number[]) => [...recipesQueryKeys.lists(), ids] as const,
  detail: (id: number) => [...recipesQueryKeys.all, 'detail', id] as const,
}
