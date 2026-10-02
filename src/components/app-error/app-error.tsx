import { Button } from '@recipe-organizer/design-system/button'
import { Component } from 'react'
import type { ReactNode } from 'react'

import * as styles from './app-error.css'

const AppErrorScreen = ({ error }: { error: unknown }) => {
  const details = import.meta.env.DEV && error instanceof Error ? error.message : undefined

  return (
    <div className={styles.root} role="alert">
      <h1 className={styles.heading}>Whoops!</h1>
      <div className={styles.body}>
        <h2 className={styles.subheading}>Une erreur est survenue</h2>
        <p>Une erreur est survenue lors du chargement de la page, nous vous suggérons de revenir à la page d'accueil.</p>
      </div>
      {details && (
        <div className={styles.details}>
          <code>{details}</code>
        </div>
      )}
      <Button asLink href="/" size="lg">
        Retour à la page d'accueil
      </Button>
    </div>
  )
}

/** Recovery screen for render errors after client-side navigation between regular pages. */
interface AppErrorBoundaryState {
  error: unknown
}

export class AppErrorBoundary extends Component<{ children: ReactNode }, AppErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { error: undefined }
  }

  static getDerivedStateFromError(error: unknown) {
    return { error }
  }

  override render() {
    return this.state.error === undefined ? this.props.children : <AppErrorScreen error={this.state.error} />
  }
}
