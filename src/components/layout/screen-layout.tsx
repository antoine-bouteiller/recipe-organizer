import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

import { TabBar } from '../navigation/tabbar'

const GoBackButton = ({ className }: { className?: string }) => {
  const router = useRouter()

  return (
    <Button
      onClick={() => {
        router.history.back()
      }}
      variant="ghost"
      size="icon"
      className={className}
      aria-label="Retour"
    >
      <ArrowLeftIcon />
    </Button>
  )
}

const GlassPill = ({ children, className, on }: { children: React.ReactNode; className?: string; on: boolean }) => (
  <div className={cn('pointer-events-auto relative', className)}>
    {/* Blur sits on an absolute child, not the box itself: backdrop-filter inside a sticky box smears during iOS momentum scroll, and fading a child's opacity carries the blur along with the tint (transition-colors would not). */}
    <div
      className={cn(
        'absolute inset-0 rounded-full border border-border/60 bg-background/80 backdrop-blur-xl transition-opacity duration-200 ease-out-snappy',
        on ? 'opacity-100' : 'opacity-0'
      )}
    />
    <div className="relative">{children}</div>
  </div>
)

interface ScreenHeaderProps {
  backgroundImage?: string
  headerEndItem?: React.ReactNode
  scrolled: boolean
  title: string
  withGoBack: boolean
}

const ScreenHeader = ({ backgroundImage, headerEndItem, scrolled, title, withGoBack }: ScreenHeaderProps) => {
  if (backgroundImage) {
    return (
      <div className="relative flex w-full shrink-0 items-center gap-2 overflow-hidden bg-linear-to-b from-[#0d3b42] to-primary px-6 pt-safe-4 pb-12 text-primary-foreground md:hidden">
        <img src={backgroundImage} alt="" className="absolute inset-0 size-full object-cover object-center" />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10 md:rounded-t-2xl" />
        {withGoBack && <GoBackButton className="-ml-4 text-white" />}
        <h1 className="z-10 min-w-0 flex-1 truncate font-heading text-2xl font-bold tracking-tight">{title}</h1>
        {headerEndItem && <div className="z-10">{headerEndItem}</div>}
      </div>
    )
  }

  return (
    // Height is fixed so the collapse never reflows the content below: a sticky box that actually shrinks slides the page up mid-scroll.
    <div className="pointer-events-none sticky top-0 z-20 -mx-4 flex h-(--screen-header-height) w-auto shrink-0 items-center gap-2 px-2 pt-safe-1 text-foreground md:hidden">
      {withGoBack && (
        <GlassPill on={scrolled}>
          <GoBackButton />
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
  withGoBack?: boolean
  backgroundImage?: string
  pageKey?: string
}

export const ScreenLayout = ({ children, headerEndItem, title, withGoBack = false, backgroundImage, pageKey }: ScreenLayoutProps) => {
  const [scrolled, setScrolled] = useState(false)

  const header = (
    <ScreenHeader backgroundImage={backgroundImage} headerEndItem={headerEndItem} scrolled={scrolled} title={title} withGoBack={withGoBack} />
  )

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col items-center overflow-hidden bg-muted pt-0 md:overflow-y-auto">
      {backgroundImage && header}
      <div
        className={cn(
          'z-10 flex min-h-0 w-full flex-1 flex-col overflow-y-auto bg-muted px-4 md:mt-0 md:max-w-5xl md:overflow-y-visible',
          backgroundImage ? 'pt-1' : 'pt-0',
          pageKey ? 'pb-safe-16' : 'pb-4',
          backgroundImage && '-mt-10 rounded-t-3xl'
        )}
        onScroll={(event) => {
          const offset = event.currentTarget.scrollTop
          // Asymmetric thresholds: a single one flickers when a finger rests right on it.
          setScrolled((wasScrolled) => (wasScrolled ? offset > 24 : offset > 40))
        }}
      >
        {!backgroundImage && header}
        {children}
      </div>
      {pageKey && <TabBar />}
    </div>
  )
}
