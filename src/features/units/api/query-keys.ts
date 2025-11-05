export const unitKeys = {
  all: ['units'] as const,
  lists: () => [...unitKeys.all, 'list'] as const,
  list: (filters: string) => [...unitKeys.lists(), { filters }] as const,
  details: () => [...unitKeys.all, 'detail'] as const,
  detail: (id: number) => [...unitKeys.details(), id] as const,
}
