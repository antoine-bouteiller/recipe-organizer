import { useRouter } from '@tanstack/solid-router'
import { type JSX, Show } from 'solid-js'
import ArrowLeft from '~icons/ph/arrow-left'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

import { TabBar } from '../navigation/tabbar'

interface ScreenLayoutProps {
  children: JSX.Element
  headerEndItem?: JSX.Element
  title: string
  withGoBack?: boolean
  backgroundImage?: string
  pageKey?: string
}

export const ScreenLayout = (props: ScreenLayoutProps) => {
  const router = useRouter()

  const isImageHeader = () => Boolean(props.backgroundImage)

  return (
    <div
      class={cn(
        'relative flex min-h-0 w-full flex-1 flex-col items-center overflow-hidden bg-muted pt-0 md:overflow-y-auto',
        props.pageKey ? 'pb-14' : ''
      )}
    >
      <Show
        when={isImageHeader()}
        fallback={
          <div class="flex w-full shrink-0 items-center gap-2 px-6 pt-safe-4 pb-1 text-foreground md:hidden">
            <Show when={props.withGoBack}>
              <Button class="-ml-4" onClick={() => router.history.back()} size="icon" variant="ghost">
                <ArrowLeft />
              </Button>
            </Show>
            <h1 class="flex-1 truncate font-heading text-3xl font-semibold">{props.title}</h1>
            <Show when={props.headerEndItem}>
              <div>{props.headerEndItem}</div>
            </Show>
          </div>
        }
      >
        <div class="relative flex w-full shrink-0 items-center gap-2 overflow-hidden bg-linear-to-b from-violet-950 to-primary px-6 pt-safe-4 pb-12 text-primary-foreground md:hidden">
          <img alt="Background Image" class="absolute inset-0 size-full object-cover object-center" src={props.backgroundImage} />
          <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10 md:rounded-t-2xl" />
          <Show when={props.withGoBack}>
            <Button class="-ml-4 text-white" onClick={() => router.history.back()} size="icon" variant="ghost">
              <ArrowLeft />
            </Button>
          </Show>
          <h1 class="z-10 min-w-0 flex-1 truncate font-heading text-2xl">{props.title}</h1>
          <Show when={props.headerEndItem}>
            <div class="z-10">{props.headerEndItem}</div>
          </Show>
        </div>
      </Show>
      <div
        class={cn(
          'z-10 flex min-h-0 w-full flex-1 flex-col overflow-y-auto bg-muted md:mt-0 md:max-w-5xl md:overflow-y-visible px-4 pb-4 pt-1',
          isImageHeader() && '-mt-10 rounded-t-3xl'
        )}
      >
        {props.children}
      </div>
      <Show when={props.pageKey}>
        <TabBar />
      </Show>
    </div>
  )
}
