import { SpinnerGapIcon, ThermometerIcon, TimerIcon } from '@/design-system/ui/data-display/icons'
import { Item } from '@/design-system/ui/data-display/item/item'
import { magimixProgramLabels } from '@/features/recipe/magimix'
import type { MagimixProgramData } from '@/features/recipe/magimix'
import { capitalize } from '@/utils/string'

import * as styles from './magimix-step-item.css'

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  if (minutes === 0) {
    return `${seconds}s`
  }
  if (seconds === 0) {
    return `${minutes}min`
  }
  return `${minutes}min ${seconds}s`
}

export const MagimixStepItem = ({ program, rotationSpeed, temperature, time }: MagimixProgramData) => (
  <Item media={<img alt="" className={styles.image} src={`/magimix/${program}.png`} />} title={magimixProgramLabels[program]} variant="outline">
    <TimerIcon size="sm" />
    <span>{formatTime(time)}</span>/
    <SpinnerGapIcon size="sm" />
    <span>{capitalize(rotationSpeed)}</span>
    {temperature !== undefined && (
      <>
        /
        <ThermometerIcon size="sm" />
        <span>{temperature}°C</span>
      </>
    )}
  </Item>
)
