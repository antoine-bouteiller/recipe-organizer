import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { updateIngredientOptions } from '@/features/ingredients/api/update'
import { IngredientForm } from '@/features/ingredients/ingredient-form'
import type { Ingredient } from '@/types/ingredient'
import { PencilSimpleIcon } from '@phosphor-icons/react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

interface EditIngredientProps {
  ingredient: Ingredient
}

export const EditIngredient = ({ ingredient }: EditIngredientProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const updateMutation = useMutation(updateIngredientOptions())

  const handleSubmit = (data: { name: string; category: string }) => {
    updateMutation.mutate(
      {
        data: {
          id: ingredient.id,
          name: data.name,
          category: data.category,
        },
      },
      {
        onSuccess: () => {
          setIsOpen(false)
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <PencilSimpleIcon />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l&apos;ingrédient</DialogTitle>
          <DialogDescription>Modifiez les informations de l&apos;ingrédient</DialogDescription>
        </DialogHeader>
        <IngredientForm
          ingredient={ingredient}
          onSubmit={handleSubmit}
          onCancel={() => setIsOpen(false)}
          submitLabel="Mettre à jour"
        />
      </DialogContent>
    </Dialog>
  )
}
