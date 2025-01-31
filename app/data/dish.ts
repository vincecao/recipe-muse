import { Dish } from "~/core/dish";

export const recommendedDishes: Dish[] = [
  // Appetizers
  {
    id: "app-1",
    category: "Appetizers",
    title: "Truffle Burrata",
    description: "Fresh burrata cheese, shaved black truffles, aged balsamic, toasted sourdough",
    difficulty: "Beginner",
    ingredientsCount: 6,
    time: "15 mins",
    calories: 320,
    price: "$18",
    images: ["/images/menu/truffle-burrata.jpg"],
    tags: ["vegetarian", "italian", "cheese"],
    servingSize: "For 2",
    allergens: ["dairy", "gluten"],
  },
  {
    id: "app-2",
    category: "Appetizers",
    title: "Tuna Tartare",
    description: "Sushi-grade tuna, avocado, sesame-soy dressing, wonton crisps",
    difficulty: "Intermediate",
    ingredientsCount: 8,
    time: "25 mins",
    calories: 280,
    price: "$22",
    images: ["/images/menu/tuna-tartare.jpg"],
    tags: ["seafood", "raw", "asian-fusion"],
    servingSize: "For 2",
    allergens: ["fish", "soy", "gluten"],
  },

  // Main Course
  {
    id: "main-1",
    category: "Main Course",
    title: "Wagyu Ribeye",
    description: "A5 Japanese Wagyu, truffle butter, roasted garlic, seasonal vegetables",
    difficulty: "Advanced",
    ingredientsCount: 10,
    time: "45 mins",
    calories: 850,
    price: "$95",
    images: ["/images/menu/wagyu-ribeye.jpg"],
    tags: ["beef", "luxury", "grilled"],
    servingSize: "For 1",
    allergens: ["dairy"],
  },
  {
    id: "main-2",
    category: "Main Course",
    title: "Lobster Risotto",
    description: "Arborio rice, butter-poached lobster, mascarpone, fresh herbs",
    difficulty: "Advanced",
    ingredientsCount: 12,
    time: "50 mins",
    calories: 680,
    price: "$48",
    images: ["/images/menu/lobster-risotto.jpg"],
    tags: ["seafood", "italian", "creamy"],
    servingSize: "For 1",
    allergens: ["shellfish", "dairy"],
  },

  // Desserts
  {
    id: "dessert-1",
    category: "Desserts",
    title: "Valrhona Soufflé",
    description: "Dark chocolate soufflé, vanilla bean ice cream, chocolate sauce",
    difficulty: "Advanced",
    ingredientsCount: 8,
    time: "30 mins",
    calories: 450,
    price: "$16",
    images: ["/images/menu/chocolate-souffle.jpg"],
    tags: ["chocolate", "hot", "classic"],
    servingSize: "For 1",
    allergens: ["dairy", "eggs"],
  },
  {
    id: "dessert-2",
    category: "Desserts",
    title: "Crème Brûlée",
    description: "Tahitian vanilla bean custard, caramelized sugar crust",
    difficulty: "Intermediate",
    ingredientsCount: 6,
    time: "45 mins",
    calories: 380,
    price: "$14",
    images: ["/images/menu/creme-brulee.jpg"],
    tags: ["french", "classic", "custard"],
    servingSize: "For 1",
    allergens: ["dairy", "eggs"],
  },

  // Beverages
  {
    id: "bev-1",
    category: "Beverages",
    title: "Smoked Old Fashioned",
    description: "Woodford Reserve, maple syrup, aromatic bitters, applewood smoke",
    difficulty: "Intermediate",
    ingredientsCount: 5,
    time: "10 mins",
    calories: 220,
    price: "$18",
    images: ["/images/menu/smoked-old-fashioned.jpg"],
    tags: ["cocktail", "whiskey", "smoked"],
    servingSize: "8 oz",
  },
  {
    id: "bev-2",
    category: "Beverages",
    title: "Elderflower Spritz",
    description: "St. Germain, prosecco, fresh mint, edible flowers",
    difficulty: "Beginner",
    ingredientsCount: 4,
    time: "5 mins",
    calories: 180,
    price: "$16",
    images: ["/images/menu/elderflower-spritz.jpg"],
    tags: ["cocktail", "sparkling", "floral"],
    servingSize: "6 oz",
  },
];

// Helper function to get dishes by category
export const getDishesByCategory = (category: Dish["category"]) => {
  return recommendedDishes.filter((dish) => dish.category === category);
};

// Helper function to get dish by ID
export const getDishById = (id: string) => {
  return recommendedDishes.find((dish) => dish.id === id);
};

// Get all unique tags
export const getAllTags = () => {
  const tags = new Set<string>();
  recommendedDishes.forEach((dish) => {
    dish.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags);
};

// Get all allergens
export const getAllAllergens = () => {
  const allergens = new Set<string>();
  recommendedDishes.forEach((dish) => {
    dish.allergens?.forEach((allergen) => allergens.add(allergen));
  });
  return Array.from(allergens);
};
