import { describe, expect, it } from "vitest";

import {
  calculateBMR,
  calculateMacroTargets,
  calculateTDEE,
  dailyCalorieTarget,
  percentOfTarget,
} from "@/lib/nutrition-math";

describe("calculateBMR", () => {
  it("returns correct value for male", () => {
    const bmr = calculateBMR(70, 175, 30, "male");
    // 10*70 + 6.25*175 - 5*30 + 5 = 700 + 1093.75 - 150 + 5 = 1648.75
    expect(bmr).toBeCloseTo(1648.75);
  });

  it("returns correct value for female", () => {
    const bmr = calculateBMR(60, 165, 25, "female");
    // 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25
    expect(bmr).toBeCloseTo(1345.25);
  });

  it("treats 'other' like female formula", () => {
    const bmrOther = calculateBMR(65, 170, 28, "other");
    const bmrFemale = calculateBMR(65, 170, 28, "female");
    expect(bmrOther).toBe(bmrFemale);
  });
});

describe("calculateTDEE", () => {
  it("multiplies BMR by correct activity factor", () => {
    expect(calculateTDEE(1500, "sedentary")).toBe(Math.round(1500 * 1.2));
    expect(calculateTDEE(1500, "moderate")).toBe(Math.round(1500 * 1.55));
    expect(calculateTDEE(1500, "very_active")).toBe(Math.round(1500 * 1.9));
  });
});

describe("dailyCalorieTarget", () => {
  it("subtracts 500 for lose goal", () => {
    expect(dailyCalorieTarget(2000, "lose")).toBe(1500);
  });
  it("adds 300 for gain goal", () => {
    expect(dailyCalorieTarget(2000, "gain")).toBe(2300);
  });
  it("returns TDEE unchanged for maintain", () => {
    expect(dailyCalorieTarget(2000, "maintain")).toBe(2000);
  });
});

describe("calculateMacroTargets", () => {
  it("produces macro totals that roughly equal kcal", () => {
    const targets = calculateMacroTargets(2000);
    const approxKcal = targets.proteinG * 4 + targets.carbsG * 4 + targets.fatG * 9;
    expect(approxKcal).toBeGreaterThan(1800);
    expect(approxKcal).toBeLessThan(2200);
  });
  it("fiber target is 25g", () => {
    expect(calculateMacroTargets(1800).fiberG).toBe(25);
  });
});

describe("percentOfTarget", () => {
  it("calculates correct percentage", () => {
    expect(percentOfTarget(1000, 2000)).toBe(50);
  });
  it("caps at 200", () => {
    expect(percentOfTarget(5000, 1000)).toBe(200);
  });
  it("returns 0 when target is 0", () => {
    expect(percentOfTarget(100, 0)).toBe(0);
  });
});
