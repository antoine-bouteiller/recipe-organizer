<script lang="ts">
  import { mobileMenuItems } from '@/components/navigation/menu-items.svelte'
  import TabBar from '@/components/navigation/tabbar.svelte'
  import ScreenLayout from '@/components/screen-layout/screen-layout.svelte'
  import Button from '@/components/ui/actions/button/button.svelte'
  import { ArrowCounterClockwiseIcon } from '@/components/ui/data-display/icons'
  import ShoppingList from '@/features/shopping-list/client/component/shopping-list.svelte'
  import { resetShoppingList } from '@/stores/shopping-list.store.svelte'
</script>

<ScreenLayout title="Liste de courses">
  <ShoppingList />
  {#snippet headerEndItem()}
    <Button aria-label="Vider la liste" onclick={resetShoppingList} size="icon" variant="outline">
      <ArrowCounterClockwiseIcon size="sm" />
    </Button>
  {/snippet}
  {#snippet footer()}<TabBar currentPath="/shopping-list" items={mobileMenuItems} />{/snippet}
</ScreenLayout>
