import * as z from 'zod'

import { unitSlugs } from '@/utils/units'

export const unitSlugSchema = z.enum(unitSlugs)
