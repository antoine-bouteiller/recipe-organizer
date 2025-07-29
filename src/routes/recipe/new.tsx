import { getAllIngredients } from "@/features/ingredients/api/get-all";
import CreateRecipe from "@/features/recipe/create-recipe";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/recipe/new")({
  component: NewRecipePage,
  loader: async () => {
    const allIngredients = await getAllIngredients();
    return { allIngredients };
  },
});

export default function NewRecipePage() {
  const { allIngredients } = Route.useLoaderData();

  return <CreateRecipe ingredients={allIngredients} />;
}
