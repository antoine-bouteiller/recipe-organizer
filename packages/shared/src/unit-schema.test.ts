import { unitSlugSchema } from '@recipe-organizer/shared/unit-schema'
import { describe, expect, it } from 'vite-plus/test'

describe('unitSlugSchema', () => {
  it('accepts known unit slugs and rejects unknown values', () => {
    expect(unitSlugSchema.safeParse('kg').success).toBe(true)
    expect(unitSlugSchema.safeParse('unknown-unit').success).toBe(false)
  })
})
