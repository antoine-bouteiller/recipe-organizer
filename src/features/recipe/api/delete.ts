import { db } from "@/lib/db";
import { recipes } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const deleteRecipe = createServerFn({
  method: "POST",
  response: "data",
})
  .validator(z.number())
  .handler(async ({ data }) => {
    return await db.delete(recipes).where(eq(recipes.id, data)).returning();
  });
