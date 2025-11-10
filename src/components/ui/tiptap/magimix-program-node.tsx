import { mergeAttributes, Node } from '@tiptap/core'
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import {
  CookingPotIcon,
  ForkKnifeIcon,
  type Icon,
  ThermometerIcon,
  TimerIcon,
} from '@phosphor-icons/react'
import { magimixProgramLabels, MagimixProgram, type MagimixProgramData } from '@/types/magimix'

// Icons for each program
const magimixProgramIcons: Record<MagimixProgram, Icon> = {
  [MagimixProgram.COOKING]: CookingPotIcon,
  [MagimixProgram.MIXING]: ForkKnifeIcon,
  [MagimixProgram.KNEADING]: ForkKnifeIcon,
  [MagimixProgram.EMULSIFYING]: ForkKnifeIcon,
  [MagimixProgram.CHOPPING]: ForkKnifeIcon,
  [MagimixProgram.BLENDING]: ForkKnifeIcon,
  [MagimixProgram.STEAMING]: CookingPotIcon,
  [MagimixProgram.SIMMERING]: CookingPotIcon,
  [MagimixProgram.SLOW_COOKING]: CookingPotIcon,
  [MagimixProgram.KEEP_WARM]: ThermometerIcon,
}

// Format time duration
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

// React component for the Magimix program node view
const MagimixProgramComponent = ({ node }: { node: { attrs: MagimixProgramData } }) => {
  const { program, time, temperature } = node.attrs
  const ProgramIcon = magimixProgramIcons[program]
  const label = magimixProgramLabels[program]

  return (
    <NodeViewWrapper className="magimix-program-node">
      <div className="my-2 rounded-lg border border-border bg-muted/50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ProgramIcon className="size-5" weight="fill" />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <div className="font-semibold text-foreground">{label}</div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
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
        </div>
      </div>
      <NodeViewContent />
    </NodeViewWrapper>
  )
}

// TipTap Node Extension
export const MagimixProgramNode = Node.create<Record<string, never>>({
  name: 'magimixProgram',

  group: 'block',

  content: 'inline*',

  draggable: true,

  addAttributes() {
    return {
      program: {
        default: MagimixProgram.COOKING,
        parseHTML: (element) => element.dataset.program,
        renderHTML: (attributes) => ({
          'data-program': attributes.program as string,
        }),
      },
      time: {
        default: 'auto',
        parseHTML: (element) => {
          const time = element.dataset.time
          if (time === 'auto') return 'auto'
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
          if (!temp) return undefined
          const parsed = Number.parseInt(temp, 10)
          return Number.isNaN(parsed) ? undefined : parsed
        },
        renderHTML: (attributes) => {
          if (attributes.temperature === undefined) return {}
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
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'magimix-program' }), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(MagimixProgramComponent)
  },

  addCommands() {
    return {
      setMagimixProgram:
        (attributes: MagimixProgramData) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          })
        },
    }
  },
})
