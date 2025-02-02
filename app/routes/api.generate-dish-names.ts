import type { LoaderFunctionArgs } from "@remix-run/node";
import generateDishNames from "~/prompts/generate-dish-names";
import { LLMClient, type LLMRequest } from "~/services/llm-client";

// Specify allowed HTTP methods
export const allowedMethods = ["GET"];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Method check
  if (!allowedMethods.includes(request.method)) {
    return Response.json({ error: `Method ${request.method} not allowed` }, { status: 405 });
  }

  try {
    // Get params from URL query string
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const cuisine = searchParams.get("cuisine") || undefined;
    const model = searchParams.get("model") as LLMRequest["model"] | null;

    if (!model) {
      return Response.json({ error: "Model parameter is required" }, { status: 400 });
    }

    // Generate names with validated parameters
    const dishNames = await generateNames(cuisine, model);
    return Response.json({ dishNames });
    
  } catch (error) {
    console.error("Error generating dish names:", error);
    return Response.json({ error: "Failed to generate dish names" }, { status: 500 });
  }
};

export const generateNames = async (cuisine: string | undefined, model: LLMRequest["model"]) => {
  const llmClient = new LLMClient();
  const prompt = generateDishNames();
  const response = await llmClient.generate({ prompt, model });
  console.log({ content: response.content })
  return JSON.parse(response.content);
};
