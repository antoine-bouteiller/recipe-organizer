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
  } from './svelte'

  import * as styles from './icons.stories.css'

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
  <div class={styles.gallery}>
    {#each icons as [name, Icon] (name)}
      <div class={styles.iconCell}>
        <Icon size="xl" />
        <span class={styles.iconName}>{name}</span>
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
