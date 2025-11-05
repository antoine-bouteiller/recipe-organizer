import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Ingredient } from '@/types/ingredient'
import { useState } from 'react'

type IngredientFormData = {
  name: string
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
    category: ingredient?.category || 'supermarket',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
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

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
