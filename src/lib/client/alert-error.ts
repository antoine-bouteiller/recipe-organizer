export const alertError = (message: string, error?: unknown) => {
  const detail = error instanceof Error ? error.message : undefined
  alert(detail ? `${message}\n\n${detail}` : message)
}
