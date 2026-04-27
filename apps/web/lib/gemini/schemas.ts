import { z } from "zod";

export const FoodItemSchema = z.object({
  name: z.string(),
  quantity: z.object({
    value: z.number(),
    unit: z.enum(["g", "ml", "piece", "cup", "tbsp"]),
  }),
  calories_kcal: z.number(),
  protein_g: z.number(),
  carbs_g: z.number(),
  fat_g: z.number(),
  fiber_g: z.number(),
  confidence: z.enum(["low", "medium", "high"]),
});

export const MealAnalysisSchema = z.object({
  items: z.array(FoodItemSchema),
  total_calories_kcal: z.number(),
  glycemic_load_estimate: z.enum(["low", "medium", "high"]),
  notes: z.string(),
});

export type FoodItem = z.infer<typeof FoodItemSchema>;
export type MealAnalysis = z.infer<typeof MealAnalysisSchema>;

export const ApiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({ ok: z.literal(true), data: dataSchema });

export const ApiErrorSchema = z.object({
  ok: z.literal(false),
  error: z.object({ code: z.string(), message: z.string() }),
});

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };
