import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { SpinnerGapIcon, ThermometerIcon, TimerIcon } from '@phosphor-icons/react'
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

import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
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

interface MagimixProgramComponentProps {
  isEditable: boolean
  nodeKey: NodeKey
  program: string
  rotationSpeed: string
  temperature?: number
  time: number
}

const MagimixProgramComponent = ({ isEditable, nodeKey, program, rotationSpeed, temperature, time }: MagimixProgramComponentProps) => {
  const [editor] = useLexicalComposerContext()
  const label = magimixProgramLabels[program as keyof typeof magimixProgramLabels]

  const formInitialValues: MagimixProgramFormInput = {
    program: program as MagimixProgramFormInput['program'],
    rotationSpeed: rotationSpeed as MagimixProgramFormInput['rotationSpeed'],
    temperature: temperature ?? undefined,
    timeMinutes: Math.floor(time / 60),
    timeSeconds: time % 60,
  }

  const updateAttributes = (data: MagimixProgramData) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isMagimixProgramNode(node)) {
        const writable = node.getWritable()
        writable.__program = data.program
        writable.__rotationSpeed = data.rotationSpeed
        writable.__temperature = data.temperature
        writable.__time = data.time
      }
    })
  }

  const content = (
    <>
      <ItemMedia>
        <img alt="Magimix Program Icon" className="not-prose size-10" src={`/magimix/${program}.png`} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{label}</ItemTitle>
        <ItemDescription className="not-prose my-0 flex items-center gap-1">
          <TimerIcon className="size-4" />
          <span>{formatTime(time)}</span>/
          <SpinnerGapIcon className="size-4" />
          <span>{capitalize(rotationSpeed)}</span>
          /
          <ThermometerIcon className="size-4" />
          <span>{temperature ?? '__'}°C</span>
        </ItemDescription>
      </ItemContent>
    </>
  )

  if (isEditable) {
    return (
      <MagimixProgramDialog
        initialData={formInitialValues}
        onSubmit={updateAttributes}
        submitLabel="Enregistrer"
        title="Modifier le programme Magimix"
        triggerRender={
          <Item variant="outline" render={<button />} className="w-full">
            {content}
          </Item>
        }
      />
    )
  }

  return <Item variant="outline">{content}</Item>
}

class MagimixProgramNodeType extends DecoratorNode<React.ReactElement> {
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
      element.setAttribute('data-rotation-speed', String(this.__rotationSpeed))
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

  decorate(editor: LexicalEditor): React.ReactElement {
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
