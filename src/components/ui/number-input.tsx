import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { NumericFormatProps } from 'react-number-format'
import { NumericFormat } from 'react-number-format'

type NumberInputProps = {
  stepper?: number
  thousandSeparator?: string
  placeholder?: string
  defaultValue?: number
  min?: number
  max?: number
  value?: number // Controlled value
  suffix?: string
  prefix?: string
  onValueChange?: (value: number | undefined) => void
  fixedDecimalScale?: boolean
  decimalScale?: number
} & Omit<NumericFormatProps, 'value' | 'onValueChange'>

const NumberInput = ({
  stepper,
  thousandSeparator,
  placeholder,
  defaultValue,
  min = -Infinity,
  max = Infinity,
  onValueChange,
  fixedDecimalScale = false,
  decimalScale = 0,
  suffix,
  prefix,
  value: controlledValue,
  ...props
}: NumberInputProps) => {
  const [value, setValue] = useState<number | undefined>(controlledValue ?? defaultValue)
  const ref = useRef<HTMLInputElement>(null)

  const handleIncrement = useCallback(() => {
    setValue((prev) => (prev === undefined ? (stepper ?? 1) : Math.min(prev + (stepper ?? 1), max)))
  }, [stepper, max])

  const handleDecrement = useCallback(() => {
    setValue((prev) =>
      prev === undefined ? -(stepper ?? 1) : Math.max(prev - (stepper ?? 1), min)
    )
  }, [stepper, min])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.activeElement === (ref as React.RefObject<HTMLInputElement>).current) {
        if (event.key === 'ArrowUp') {
          handleIncrement()
        } else if (event.key === 'ArrowDown') {
          handleDecrement()
        }
      }
    }

    globalThis.addEventListener('keydown', handleKeyDown)

    return () => {
      globalThis.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleIncrement, handleDecrement, ref])

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue)
    }
  }, [controlledValue])

  const handleChange = (values: { value: string; floatValue: number | undefined }) => {
    const newValue = values.floatValue === undefined ? undefined : values.floatValue
    setValue(newValue)
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  const handleBlur = () => {
    if (value !== undefined) {
      if (value < min) {
        setValue(min)

        if (ref.current) {
          ref.current.value = String(min)
        }
      } else if (value > max) {
        setValue(max)

        if (ref.current) {
          ref.current.value = String(max)
        }
      }
    }
  }

  return (
    <div className="relative flex items-center h-8.5">
      <NumericFormat
        value={value}
        onValueChange={handleChange}
        thousandSeparator={thousandSeparator}
        decimalScale={decimalScale}
        fixedDecimalScale={fixedDecimalScale}
        allowNegative={min < 0}
        valueIsNumericString
        onBlur={handleBlur}
        max={max}
        min={min}
        suffix={suffix}
        prefix={prefix}
        customInput={Input}
        placeholder={placeholder}
        getInputRef={ref}
        {...props}
      />

      <div className="absolute right-[2px] flex flex-col w-9 border-l border-input">
        <Button
          aria-label="Increase value"
          className="flex-1 h-auto rounded-l-none rounded-br-none border-b-[0.5px] border-l-0 border-input px-2 focus-visible:relative p-0 -mb-[0.5px]"
          variant="ghost"
          type="button"
          size="icon"
          onClick={handleIncrement}
          disabled={value === max}
        >
          <ChevronUp size={13} />
        </Button>
        <Button
          aria-label="Decrease value"
          className="flex-1 h-auto rounded-l-none rounded-tr-none border-t-[0.5px] border-l-0 border-input px-2 focus-visible:relative -mt-[0.5px]"
          variant="ghost"
          size="icon"
          type="button"
          onClick={handleDecrement}
          disabled={value === min}
        >
          <ChevronDown size={13} />
        </Button>
      </div>
    </div>
  )
}

export { NumberInput }
export type { NumberInputProps }
