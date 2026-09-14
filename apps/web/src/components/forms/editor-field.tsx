import { Editor, EditorContent, EditorToolbarButton } from '@client/components/common/editor/index'
import { ArrowUUpLeftIcon } from '@client/components/icons/arrow-u-up-left'
import { ArrowUUpRightIcon } from '@client/components/icons/arrow-u-up-right'
import { ListBulletsIcon } from '@client/components/icons/list-bullets'
import { TextBolderIcon } from '@client/components/icons/text-bolder'
import { TextItalicIcon } from '@client/components/icons/text-italic'
import { TextUnderlineIcon } from '@client/components/icons/text-underline'
import { Field, FieldError, FieldLabel } from '@client/components/ui/field'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@client/components/ui/toolbar'
import { useFieldContext } from '@client/hooks/use-form-context'
import { type Klass, type LexicalNode } from 'lexical'
import { type ReactNode } from 'react'

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
      <FieldLabel>{label}</FieldLabel>
      <Editor content={field.state.value} nodes={nodes} onChange={field.handleChange}>
        <Toolbar>
          <ToolbarGroup>
            <EditorToolbarButton command="undo">
              <ArrowUUpLeftIcon />
            </EditorToolbarButton>
            <EditorToolbarButton command="redo">
              <ArrowUUpRightIcon />
            </EditorToolbarButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
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
          </ToolbarGroup>
          {extraToolbar}
        </Toolbar>
        <EditorContent disabled={disabled} />
      </Editor>
      <FieldError />
    </Field>
  )
}

export default EditorField
