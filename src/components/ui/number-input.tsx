import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ComponentProps } from 'react'
import { NumericFormat } from 'react-number-format'
import type { NumericFormatProps } from 'react-number-format'

interface NumberInputProps extends Omit<NumericFormatProps, 'value' | 'onValueChange'> {
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
}

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
    <div className="flex items-center">
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

      <div className="flex flex-col">
        <Button
          aria-label="Increase value"
          className="h-[18px] rounded-l-none rounded-br-none border-b-[0.5px] border-l-0 border-input px-2 focus-visible:relative"
          variant="outline"
          type="button"
          onClick={handleIncrement}
          disabled={value === max}
        >
          <ChevronUp size={15} />
        </Button>
        <Button
          aria-label="Decrease value"
          className="h-[18px] rounded-l-none rounded-tr-none border-t-[0.5px] border-l-0 border-input px-2 focus-visible:relative"
          variant="outline"
          type="button"
          onClick={handleDecrement}
          disabled={value === min}
        >
          <ChevronDown size={15} />
        </Button>
      </div>
    </div>
  )
}

const Input = ({ className, type, ...props }: ComponentProps<'input'>) => (
  <input
    type={type}
    data-slot="input"
    className={cn(
      'relative flex h-9 w-full min-w-0 [appearance:textfield] rounded-md rounded-r-none border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
      'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
      'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
      className
    )}
    {...props}
  />
)

export type { NumberInputProps }
export { NumberInput }
