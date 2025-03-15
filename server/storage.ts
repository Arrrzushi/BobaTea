import { TeaRecipe, InsertTeaRecipe, Achievement, InsertAchievement } from "@shared/schema";

export interface IStorage {
  getRecipes(): Promise<TeaRecipe[]>;
  getRecipe(id: number): Promise<TeaRecipe | undefined>;
  createRecipe(recipe: InsertTeaRecipe): Promise<TeaRecipe>;
  likeRecipe(id: number): Promise<TeaRecipe>;
  getAchievements(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
}

export class MemStorage implements IStorage {
  private recipes: Map<number, TeaRecipe>;
  private achievements: Map<number, Achievement>;
  private currentRecipeId: number;
  private currentAchievementId: number;

  constructor() {
    this.recipes = new Map();
    this.achievements = new Map();
    this.currentRecipeId = 1;
    this.currentAchievementId = 1;
  }

  async getRecipes(): Promise<TeaRecipe[]> {
    return Array.from(this.recipes.values());
  }

  async getRecipe(id: number): Promise<TeaRecipe | undefined> {
    return this.recipes.get(id);
  }

  async createRecipe(insertRecipe: InsertTeaRecipe): Promise<TeaRecipe> {
    const id = this.currentRecipeId++;
    const recipe: TeaRecipe = { ...insertRecipe, id, likes: 0 };
    this.recipes.set(id, recipe);
    return recipe;
  }

  async likeRecipe(id: number): Promise<TeaRecipe> {
    const recipe = await this.getRecipe(id);
    if (!recipe) throw new Error("Recipe not found");
    
    const updated = { ...recipe, likes: recipe.likes + 1 };
    this.recipes.set(id, updated);
    return updated;
  }

  async getAchievements(userId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter(a => a.userId === userId);
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentAchievementId++;
    const achievement: Achievement = { ...insertAchievement, id };
    this.achievements.set(id, achievement);
    return achievement;
  }
}

export const storage = new MemStorage();
