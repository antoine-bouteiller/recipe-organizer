import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { recipes } from "@/lib/db/schema";

export const getRecipe = createServerFn({
  method: "GET",
  response: "data",
})
  .validator(z.number())
  .handler(async ({ data }) => {
    const result = await db.query.recipes.findFirst({
      where: eq(recipes.id, data),
      with: {
        sections: {
          with: {
            sectionIngredients: {
              with: {
                ingredient: true,
              },
            },
            subRecipe: true,
          },
        },
      },
    });
    return result;
  });
