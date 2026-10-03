import { spacing } from './spacing'

import * as styles from './tokens.css'

export const theme = {
  spacing,
  ...styles.vars,
  radius: { ...styles.vars.radius, inherit: 'inherit' },
}
