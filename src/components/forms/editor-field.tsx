import { ArrowUUpLeftIcon, ArrowUUpRightIcon, ListBulletsIcon, TextBolderIcon, TextItalicIcon, TextUnderlineIcon } from '@phosphor-icons/react'
import { type Klass, type LexicalNode } from 'lexical'
import { type ReactNode } from 'react'

import { Editor, EditorContent, EditorToolbarButton } from '@/components/ui/editor'
import { Field } from '@/components/ui/field'
import { Toolbar } from '@/components/ui/toolbar'
import { useFieldContext } from '@/hooks/use-form-context'

interface EditorFieldProps {
  disabled?: boolean
  extraToolbar?: ReactNode
  label?: string
  nodes?: readonly Klass<LexicalNode>[]
}

const EditorField = ({ disabled, extraToolbar, label, nodes }: EditorFieldProps) => {
  const field = useFieldContext<string>()

  return (
    <Field dirty={field.state.meta.isDirty} invalid={!field.state.meta.isValid} name={field.name} touched={field.state.meta.isTouched}>
      <Field.Label>{label}</Field.Label>
      <Editor content={field.state.value} nodes={nodes} onChange={field.handleChange}>
        <Toolbar>
          <Toolbar.Group>
            <EditorToolbarButton command="undo">
              <ArrowUUpLeftIcon />
            </EditorToolbarButton>
            <EditorToolbarButton command="redo">
              <ArrowUUpRightIcon />
            </EditorToolbarButton>
          </Toolbar.Group>
          <Toolbar.Separator />
          <Toolbar.Group>
            <EditorToolbarButton command="bold">
              <TextBolderIcon />
            </EditorToolbarButton>
            <EditorToolbarButton command="italic">
              <TextItalicIcon />
            </EditorToolbarButton>
            <EditorToolbarButton command="underline">
              <TextUnderlineIcon />
            </EditorToolbarButton>
            <EditorToolbarButton command="bulletList">
              <ListBulletsIcon />
            </EditorToolbarButton>
          </Toolbar.Group>
          {extraToolbar}
        </Toolbar>
        <EditorContent disabled={disabled} />
      </Editor>
      <Field.Error />
    </Field>
  )
}

export default EditorField
