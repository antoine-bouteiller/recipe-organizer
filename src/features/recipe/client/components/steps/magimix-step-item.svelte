<script lang="ts">
  import { SpinnerGapIcon, ThermometerIcon, TimerIcon } from '@/components/ui/data-display/icons'
  import Item from '@/components/ui/data-display/item/item.svelte'
  import { magimixProgramLabels } from '@/features/recipe/magimix'
  import type { MagimixProgramData } from '@/features/recipe/magimix'
  import { capitalize } from '@/utils/string'

  const { program, rotationSpeed, temperature, time }: MagimixProgramData = $props()
  const formatTime = (value: number) => {
    const minutes = Math.floor(value / 60)
    const seconds = value % 60
    if (minutes === 0) {
      return `${seconds}s`
    }
    if (seconds === 0) {
      return `${minutes}min`
    }
    return `${minutes}min ${seconds}s`
  }
</script>

<Item variant="outline">
  {#snippet title()}{magimixProgramLabels[program]}{/snippet}
  {#snippet media()}<img alt="" class="magimix-step-item-image" src={`/magimix/${program}.png`} />{/snippet}
  <TimerIcon size="sm" /><span>{formatTime(time)}</span>/<SpinnerGapIcon size="sm" /><span>{capitalize(rotationSpeed)}</span>
  {#if temperature !== undefined}/<ThermometerIcon size="sm" /><span>{temperature}°C</span>{/if}
</Item>

<style>
  .magimix-step-item-image {
    height: 40px;
    width: 40px;
  }
</style>
