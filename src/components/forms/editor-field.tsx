import { type Klass, type LexicalNode } from 'lexical'
import { type JSX, Show } from 'solid-js'
import ArrowUUpLeft from '~icons/ph/arrow-u-up-left'
import ArrowUUpRight from '~icons/ph/arrow-u-up-right'
import ListBullets from '~icons/ph/list-bullets'
import TextB from '~icons/ph/text-b'
import TextItalic from '~icons/ph/text-italic'
import TextUnderline from '~icons/ph/text-underline'

import { Editor, EditorContent, EditorToolbarButton } from '@/components/common/editor'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/ui/toolbar'
import { useFieldContext } from '@/hooks/use-form-context'

interface EditorFieldProps {
  disabled?: boolean
  extraToolbar?: JSX.Element
  label?: string
  nodes?: readonly Klass<LexicalNode>[]
}

const EditorField = (props: EditorFieldProps) => {
  const field = useFieldContext<string>()

  return (
    <Field dirty={field().state.meta.isDirty} invalid={!field().state.meta.isValid} name={field().name} touched={field().state.meta.isTouched}>
      <Show when={props.label}>{(label) => <FieldLabel>{label()}</FieldLabel>}</Show>
      <Editor content={field().state.value} nodes={props.nodes} onChange={field().handleChange}>
        <Toolbar>
          <ToolbarGroup>
            <EditorToolbarButton command="undo">
              <ArrowUUpLeft />
            </EditorToolbarButton>
            <EditorToolbarButton command="redo">
              <ArrowUUpRight />
            </EditorToolbarButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <EditorToolbarButton command="bold">
              <TextB />
            </EditorToolbarButton>
            <EditorToolbarButton command="italic">
              <TextItalic />
            </EditorToolbarButton>
            <EditorToolbarButton command="underline">
              <TextUnderline />
            </EditorToolbarButton>
            <EditorToolbarButton command="bulletList">
              <ListBullets />
            </EditorToolbarButton>
          </ToolbarGroup>
          {props.extraToolbar}
        </Toolbar>
        <EditorContent disabled={props.disabled} />
      </Editor>
      <FieldError />
    </Field>
  )
}

export default EditorField
