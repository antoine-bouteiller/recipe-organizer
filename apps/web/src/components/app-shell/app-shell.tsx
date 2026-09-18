import { type ReactNode } from 'react'

import * as styles from './app-shell.css'

export const AppHeader = ({ children }: { children: ReactNode }) => <header className={styles.element}>{children}</header>

export const AppMain = ({ children }: { children: ReactNode }) => <main className={styles.mainContent}>{children}</main>

export const NavbarSearchPlaceholder = () => <div className={styles.container} />
