import { Tabs as TabsRoot, TabsList, TabsPanel, TabsTab } from './primitive/tabs'

const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Panel: TabsPanel,
  Tab: TabsTab,
})

export { Tabs }
