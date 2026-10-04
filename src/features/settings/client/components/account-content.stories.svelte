<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import AccountContent from './account-content.svelte'

  const { Story } = defineMeta({ component: AccountContent, title: 'Features/Settings/AccountContent' })
</script>

<Story name="Default" args={{ email: 'alice@example.com' }} />
