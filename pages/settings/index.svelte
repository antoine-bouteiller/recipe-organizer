<script lang="ts">
  import { mobileMenuItems } from '@/components/navigation/menu-items.svelte'
  import TabBar from '@/components/navigation/tabbar.svelte'
  import ScreenLayout from '@/components/screen-layout/screen-layout.svelte'
  import SettingsContent from '@/features/settings/client/components/settings-content.svelte'

  import type { Props } from './index.server'

  const { isAdmin }: Props = $props()
</script>

<ScreenLayout title="Paramètres">
  <SettingsContent {isAdmin} />
  {#snippet footer()}<TabBar currentPath="/settings" items={mobileMenuItems} />{/snippet}
</ScreenLayout>
