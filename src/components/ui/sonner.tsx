import { useRouteContext } from '@tanstack/react-router'
import type { ToasterProps } from 'sonner'
import { Toaster as Sonner } from 'sonner'

const style = {
  '--normal-bg': 'var(--popover)',
  '--normal-text': 'var(--popover-foreground)',
  '--normal-border': 'var(--border)',
} as React.CSSProperties

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useRouteContext({ from: '__root__' })

  return <Sonner theme={theme} className="toaster group" richColors style={style} {...props} />
}

export { Toaster }
