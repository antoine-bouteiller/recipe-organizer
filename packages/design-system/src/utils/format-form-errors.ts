import type { StandardSchemaV1Issue } from '@tanstack/react-form'

export const formatFormErrors = (errors: (Record<string, StandardSchemaV1Issue[]> | undefined)[]) => {
  if (!errors?.length) {
    return {}
  }

  return Object.entries(errors[0] ?? {}).reduce<Record<string, string>>((acc, issue) => {
    const [key, [currentError]] = issue
    if (typeof key === 'string' && !acc[key]) {
      acc[key] = currentError.message
    }
    return acc
  }, {})
}
