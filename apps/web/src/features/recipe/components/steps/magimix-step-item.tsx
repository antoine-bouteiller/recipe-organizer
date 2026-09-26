import { capitalize } from '@client/utils/string'
import { SpinnerGapIcon } from '@recipe-organizer/design-system/icons/spinner-gap'
import { ThermometerIcon } from '@recipe-organizer/design-system/icons/thermometer'
import { TimerIcon } from '@recipe-organizer/design-system/icons/timer'
import { Item } from '@recipe-organizer/design-system/item'
import { magimixProgramLabels, type MagimixProgramData } from '@recipe-organizer/shared/recipe/magimix'

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
