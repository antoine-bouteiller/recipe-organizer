<script lang="ts">
  import GoBackButton from '@/components/screen-layout/go-back-button.svelte'
  import ScreenLayout from '@/components/screen-layout/screen-layout.svelte'
  import UsersManagement from '@/features/users/client/components/users-management.svelte'

  import type { Props } from './index.server'

  const { users }: Props = $props()
</script>

<ScreenLayout title="Utilisateurs">
  <UsersManagement {users} />
  {#snippet backButton()}<GoBackButton />{/snippet}
</ScreenLayout>
