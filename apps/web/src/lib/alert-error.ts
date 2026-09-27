import * as z from 'zod'

const getDetail = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return z.prettifyError(error)
  }
  return error instanceof Error ? error.message : undefined
}

export const alertError = (message: string, error?: unknown) => {
  const detail = getDetail(error)
  alert(detail ? `${message}\n\n${detail}` : message)
}
