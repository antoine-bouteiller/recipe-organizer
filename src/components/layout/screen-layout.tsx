import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useRouter } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

interface ScreenLayoutProps {
  children: React.ReactNode
  headerEndItem?: React.ReactNode
  title: string
  withGoBack?: boolean
  backgroundImage?: string
}

export const ScreenLayout = ({ children, headerEndItem, title, withGoBack, backgroundImage }: ScreenLayoutProps) => {
  const router = useRouter()

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col items-center gap-2 overflow-hidden bg-background pt-0 md:overflow-y-auto">
      <div className="relative flex w-full shrink-0 items-center gap-2 overflow-hidden bg-linear-to-b from-violet-950 to-primary px-6 pt-safe-4 pb-12 text-primary-foreground md:hidden">
        {backgroundImage && (
          <>
            <img src={backgroundImage} alt="Background Image" className="absolute inset-0 size-full object-cover object-center" />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10 md:rounded-t-2xl" />
          </>
        )}
        {withGoBack && (
          <Button onClick={() => router.history.back()} variant="ghost" size="icon" className="-ml-4">
            <ArrowLeftIcon />
          </Button>
        )}
        <h1 className="z-10 min-w-0 flex-1 truncate font-heading text-2xl">{title}</h1>
        {headerEndItem && <div className="z-10">{headerEndItem}</div>}
      </div>
      <div className="z-10 -mt-10 w-full flex-1 overflow-y-auto rounded-t-3xl bg-background md:mt-0 md:max-w-5xl md:overflow-y-visible">
        {children}
      </div>
    </div>
  )
}
