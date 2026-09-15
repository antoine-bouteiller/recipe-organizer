import { type Meta, type StoryObj } from '@storybook/react-vite'

import { ArrowCounterClockwiseIcon } from './arrow-counter-clockwise'
import { ArrowElbowDownLeftIcon } from './arrow-elbow-down-left'
import { ArrowLeftIcon } from './arrow-left'
import { ArrowUUpLeftIcon } from './arrow-u-up-left'
import { ArrowUUpRightIcon } from './arrow-u-up-right'
import { BasketIcon } from './basket'
import { BookIcon } from './book'
import { BookOpenIcon } from './book-open'
import { CaretDownIcon } from './caret-down'
import { CaretLeftIcon } from './caret-left'
import { CaretRightIcon } from './caret-right'
import { CaretUpIcon } from './caret-up'
import { CaretUpDownIcon } from './caret-up-down'
import { CarrotIcon } from './carrot'
import { CheckIcon } from './check'
import { CheckCircleIcon } from './check-circle'
import { CircleNotchIcon } from './circle-notch'
import { CookieIcon } from './cookie'
import { CookingPotIcon } from './cooking-pot'
import { CowIcon } from './cow'
import { DotsThreeVerticalIcon } from './dots-three-vertical'
import { FishIcon } from './fish'
import { FunnelSimpleIcon } from './funnel-simple'
import { GearIcon } from './gear'
import { HouseIcon } from './house'
import { ImageIcon } from './image'
import { ListBulletsIcon } from './list-bullets'
import { MagnifyingGlassIcon } from './magnifying-glass'
import { MinusIcon } from './minus'
import { PackageIcon } from './package'
import { PencilSimpleIcon } from './pencil-simple'
import { PepperIcon } from './pepper'
import { PlusIcon } from './plus'
import { ProhibitIcon } from './prohibit'
import { ShoppingCartSimpleIcon } from './shopping-cart-simple'
import { SpinnerGapIcon } from './spinner-gap'
import { TextBolderIcon } from './text-bolder'
import { TextItalicIcon } from './text-italic'
import { TextUnderlineIcon } from './text-underline'
import { ThemeIcon } from './theme'
import { ThermometerIcon } from './thermometer'
import { TimerIcon } from './timer'
import { TrashIcon } from './trash'
import { UserIcon } from './user'
import { UsersIcon } from './users'
import { VideoIcon } from './video'
import { WarningCircleIcon } from './warning-circle'
import { XIcon } from './x'

const meta = {
  tags: ['autodocs'],
  title: 'Data Display/Icons',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const icons = [
  ['ArrowCounterClockwiseIcon', ArrowCounterClockwiseIcon],
  ['ArrowElbowDownLeftIcon', ArrowElbowDownLeftIcon],
  ['ArrowLeftIcon', ArrowLeftIcon],
  ['ArrowUUpLeftIcon', ArrowUUpLeftIcon],
  ['ArrowUUpRightIcon', ArrowUUpRightIcon],
  ['BasketIcon', BasketIcon],
  ['BookIcon', BookIcon],
  ['BookOpenIcon', BookOpenIcon],
  ['CaretDownIcon', CaretDownIcon],
  ['CaretLeftIcon', CaretLeftIcon],
  ['CaretRightIcon', CaretRightIcon],
  ['CaretUpIcon', CaretUpIcon],
  ['CaretUpDownIcon', CaretUpDownIcon],
  ['CarrotIcon', CarrotIcon],
  ['CheckIcon', CheckIcon],
  ['CheckCircleIcon', CheckCircleIcon],
  ['CircleNotchIcon', CircleNotchIcon],
  ['CookieIcon', CookieIcon],
  ['CookingPotIcon', CookingPotIcon],
  ['CowIcon', CowIcon],
  ['DotsThreeVerticalIcon', DotsThreeVerticalIcon],
  ['FishIcon', FishIcon],
  ['FunnelSimpleIcon', FunnelSimpleIcon],
  ['GearIcon', GearIcon],
  ['HouseIcon', HouseIcon],
  ['ImageIcon', ImageIcon],
  ['ListBulletsIcon', ListBulletsIcon],
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
  ['TextItalicIcon', TextItalicIcon],
  ['TextUnderlineIcon', TextUnderlineIcon],
  ['ThemeIcon', ThemeIcon],
  ['ThermometerIcon', ThermometerIcon],
  ['TimerIcon', TimerIcon],
  ['TrashIcon', TrashIcon],
  ['UserIcon', UserIcon],
  ['UsersIcon', UsersIcon],
  ['VideoIcon', VideoIcon],
  ['WarningCircleIcon', WarningCircleIcon],
  ['XIcon', XIcon],
] as const

export const Gallery: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {icons.map(([name, Icon]) => (
        <div className="flex flex-col items-center gap-2 rounded-md border p-4" key={name}>
          <Icon aria-hidden="true" className="size-6" />
          <span className="text-xs text-muted-foreground">{name}</span>
        </div>
      ))}
    </div>
  ),
}
