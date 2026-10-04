<script lang="ts">
  import GoBackButton from '@/components/screen-layout/go-back-button.svelte'
  import ScreenLayout from '@/components/screen-layout/screen-layout.svelte'
  import AccountContent from '@/features/settings/client/components/account-content.svelte'

  import type { Props } from './index.server'

  const { email }: Props = $props()
</script>

<ScreenLayout title="Compte">
  <AccountContent {email} />
  {#snippet backButton()}<GoBackButton />{/snippet}
</ScreenLayout>
