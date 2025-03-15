export const TEA_BASES = [
  { id: "black", name: "Black Tea", color: "#6B4423" },
  { id: "green", name: "Green Tea", color: "#90A955" },
  { id: "oolong", name: "Oolong Tea", color: "#D4A373" },
  { id: "thai", name: "Thai Tea", color: "#FB8B24" },
  { id: "taro", name: "Taro", color: "#9B6B9E" },
  { id: "matcha", name: "Matcha", color: "#4A7B3F" },
  { id: "strawberry", name: "Strawberry", color: "#FF97A1" },
  { id: "mango", name: "Mango", color: "#FFB344" }
];

export const TOPPINGS = [
  { id: "boba", name: "Boba Pearls", color: "#3A3238" },
  { id: "jelly", name: "Grass Jelly", color: "#2F2F2F" },
  { id: "pudding", name: "Pudding", color: "#FFB344" },
  { id: "redbean", name: "Red Bean", color: "#9B2226" },
  { id: "lychee", name: "Lychee Jelly", color: "#F5F5F5" },
  { id: "rainbow", name: "Rainbow Jelly", color: "#FF97A1" },
  { id: "crystal", name: "Crystal Boba", color: "#D4E7F1" },
  { id: "popping", name: "Popping Boba", color: "#FFD93D" }
];

export const SPECIAL_COMBINATIONS = [
  { 
    name: "Galaxy Dream",
    bases: ["black", "taro"],
    toppings: ["crystal", "popping"],
    description: "A mystical blend that sparkles like the night sky!"
  },
  {
    name: "Tropical Paradise",
    bases: ["green", "mango"],
    toppings: ["rainbow", "lychee"],
    description: "A refreshing mix that takes you to a beach paradise!"
  }
];

export const ACHIEVEMENTS = [
  { id: "first_drink", name: "First Creation", description: "Create your first bubble tea" },
  { id: "experimenter", name: "Experimenter", description: "Try all tea bases" },
  { id: "popular", name: "Popular Creation", description: "Get 5 likes on your recipe" },
  { id: "master", name: "Boba Master", description: "Create 10 unique combinations" },
  { id: "mixologist", name: "Tea Mixologist", description: "Create a special combination" },
  { id: "collector", name: "Topping Collector", description: "Use all available toppings" }
];

export const SWEETNESS_LEVELS = [0, 25, 50, 75, 100];
export const ICE_LEVELS = [0, 30, 50, 70, 100];