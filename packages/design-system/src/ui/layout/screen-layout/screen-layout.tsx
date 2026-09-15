import { cn } from 'cn'
import { useState } from 'react'

import { Button } from '../../actions/button/button'
import { ArrowLeftIcon } from '../../data-display/icons/arrow-left'
import { GlassPill } from '../glass-pill/glass-pill'

const GoBackButton = ({ className, onBack }: { className?: string; onBack: () => void }) => (
  <Button onClick={onBack} variant="ghost" size="icon" className={className} aria-label="Retour">
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

const ScreenHeader = ({ backgroundImage, headerEndItem, scrolled, title, onBack }: ScreenHeaderProps) => {
  if (backgroundImage) {
    return (
      <div className="relative flex w-full shrink-0 items-center gap-2 overflow-hidden bg-linear-to-b from-[#0d3b42] to-primary px-6 pt-safe-4 pb-12 text-primary-foreground md:hidden">
        <img src={backgroundImage} alt="" className="absolute inset-0 size-full object-cover object-center" />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10 md:rounded-t-2xl" />
        {onBack && <GoBackButton className="-ml-4 text-white" onBack={onBack} />}
        <h1 className="z-10 min-w-0 flex-1 truncate font-heading text-2xl font-bold tracking-tight">{title}</h1>
        {headerEndItem && <div className="z-10">{headerEndItem}</div>}
      </div>
    )
  }

  return (
    // Height is fixed so the collapse never reflows the content below: a sticky box that actually shrinks slides the page up mid-scroll.
    <div className="pointer-events-none sticky top-0 z-20 -mx-4 flex h-(--screen-header-height) w-auto shrink-0 items-center gap-2 px-2 pt-safe-1 text-foreground md:hidden">
      {onBack && (
        <GlassPill on={scrolled}>
          <GoBackButton onBack={onBack} />
        </GlassPill>
      )}
      {/* Vertical padding + the collapsed text-base line-height adds up to the go-back button's size-9 pill. */}
      <GlassPill className="min-w-0 px-4 py-1.5" on={scrolled}>
        <h1
          className={cn(
            'truncate font-heading font-bold tracking-tight transition-[font-size,line-height] duration-200 ease-out-snappy',
            scrolled ? 'text-base' : 'text-3xl'
          )}
        >
          {title}
        </h1>
      </GlassPill>
      {headerEndItem && <div className="pointer-events-auto ms-auto">{headerEndItem}</div>}
    </div>
  )
}

interface ScreenLayoutProps {
  children: React.ReactNode
  headerEndItem?: React.ReactNode
  title: string
  onBack?: () => void
  backgroundImage?: string
  footer?: React.ReactNode
  outerScrollId?: string
  innerScrollId?: string
}

export const ScreenLayout = ({
  children,
  headerEndItem,
  title,
  onBack,
  backgroundImage,
  footer,
  outerScrollId,
  innerScrollId,
}: ScreenLayoutProps) => {
  const [scrolled, setScrolled] = useState(false)

  const header = <ScreenHeader backgroundImage={backgroundImage} headerEndItem={headerEndItem} scrolled={scrolled} title={title} onBack={onBack} />

  return (
    <div
      className="relative flex min-h-0 w-full flex-1 flex-col items-center overflow-hidden bg-muted pt-0 md:overflow-y-auto"
      data-scroll-restoration-id={outerScrollId}
    >
      {backgroundImage && header}
      <div
        className={cn(
          'z-10 flex min-h-0 w-full flex-1 flex-col overflow-y-auto bg-muted px-4 md:mt-0 md:max-w-5xl md:overflow-y-visible',
          backgroundImage ? 'pt-1' : 'pt-0',
          footer ? 'pb-safe-16' : 'pb-4',
          backgroundImage && '-mt-10 rounded-t-3xl'
        )}
        data-scroll-restoration-id={innerScrollId}
        onScroll={(event) => {
          const offset = event.currentTarget.scrollTop
          // Asymmetric thresholds: a single one flickers when a finger rests right on it.
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
