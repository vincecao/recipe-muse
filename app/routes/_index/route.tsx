import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios, { isAxiosError } from "axios";
import { Recipe } from "~/core/type";
import { MenuLayout, MenuHeader, MenuContent, MenuSection, DishCard, MenuFooter } from "./menu";

export const meta: MetaFunction = () => {
  return [{ title: "MealMuse - Daily Menu" }, { name: "description", content: "Today's curated selection of dishes, crafted with care and precision." }];
};

const MODEL = "claude-3-opus-20240229";

export const loader: LoaderFunction = async ({ request }) => {
  let recipes: Recipe[] = [];
  const { origin } = new URL(request.url);
  try {
    // Get recipe names from API using Axios
    const { data: names } = await axios.get<string[]>(`${origin}/api/recipe-names/home`, {
      params: { model: MODEL },
    });

    // Get recipes for each dish name using Axios
    recipes = await Promise.all(
      names.map((name: string) =>
        axios
          .get<Recipe>(`${origin}/api/recipe`, {
            params: {
              name,
              model: MODEL,
            },
          })
          .then(({ data }) => data)
      )
    );

  } catch (error) {
    console.error("Loader error:", error);
    if (isAxiosError(error)) {
      throw new Response(error.response?.data?.error || "Failed to load recipes", {
        status: error.response?.status || 500,
      });
    }
    throw new Response("Failed to load recipes", { status: 500 });
  }

  const recipesByCategory = recipes.reduce((acc: Record<Recipe["category"], Recipe[]>, recipe) => {
    (acc[recipe.category] ||= []).push(recipe);
    return acc;
  }, {} as Record<Recipe["category"], Recipe[]>);

  return Response.json({ recipesByCategory });
};

export default function Index() {
  const { recipesByCategory } = useLoaderData<{ recipesByCategory: Record<Recipe["category"], Recipe[]> }>();

  return (
    <MenuLayout>
      <MenuHeader />
      <MenuContent>
        {Object.entries(recipesByCategory).map(([category, recipes]) => (
          <MenuSection key={category} category={category as Recipe["category"]}>
            {recipes.map((recipe) => (
              <DishCard key={recipe.id} recipe={recipe} />
            ))}
          </MenuSection>
        ))}
        <MenuFooter />
      </MenuContent>
    </MenuLayout>
  );
}
