import type { LoaderFunctionArgs } from "@remix-run/node";
import { mockDishNames } from "~/data/dish";
import generate from "~/prompts/generate-home-recipe-names";
import { LLMClient, type LLMRequest } from "~/services/llm-client";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    // Get params from URL query string
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    // const cuisine = searchParams.get("cuisine") || undefined;
    const model = searchParams.get("model") as LLMRequest["model"] | null;

    if (!model) {
      return Response.json({ error: "Model parameter is required" }, { status: 400 });
    }

    // Generate names with validated parameters
    const names = await generateHomeRecipeNames(model);
    return Response.json(names);
  } catch (error) {
    console.error("Error generating home recipe names:", error);
    return Response.json(mockDishNames);
    // return Response.json({ error: "Failed to generate home recipe names" }, { status: 500 });
  }
};

export const generateHomeRecipeNames = async (model: LLMRequest["model"]) => {
  const llmClient = new LLMClient();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prompt, version] = generate();
  const response = await llmClient.generate({ prompt, model });
  console.log("home recipe names generated", response.content);
  return JSON.parse(response.content);
};
