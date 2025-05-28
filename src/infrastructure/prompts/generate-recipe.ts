import { ResponseFormatJSONSchema } from 'openai/resources/index';

export default function generateRecipeByName(
  name: string,
): [string, string, string | undefined, ResponseFormatJSONSchema, string] {
  return [
    `You are a professional chef and recipe developer. Generate detailed, restaurant-quality recipes in strict JSON format. Follow all specifications precisely and maintain consistent formatting.`,
    `Generate a detailed recipe for: "${name}"

Requirements:
1. Strictly follow the JSON schema provided
2. Instructions must include:
  - Ingredients used in each step
  - Specific tools required
  - Detailed preparation tips
  - Cooking temperature and duration where applicable
3. Ingredients must specify preparation state (chopped, diced, etc.) when relevant
4. Include alternative ingredients where possible
5. Cooking times must be in minutes
6. Validate all measurements use allowed units
7. Ensure title < 40 chars and description 30-80 chars
`,
    undefined,
    {
      type: 'json_schema',
      json_schema: {
        name: 'recipe',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              enum: ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Cocktails'],
              description: 'The category of the recipe (e.g., Appetizers, Main Course, Desserts).',
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
              description: 'The difficulty level of the recipe (Beginner, Intermediate, Advanced).',
            },
            ingredientsCount: {
              type: 'number',
              description: 'The total number of ingredients required for the recipe.',
            },
            time: {
              type: 'string',
              description: 'The total time required to prepare and cook the recipe (e.g., "30 minutes").',
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
              description: 'Tags associated with the recipe (e.g., Italian, Vegetarian, Quick).',
            },
            servingSize: {
              type: 'string',
              description: 'The serving size of the recipe (e.g., "2 servings").',
            },
            allergens: {
              type: 'array',
              items: {
                type: 'string',
              },
              optional: true,
              description: 'List of allergens present in the recipe (e.g., Gluten, Dairy).',
            },
            cuisine: {
              type: 'array',
              items: {
                type: 'string',
                enum: [
                  'Italian',
                  'French',
                  'Spanish',
                  'Greek',
                  'Mediterranean',
                  'Mexican',
                  'Brazilian',
                  'Peruvian',
                  'American',
                  'Japanese',
                  'Chinese',
                  'Thai',
                  'Indian',
                  'Middle Eastern',
                  'Lebanese',
                  'Turkish',
                  'Moroccan',
                  'Ethiopian',
                  'Korean',
                  'Vietnamese',
                  'Caribbean',
                  'Cajun/Creole',
                  'German',
                  'British',
                  'Irish',
                  'Scandinavian',
                  'Russian',
                  'Hawaiian',
                  'Filipino',
                  'Malaysian',
                  'Indonesian',
                  'South African',
                  'Soul Food',
                  'Tex-Mex',
                  'Israeli',
                  'Polish',
                  'Portuguese',
                  'Argentinian',
                  'Nordic',
                  'Southern',
                  'Pacific Islander',
                  'Fusion',
                  'Vegetarian',
                  'Vegan',
                  'Kosher',
                  'BBQ',
                ],
              },
              description: 'The cuisine(s) the recipe belongs to (e.g., Italian, Mexican).',
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
                    enum: [
                      'g',
                      'kg',
                      'L',
                      'ml',
                      'tsp',
                      'tbsp',
                      'cup',
                      'pc',
                      'slice',
                      'oz',
                      'lb',
                      'bunch',
                      'dash',
                      'pinch',
                      'clove',
                      'scoop',
                    ],
                    description: 'The unit of measurement for the ingredient (e.g., g, tsp, cup).',
                  },
                  name: {
                    type: 'string',
                    description: 'The name of the ingredient.',
                  },
                  preparation: {
                    type: 'string',
                    optional: true,
                    description: 'The preparation state of the ingredient (e.g., chopped, diced).',
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
                    description: 'The state of the ingredient (e.g., fresh, frozen).',
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
                        enum: ['C', 'F'],
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
