/** Home only matches exactly; other items stay current on their nested pages. */
export const isCurrentPath = (currentPath: string, href: string): boolean =>
  href === '/' ? currentPath === '/' : currentPath === href || currentPath.startsWith(`${href}/`)
