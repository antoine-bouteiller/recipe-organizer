export const getImageUrl = (key: string) => (import.meta.env.DEV ? `https://picsum.photos/seed/${key}/300/200` : `/api/image/${key}`)

export const getVideoUrl = (key: string) => `/api/video/${key}`
