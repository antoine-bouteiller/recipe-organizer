import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useRouter } from '@tanstack/react-router'
import { useRef, useState } from 'react'

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
      className={cn('-ml-4', className)}
      aria-label="Retour"
    >
      <ArrowLeftIcon />
    </Button>
  )
}

interface ScreenHeaderProps {
  backgroundImage?: string
  headerEndItem?: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
  scrollTitle: boolean
  title: string
  withGoBack: boolean
}

const ScreenHeader = ({ backgroundImage, headerEndItem, ref, scrollTitle, title, withGoBack }: ScreenHeaderProps) => {
  if (backgroundImage) {
    return (
      <div className="relative flex w-full shrink-0 items-center gap-2 overflow-hidden bg-linear-to-b from-[#0d3b42] to-primary px-6 pt-safe-4 pb-12 text-primary-foreground md:hidden">
        <img src={backgroundImage} alt="" className="absolute inset-0 size-full object-cover object-center" />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10 md:rounded-t-2xl" />
        {withGoBack && <GoBackButton className="text-white" />}
        <h1 className="z-10 min-w-0 flex-1 truncate font-heading text-2xl font-bold tracking-tight">{title}</h1>
        {headerEndItem && <div className="z-10">{headerEndItem}</div>}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn('flex w-full shrink-0 items-center gap-2 px-6 pt-safe-4 pb-1 text-foreground md:hidden', scrollTitle && '-mx-4 w-auto')}
    >
      {withGoBack && <GoBackButton />}
      <h1 className="flex-1 truncate font-heading text-3xl font-bold tracking-tight">{title}</h1>
      {headerEndItem && <div>{headerEndItem}</div>}
    </div>
  )
}

const CompactTitleBar = ({ title, visible }: { title: string; visible: boolean }) => (
  // Aria-hidden is unconditional because the real <h1> stays in the a11y tree when scrolled off; a conditional one would announce the title twice.
  <div
    aria-hidden
    className={cn(
      '-mx-4 -mb-11 sticky top-0 z-20 flex h-11 shrink-0 items-center px-6 transition-opacity duration-200 ease-out md:hidden',
      visible ? 'opacity-100' : 'pointer-events-none opacity-0'
    )}
  >
    {/* Blur lives on an absolute child, not on the sticky box itself — backdrop-filter on a sticky box smears during iOS momentum scroll */}
    <div className="absolute inset-0 border-b border-border/60 bg-background/80 backdrop-blur-xl" />
    <span className="relative truncate font-heading text-base font-bold tracking-tight">{title}</span>
  </div>
)

interface ScreenLayoutProps {
  children: React.ReactNode
  headerEndItem?: React.ReactNode
  title: string
  withGoBack?: boolean
  backgroundImage?: string
  pageKey?: string
  scrollTitle?: boolean
}

export const ScreenLayout = ({
  children,
  headerEndItem,
  title,
  withGoBack = false,
  backgroundImage,
  pageKey,
  scrollTitle = false,
}: ScreenLayoutProps) => {
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  const header = (
    <ScreenHeader
      backgroundImage={backgroundImage}
      headerEndItem={headerEndItem}
      ref={headerRef}
      scrollTitle={scrollTitle}
      title={title}
      withGoBack={withGoBack}
    />
  )

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col items-center overflow-hidden bg-muted pt-0 md:overflow-y-auto">
      {!scrollTitle && header}
      <div
        className={cn(
          'z-10 flex min-h-0 w-full flex-1 flex-col overflow-y-auto bg-muted px-4 md:mt-0 md:max-w-5xl md:overflow-y-visible',
          scrollTitle ? 'pt-0' : 'pt-1',
          pageKey ? 'pb-safe-16' : 'pb-4',
          backgroundImage && '-mt-10 rounded-t-3xl'
        )}
        onScroll={
          scrollTitle
            ? (event) => {
                setScrolled(event.currentTarget.scrollTop > (headerRef.current?.offsetHeight ?? 0) - 12)
              }
            : undefined
        }
      >
        {scrollTitle && header}
        {scrollTitle && <CompactTitleBar title={title} visible={scrolled} />}
        {children}
      </div>
      {pageKey && <TabBar />}
    </div>
  )
}
