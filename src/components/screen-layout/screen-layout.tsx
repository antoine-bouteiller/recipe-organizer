import { Button } from '@/components/ui/actions/button/button'
import { ArrowLeftIcon } from '@/components/ui/data-display/icons'

import * as styles from './screen-layout.css'

const goBack = () => history.back()

export const GoBackButton = ({ onBack = goBack }: { onBack?: () => void }): React.ReactElement => (
  <Button aria-label="Retour" onClick={onBack} size="icon" variant="ghost">
    <ArrowLeftIcon />
  </Button>
)

export type ScreenLayoutProps = Pick<React.ComponentProps<'div'>, 'children'> & {
  /** Usually `GoBackButton`. */
  backButton?: React.ReactNode
  backgroundImage?: string
  footer?: React.ReactNode
  headerEndItem?: React.ReactNode
  innerScrollId?: string
  outerScrollId?: string
  title: string
}

export const ScreenLayout = ({
  backButton,
  backgroundImage,
  children,
  footer,
  headerEndItem,
  innerScrollId = 'screen-inner',
  outerScrollId = 'screen-outer',
  title,
}: ScreenLayoutProps): React.ReactElement => {
  const header = backgroundImage ? (
    <div className={styles.imageHeader}>
      <img alt="" className={styles.image} src={backgroundImage} />
      <div className={styles.imageOverlay} />
      {backButton && <span className={styles.imageBack}>{backButton}</span>}
      <h1 className={styles.imageTitle}>{title}</h1>
      {headerEndItem && <div className={styles.imageAction}>{headerEndItem}</div>}
    </div>
  ) : (
    <div className={styles.header}>
      {backButton}
      <h1 className={styles.title}>{title}</h1>
      {headerEndItem && <div className={styles.headerAction}>{headerEndItem}</div>}
    </div>
  )
  return (
    <div
      className={styles.screen}
      data-footer-present={footer ? 'true' : undefined}
      data-scroll-restoration-id={outerScrollId}
      data-slot="screen-layout"
    >
      {backgroundImage && header}
      <div
        className={styles.content({ hasBackground: Boolean(backgroundImage), hasFooter: Boolean(footer) })}
        data-scroll-restoration-id={innerScrollId}
        data-slot="screen-layout-content"
      >
        {!backgroundImage && header}
        {children}
      </div>
      {footer}
    </div>
  )
}
