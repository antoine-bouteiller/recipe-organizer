import type { ArkErrors } from 'arktype'

export const formatFormErrors = (errors: (Record<string, ArkErrors> | undefined)[] | undefined) => {
  if (!errors?.length) {
    return {}
  }

  return Object.entries(errors[0] ?? {}).reduce<Record<string, string>>((acc, [key, value]) => {
    acc[key] = value.map((issue) => issue.problem).join(', ')
    return acc
  }, {})
}
