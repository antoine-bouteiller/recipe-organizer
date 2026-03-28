import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useRouter } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { useBackViewTransition } from '@/hooks/use-back-view-transition'
import { cn } from '@/utils/cn'

import { TabBar } from '../navigation/tabbar'

interface ScreenLayoutProps {
  children: React.ReactNode
  headerEndItem?: React.ReactNode
  title: string
  withGoBack?: boolean
  backgroundImage?: string
  pageKey?: string
}

export const ScreenLayout = ({ children, headerEndItem, title, withGoBack, backgroundImage, pageKey }: ScreenLayoutProps) => {
  const router = useRouter()

  useBackViewTransition(Boolean(withGoBack))

  return (
    <div
      className={cn(
        'relative flex min-h-0 w-full flex-1 flex-col items-center gap-2 overflow-hidden bg-background pt-0 md:overflow-y-auto',
        pageKey ? 'pb-14' : ''
      )}
    >
      <div className="relative flex w-full shrink-0 items-center gap-2 overflow-hidden bg-linear-to-b from-violet-950 to-primary px-6 pt-safe-4 pb-12 text-primary-foreground md:hidden">
        {backgroundImage && (
          <>
            <img src={backgroundImage} alt="Background Image" className="absolute inset-0 size-full object-cover object-center" />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10 md:rounded-t-2xl" />
          </>
        )}
        {withGoBack && (
          <Button
            onClick={() => {
              if (!document.startViewTransition) {
                router.history.back()
                return
              }

              document.documentElement.classList.add('back-transition')
              const transition = document.startViewTransition(async () => {
                router.history.back()
                await new Promise<void>((resolve) => {
                  const unsub = router.subscribe('onResolved', () => {
                    unsub()
                    resolve()
                  })
                })
              })
              void transition.finished.then(() => {
                document.documentElement.classList.remove('back-transition')
              })
            }}
            variant="ghost"
            size="icon"
            className="-ml-4 text-white"
          >
            <ArrowLeftIcon />
          </Button>
        )}
        <h1 className="z-10 min-w-0 flex-1 truncate font-heading text-2xl">{title}</h1>
        {headerEndItem && <div className="z-10">{headerEndItem}</div>}
      </div>
      <div className="z-10 -mt-10 flex min-h-0 w-full flex-1 flex-col overflow-y-auto rounded-t-3xl bg-background md:mt-0 md:max-w-5xl md:overflow-y-visible">
        {children}
      </div>
      {pageKey && <TabBar activePage={pageKey} />}
    </div>
  )
}
