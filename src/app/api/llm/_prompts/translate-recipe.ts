import { ResponseFormatJSONSchema } from 'openai/resources/index';
import { Recipe } from '~/types/recipe';

export default function translateRecipe(
  recipe: Partial<Recipe>,
  targetLanguage: string,
): [string, string, string | undefined, ResponseFormatJSONSchema, string] {
  return [
    `You are a professional culinary translator that help user from the world understand recipes from other places.`,
    `Translate the provided recipe JSON object to ${targetLanguage} following these rules:
1. Making sure all the nested values inside JSON structure gets all translated, and keep the JSON structure remain the same
2. Avoiding translate numerical values
3. Maintaining information accurately
4. Keeping special culinary terms untranslated when no direct equivalent exists
5. Maintaining original formatting (bullet points, numbering, etc)
6. Strictly follow the JSON schema provided as output

Input Recipe:
${JSON.stringify(recipe, null, 2)}
`,
    undefined,
    {
      type: 'json_schema',
      json_schema: {
        name: 'translated-recipe',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              enum: ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Cocktails'],
              description: 'The category of the recipe.',
            },
            title: {
              type: 'string',
              maxLength: 40,
              description: 'The title of the recipe. Must be concise and less than 40 characters.',
            },
            description: {
              type: 'string',
              minLength: 30,
              maxLength: 80,
              description: 'A brief description of the recipe. Must be between 30 and 80 characters.',
            },
            difficulty: {
              type: 'string',
              enum: ['Beginner', 'Intermediate', 'Advanced'],
              description: 'The difficulty level of the recipe.',
            },
            ingredientsCount: {
              type: 'number',
              description: 'The total number of ingredients required for the recipe.',
            },
            time: {
              type: 'string',
              description: 'The total time required to prepare and cook the recipe.',
            },
            calories: {
              type: 'number',
              description: 'The approximate number of calories per serving.',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Tags associated with the recipe.',
            },
            servingSize: {
              type: 'string',
              description: 'The serving size of the recipe.',
            },
            allergens: {
              type: 'array',
              items: {
                type: 'string',
              },
              optional: true,
              description: 'List of allergens present in the recipe.',
            },
            cuisine: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'The cuisine(s) the recipe belongs to.',
            },
            ingredients: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  quantity: {
                    type: 'number',
                    description: 'The quantity of the ingredient required.',
                  },
                  unit: {
                    type: 'string',
                    description: 'The unit of measurement for the ingredient.',
                  },
                  name: {
                    type: 'string',
                    description: 'The name of the ingredient.',
                  },
                  preparation: {
                    type: 'string',
                    optional: true,
                    description: 'The preparation state of the ingredient.',
                  },
                  alternatives: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        quantity: {
                          type: 'number',
                        },
                        unit: {
                          type: 'string',
                        },
                        name: {
                          type: 'string',
                        },
                      },
                    },
                    optional: true,
                    description: 'Alternative ingredients that can be used.',
                  },
                  state: {
                    type: 'string',
                    optional: true,
                    description: 'The state of the ingredient.',
                  },
                },
                required: ['quantity', 'unit', 'name'],
              },
              description: 'The list of ingredients required for the recipe.',
            },
            instructions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  description: {
                    type: 'string',
                    description: 'The detailed description of the step.',
                  },
                  order: {
                    type: 'number',
                    description: 'The order of the step in the recipe.',
                  },
                  ingredientsUsed: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    optional: true,
                    description: 'The ingredients used in this step.',
                  },
                  toolsNeeded: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    optional: true,
                    description: 'The tools required for this step.',
                  },
                  tips: {
                    type: 'string',
                    optional: true,
                    description: 'Additional tips or notes for this step.',
                  },
                  temperature: {
                    type: 'object',
                    properties: {
                      value: {
                        type: 'number',
                      },
                      unit: {
                        type: 'string',
                      },
                    },
                    optional: true,
                    description: 'The cooking temperature for this step.',
                  },
                  duration: {
                    type: 'number',
                    optional: true,
                    description: 'The duration of this step in minutes.',
                  },
                },
                required: ['description', 'order'],
              },
              description: 'The step-by-step instructions for preparing the recipe.',
            },
            prepTime: {
              type: 'number',
              description: 'The preparation time required for the recipe in minutes.',
            },
            cookTime: {
              type: 'number',
              description: 'The cooking time required for the recipe in minutes.',
            },
            tools: {
              type: 'array',
              items: {
                type: 'string',
              },
              optional: true,
              description: 'The tools required to prepare the recipe.',
            },
          },
          required: [
            'category',
            'title',
            'description',
            'difficulty',
            'ingredientsCount',
            'time',
            'calories',
            'tags',
            'servingSize',
            'cuisine',
            'ingredients',
            'instructions',
            'prepTime',
            'cookTime',
          ],
          additionalProperties: false,
        },
      },
    },
    '05-11-2025',
  ];
}
