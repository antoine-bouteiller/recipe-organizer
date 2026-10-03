export const isNotEmpty = <TArray extends ArrayLike<unknown>>(array: TArray | null | undefined): array is TArray => {
  if (!array) {
    return false
  }
  return array.length > 0
}

export const incrementalArray = ({ length }: { length: number }): number[] => Array.from({ length }, (_val, index) => index + 1)

export const replaceAt = <TItem>(items: readonly TItem[], index: number, value: TItem): TItem[] =>
  items.map((item, itemIndex) => (itemIndex === index ? value : item))
export const removeAt = <TItem>(items: readonly TItem[], index: number): TItem[] => items.filter((_item, itemIndex) => itemIndex !== index)
export const moveAt = <TItem>(items: readonly TItem[], from: number, to: number): TItem[] => {
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}
