<svelte:options namespace="svg" />

<script lang="ts">
  import type { IconProps } from './icon-types'
  import Icon from './icon.svelte'

  const { weight, ...props }: IconProps & { weight?: 'bold' } = $props()
</script>

<Icon {...props}>
  <path d="M17 17L21 21" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width={weight === 'bold' ? 2.5 : 1.5} />
  <path
    d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={weight === 'bold' ? 2.5 : 1.5}
  />
</Icon>
