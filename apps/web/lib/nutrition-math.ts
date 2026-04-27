/**
 * All functions are pure — no side effects, easy to unit test.
 * BMR uses Mifflin-St Jeor (1990) which is more accurate than Harris-Benedict.
 */

export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
export type Goal = "lose" | "maintain" | "gain";
export type Sex = "male" | "female" | "other";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

/**
 * Mifflin-St Jeor BMR formula.
 * @param weightKg - Body weight in kilograms.
 * @param heightCm - Height in centimetres.
 * @param age - Age in years.
 * @param sex - Biological sex for the formula constant.
 * @returns Basal metabolic rate in kcal/day.
 */
export function calculateBMR(weightKg: number, heightCm: number, age: number, sex: Sex): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

/**
 * @returns Total Daily Energy Expenditure in kcal/day.
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];
  return Math.round(bmr * multiplier);
}

/**
 * Adjusts TDEE for the user's goal (±500 kcal is the standard 0.5kg/week target).
 * @returns Daily calorie target in kcal.
 */
export function dailyCalorieTarget(tdee: number, goal: Goal): number {
  if (goal === "lose") return tdee - 500;
  if (goal === "gain") return tdee + 300;
  return tdee;
}

export type MacroTargets = {
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
};

/**
 * Calculates macro targets using standard balanced ratios:
 * protein 25%, carbs 45%, fat 30% of total kcal.
 * Fiber target follows WHO recommendation of 25g/day.
 */
export function calculateMacroTargets(dailyKcal: number): MacroTargets {
  return {
    kcal: dailyKcal,
    proteinG: Math.round((dailyKcal * 0.25) / 4),
    carbsG: Math.round((dailyKcal * 0.45) / 4),
    fatG: Math.round((dailyKcal * 0.3) / 9),
    fiberG: 25,
  };
}

/**
 * @returns Percentage of target consumed, capped at 200 to avoid absurd values.
 */
export function percentOfTarget(consumed: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(Math.round((consumed / target) * 100), 200);
}
