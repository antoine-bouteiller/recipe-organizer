import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

import { getDb } from '@/lib/db'
import { queryKeys } from '@/lib/query-keys'

const getUnitsList = createServerFn({
  method: 'GET',
}).handler(() =>
  getDb().query.unit.findMany({
    orderBy: {
      name: 'asc',
    },
    with: {
      parent: true,
    },
  })
)

export type Unit = Awaited<ReturnType<typeof getUnitsList>>[number]

const getUnitsListOptions = () =>
  queryOptions({
    queryFn: getUnitsList,
    queryKey: queryKeys.unitList(),
  })

export { getUnitsList, getUnitsListOptions }
