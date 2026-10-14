<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query'

  import { mobileMenuItems } from '@/components/navigation/menu-items.svelte'
  import TabBar from '@/components/navigation/tabbar.svelte'
  import ScreenLayout from '@/components/screen-layout/screen-layout.svelte'
  import SettingsContent from '@/features/settings/client/components/settings-content.svelte'
  import { sessionQuery } from '@/lib/client/session'

  const session = createQuery(() => sessionQuery)
</script>

<ScreenLayout title="Paramètres">
  <SettingsContent isAdmin={session.data?.role === 'admin'} />
  {#snippet footer()}<TabBar currentPath="/settings" items={mobileMenuItems} />{/snippet}
</ScreenLayout>
