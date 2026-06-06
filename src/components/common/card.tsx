import { type ReactElement, type ReactNode } from 'react'

import { Card as CardRoot, CardDescription, CardFooter, CardHeader, CardPanel, CardTitle } from '@/components/ui/card'

interface CardProps {
  title?: ReactNode
  description?: ReactNode
  header?: ReactNode
  footer?: ReactNode
  className?: string
  panelClassName?: string
  footerClassName?: string
  children?: ReactNode
}

export const Card = ({ title, description, header, footer, className, panelClassName, footerClassName, children }: CardProps): ReactElement => {
  const hasHeader = header !== undefined || title !== undefined || description !== undefined
  const isStructured = hasHeader || footer !== undefined

  return (
    <CardRoot className={className}>
      {hasHeader && (
        <CardHeader>
          {header ?? (
            <>
              {title !== undefined && <CardTitle>{title}</CardTitle>}
              {description !== undefined && <CardDescription>{description}</CardDescription>}
            </>
          )}
        </CardHeader>
      )}
      {isStructured ? <CardPanel className={panelClassName}>{children}</CardPanel> : children}
      {footer !== undefined && <CardFooter className={footerClassName}>{footer}</CardFooter>}
    </CardRoot>
  )
}
