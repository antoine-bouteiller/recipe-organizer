import { TabsList, TabsPanel, Tabs as TabsRoot, TabsTab } from '@/components/ui/tabs'

const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Panel: TabsPanel,
  Tab: TabsTab,
})

export { Tabs }
