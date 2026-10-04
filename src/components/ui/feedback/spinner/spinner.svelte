<script lang="ts">
  import { CircleNotchIcon } from '@/components/ui/data-display/icons'
</script>

<span class="spinner"><CircleNotchIcon aria-label="Loading" /></span>

<style>
  .spinner {
    --owner-icon-size: 18px;
    animation: spin 1s linear infinite reverse;
  }
</style>
