import { db } from "@/lib/db";
import { recipes } from "@/lib/db/schema";
import { getFileUrl } from "@/lib/s3.client";
import { createServerFn } from "@tanstack/react-start";

export const getAllRecipes = createServerFn({
  method: "GET",
  response: "data",
}).handler(async () => {
  const allRecipes = await db.select().from(recipes);

  return allRecipes.map((recipe) => ({
    ...recipe,
    image: getFileUrl(recipe.image),
  }));
});
