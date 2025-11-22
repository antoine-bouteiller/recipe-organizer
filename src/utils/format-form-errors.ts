import type { StandardSchemaV1Issue } from '@tanstack/react-form'

export const formatFormErrors = (
  errors: (Record<string, StandardSchemaV1Issue[]> | undefined)[] | undefined
) => {
  if (!errors?.length) {
    return {}
  }

  return Object.entries(errors[0] ?? {}).reduce<Record<string, string>>((acc, [key, value]) => {
    acc[key] = value.map((issue) => issue.message).join(', ')
    return acc
  }, {})
}
