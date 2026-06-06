import { Toolbar as ToolbarRoot, ToolbarGroup, ToolbarSeparator } from './primitive/toolbar'

const Toolbar = Object.assign(ToolbarRoot, {
  Group: ToolbarGroup,
  Separator: ToolbarSeparator,
})

export { Toolbar }
