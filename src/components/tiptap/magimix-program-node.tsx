import { type MagimixProgramData, magimixProgramLabels } from '@/components/tiptap/types/magimix'
import { capitalize } from '@/utils/string'
import { SpinnerGapIcon, ThermometerIcon, TimerIcon } from '@phosphor-icons/react'
import { mergeAttributes, Node } from '@tiptap/core'
import {
  NodeViewWrapper,
  type ReactNodeViewProps,
  ReactNodeViewRenderer as reactNodeViewRenderer,
} from '@tiptap/react'
import { MagimixProgramDialog, type MagimixProgramFormInput } from './magimix-program-dialog'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    magimixProgram: {
      setMagimixProgram: (attributes: MagimixProgramData) => ReturnType
    }
  }
}

interface WrapperProps {
  children: React.ReactNode
  isEditable: boolean
  updateAttributes: (attributes: MagimixProgramData) => void
  initialData: MagimixProgramFormInput
}

const Wrapper = ({ children, isEditable, initialData, updateAttributes }: WrapperProps) =>
  isEditable ? (
    <MagimixProgramDialog
      submitLabel="Enregistrer"
      triggerRender={
        <div className="my-2 rounded-lg border border-border bg-muted/50 p-4 w-full text-start cursor-pointer" />
      }
      title="Modifier le programme Magimix"
      onSubmit={updateAttributes}
      initialData={initialData}
    >
      {children}
    </MagimixProgramDialog>
  ) : (
    <div className="my-2 rounded-lg border border-border bg-muted/50 p-4 w-full text-start">
      {children}
    </div>
  )

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

const MagimixProgramComponent = ({ node, editor, updateAttributes }: ReactNodeViewProps) => {
  const { program, time, temperature, rotationSpeed } = node.attrs as MagimixProgramData
  const label = magimixProgramLabels[program]

  const formInitialValues: MagimixProgramFormInput = {
    program,
    timeMinutes: typeof time === 'number' ? Math.floor(time / 60) : 0,
    timeSeconds: typeof time === 'number' ? time % 60 : 0,
    temperature,
    rotationSpeed,
  }

  return (
    <NodeViewWrapper className="magimix-program-node">
      <Wrapper
        initialData={formInitialValues}
        updateAttributes={updateAttributes}
        isEditable={editor.isEditable}
      >
        <div className="flex items-center gap-3">
          <img
            alt="Magimix Program Icon"
            src={`/magimix/${program}.png`}
            className="size-10 not-prose"
          />
          <div className="flex flex-col md:flex-row flex-1 gap-1">
            <div className="font-semibold text-foreground">{label}</div>
            <div className="flex flex-1 gap-1">
              <div className="flex items-center gap-1 pl-2">
                <TimerIcon className="size-4" />
                <span>{formatTime(time)}</span>
              </div>
              /
              <div className="flex items-center gap-1">
                <SpinnerGapIcon className="size-4" />
                <span>{capitalize(rotationSpeed)}</span>
              </div>
              /
              <div className="flex items-center gap-1">
                <ThermometerIcon className="size-4" />
                <span>{temperature ?? '__'}°C</span>
              </div>
            </div>
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
          return Number.parseInt(time ?? '0', 10)
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
      rotationSpeed: {
        default: undefined,
        parseHTML: (element) => element.dataset.rotationSpeed,
        renderHTML: (attributes) => {
          if (attributes.rotationSpeed === undefined) {
            return {}
          }
          return {
            'data-rotation-speed': String(attributes.rotationSpeed),
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
    return reactNodeViewRenderer(MagimixProgramComponent)
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
