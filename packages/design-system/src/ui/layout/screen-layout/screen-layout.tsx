import { cva } from '@recipe-organizer/design-system/css'
import { useState } from 'react'

import { Button } from '../../actions/button/button'
import { ArrowLeftIcon } from '../../data-display/icons/arrow-left'
import { GlassPill } from '../glass-pill/glass-pill'

const screenRecipe = cva({
  base: {
    alignItems: 'center',
    backgroundColor: 'muted',
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    minHeight: '0',
    overflow: { base: 'hidden', md: 'hidden' },
    overflowY: { md: 'auto' },
    position: 'relative',
    width: 'full',
  },
})
const contentRecipe = cva({
  base: {
    backgroundColor: 'muted',
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    maxWidth: { md: '5xl' },
    minHeight: '0',
    overflowY: { base: 'auto', md: 'visible' },
    paddingInline: '4',
    position: 'relative',
    width: 'full',
    zIndex: 10,
  },
  defaultVariants: { hasBackground: false, hasFooter: false },
  variants: {
    hasBackground: { true: { borderTopRadius: '3xl', marginTop: '-10', paddingTop: '1' } },
    hasFooter: { false: { paddingBottom: '4' }, true: { paddingBottom: 'calc(env(safe-area-inset-bottom) + token(spacing.16))' } },
  },
})
const imageHeaderRecipe = cva({
  base: {
    alignItems: 'center',
    background: 'linear-gradient(to bottom, #0d3b42, token(colors.primary))',
    color: 'primary-foreground',
    display: { base: 'flex', md: 'none' },
    flexShrink: '0',
    gap: '2',
    overflow: 'hidden',
    paddingBottom: '12',
    paddingInline: '6',
    paddingTop: 'calc(env(safe-area-inset-top) + token(spacing.4))',
    position: 'relative',
    width: 'full',
  },
})
const headerRecipe = cva({
  base: {
    alignItems: 'center',
    color: 'foreground',
    display: { base: 'flex', md: 'none' },
    flexShrink: '0',
    gap: '2',
    height: 'var(--screen-header-height)',
    marginInline: '-4',
    paddingInline: '2',
    paddingTop: 'calc(env(safe-area-inset-top) + token(spacing.1))',
    pointerEvents: 'none',
    position: 'sticky',
    top: '0',
    width: 'auto',
    zIndex: 20,
  },
})
const titlePillRecipe = cva({ base: { minWidth: '0', paddingBlock: '1.5', paddingInline: '4' } })
const imageRecipe = cva({ base: { height: 'full', inset: '0', objectFit: 'cover', objectPosition: 'center', position: 'absolute', width: 'full' } })
const imageOverlayRecipe = cva({
  base: { background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))', inset: '0', position: 'absolute' },
})
const imageBackRecipe = cva({ base: { '--owner-icon-size': '1rem', color: 'white', marginLeft: '-4', position: 'relative', zIndex: 10 } })
const imageTitleRecipe = cva({
  base: {
    flex: '1',
    fontFamily: 'heading',
    fontSize: '2xl',
    fontWeight: 'bold',
    letterSpacing: 'tight',
    minWidth: '0',
    overflow: 'hidden',
    position: 'relative',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    zIndex: 10,
  },
})
const imageActionRecipe = cva({ base: { position: 'relative', zIndex: 10 } })
const headerActionRecipe = cva({ base: { marginStart: 'auto', pointerEvents: 'auto' } })
const titleRecipe = cva({
  base: {
    fontFamily: 'heading',
    fontWeight: 'bold',
    letterSpacing: 'tight',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    transitionDuration: '200ms',
    transitionProperty: 'font-size, line-height',
    transitionTimingFunction: 'out-snappy',
    whiteSpace: 'nowrap',
  },
  defaultVariants: { scrolled: false },
  variants: { scrolled: { false: { fontSize: '3xl' }, true: { fontSize: 'base' } } },
})

const GoBackButton = ({ onBack }: { onBack: () => void }) => (
  <Button aria-label="Retour" onClick={onBack} size="icon" variant="ghost">
    <ArrowLeftIcon />
  </Button>
)

interface ScreenHeaderProps {
  backgroundImage?: string
  headerEndItem?: React.ReactNode
  scrolled: boolean
  title: string
  onBack?: () => void
}

const ScreenHeader = ({ backgroundImage, headerEndItem, scrolled, title, onBack }: ScreenHeaderProps): React.ReactElement => {
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
      {onBack && (
        <GlassPill on={scrolled}>
          <GoBackButton onBack={onBack} />
        </GlassPill>
      )}
      <GlassPill on={scrolled}>
        <div className={titlePillRecipe()}>
          <h1 className={titleRecipe({ scrolled })} data-scrolled={scrolled ? 'true' : undefined}>
            {title}
          </h1>
        </div>
      </GlassPill>
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
  const [scrolled, setScrolled] = useState(false)
  const header = <ScreenHeader backgroundImage={backgroundImage} headerEndItem={headerEndItem} onBack={onBack} scrolled={scrolled} title={title} />
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
        onScroll={(event) => {
          const offset = event.currentTarget.scrollTop
          setScrolled((wasScrolled) => (wasScrolled ? offset > 24 : offset > 40))
        }}
      >
        {!backgroundImage && header}
        {children}
      </div>
      {footer}
    </div>
  )
}
