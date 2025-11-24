import { getDb } from '@/lib/db'
import { unit } from '@/lib/db/schema'
import { queryKeys } from '@/lib/query-keys'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { asc } from 'drizzle-orm'

const getUnitsList = createServerFn({
  method: 'GET',
}).handler(() =>
  getDb().query.unit.findMany({
    orderBy: asc(unit.name),
    with: {
      parent: true,
    },
  })
)

export type Unit = Awaited<ReturnType<typeof getUnitsList>>[number]

const getUnitsListOptions = () =>
  queryOptions({
    queryKey: queryKeys.unitList(),
    queryFn: getUnitsList,
  })

export { getUnitsList, getUnitsListOptions }
