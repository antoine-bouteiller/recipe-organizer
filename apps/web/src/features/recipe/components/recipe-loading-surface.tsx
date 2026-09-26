import type { ReactNode } from 'react'

import * as styles from './recipe-loading-surface.css'

export const RecipeLoadingSurface = ({ children }: { readonly children: ReactNode }) => <div className={styles.surface}>{children}</div>
