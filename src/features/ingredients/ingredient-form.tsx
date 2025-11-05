import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SelectUnit } from '@/lib/db/schema'
import { useState } from 'react'

type IngredientFormData = {
  name: string
  unitIds: number[]
  category: string
}

type IngredientWithUnits = {
  id: number
  name: string
  category: string
  ingredientUnits?: Array<{
    unitId: number
  }>
}

interface IngredientFormProps {
  ingredient?: IngredientWithUnits
  units: SelectUnit[]
  onSubmit: (data: IngredientFormData) => void
  onCancel: () => void
  submitLabel?: string
}

export const IngredientForm = ({
  ingredient,
  units,
  onSubmit,
  onCancel,
  submitLabel = 'Ajouter',
}: IngredientFormProps) => {
  const [formData, setFormData] = useState<IngredientFormData>({
    name: ingredient?.name || '',
    unitIds: ingredient?.ingredientUnits?.map((iu) => iu.unitId) || [],
    category: ingredient?.category || 'supermarket',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const toggleUnit = (unitId: number) => {
    setFormData((prev) => ({
      ...prev,
      unitIds: prev.unitIds.includes(unitId)
        ? prev.unitIds.filter((id) => id !== unitId)
        : [...prev.unitIds, unitId],
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom de l&apos;ingrédient</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: Tomate"
          required
          minLength={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Catégorie</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="Ex: supermarket"
        />
      </div>

      <div className="space-y-2">
        <Label>Unités autorisées</Label>
        <div className="grid grid-cols-2 gap-2">
          {units.map((unit) => (
            <div key={unit.id} className="flex items-center space-x-2">
              <Checkbox
                id={`unit-${unit.id}`}
                checked={formData.unitIds.includes(unit.id)}
                onCheckedChange={() => toggleUnit(unit.id)}
              />
              <label
                htmlFor={`unit-${unit.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {unit.symbol}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
