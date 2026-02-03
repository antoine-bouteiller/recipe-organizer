import { FrameCornersIcon, PauseIcon, PlayIcon } from '@phosphor-icons/react'
import { ClientOnly } from '@tanstack/react-router'
import { Controls, FullscreenButton, MediaPlayer, MediaProvider, PlayButton, Time, useMediaRemote, useMediaState } from '@vidstack/react'
import { useEffect, useState, type ComponentPropsWithoutRef } from 'react'

import { cn } from '@/utils/cn'

import { Button } from './button'
import { Slider } from './slider'

type VideoProps = Omit<ComponentPropsWithoutRef<typeof MediaPlayer>, 'children'>

const VideoControls = () => {
  const time = useMediaState('currentTime')
  const canSeek = useMediaState('canSeek')
  const duration = useMediaState('duration')
  const seeking = useMediaState('seeking')
  const remote = useMediaRemote()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (seeking) {
      return
    }
    setValue((time / duration) * 100)
  }, [time, duration, seeking])

  return (
    <Controls.Root className="absolute inset-0 z-10 flex size-full flex-col bg-linear-to-t from-black/10 to-transparent opacity-0 transition-opacity media-controls:opacity-100">
      <div className="flex-1" />
      <Controls.Group className="flex w-full items-center px-2">
        <Slider
          value={value}
          disabled={!canSeek}
          onValueChange={(value) => {
            setValue(value)
            remote.seeking((value / 100) * duration)
          }}
          onValueCommitted={(value) => {
            remote.seek((value / 100) * duration)
          }}
        />
      </Controls.Group>
      <Controls.Group className="flex w-full items-center py-0.5 text-white">
        <Button render={<PlayButton />} variant="ghost" size="icon" className="group">
          <PlayIcon className="hidden group-data-paused:block" />
          <PauseIcon className="group-data-paused:hidden" />
        </Button>
        <div className="ml-2.5 flex items-center text-sm font-medium">
          <Time className="time" type="current" />
          <div className="mx-1 text-white/80">/</div>
          <Time className="time" type="duration" />
        </div>
        <div className="flex-1" />
        <Button render={<FullscreenButton />} variant="ghost" size="icon">
          <FrameCornersIcon />
        </Button>
      </Controls.Group>
    </Controls.Root>
  )
}

export const Video = ({ className, ...props }: VideoProps) => (
  <ClientOnly>
    <MediaPlayer
      aspectRatio="9/16"
      crossOrigin
      className={cn('flex max-w-sm flex-col rounded-lg relative', className)}
      fullscreenOrientation="portrait"
      playsInline
      {...props}
    >
      <MediaProvider />
      <VideoControls />
    </MediaPlayer>
  </ClientOnly>
)
