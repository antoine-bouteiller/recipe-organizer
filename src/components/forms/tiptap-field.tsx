import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Tiptap, TiptapButton, TiptapContent } from '@/components/ui/tiptap'
import { useFieldContext } from '@/hooks/use-form-context'
import {
  ArrowUUpLeftIcon,
  ArrowUUpRightIcon,
  ListBulletsIcon,
  TextBolderIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from '@phosphor-icons/react'
import { MagimixProgramButton } from '../tiptap/magimix-program-button'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '../ui/toolbar'

interface TiptapProps {
  label?: string
  disabled?: boolean
}

const TiptapField = ({ label, disabled }: TiptapProps) => {
  const field = useFieldContext<string>()

  return (
    <Field
      name={field.name}
      invalid={!field.state.meta.isValid}
      dirty={field.state.meta.isDirty}
      touched={field.state.meta.isTouched}
    >
      <FieldLabel>{label}</FieldLabel>
      <Tiptap onChange={field.handleChange} content={field.state.value}>
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
