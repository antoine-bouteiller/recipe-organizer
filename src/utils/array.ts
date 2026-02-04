export const isNotEmpty = <T extends unknown[] | FileList>(array: T | null | undefined): array is T => {
  if (!array) {
    return false
  }
  return array.length > 0
}

export const incrementalArray = ({ length }: { length: number }): number[] => Array.from({ length }, (_, i) => i + 1)
