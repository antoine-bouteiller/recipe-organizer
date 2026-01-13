export const isNotEmpty = <T extends unknown[] | FileList>(array: T | null | undefined): array is T => {
  if (!array) {
    return false
  }
  return array.length > 0
}
