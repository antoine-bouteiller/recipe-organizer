<script lang="ts">
  import Button from '@/components/ui/actions/button/button.svelte'
  import Spinner from '@/components/ui/feedback/spinner/spinner.svelte'

  const { label, pending }: { label: string; pending: boolean } = $props()
</script>

<Button disabled={pending} type="submit"
  >{#if pending}<Spinner />{/if}{label}</Button
>
