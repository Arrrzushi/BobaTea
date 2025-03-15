import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTeaRecipeSchema, insertAchievementSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/recipes", async (_req, res) => {
    const recipes = await storage.getRecipes();
    res.json(recipes);
  });

  app.get("/api/recipes/:id", async (req, res) => {
    const recipe = await storage.getRecipe(Number(req.params.id));
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  });

  app.post("/api/recipes", async (req, res) => {
    const parseResult = insertTeaRecipeSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid recipe data" });
    }
    const recipe = await storage.createRecipe(parseResult.data);
    res.status(201).json(recipe);
  });

  app.post("/api/recipes/:id/like", async (req, res) => {
    try {
      const recipe = await storage.likeRecipe(Number(req.params.id));
      res.json(recipe);
    } catch (error) {
      res.status(404).json({ message: "Recipe not found" });
    }
  });

  app.get("/api/achievements/:userId", async (req, res) => {
    const achievements = await storage.getAchievements(req.params.userId);
    res.json(achievements);
  });

  app.post("/api/achievements", async (req, res) => {
    const parseResult = insertAchievementSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid achievement data" });
    }
    const achievement = await storage.createAchievement(parseResult.data);
    res.status(201).json(achievement);
  });

  const httpServer = createServer(app);
  return httpServer;
}
