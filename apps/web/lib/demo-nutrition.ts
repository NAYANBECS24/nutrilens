import type { MealAnalysis } from "@/lib/gemini/schemas";

const demoMeals: MealAnalysis[] = [
  {
    items: [
      {
        name: "Dal tadka",
        quantity: { value: 1, unit: "cup" },
        calories_kcal: 200,
        protein_g: 11,
        carbs_g: 22,
        fat_g: 7,
        fiber_g: 5,
        confidence: "high",
      },
      {
        name: "Roti",
        quantity: { value: 2, unit: "piece" },
        calories_kcal: 220,
        protein_g: 7,
        carbs_g: 44,
        fat_g: 2,
        fiber_g: 6,
        confidence: "high",
      },
      {
        name: "Cucumber raita",
        quantity: { value: 0.5, unit: "cup" },
        calories_kcal: 60,
        protein_g: 3,
        carbs_g: 6,
        fat_g: 3,
        fiber_g: 1,
        confidence: "medium",
      },
    ],
    total_calories_kcal: 480,
    glycemic_load_estimate: "medium",
    notes:
      "Demo AI estimate: balanced Indian plate with solid fiber. Smart swap: add salad or curd if dinner is rice-heavy.",
  },
  {
    items: [
      {
        name: "Veg biryani",
        quantity: { value: 1.5, unit: "cup" },
        calories_kcal: 570,
        protein_g: 14,
        carbs_g: 90,
        fat_g: 19,
        fiber_g: 6,
        confidence: "medium",
      },
      {
        name: "Raita",
        quantity: { value: 0.5, unit: "cup" },
        calories_kcal: 60,
        protein_g: 3,
        carbs_g: 6,
        fat_g: 3,
        fiber_g: 1,
        confidence: "medium",
      },
    ],
    total_calories_kcal: 630,
    glycemic_load_estimate: "high",
    notes:
      "Demo AI estimate: carb-heavy meal. Smart swap: choose smaller rice portion and add paneer, dal, or sprouts for protein.",
  },
  {
    items: [
      {
        name: "Masala dosa",
        quantity: { value: 1, unit: "piece" },
        calories_kcal: 390,
        protein_g: 8,
        carbs_g: 58,
        fat_g: 13,
        fiber_g: 4,
        confidence: "medium",
      },
      {
        name: "Sambhar",
        quantity: { value: 1, unit: "cup" },
        calories_kcal: 140,
        protein_g: 7,
        carbs_g: 18,
        fat_g: 4,
        fiber_g: 5,
        confidence: "high",
      },
      {
        name: "Coconut chutney",
        quantity: { value: 2, unit: "tbsp" },
        calories_kcal: 90,
        protein_g: 1,
        carbs_g: 4,
        fat_g: 8,
        fiber_g: 2,
        confidence: "medium",
      },
    ],
    total_calories_kcal: 620,
    glycemic_load_estimate: "medium",
    notes:
      "Demo AI estimate: good breakfast energy. Smart swap: add extra sambhar for protein and keep chutney to 2 tbsp.",
  },
];

export function demoMealAnalysis(seed = Date.now()): MealAnalysis {
  const index = Math.abs(Math.floor(seed)) % demoMeals.length;
  const fallback = demoMeals[0];
  if (!fallback) throw new Error("Demo meals are not configured");
  return demoMeals[index] ?? fallback;
}

export function demoCoachReply(question: string): string {
  const cleanQuestion = question.trim() || "today's meal";

  return [
    `I can help with "${cleanQuestion}".`,
    "",
    "Demo coach mode is active because the Gemini key is not configured. Here is a strong nutrition nudge anyway:",
    "",
    "- Keep half the plate vegetables or salad.",
    "- Add one protein anchor: dal, paneer, eggs, sprouts, curd, chicken, or fish.",
    "- If the meal is rice-heavy, reduce the rice by 25% and add sambhar or raita.",
    "- For Indian snacks like samosa, pav bhaji, or Maggi, pair with sprouts or curd and keep dinner lighter.",
    "",
    "Best next step: log one photo meal now, then ask me for a smart swap.",
  ].join("\n");
}
