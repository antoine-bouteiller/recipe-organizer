interface TextSelection {
  end: number
  start: number
  value: string
}

const BOLD = '**'

// Wraps the selection in `**`, or unwraps it when already wrapped; with no selection inserts `****`.
export const toggleBold = ({ end, start, value }: TextSelection): TextSelection => {
  const before = value.slice(0, start)
  const selected = value.slice(start, end)
  const after = value.slice(end)
  if (selected.length >= 4 && selected.startsWith(BOLD) && selected.endsWith(BOLD)) {
    return { end: end - 4, start, value: `${before}${selected.slice(2, -2)}${after}` }
  }
  if (selected && before.endsWith(BOLD) && after.startsWith(BOLD)) {
    return { end: end - 2, start: start - 2, value: `${before.slice(0, -2)}${selected}${after.slice(2)}` }
  }
  return { end: end + 2, start: start + 2, value: `${before}${BOLD}${selected}${BOLD}${after}` }
}

// Clamps an inclusive 1-based range to the source's current step count.
export const clampStepRange = (count: number, fromStep?: number, toStep?: number) => ({
  first: Math.max(1, fromStep ?? 1),
  last: Math.min(count, toStep ?? count),
})
