import { ArrowUUpLeftIcon, ArrowUUpRightIcon, ListBulletsIcon, TextBolderIcon, TextItalicIcon, TextUnderlineIcon } from '@phosphor-icons/react'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Tiptap, TiptapButton, TiptapContent } from '@/components/ui/tiptap'
import { useFieldContext } from '@/hooks/use-form-context'

import { MagimixProgramButton } from '../tiptap/magimix-program-button'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '../ui/toolbar'

interface TiptapProps {
  disabled?: boolean
  label?: string
}

const TiptapField = ({ disabled, label }: TiptapProps) => {
  const field = useFieldContext<string>()

  return (
    <Field dirty={field.state.meta.isDirty} invalid={!field.state.meta.isValid} name={field.name} touched={field.state.meta.isTouched}>
      <FieldLabel>{label}</FieldLabel>
      <Tiptap content={field.state.value} onChange={field.handleChange}>
        <Toolbar>
          <ToolbarGroup>
            <TiptapButton command="undo">
              <ArrowUUpLeftIcon />
            </TiptapButton>
            <TiptapButton command="redo">
              <ArrowUUpRightIcon />
            </TiptapButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <TiptapButton command="bold">
              <TextBolderIcon />
            </TiptapButton>
            <TiptapButton command="italic">
              <TextItalicIcon />
            </TiptapButton>
            <TiptapButton command="underline">
              <TextUnderlineIcon />
            </TiptapButton>
            <TiptapButton command="bulletList">
              <ListBulletsIcon />
            </TiptapButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <MagimixProgramButton />
          </ToolbarGroup>
        </Toolbar>
        <TiptapContent disabled={disabled} />
      </Tiptap>
      <FieldError />
    </Field>
  )
}

export default TiptapField
