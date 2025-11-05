import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Ingredient } from '@/types/ingredient'
import { units } from '@/types/units'
import { useState } from 'react'

type IngredientFormData = {
  name: string
  allowedUnits: string[]
  category: string
}

interface IngredientFormProps {
  ingredient?: Ingredient
  onSubmit: (data: IngredientFormData) => void
  onCancel: () => void
  submitLabel?: string
}

export const IngredientForm = ({
  ingredient,
  onSubmit,
  onCancel,
  submitLabel = 'Ajouter',
}: IngredientFormProps) => {
  const [formData, setFormData] = useState<IngredientFormData>({
    name: ingredient?.name || '',
    allowedUnits: ingredient?.allowedUnits || [],
    category: ingredient?.category || 'supermarket',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const toggleUnit = (unit: string) => {
    setFormData((prev) => ({
      ...prev,
      allowedUnits: prev.allowedUnits.includes(unit)
        ? prev.allowedUnits.filter((u) => u !== unit)
        : [...prev.allowedUnits, unit],
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
            <div key={unit} className="flex items-center space-x-2">
              <Checkbox
                id={`unit-${unit}`}
                checked={formData.allowedUnits.includes(unit)}
                onCheckedChange={() => toggleUnit(unit)}
              />
              <label
                htmlFor={`unit-${unit}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {unit}
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
