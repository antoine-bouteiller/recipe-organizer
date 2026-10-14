<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query'

  import GoBackButton from '@/components/screen-layout/go-back-button.svelte'
  import ScreenLayout from '@/components/screen-layout/screen-layout.svelte'
  import { userListQuery } from '@/features/users/client/api/get-all'
  import UsersManagement from '@/features/users/client/components/users-management.svelte'

  const active = createQuery(() => userListQuery('active'))
  const pending = createQuery(() => userListQuery('pending'))
  const blocked = createQuery(() => userListQuery('blocked'))
</script>

<ScreenLayout title="Utilisateurs">
  <UsersManagement users={{ active: active.data ?? [], blocked: blocked.data ?? [], pending: pending.data ?? [] }} />
  {#snippet backButton()}<GoBackButton />{/snippet}
</ScreenLayout>
