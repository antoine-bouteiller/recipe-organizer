import { Separator as SeparatorPrimitive } from '@base-ui/react/separator'
import type React from 'react'

import * as styles from './separator.css'

export const Separator = (): React.ReactElement => <SeparatorPrimitive className={styles.separator} data-slot="separator" />
