export interface ScrollSnapshot {
  readonly document: readonly [number, number]
  readonly elements: Readonly<Record<string, readonly [number, number]>>
}

const scrollContainers = () => document.querySelectorAll<HTMLElement>('[data-scroll-restoration-id]')

export const captureScroll = (): ScrollSnapshot => ({
  document: [scrollX, scrollY],
  elements: Object.fromEntries(
    [...scrollContainers()].map((element) => [element.dataset.scrollRestorationId ?? '', [element.scrollLeft, element.scrollTop] as const])
  ),
})

/** Restores `snapshot`, or scrolls the document and every scroll container to the top without one. */
export const applyScroll = (snapshot: ScrollSnapshot | undefined) => {
  scrollTo(...(snapshot?.document ?? [0, 0]))
  for (const element of scrollContainers()) {
    const [left, top] = snapshot?.elements[element.dataset.scrollRestorationId ?? ''] ?? [0, 0]
    element.scrollTo(left, top)
  }
}
