'use client';

import axios from 'axios';
import { cache } from 'react';
import { RecipeProgressEvent } from '~/app/api/llm/recipe/route';
import { Cuisine, DbRecipe } from '~/core/type';

const PRESET_RECIPE_NAMES: string[] = [];
const PRESET_RECIPE: DbRecipe | undefined = undefined;

export const generateRecipeNames = cache(async (length: number, cuisines: Cuisine[], rawModel: string) => {
  if (PRESET_RECIPE_NAMES.length) return PRESET_RECIPE_NAMES;

  try {
    const url = `/api/llm/recipe-names`;
    const [family, model] = rawModel.split('/');
    const { data } = await axios.get<string[]>(url, {
      params: { length, cuisines: JSON.stringify(cuisines), family, model },
    });
    return data;
  } catch (error) {
    throw error;
  }
});

export const generateRecipe = async (
  name: string,
  rawModel: string,
  onProgress: (payload: { message: string | undefined; value: number }) => void,
) => {
  if (!!PRESET_RECIPE) return PRESET_RECIPE;
  try {
    const url = `/api/llm/recipe`;
    const [family, model] = rawModel.split('/');
    const taskResponse = await axios.get<{ taskId: string }>(url, {
      params: { name, family, model },
    });
    // First, get the task ID
    const { taskId } = taskResponse.data;

    // Setup SSE connection for progress updates
    return new Promise<DbRecipe>((resolve, reject) => {
      const eventSource = new EventSource(`/api/llm/recipe?taskId=${taskId}`);
      eventSource.onmessage = async (event) => {
        const data = JSON.parse(event.data) as RecipeProgressEvent;

        // Ensure progress is a number between 0 and 100
        const safeProgress = Math.min(Math.max(data.progress, 0), 100);

        // Update progress with both message and percentage
        onProgress({
          message: data.output.status === 'success' ? undefined : data.output.message,
          value: safeProgress,
        });

        // Handle error
        if (data.output.status === 'error') {
          onProgress({
            message: data.output.message,
            value: data.progress,
          });
          throw new Error(data.output.message);
        }

        // Handle success
        if (data.output.status === 'success') {
          eventSource.close();
          resolve(data.output.recipe);
        }
      };
      eventSource.onerror = () => {
        eventSource.close();
        reject(new Error('Recipe generation failed - connection error'));
      };
    });
  } catch (error) {
    throw error;
  }
};
