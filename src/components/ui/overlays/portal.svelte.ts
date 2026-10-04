import type { Attachment } from 'svelte/attachments'

/** Relocate Svelte-owned DOM, not its component tree; document delegation keeps snippet events working. */
export const portal: Attachment<HTMLElement> = (element) => {
  document.body.appendChild(element)
  return () => element.remove()
}
