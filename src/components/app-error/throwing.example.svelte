<script lang="ts">
  const { shouldThrow }: { shouldThrow: boolean } = $props()
  const content = $derived.by(() => {
    if (shouldThrow) {
      throw new Error('Render failure')
    }
    return 'Page content'
  })
</script>

<p>{content}</p>
