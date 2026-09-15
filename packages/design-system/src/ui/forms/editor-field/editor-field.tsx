import { type Klass, type LexicalNode } from 'lexical'
import { type ReactNode } from 'react'

import { useFieldContext } from '../../../hooks/use-form-context'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '../../actions/toolbar/toolbar'
import { ArrowUUpLeftIcon } from '../../data-display/icons/arrow-u-up-left'
import { ArrowUUpRightIcon } from '../../data-display/icons/arrow-u-up-right'
import { ListBulletsIcon } from '../../data-display/icons/list-bullets'
import { TextBolderIcon } from '../../data-display/icons/text-bolder'
import { TextItalicIcon } from '../../data-display/icons/text-italic'
import { TextUnderlineIcon } from '../../data-display/icons/text-underline'
import { Editor, EditorContent, EditorToolbarButton } from '../editor/editor'
import { Field, FieldError, FieldLabel } from '../field/field'

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
