import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Unit } from '@/features/units/api/get-all'
import { useState } from 'react'

interface UnitFormData {
  name: string
  symbol: string
  parentId: number | undefined
  factor: number | undefined
}

interface UnitFormProps {
  unit?: Unit
  units: Unit[]
  onSubmit: (data: UnitFormData) => void
  onCancel: () => void
  submitLabel?: string
}

export const UnitForm = ({
  unit,
  units,
  onSubmit,
  onCancel,
  submitLabel = 'Ajouter',
}: UnitFormProps) => {
  const [formData, setFormData] = useState<UnitFormData>({
    name: unit?.name || '',
    symbol: unit?.symbol || '',
    parentId: unit?.parentId || undefined,
    factor: unit?.factor || undefined,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const availableParentUnits = units.filter((u) => u.id !== unit?.id)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom de l&apos;unité</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: Gramme"
          required
          minLength={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="symbol">Symbole</Label>
        <Input
          id="symbol"
          value={formData.symbol}
          onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
          placeholder="Ex: g"
          required
          minLength={1}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parent">Unité parente (optionnel)</Label>
        <Select
          value={formData.parentId?.toString() || 'none'}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              parentId: value === 'none' ? undefined : Number(value),
            })
          }
        >
          <SelectTrigger id="parent">
            <SelectValue placeholder="Sélectionner une unité parente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucune</SelectItem>
            {availableParentUnits.map((u) => (
              <SelectItem key={u.id} value={u.id.toString()}>
                {u.name} ({u.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formData.parentId && (
        <div className="space-y-2">
          <Label htmlFor="factor">
            Facteur de conversion (combien de cette unité dans l&apos;unité parente)
          </Label>
          <Input
            id="factor"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.factor || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                factor: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            placeholder="Ex: 1000 (pour 1000 g dans 1 kg)"
            required
          />
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
