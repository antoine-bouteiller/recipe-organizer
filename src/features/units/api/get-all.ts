import { getDb } from '@/lib/db'
import { unit } from '@/lib/db/schema'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { asc } from 'drizzle-orm'
import { unitKeys } from './query-keys'

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

const getUnitsListOptions = () =>
  queryOptions({
    queryKey: unitKeys.list(''),
    queryFn: getUnitsList,
  })

export { getUnitsListOptions, getUnitsList }
