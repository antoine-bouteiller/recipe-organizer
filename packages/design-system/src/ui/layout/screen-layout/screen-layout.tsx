import { Button } from '@recipe-organizer/design-system/button'
import { ArrowLeftIcon } from '@recipe-organizer/design-system/icons/arrow-left'
import { useRouter } from '@tanstack/react-router'

import * as styles from './screen-layout.css'

const GoBackButton = ({ onBack }: { onBack: () => void }) => (
  <Button aria-label="Retour" onClick={onBack} size="icon" variant="ghost">
    <ArrowLeftIcon />
  </Button>
)

export type ScreenLayoutProps = Pick<React.ComponentProps<'div'>, 'children'> & {
  backgroundImage?: string
  footer?: React.ReactNode
  headerEndItem?: React.ReactNode
  innerScrollId?: string
  outerScrollId?: string
  title: string
  withGoBack?: boolean
}

export const ScreenLayout = ({
  backgroundImage,
  children,
  footer,
  headerEndItem,
  innerScrollId = 'screen-inner',
  outerScrollId = 'screen-outer',
  title,
  withGoBack = false,
}: ScreenLayoutProps): React.ReactElement => {
  const router = useRouter()
  const onBack = withGoBack ? () => router.history.back() : undefined
  const header = backgroundImage ? (
    <div className={styles.imageHeader()}>
      <img alt="" className={styles.image()} src={backgroundImage} />
      <div className={styles.imageOverlay()} />
      {onBack && (
        <span className={styles.imageBack()}>
          <GoBackButton onBack={onBack} />
        </span>
      )}
      <h1 className={styles.imageTitle()}>{title}</h1>
      {headerEndItem && <div className={styles.imageAction()}>{headerEndItem}</div>}
    </div>
  ) : (
    <div className={styles.header()}>
      {onBack && <GoBackButton onBack={onBack} />}
      <h1 className={styles.title()}>{title}</h1>
      {headerEndItem && <div className={styles.headerAction()}>{headerEndItem}</div>}
    </div>
  )
  return (
    <div
      className={styles.screen()}
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
