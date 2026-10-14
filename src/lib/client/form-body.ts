type HasFile<TValue> = TValue extends File
  ? true
  : TValue extends readonly (infer TItem)[]
    ? HasFile<TItem>
    : TValue extends object
      ? true extends { [TKey in keyof TValue]-?: HasFile<TValue[TKey]> }[keyof TValue]
        ? true
        : false
      : false

/** Multipart is only possible when `TData` can hold a `File`. */
export type FormBody<TData> = true extends HasFile<TData> ? FormData | TData : TData

const containsFile = (value: unknown): boolean => {
  if (value instanceof File) {
    return true
  }
  if (Array.isArray(value)) {
    return value.some(containsFile)
  }
  return typeof value === 'object' && value !== null && Object.values(value).some(containsFile)
}

const appendField = (formData: FormData, key: string, value: unknown) => {
  if (value instanceof File) {
    formData.append(key, value)
  } else if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) {
      appendField(formData, `${key}[${index}]`, item)
    }
  } else if (typeof value === 'object' && value !== null) {
    for (const [name, item] of Object.entries(value)) {
      appendField(formData, `${key}[${name}]`, item)
    }
  } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    formData.append(key, String(value))
  } else {
    formData.append(key, '')
  }
}

/**
 * JSON unless a value is a `File`; then bracket-key multipart, where numbers become strings,
 * `null` and `undefined` become empty strings and empty arrays are omitted.
 */
export const toRequestBody = <TData extends object>(data: TData): FormBody<TData> => {
  let body: FormData | TData = data
  if (containsFile(data)) {
    body = new FormData()
    for (const [key, value] of Object.entries(data)) {
      appendField(body, key, value)
    }
  }
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- FormData is only built when `TData` holds a File.
  return body as FormBody<TData>
}
