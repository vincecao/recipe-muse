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
    images: ["https://media.istockphoto.com/id/1346744481/photo/anonymous-chef-harvesting-fresh-vegetables-on-a-farm.jpg?s=612x612&w=0&k=20&c=U9h4fAi68nwVndAJW8TF-f2lFFCO2Y-XrZWA2gah1Xw="],
    tags: ["vegetarian", "italian", "cheese"],
    servingSize: "For 2",
    allergens: ["dairy", "gluten"],
    cuisine: "Italian"
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
    images: ["https://media.istockphoto.com/id/871231060/photo/organic-food-signage-on-modern-supermarket-fresh-produce-vegetable-aisle.jpg?s=612x612&w=0&k=20&c=XbmsAmMzGGDyeA_iWUQFWCYLBFFtgz8NqKbLRmvOuPM="],
    tags: ["seafood", "raw", "asian-fusion"],
    servingSize: "For 2",
    allergens: ["fish", "soy", "gluten"],
    cuisine: "Japanese"
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
    images: ["https://media.istockphoto.com/id/1097842636/photo/autumn-harvest.jpg?s=612x612&w=0&k=20&c=rWckDYdnQG403oG0HwCpGZyGtZrZv2zPLIVOvgbu8Ng="],
    tags: ["beef", "luxury", "grilled"],
    servingSize: "For 1",
    allergens: ["dairy"],
    cuisine: "Japanese"
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
    images: ["https://media.istockphoto.com/id/1003787134/photo/bag-with-fresh-vegetables.jpg?s=612x612&w=0&k=20&c=sez4OkCCYpNMpL0-2bW1i8IHWQSnJODmGOhpNXpLDsQ="],
    tags: ["seafood", "italian", "creamy"],
    servingSize: "For 1",
    allergens: ["shellfish", "dairy"],
    cuisine: "Italian"
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
    images: ["https://media.istockphoto.com/id/1222581489/photo/farmer-woman-holding-wooden-box-full-of-fresh-raw-vegetables.jpg?s=612x612&w=0&k=20&c=oqL1nl4fxvYrDCG93r0PXEe2NnARXwPT7RqXFIRSPh8="],
    tags: ["chocolate", "hot", "classic"],
    servingSize: "For 1",
    allergens: ["dairy", "eggs"],
    cuisine: "French"
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
    images: ["https://media.istockphoto.com/id/870915532/photo/man-holding-crate-ob-fresh-vegetables.jpg?s=612x612&w=0&k=20&c=k2dXOI-wxUy7lX77Pm90vU6TJXmAAv5VtK60ZZHIyCA="],
    tags: ["french", "classic", "custard"],
    servingSize: "For 1",
    allergens: ["dairy", "eggs"],
    cuisine: "French"
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
    images: ["https://media.istockphoto.com/id/901653798/photo/young-farmer-with-crate-full-of-vegetables.jpg?s=612x612&w=0&k=20&c=qBCV-H1Hqww_Hh-hPS8fi-oed0fOJygyylo-5r3jBsk="],
    tags: ["cocktail", "whiskey", "smoked"],
    servingSize: "8 oz",
    cuisine: "American"
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
    images: ["https://media.istockphoto.com/id/1198277998/photo/zero-waste-lifestyle-plastic-free-eco-friendly-food-shopping-healthy-food-vegetable-in.jpg?s=612x612&w=0&k=20&c=MaFpXa9MvKwAzp_ppBK63176pA2bKWXtahrr6DJcivs="],
    tags: ["cocktail", "sparkling", "floral"],
    servingSize: "6 oz",
    cuisine: "French"
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
