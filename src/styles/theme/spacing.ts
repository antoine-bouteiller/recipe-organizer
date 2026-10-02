type Spacing =
  | [top: number, right: number, bottom: number, left: number]
  | [top: number, rightLeft: number, bottom: number]
  | [topBottom: number, rightLeft: number]
  | [value: number]

export const spacing = (...values: Spacing): string => values.map((value) => `calc(4px * ${value})`).join(' ') || '0'
