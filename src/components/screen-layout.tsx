import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useRouter } from '@tanstack/react-router'
import { Button } from './ui/button'

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
      <div className="p-6 pb-12 text-2xl flex font-heading text-primary-foreground w-full shrink-0 items-center md:hidden gap-2 bg-linear-to-b from-[color-mix(in_srgb,var(--color-primary)_60%,black)] to-primary">
        {withGoBack && (
          <Button size="icon-sm" onClick={() => router.history.back()}>
            <ArrowLeftIcon className="size-6" />
          </Button>
        )}
        {title}
        <div className="ml-auto">{headerEndItem}</div>
      </div>
      <div className="flex flex-col gap-2 rounded-t-3xl bg-background flex-1 overflow-y-auto md:overflow-y-visible min-h-0 -mt-10 z-10 md:mt-0 w-full md:max-w-5xl p-4 md:p-8">
        {children}
      </div>
    </div>
  )
}
