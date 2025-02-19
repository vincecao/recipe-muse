import { cache } from "react";
import { firebaseDb } from "~/app/api/_services/firebase";

export const cachedRecipes = cache(() => firebaseDb.getAllRecipes());
export const cachedRecipeById = cache((id: string) => firebaseDb.getRecipe(id));

export const CACHE_EXPIRATION = 3600000 // in seconds