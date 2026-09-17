import { Button } from '../../actions/button/button'
import { ArrowLeftIcon } from '../../data-display/icons/arrow-left'

import {
  screenRecipe,
  contentRecipe,
  imageHeaderRecipe,
  headerRecipe,
  imageRecipe,
  imageOverlayRecipe,
  imageBackRecipe,
  imageTitleRecipe,
  imageActionRecipe,
  headerActionRecipe,
  titleRecipe,
} from './screen-layout.css'

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
      <div className={imageHeaderRecipe()}>
        <img alt="" className={imageRecipe()} src={backgroundImage} />
        <div className={imageOverlayRecipe()} />
        {onBack && (
          <span className={imageBackRecipe()}>
            <GoBackButton onBack={onBack} />
          </span>
        )}
        <h1 className={imageTitleRecipe()}>{title}</h1>
        {headerEndItem && <div className={imageActionRecipe()}>{headerEndItem}</div>}
      </div>
    )
  }
  return (
    <div className={headerRecipe()}>
      {onBack && <GoBackButton onBack={onBack} />}
      <h1 className={titleRecipe()}>{title}</h1>
      {headerEndItem && <div className={headerActionRecipe()}>{headerEndItem}</div>}
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
      className={screenRecipe()}
      data-footer-present={footer ? 'true' : undefined}
      data-scroll-restoration-id={outerScrollId}
      data-slot="screen-layout"
    >
      {backgroundImage && header}
      <div
        className={contentRecipe({ hasBackground: Boolean(backgroundImage), hasFooter: Boolean(footer) })}
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
