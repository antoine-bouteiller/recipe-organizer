import { createMediaQuery } from '@solid-primitives/media'

const MOBILE_QUERY = '(max-width: 768px)'

export const useIsMobile = () => createMediaQuery(MOBILE_QUERY, false)
