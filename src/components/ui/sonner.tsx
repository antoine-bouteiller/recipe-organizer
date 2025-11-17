import { useRouteContext } from '@tanstack/react-router'
import type { ToasterProps } from 'sonner'
import { Toaster as Sonner, toast } from 'sonner'

const style = {
  '--normal-bg': 'var(--popover)',
  '--normal-text': 'var(--popover-foreground)',
  '--normal-border': 'var(--border)',
} as React.CSSProperties

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useRouteContext({ from: '__root__' })

  return <Sonner theme={theme} className="toaster group" richColors style={style} {...props} />
}

const toastError = (message: string, error: unknown) => {
  toast.error(message, {
    description: error instanceof Error ? error.message : String(error),
  })
}

export { Toaster, toastError }
