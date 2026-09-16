import { Field as FieldPrimitive } from '@base-ui/react/field'
import { css, cva } from '@recipe-organizer/design-system/css'
import type React from 'react'

const fieldClassName = css({ alignItems: 'flex-start', display: 'flex', flexDirection: 'column', gap: '2', width: 'full' })
const dropzoneStyles = {
  '&:has(input:disabled)': { opacity: 0.5, pointerEvents: 'none' },
  '&:has(input:focus)': { borderColor: 'ring', boxShadow: '0 0 0 3px color-mix(in oklab, token(colors.ring) 50%, transparent)' },
  '&[data-invalid]': { borderColor: 'destructive' },
  _hover: { backgroundColor: 'accent/50' },
  borderColor: 'input',
  borderRadius: 'xl',
  borderStyle: 'dashed',
  borderWidth: '1px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  overflow: 'hidden',
  padding: '4',
  position: 'relative',
  transitionDuration: '150ms',
  transitionProperty: 'color, background-color, border-color, outline-color, text-decoration-color, fill, stroke',
  transitionTimingFunction: 'in-out',
  width: 'full',
} as const
const labelRecipe = cva({
  base: {
    alignItems: 'center',
    color: 'foreground',
    display: 'inline-flex',
    fontSize: { base: 'base', sm: 'sm' },
    fontWeight: 'medium',
    gap: '2',
    lineHeight: { base: '1.125rem', sm: '1rem' },
  },
  variants: {
    presentation: {
      'dropzone-image': { ...dropzoneStyles, '&:has(img)': { borderStyle: 'none' }, minHeight: '52' },
      'dropzone-video': { ...dropzoneStyles, minHeight: '32' },
    },
  },
})
const errorClassName = css({ color: 'destructive-foreground', fontSize: 'xs' })

type FieldProps = Pick<FieldPrimitive.Root.Props, 'children' | 'dirty' | 'disabled' | 'invalid' | 'name' | 'touched'>
type FieldLabelProps = Pick<FieldPrimitive.Label.Props, 'children'> & {
  presentation?: 'dropzone-image' | 'dropzone-video'
}
type FieldErrorProps = Pick<FieldPrimitive.Error.Props, 'children' | 'match'>
type FieldControlProps = Pick<FieldPrimitive.Control.Props, 'required'>

export const Field = ({ children, dirty, disabled, invalid, name, touched }: FieldProps): React.ReactElement => (
  <FieldPrimitive.Root className={fieldClassName} data-slot="field" dirty={dirty} disabled={disabled} invalid={invalid} name={name} touched={touched}>
    {children}
  </FieldPrimitive.Root>
)
export const FieldLabel = ({ children, presentation }: FieldLabelProps): React.ReactElement => (
  <FieldPrimitive.Label className={labelRecipe({ presentation })} data-slot="field-label">
    {children}
  </FieldPrimitive.Label>
)
export const FieldError = ({ children, match }: FieldErrorProps): React.ReactElement => (
  <FieldPrimitive.Error className={errorClassName} data-slot="field-error" match={match}>
    {children}
  </FieldPrimitive.Error>
)
export const FieldControl = ({ required }: FieldControlProps): React.ReactElement => (
  <FieldPrimitive.Control data-slot="field-control" required={required} />
)
