import { PrismaClient } from '@/generated/prisma/client'
import { getBindings } from '@/lib/bindings'
import { PrismaD1 } from '@prisma/adapter-d1'

export const getDb = () => {
  const d1Adapter = new PrismaD1(getBindings().DB)
  return new PrismaClient({ adapter: d1Adapter })
}
