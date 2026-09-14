const isRouteParams = (value: unknown): value is object => typeof value === 'object' && value !== null && !Array.isArray(value)

export const parseRecipeId = (params: unknown) => {
  if (!isRouteParams(params) || !('id' in params) || typeof params.id !== 'string') {
    throw new Error('Invalid id')
  }

  return { id: Number.parseInt(params.id, 10) }
}

export const parseRecipeListSearch = (search: unknown) => {
  if (!isRouteParams(search)) {
    throw new Error('Invalid search params')
  }

  if (!('search' in search)) {
    return {}
  }

  if (search.search !== undefined && typeof search.search !== 'boolean') {
    throw new Error('Invalid search params')
  }

  return { search: search.search }
}

export const parseLoginSearch = (search: unknown) => {
  if (!isRouteParams(search)) {
    throw new Error('Invalid search params')
  }

  if (!('error' in search)) {
    return {}
  }

  if (search.error !== undefined && typeof search.error !== 'string') {
    throw new Error('Invalid search params')
  }

  return { error: search.error }
}
