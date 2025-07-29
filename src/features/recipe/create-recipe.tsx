import { ImageField } from "@/components/forms/image-field";
import { NumberField } from "@/components/forms/number-field";
import { SearchSelectField } from "@/components/forms/search-select-field";
import { TextField } from "@/components/forms/text-field";
import TiptapField from "@/components/forms/tiptap-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormLabel } from "@/components/ui/form";
import { createRecipe, recipeSchema } from "@/features/recipe/api/create-one";
import { units } from "@/lib/db/schema";
import type { Ingredient } from "@/types/ingredient";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { Loader2, PlusIcon, TrashIcon } from "lucide-react";
import { useCallback, useMemo, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export type RecipeFormValues = z.infer<typeof recipeSchema>;

interface CreateRecipeProps {
  ingredients: Ingredient[];
}

const unitsOptions = units.enumValues.map((unit) => ({
  label: unit,
  value: unit,
}));

export default function CreateRecipe({ ingredients }: CreateRecipeProps) {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: "",
      steps: "",
      sections: [
        {
          ingredients: [
            {
              id: undefined,
              quantity: 0,
              unit: undefined,
            },
          ],
        },
      ],
    },
  });

  const onSubmit = useCallback(
    async (data: RecipeFormValues) => {
      startTransition(async () => {
        try {
          const formData = new FormData();
          formData.append("image", data.image);
          formData.append("name", data.name);
          formData.append("steps", data.steps);
          formData.append("sections", JSON.stringify(data.sections));
          await createRecipe({ data: formData });

          router.navigate({ to: "/" });
        } catch (error) {
          toast.error(
            "Une erreur est survenue lors de la création de la recette",
            {
              description:
                error instanceof Error ? error.message : JSON.stringify(error),
            }
          );
        }
      });
    },
    [router]
  );

  const {
    fields: ingredientsFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "sections.0.ingredients",
  });

  const ingredientsOptions = useMemo(() => {
    return ingredients.map((ingredient) => ({
      label: ingredient.name,
      value: ingredient.id.toString(),
    }));
  }, [ingredients]);

  return (
    <>
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Nouvelle Recette</CardTitle>
          <CardDescription className="text-lg">
            Ajoutez votre délicieuse recette à la collection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TextField
                control={form.control}
                name="name"
                label="Nom de la recette"
                disabled={isLoading}
              />
              <ImageField
                control={form.control}
                name="image"
                label="Photo de la recette"
                disabled={isLoading}
              />

              <div>
                <FormLabel className="text-base font-semibold">
                  Ingrédients
                </FormLabel>
                <div className="flex flex-col gap-2 pt-2">
                  {ingredientsFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex w-full items-start justify-between gap-2"
                    >
                      <SearchSelectField
                        control={form.control}
                        name={`sections.0.ingredients.${index}.id`}
                        options={ingredientsOptions}
                      />
                      <NumberField
                        control={form.control}
                        name={`sections.0.ingredients.${index}.quantity`}
                        min={0}
                        decimalScale={1}
                      />
                      <SearchSelectField
                        control={form.control}
                        name={`sections.0.ingredients.${index}.unit`}
                        options={unitsOptions}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      append({
                        id: undefined,
                        quantity: 0,
                        unit: undefined,
                      });
                    }}
                    size="sm"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <TiptapField
                control={form.control}
                name="steps"
                label="Étapes"
                disabled={isLoading}
              />

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.navigate({ to: "/" })}
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    "Créer la recette"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
