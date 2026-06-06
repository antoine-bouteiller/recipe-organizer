import { Kbd as KbdRoot, KbdGroup } from './primitive/kbd'

const Kbd = Object.assign(KbdRoot, {
  Group: KbdGroup,
})

export { Kbd }
