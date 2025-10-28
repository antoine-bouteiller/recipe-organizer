export const ingredientsQueryKeys = {
  all: ['ingredients'] as const,
  list: () => [...ingredientsQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...ingredientsQueryKeys.all, id] as const,
}
