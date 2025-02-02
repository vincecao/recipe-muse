import type { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "~/core/db";
import generateRecipeByName from "~/prompts/generate-recipe-by-name";
import { LLMClient, type LLMRequest } from "~/services/llm-client";

// Specify allowed HTTP methods
export const allowedMethods = ["GET"];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Method check
  if (!allowedMethods.includes(request.method)) {
    return Response.json({ error: `Method ${request.method} not allowed` }, { status: 405 });
  }

  try {
    // Get parameters from URL query
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);
    
    const dishName = params.get("dishName");
    const model = params.get("model") as LLMRequest["model"] | null;

    // Validate required parameters
    if (!dishName) {
      return Response.json({ error: "Dish name is required" }, { status: 400 });
    }
    if (!model) {
      return Response.json({ error: "Model parameter is required" }, { status: 400 });
    }

    // Generate recipe with validated parameters
    const recipe = await db.getRecipe('app-1-full') ?? await generateRecipe(dishName, model);
    return Response.json({ recipe });

  } catch (error) {
    console.error("Error generating recipe:", error);
    return Response.json({ error: "Failed to generate recipe" }, { status: 500 });
  }
};

const generateRecipe = async (dishName: string, model: LLMRequest["model"]) => {
  const llmClient = new LLMClient();
  const prompt = generateRecipeByName(dishName);
  const response = await llmClient.generate({ prompt, model });
  console.log({ content: response.content })
  return JSON.parse(response.content);
};
