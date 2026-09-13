export const isNotEmpty = <TArray extends unknown[] | FileList>(array: TArray | null | undefined): array is TArray => {
  if (!array) {
    return false
  }
  return array.length > 0
}

export const incrementalArray = ({ length }: { length: number }): number[] => Array.from({ length }, (_val, index) => index + 1)
