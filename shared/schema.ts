import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const teaRecipes = pgTable("tea_recipes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  base: text("base").notNull(),
  toppings: text("toppings").array().notNull(),
  sweetness: integer("sweetness").notNull(),
  iceLevel: integer("ice_level").notNull(),
  creator: text("creator").notNull(),
  likes: integer("likes").default(0).notNull(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(),
  unlockedAt: text("unlocked_at").notNull(),
});

export const insertTeaRecipeSchema = createInsertSchema(teaRecipes).omit({
  id: true,
  likes: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
});

export type TeaRecipe = typeof teaRecipes.$inferSelect;
export type InsertTeaRecipe = z.infer<typeof insertTeaRecipeSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
