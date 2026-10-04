<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { expect, within } from 'storybook/test'

  import {
    ArrowCounterClockwiseIcon,
    ArrowElbowDownLeftIcon,
    ArrowLeftIcon,
    BasketIcon,
    BookIcon,
    CaretDownIcon,
    CaretLeftIcon,
    CaretRightIcon,
    CaretUpDownIcon,
    CaretUpIcon,
    CarrotIcon,
    CheckIcon,
    CircleNotchIcon,
    CookieIcon,
    CowIcon,
    DotsThreeVerticalIcon,
    FishIcon,
    FunnelSimpleIcon,
    GearIcon,
    HouseIcon,
    ImageIcon,
    MagnifyingGlassIcon,
    MinusIcon,
    PackageIcon,
    PencilSimpleIcon,
    PepperIcon,
    PlusIcon,
    ProhibitIcon,
    ShoppingCartSimpleIcon,
    SpinnerGapIcon,
    TextBolderIcon,
    ThemeIcon,
    ThermometerIcon,
    TimerIcon,
    TrashIcon,
    UserIcon,
    UsersIcon,
    VideoIcon,
    XIcon,
  } from '.'

  const { Story } = defineMeta({ title: 'Data Display/Icons' })

  const icons = [
    ['ArrowCounterClockwiseIcon', ArrowCounterClockwiseIcon],
    ['ArrowElbowDownLeftIcon', ArrowElbowDownLeftIcon],
    ['ArrowLeftIcon', ArrowLeftIcon],
    ['BasketIcon', BasketIcon],
    ['BookIcon', BookIcon],
    ['CaretDownIcon', CaretDownIcon],
    ['CaretLeftIcon', CaretLeftIcon],
    ['CaretRightIcon', CaretRightIcon],
    ['CaretUpDownIcon', CaretUpDownIcon],
    ['CaretUpIcon', CaretUpIcon],
    ['CarrotIcon', CarrotIcon],
    ['CheckIcon', CheckIcon],
    ['CircleNotchIcon', CircleNotchIcon],
    ['CookieIcon', CookieIcon],
    ['CowIcon', CowIcon],
    ['DotsThreeVerticalIcon', DotsThreeVerticalIcon],
    ['FishIcon', FishIcon],
    ['FunnelSimpleIcon', FunnelSimpleIcon],
    ['GearIcon', GearIcon],
    ['HouseIcon', HouseIcon],
    ['ImageIcon', ImageIcon],
    ['MagnifyingGlassIcon', MagnifyingGlassIcon],
    ['MinusIcon', MinusIcon],
    ['PackageIcon', PackageIcon],
    ['PencilSimpleIcon', PencilSimpleIcon],
    ['PepperIcon', PepperIcon],
    ['PlusIcon', PlusIcon],
    ['ProhibitIcon', ProhibitIcon],
    ['ShoppingCartSimpleIcon', ShoppingCartSimpleIcon],
    ['SpinnerGapIcon', SpinnerGapIcon],
    ['TextBolderIcon', TextBolderIcon],
    ['ThemeIcon', ThemeIcon],
    ['ThermometerIcon', ThermometerIcon],
    ['TimerIcon', TimerIcon],
    ['TrashIcon', TrashIcon],
    ['UserIcon', UserIcon],
    ['UsersIcon', UsersIcon],
    ['VideoIcon', VideoIcon],
    ['XIcon', XIcon],
  ] as const
</script>

<Story name="Gallery" asChild>
  <div class="gallery">
    {#each icons as [name, Icon] (name)}
      <div class="icon-cell">
        <Icon size="xl" />
        <span class="icon-name">{name}</span>
      </div>
    {/each}
  </div>
</Story>

<Story
  name="Accessibility"
  asChild
  tags={['!dev']}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('img', { name: 'Back' })).toBeInTheDocument()
    await expect(canvas.getAllByRole('img')).toHaveLength(1)
    const decorative = canvasElement.querySelector('[data-testid=decorative] svg')
    await expect(decorative).toHaveAttribute('aria-hidden', 'true')
    await expect(decorative).toHaveAttribute('width', '1em')
    await expect(decorative).toHaveAttribute('height', '1em')
  }}
>
  <span data-testid="decorative"><ArrowLeftIcon /></span>
  <ArrowLeftIcon aria-label="Back" />
</Story>

<style>
  .gallery {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media screen and (min-width: 640px) {
    .gallery {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  @media screen and (min-width: 1024px) {
    .gallery {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  .icon-cell {
    align-items: center;
    border-radius: var(--radius-md);
    border-width: 1px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
  }

  .icon-name {
    font-size: var(--font-sizes-xs);
  }
</style>
