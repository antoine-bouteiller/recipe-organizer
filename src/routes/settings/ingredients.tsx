import { createIngredientOptions } from '@/features/ingredients/api/add-one'
import { deleteIngredientOptions } from '@/features/ingredients/api/delete'
import { getIngredientListOptions } from '@/features/ingredients/api/get-all'
import { updateIngredientOptions } from '@/features/ingredients/api/update'
import type { Ingredient } from '@/types/ingredient'
import { units } from '@/types/units'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'

interface IngredientFormData {
  name: string
  allowedUnits: string[]
  category: string
}

const IngredientForm = ({
  ingredient,
  onSubmit,
  onCancel,
}: {
  ingredient?: Ingredient
  onSubmit: (data: IngredientFormData) => void
  onCancel: () => void
}) => {
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

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">{ingredient ? 'Mettre à jour' : 'Ajouter'}</Button>
      </DialogFooter>
    </form>
  )
}

const IngredientsManagement = () => {
  const { data: ingredients } = useSuspenseQuery(getIngredientListOptions())
  const createMutation = useMutation(createIngredientOptions())
  const updateMutation = useMutation(updateIngredientOptions())
  const deleteMutation = useMutation(deleteIngredientOptions())

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | undefined>(undefined)

  const handleAdd = (data: IngredientFormData) => {
    createMutation.mutate(
      { data: { name: data.name } },
      {
        onSuccess: () => {
          setIsAddDialogOpen(false)
        },
      }
    )
  }

  const handleUpdate = (data: IngredientFormData) => {
    if (!editingIngredient) {
      return
    }

    updateMutation.mutate(
      {
        data: {
          id: editingIngredient.id,
          name: data.name,
          allowedUnits: data.allowedUnits,
          category: data.category,
        },
      },
      {
        onSuccess: () => {
          setEditingIngredient(undefined)
        },
      }
    )
  }

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet ingrédient ?')) {
      deleteMutation.mutate({ data: { id } })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Gestion des ingrédients</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger render={<Button />}>Ajouter un ingrédient</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un ingrédient</DialogTitle>
              <DialogDescription>Créez un nouvel ingrédient pour vos recettes</DialogDescription>
            </DialogHeader>
            <IngredientForm onSubmit={handleAdd} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {ingredients.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aucun ingrédient trouvé. Ajoutez-en un pour commencer.
          </p>
        ) : (
          ingredients.map((ingredient) => (
            <div
              key={ingredient.id}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium">{ingredient.name}</p>
                <p className="text-sm text-muted-foreground">Catégorie: {ingredient.category}</p>
                {ingredient.allowedUnits && ingredient.allowedUnits.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Unités: {ingredient.allowedUnits.join(', ')}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Dialog
                  open={editingIngredient?.id === ingredient.id}
                  onOpenChange={(open) => {
                    if (open) {
                      setEditingIngredient(ingredient)
                    } else {
                      setEditingIngredient(undefined)
                    }
                  }}
                >
                  <DialogTrigger render={<Button variant="outline" size="sm" />}>
                    Modifier
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Modifier l&apos;ingrédient</DialogTitle>
                      <DialogDescription>
                        Modifiez les informations de l&apos;ingrédient
                      </DialogDescription>
                    </DialogHeader>
                    <IngredientForm
                      ingredient={ingredient}
                      onSubmit={handleUpdate}
                      onCancel={() => setEditingIngredient(undefined)}
                    />
                  </DialogContent>
                </Dialog>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(ingredient.id)}
                  disabled={deleteMutation.isPending}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const RouteComponent = () => <IngredientsManagement />

export const Route = createFileRoute('/settings/ingredients')({
  component: RouteComponent,
  loader: ({ context }) => context.queryClient.ensureQueryData(getIngredientListOptions()),
})
