import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useRouter } from '@tanstack/react-router'

interface ScreenLayoutProps {
  children: React.ReactNode
  title: string
  withGoBack?: boolean
  headerEndItem?: React.ReactNode
}

export const ScreenLayout = ({ children, title, withGoBack, headerEndItem }: ScreenLayoutProps) => {
  const router = useRouter()

  return (
    <div className="pt-0 relative gap-2 flex flex-col bg-background flex-1 min-h-0 overflow-hidden items-center w-full md:overflow-y-auto">
      <div className="px-6 pt-4 pb-12 text-2xl flex font-heading text-primary-foreground w-full shrink-0 items-center md:hidden gap-2 bg-linear-to-b from-violet-950 to-primary size">
        {withGoBack && (
          <Button variant="ghost" onClick={() => router.history.back()}>
            <ArrowLeftIcon className="size-6" />
          </Button>
        )}
        <span className="h-9 flex items-center">{title}</span>
        <div className="ml-auto">{headerEndItem}</div>
      </div>
      <div className="rounded-t-3xl bg-background flex-1 overflow-y-auto md:overflow-y-visible -mt-10 z-10 md:mt-0 w-full md:max-w-5xl">
        {children}
      </div>
    </div>
  )
}
