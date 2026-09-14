import * as z from 'zod'

import { unitSlugs } from './units'

export const unitSlugSchema = z.enum(unitSlugs)
