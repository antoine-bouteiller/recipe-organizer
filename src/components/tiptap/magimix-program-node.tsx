import { SpinnerGapIcon, ThermometerIcon, TimerIcon } from '@phosphor-icons/react'
import { mergeAttributes, Node, NodeViewWrapper, ReactNodeViewRenderer as reactNodeViewRenderer, type ReactNodeViewProps } from '@tiptap/react'

import { magimixProgramLabels, type MagimixProgramData } from '@/components/tiptap/types/magimix'
import { capitalize } from '@/utils/string'

import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '../ui/item'
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
  initialData: MagimixProgramFormInput
  isEditable: boolean
  updateAttributes: (attributes: MagimixProgramData) => void
}

const Wrapper = ({ children, initialData, isEditable, updateAttributes }: WrapperProps) =>
  isEditable ? (
    <MagimixProgramDialog
      initialData={initialData}
      onSubmit={updateAttributes}
      submitLabel="Enregistrer"
      title="Modifier le programme Magimix"
      triggerRender={
        <Item variant="outline" render={<button />} className="w-full">
          {children}
        </Item>
      }
    />
  ) : (
    <Item variant="outline">{children}</Item>
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

const MagimixProgramComponent = ({ editor, node, updateAttributes }: ReactNodeViewProps) => {
  const { program, rotationSpeed, temperature, time } = node.attrs as MagimixProgramData
  const label = magimixProgramLabels[program]

  const formInitialValues: MagimixProgramFormInput = {
    program,
    rotationSpeed,
    temperature: temperature ?? undefined,
    timeMinutes: Math.floor(time / 60),
    timeSeconds: time % 60,
  }

  return (
    <NodeViewWrapper className="not-prose">
      <Wrapper initialData={formInitialValues} isEditable={editor.isEditable} updateAttributes={updateAttributes}>
        <ItemMedia>
          <img alt="Magimix Program Icon" className="not-prose size-10" src={`/magimix/${program}.png`} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{label}</ItemTitle>
          <ItemDescription className="my-0 flex items-center gap-1">
            <TimerIcon className="size-4" />
            <span>{formatTime(time)}</span>/
            <SpinnerGapIcon className="size-4" />
            <span>{capitalize(rotationSpeed)}</span>
            /
            <ThermometerIcon className="size-4" />
            <span>{temperature ?? '__'}°C</span>
          </ItemDescription>
        </ItemContent>
      </Wrapper>
    </NodeViewWrapper>
  )
}

export const MagimixProgramNode = Node.create({
  addAttributes() {
    return {
      program: {
        parseHTML: (element) => element.dataset.program,
        renderHTML: (attributes) => ({
          'data-program': attributes.program as string,
        }),
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
    }
  },

  addCommands() {
    return {
      setMagimixProgram:
        (attributes: MagimixProgramData) =>
        ({ commands }) =>
          commands.insertContent({
            attrs: attributes,
            type: this.name,
          }),
    }
  },

  addNodeView() {
    return reactNodeViewRenderer(MagimixProgramComponent)
  },

  draggable: true,

  group: 'block',

  name: 'magimixProgram',

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
})
