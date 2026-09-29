import type { Meta, StoryObj } from '@storybook/react-vite'

import { ArrowCounterClockwiseIcon } from './arrow-counter-clockwise'
import { ArrowElbowDownLeftIcon } from './arrow-elbow-down-left'
import { ArrowLeftIcon } from './arrow-left'
import { BasketIcon } from './basket'
import { BookIcon } from './book'
import { CaretDownIcon } from './caret-down'
import { CaretLeftIcon } from './caret-left'
import { CaretRightIcon } from './caret-right'
import { CaretUpIcon } from './caret-up'
import { CaretUpDownIcon } from './caret-up-down'
import { CarrotIcon } from './carrot'
import { CheckIcon } from './check'
import { CircleNotchIcon } from './circle-notch'
import { CookieIcon } from './cookie'
import { CowIcon } from './cow'
import { DotsThreeVerticalIcon } from './dots-three-vertical'
import { FishIcon } from './fish'
import { FunnelSimpleIcon } from './funnel-simple'
import { GearIcon } from './gear'
import { HouseIcon } from './house'
import { ImageIcon } from './image'
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
import { ThemeIcon } from './theme'
import { ThermometerIcon } from './thermometer'
import { TimerIcon } from './timer'
import { TrashIcon } from './trash'
import { UserIcon } from './user'
import { UsersIcon } from './users'
import { VideoIcon } from './video'
import { XIcon } from './x'

import * as styles from './icons.stories.css'

const meta = {
  title: 'Data Display/Icons',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const icons = [
  ['ArrowCounterClockwiseIcon', ArrowCounterClockwiseIcon],
  ['ArrowElbowDownLeftIcon', ArrowElbowDownLeftIcon],
  ['ArrowLeftIcon', ArrowLeftIcon],
  ['BasketIcon', BasketIcon],
  ['BookIcon', BookIcon],
  ['CaretDownIcon', CaretDownIcon],
  ['CaretLeftIcon', CaretLeftIcon],
  ['CaretRightIcon', CaretRightIcon],
  ['CaretUpIcon', CaretUpIcon],
  ['CaretUpDownIcon', CaretUpDownIcon],
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

export const Gallery: Story = {
  render: () => (
    <div className={styles.gallery}>
      {icons.map(([name, Icon]) => (
        <div className={styles.iconCell} key={name}>
          <Icon size="xl" />
          <span className={styles.iconName}>{name}</span>
        </div>
      ))}
    </div>
  ),
}
