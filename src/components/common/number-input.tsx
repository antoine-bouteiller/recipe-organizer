import { type ComponentProps, type ReactElement } from 'react'

import {
  NumberInputDecrement,
  NumberInputField,
  NumberInputGroup,
  NumberInputIncrement,
  NumberInput as NumberInputRoot,
  NumberInputScrubArea,
} from '@/components/ui/number-input'

type NumberInputProps = ComponentProps<typeof NumberInputRoot> & {
  label?: string
  placeholder?: string
}

export const NumberInput = ({ label, placeholder, ...props }: NumberInputProps): ReactElement => (
  <NumberInputRoot {...props}>
    {label && <NumberInputScrubArea label={label} />}
    <NumberInputGroup>
      <NumberInputDecrement />
      <NumberInputField placeholder={placeholder} />
      <NumberInputIncrement />
    </NumberInputGroup>
  </NumberInputRoot>
)
