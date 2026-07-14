import {
  $getNodeByKey,
  DecoratorNode,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalEditor,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from 'lexical'
import { type JSX, Show } from 'solid-js'
import SpinnerGap from '~icons/ph/spinner-gap'
import Thermometer from '~icons/ph/thermometer'
import Timer from '~icons/ph/timer'

import { useEditor } from '@/components/common/editor'
import { Item } from '@/components/ui/item'
import { magimixProgramLabels, type MagimixProgramData } from '@/features/recipe/types/magimix'
import { capitalize } from '@/utils/string'

import { MagimixProgramDialog, type MagimixProgramFormInput } from './magimix-program-dialog'

type SerializedMagimixProgramNode = Spread<
  {
    program: string
    rotationSpeed: string
    temperature?: number
    time: number
    type: 'magimixProgram'
    version: 1
  },
  SerializedLexicalNode
>

const $createMagimixProgramNode = (data: MagimixProgramData): MagimixProgramNodeType =>
  new MagimixProgramNodeType(data.program, data.rotationSpeed, data.time, data.temperature)

const $isMagimixProgramNode = (node: LexicalNode | null | undefined): node is MagimixProgramNodeType => node instanceof MagimixProgramNodeType

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

interface MagimixItemProps {
  program: string
  rotationSpeed: string
  temperature?: number
  time: number
}

const MagimixItem = (props: MagimixItemProps) => (
  <Item
    class="w-full"
    media={<img alt="Magimix Program Icon" class="not-prose size-10" src={`/magimix/${props.program}.png`} />}
    title={magimixProgramLabels[props.program as keyof typeof magimixProgramLabels]}
    variant="outline"
  >
    <Timer class="size-4" />
    <span>{formatTime(props.time)}</span>/
    <SpinnerGap class="size-4" />
    <span>{capitalize(props.rotationSpeed)}</span>
    /
    <Thermometer class="size-4" />
    <span>{props.temperature ?? '__'}°C</span>
  </Item>
)

interface MagimixProgramComponentProps {
  isEditable: boolean
  nodeKey: NodeKey
  program: string
  rotationSpeed: string
  temperature?: number
  time: number
}

const MagimixProgramComponent = (props: MagimixProgramComponentProps) => {
  const editor = useEditor()

  const formInitialValues = (): MagimixProgramFormInput => ({
    program: props.program as MagimixProgramFormInput['program'],
    rotationSpeed: props.rotationSpeed as MagimixProgramFormInput['rotationSpeed'],
    temperature: props.temperature ?? undefined,
    timeMinutes: Math.floor(props.time / 60),
    timeSeconds: props.time % 60,
  })

  const updateAttributes = (data: MagimixProgramData) => {
    editor.update(() => {
      const node = $getNodeByKey(props.nodeKey)
      if ($isMagimixProgramNode(node)) {
        const writable = node.getWritable()
        writable.__program = data.program
        writable.__rotationSpeed = data.rotationSpeed
        writable.__temperature = data.temperature
        writable.__time = data.time
      }
    })
  }

  const item = <MagimixItem program={props.program} rotationSpeed={props.rotationSpeed} temperature={props.temperature} time={props.time} />

  return (
    <Show fallback={item} when={props.isEditable}>
      <MagimixProgramDialog
        initialData={formInitialValues()}
        onSubmit={updateAttributes}
        submitLabel="Enregistrer"
        title="Modifier le programme Magimix"
        trigger={{ as: 'button', children: item, class: 'w-full', type: 'button' }}
      />
    </Show>
  )
}

class MagimixProgramNodeType extends DecoratorNode<JSX.Element> {
  __program: string
  __rotationSpeed: string
  __temperature?: number
  __time: number

  static getType(): string {
    return 'magimixProgram'
  }

  static clone(node: MagimixProgramNodeType): MagimixProgramNodeType {
    return new MagimixProgramNodeType(node.__program, node.__rotationSpeed, node.__time, node.__temperature, node.__key)
  }

  constructor(program: string, rotationSpeed: string, time: number, temperature?: number, key?: NodeKey) {
    super(key)
    this.__program = program
    this.__rotationSpeed = rotationSpeed
    this.__time = time
    this.__temperature = temperature
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (domNode.getAttribute('data-type') !== 'magimix-program') {
          return null
        }
        return {
          conversion: (element: HTMLElement): DOMConversionOutput => {
            const program = element.dataset.program ?? 'expert'
            const rotationSpeed = element.dataset.rotationSpeed ?? 'auto'
            const temp = element.dataset.temperature
            const temperature = temp ? Number.parseInt(temp, 10) : undefined
            const time = Number.parseInt(element.dataset.time ?? '0', 10)
            return { node: new MagimixProgramNodeType(program, rotationSpeed, time, Number.isNaN(temperature) ? undefined : temperature) }
          },
          priority: 1,
        }
      },
    }
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div')
    element.setAttribute('data-type', 'magimix-program')
    element.setAttribute('data-program', this.__program)
    if (this.__rotationSpeed !== undefined) {
      element.setAttribute('data-rotation-speed', this.__rotationSpeed)
    }
    if (this.__temperature !== undefined) {
      element.setAttribute('data-temperature', String(this.__temperature))
    }
    element.setAttribute('data-time', String(this.__time))
    return { element }
  }

  exportJSON(): SerializedMagimixProgramNode {
    return {
      ...super.exportJSON(),
      program: this.__program,
      rotationSpeed: this.__rotationSpeed,
      temperature: this.__temperature,
      time: this.__time,
      type: 'magimixProgram',
      version: 1,
    }
  }

  static importJSON(json: SerializedMagimixProgramNode): MagimixProgramNodeType {
    return new MagimixProgramNodeType(json.program, json.rotationSpeed, json.time, json.temperature)
  }

  isInline(): boolean {
    return false
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const div = document.createElement('div')
    div.style.display = 'contents'
    return div
  }

  updateDOM(): boolean {
    return false
  }

  decorate(editor: LexicalEditor): JSX.Element {
    return (
      <MagimixProgramComponent
        isEditable={editor.isEditable()}
        nodeKey={this.__key}
        program={this.__program}
        rotationSpeed={this.__rotationSpeed}
        temperature={this.__temperature}
        time={this.__time}
      />
    )
  }
}

export { $createMagimixProgramNode, MagimixProgramNodeType as MagimixProgramNode }
