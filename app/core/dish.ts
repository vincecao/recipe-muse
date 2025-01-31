export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type Category = "Appetizers" | "Main Course" | "Desserts" | "Beverages";

export interface Dish {
  id: string;
  category: Category;
  title: string;
  description: string;
  difficulty: Difficulty;
  ingredientsCount: number;
  time: string;
  calories: number;
  price: string;
  images: string[];
  tags: string[];
  servingSize: string;
  allergens?: string[];
}
