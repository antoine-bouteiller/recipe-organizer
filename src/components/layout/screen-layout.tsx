import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useRouter } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

interface ScreenLayoutProps {
  children: React.ReactNode
  headerEndItem?: React.ReactNode
  title: string
  withGoBack?: boolean
}

export const ScreenLayout = ({ children, headerEndItem, title, withGoBack }: ScreenLayoutProps) => {
  const router = useRouter()

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col items-center gap-2 overflow-hidden bg-background pt-0 md:overflow-y-auto">
      <div className="flex w-full shrink-0 items-center gap-2 bg-linear-to-b from-violet-950 to-primary px-6 pt-safe-4 pb-12 font-heading text-2xl text-primary-foreground md:hidden">
        {withGoBack && (
          <Button onClick={() => router.history.back()} variant="ghost" className="pl-0">
            <ArrowLeftIcon className="size-6" />
          </Button>
        )}
        <span className="flex h-9 items-center">{title}</span>
        <div className="ml-auto">{headerEndItem}</div>
      </div>
      <div className="z-10 -mt-10 w-full flex-1 overflow-y-auto rounded-t-3xl bg-background md:mt-0 md:max-w-5xl md:overflow-y-visible">
        {children}
      </div>
    </div>
  )
}
