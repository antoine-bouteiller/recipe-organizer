import { Button } from '../../actions/button/button'
import { ArrowLeftIcon } from '../../data-display/icons/arrow-left'

import * as styles from './screen-layout.css'

const GoBackButton = ({ onBack }: { onBack: () => void }) => (
  <Button aria-label="Retour" onClick={onBack} size="icon" variant="ghost">
    <ArrowLeftIcon />
  </Button>
)

interface ScreenHeaderProps {
  backgroundImage?: string
  headerEndItem?: React.ReactNode
  title: string
  onBack?: () => void
}

const ScreenHeader = ({ backgroundImage, headerEndItem, title, onBack }: ScreenHeaderProps): React.ReactElement => {
  if (backgroundImage) {
    return (
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
    )
  }
  return (
    <div className={styles.header()}>
      {onBack && <GoBackButton onBack={onBack} />}
      <h1 className={styles.title()}>{title}</h1>
      {headerEndItem && <div className={styles.headerAction()}>{headerEndItem}</div>}
    </div>
  )
}

export type ScreenLayoutProps = Pick<React.ComponentProps<'div'>, 'children'> & {
  backgroundImage?: string
  footer?: React.ReactNode
  headerEndItem?: React.ReactNode
  innerScrollId?: string
  onBack?: () => void
  outerScrollId?: string
  title: string
}

export const ScreenLayout = ({
  backgroundImage,
  children,
  footer,
  headerEndItem,
  innerScrollId,
  onBack,
  outerScrollId,
  title,
}: ScreenLayoutProps): React.ReactElement => {
  const header = <ScreenHeader backgroundImage={backgroundImage} headerEndItem={headerEndItem} onBack={onBack} title={title} />
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
