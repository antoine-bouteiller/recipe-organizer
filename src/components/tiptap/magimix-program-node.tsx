import { type MagimixProgramData, magimixProgramLabels } from '@/components/tiptap/types/magimix'
import { ThermometerIcon, TimerIcon } from '@phosphor-icons/react'
import { mergeAttributes, Node } from '@tiptap/core'
import { NodeViewWrapper, type ReactNodeViewProps, ReactNodeViewRenderer } from '@tiptap/react'
import { useCallback, useMemo } from 'react'
import { MagimixProgramDialog, type MagimixProgramFormInput } from './magimix-program-dialog'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    magimixProgram: {
      setMagimixProgram: (attributes: MagimixProgramData) => ReturnType
    }
  }
}

const formatTime = (time: 'auto' | number): string => {
  if (time === 'auto') {
    return 'Auto'
  }

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

const MagimixProgramComponent = ({ node, editor, updateAttributes }: ReactNodeViewProps) => {
  const { program, time, temperature } = node.attrs as MagimixProgramData
  const label = magimixProgramLabels[program]

  const formInitialValues: MagimixProgramFormInput = useMemo(
    () => ({
      program,
      timeType: time === 'auto' ? 'auto' : 'manual',
      timeMinutes: typeof time === 'number' ? Math.floor(time / 60) : 0,
      timeSeconds: typeof time === 'number' ? time % 60 : 0,
      temperature,
    }),
    [program, time, temperature]
  )

  const Wrapper = useCallback(
    ({ children }: { children: React.ReactNode }) =>
      editor.isEditable ? (
        <MagimixProgramDialog
          submitLabel="Enregistrer"
          triggerRender={
            <div className="my-2 rounded-lg border border-border bg-muted/50 p-4 w-full text-start cursor-pointer" />
          }
          title="Modifier le programme Magimix"
          onSubmit={updateAttributes}
          initialData={formInitialValues}
        >
          {children}
        </MagimixProgramDialog>
      ) : (
        <div className="my-2 rounded-lg border border-border bg-muted/50 p-4 w-full text-start">
          {children}
        </div>
      ),
    [editor.isEditable, formInitialValues, updateAttributes]
  )

  return (
    <NodeViewWrapper className="magimix-program-node">
      <Wrapper>
        <div className="flex items-center gap-3">
          <img src={`/magimix/${program}.png`} className="size-10 not-prose" />
          <div className="flex flex-1 gap-1">
            <div className="font-semibold text-foreground">{label}</div>
            <div className="flex items-center gap-1 pl-2">
              <TimerIcon className="size-4" />
              <span>{formatTime(time)}</span>
            </div>
            {temperature !== undefined && (
              <div className="flex items-center gap-1">
                <ThermometerIcon className="size-4" />
                <span>{temperature}°C</span>
              </div>
            )}
          </div>
        </div>
      </Wrapper>
    </NodeViewWrapper>
  )
}

export const MagimixProgramNode = Node.create<Record<string, never>>({
  name: 'magimixProgram',

  group: 'block',

  draggable: true,

  addAttributes() {
    return {
      program: {
        parseHTML: (element) => element.dataset.program,
        renderHTML: (attributes) => ({
          'data-program': attributes.program as string,
        }),
      },
      time: {
        default: 'auto',
        parseHTML: (element) => {
          const { time } = element.dataset
          if (time === 'auto') {
            return 'auto'
          }
          const parsed = Number.parseInt(time ?? '0', 10)
          return Number.isNaN(parsed) ? 'auto' : parsed
        },
        renderHTML: (attributes) => ({
          'data-time': String(attributes.time),
        }),
      },
      temperature: {
        default: undefined,
        parseHTML: (element) => {
          const temp = element.dataset.temperature
          if (!temp) {
            return undefined
          }
          const parsed = Number.parseInt(temp, 10)
          return Number.isNaN(parsed) ? undefined : parsed
        },
        renderHTML: (attributes) => {
          if (attributes.temperature === undefined) {
            return {}
          }
          return {
            'data-temperature': String(attributes.temperature),
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="magimix-program"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'magimix-program' })]
  },

  addNodeView() {
    // eslint-disable-next-line new-cap
    return ReactNodeViewRenderer(MagimixProgramComponent)
  },

  addCommands() {
    return {
      setMagimixProgram:
        (attributes: MagimixProgramData) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: attributes,
          }),
    }
  },
})
