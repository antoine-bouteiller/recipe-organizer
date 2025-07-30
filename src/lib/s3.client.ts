import { env } from "@/config/env.client";

export function getFileUrl(key: string) {
  return `${env.VITE_BUCKET_URL}/${key}`;
}
