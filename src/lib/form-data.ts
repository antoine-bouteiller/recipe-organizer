export const objectToFormData = (object: Record<string, unknown>) => {
  const formData = new FormData()
  for (const [key, value] of Object.entries(object)) {
    if (value instanceof File) {
      formData.append(key, value)
    } else {
      formData.append(key, JSON.stringify(value))
    }
  }
  return formData
}

const isJsonString = (str: string): boolean => {
  try {
    JSON.parse(str)
  } catch {
    return false
  }
  return true
}

export const parseFormData = (formData: FormData) => {
  const data: Record<string, unknown> = {}
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string' && isJsonString(value)) {
      data[key] = JSON.parse(value)
    } else {
      data[key] = value
    }
  }
  return data
}
