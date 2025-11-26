import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ToggleGroupItem } from '@/components/ui/toggle-group'
import { RobotIcon } from '@phosphor-icons/react'
import { EditorContext } from '@tiptap/react'
import { useContext, useState } from 'react'
import { magimixProgramLabels, MagimixProgram, type MagimixProgramData } from '@/types/magimix'

export const MagimixProgramButton = () => {
  const { editor } = useContext(EditorContext)
  const [open, setOpen] = useState(false)
  const [program, setProgram] = useState<MagimixProgram>(MagimixProgram.COOKING)
  const [timeType, setTimeType] = useState<'auto' | 'manual'>('auto')
  const [timeMinutes, setTimeMinutes] = useState<number>(0)
  const [timeSeconds, setTimeSeconds] = useState<number>(0)
  const [temperature, setTemperature] = useState<string>('')

  const handleInsert = () => {
    if (!editor) {
      return
    }

    const time: 'auto' | number = timeType === 'auto' ? 'auto' : timeMinutes * 60 + timeSeconds

    const programData: MagimixProgramData = {
      program,
      time,
      temperature: temperature ? Number.parseInt(temperature, 10) : undefined,
    }

    editor.chain().focus().setMagimixProgram(programData).run()
    setOpen(false)

    // Reset form
    setProgram(MagimixProgram.COOKING)
    setTimeType('auto')
    setTimeMinutes(0)
    setTimeSeconds(0)
    setTemperature('')
  }

  const canInsert = editor?.can().insertContent({ type: 'magimixProgram' }) ?? false

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={(props) => (
          <ToggleGroupItem
            {...props}
            value="magimix"
            disabled={!canInsert}
            data-state="off"
            type="button"
          >
            <RobotIcon className="size-4" />
          </ToggleGroupItem>
        )}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un programme Magimix</DialogTitle>
          <DialogDescription>
            Configurez les paramètres du programme Magimix à insérer
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="program">Programme</Label>
            <Select
              value={program}
              onValueChange={(value) => {
                setProgram(value)
              }}
            >
              <SelectTrigger id="program">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(magimixProgramLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="time-type">Durée</Label>
            <Select
              value={timeType}
              onValueChange={(value) => {
                setTimeType(value)
              }}
            >
              <SelectTrigger id="time-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Automatique</SelectItem>
                <SelectItem value="manual">Manuel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {timeType === 'manual' && (
            <div className="flex gap-2">
              <div className="flex flex-1 flex-col gap-2">
                <Label htmlFor="minutes">Minutes</Label>
                <Input
                  id="minutes"
                  type="number"
                  min="0"
                  value={timeMinutes}
                  onChange={(e) => {
                    setTimeMinutes(Number.parseInt(e.target.value, 10) || 0)
                  }}
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <Label htmlFor="seconds">Secondes</Label>
                <Input
                  id="seconds"
                  type="number"
                  min="0"
                  max="59"
                  value={timeSeconds}
                  onChange={(e) => {
                    setTimeSeconds(Number.parseInt(e.target.value, 10) || 0)
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="temperature">Température (°C) - Optionnel</Label>
            <Input
              id="temperature"
              type="number"
              min="0"
              max="200"
              value={temperature}
              onChange={(e) => {
                setTemperature(e.target.value)
              }}
              placeholder="Ex: 100"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose
            render={(props) => (
              <Button {...props} variant="outline">
                Annuler
              </Button>
            )}
          />
          <Button onClick={handleInsert}>Insérer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
