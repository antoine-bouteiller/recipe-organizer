import type { ReactNode } from 'react'

import * as styles from './recipe-form-actions.css'

export const RecipeFormActions = ({ children }: { readonly children: ReactNode }) => <div className={styles.actions}>{children}</div>
