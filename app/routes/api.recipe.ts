import type { LoaderFunctionArgs } from "@remix-run/node";
import { Recipe } from "~/core/type";
import { mockRecipes } from "~/data/dish";
import generate from "~/prompts/generate-recipe-by-name";
import { firebaseDb } from "~/services/firebase";
import { LLMClient, type LLMRequest } from "~/services/llm-client";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let name: string | null = null;
  try {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);

    name = params.get("name");
    const model = params.get("model") as LLMRequest["model"] | null;

    if (!name) {
      return Response.json({ error: "Recipe name is required" }, { status: 400 });
    }
    if (!model) {
      return Response.json({ error: "Model parameter is required" }, { status: 400 });
    }

    const recipe = await generateRecipeByName(name, model);
    return Response.json(recipe);
  } catch (error) {
    console.error("Error generating recipe:", error);
    return Response.json(mockRecipes.find(({ title }) => title === name));
    // return Response.json({ error: "Failed to generate recipe" }, { status: 500 });
  }
};

const generateRecipeByName = async (name: string, model: LLMRequest["model"]) => {
  try {
    // First, try to get the recipe from Firebase
    const existingRecipe = await firebaseDb.getRecipeByName(name);
    if (existingRecipe) {
      console.log("Recipe found in database:", name);
      return existingRecipe;
    }

    // If not found, generate new recipe
    console.log("Generating new recipe:", name);
    const llmClient = new LLMClient();
    const [prompt, version] = generate(name);
    const response = await llmClient.generate({ prompt, model });
    const newRecipe = JSON.parse(response.content) as Recipe;

    // Store the new recipe in Firebase
    await firebaseDb.saveRecipeByName({ ...newRecipe, version, model });
    console.log("New recipe saved to database:", name);

    return newRecipe;
  } catch (error) {
    console.error("Error in generateRecipeByName:", error);
    throw error;
  }
};
