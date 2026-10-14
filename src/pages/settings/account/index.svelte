<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query'

  import GoBackButton from '@/components/screen-layout/go-back-button.svelte'
  import ScreenLayout from '@/components/screen-layout/screen-layout.svelte'
  import AccountContent from '@/features/settings/client/components/account-content.svelte'
  import { sessionQuery } from '@/lib/client/session'

  const session = createQuery(() => sessionQuery)
</script>

<ScreenLayout title="Compte">
  <AccountContent email={session.data?.email ?? undefined} />
  {#snippet backButton()}<GoBackButton />{/snippet}
</ScreenLayout>
