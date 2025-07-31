export function getFileUrl(key: string) {
  return `${import.meta.env.VITE_PUBLIC_R2_URL}/${key}`
}
