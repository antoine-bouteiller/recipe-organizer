import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createIngredientOptions } from '@/features/ingredients/api/add-one'
import { IngredientForm } from '@/features/ingredients/ingredient-form'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

export const AddIngredient = () => {
  const [isOpen, setIsOpen] = useState(false)
  const createMutation = useMutation(createIngredientOptions())

  const handleSubmit = (data: { name: string; category: string }) => {
    createMutation.mutate(
      { data },
      {
        onSuccess: () => {
          setIsOpen(false)
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button />}>Ajouter un ingrédient</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un ingrédient</DialogTitle>
          <DialogDescription>Créez un nouvel ingrédient pour vos recettes</DialogDescription>
        </DialogHeader>
        <IngredientForm onSubmit={handleSubmit} onCancel={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
