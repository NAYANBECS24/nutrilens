"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { userDocRef } from "@/lib/firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { calculateBMR, calculateMacroTargets, calculateTDEE, dailyCalorieTarget } from "@/lib/nutrition-math";
import { setDoc } from "firebase/firestore";

// HTML number inputs deliver strings; we parse manually in onSubmit to keep TS happy with Zod v4.
const ProfileSchema = z.object({
  age: z.string(),
  sex: z.enum(["male", "female", "other"]),
  heightCm: z.string(),
  weightKg: z.string(),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
  goal: z.enum(["lose", "maintain", "gain"]),
  region: z.enum(["north_indian", "south_indian", "west_indian", "east_indian", "global"]),
});

type ProfileForm = z.infer<typeof ProfileSchema>;

export default function OnboardingWizard() {
  const router = useRouter();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: { activityLevel: "moderate", goal: "maintain", sex: "other", region: "global" },
  });

  async function onSubmit(data: ProfileForm) {
    if (!user) { router.replace("/sign-in"); return; }

    setSaving(true);
    setError(null);
    try {
      const age = Number(data.age);
      const heightCm = Number(data.heightCm);
      const weightKg = Number(data.weightKg);
      const bmr = calculateBMR(weightKg, heightCm, age, data.sex);
      const tdee = calculateTDEE(bmr, data.activityLevel);
      const kcal = dailyCalorieTarget(tdee, data.goal);
      const targets = calculateMacroTargets(kcal);

      await setDoc(userDocRef(user.uid), {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        profile: { ...data },
        targets: { kcal: targets.kcal, proteinG: targets.proteinG, carbsG: targets.carbsG, fatG: targets.fatG, fiberG: targets.fiberG },
        settings: { units: "metric", theme: "light", voiceEnabled: true, reducedMotion: false },
      });
      router.replace("/home");
    } catch {
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
        <input id="age" type="number" {...register("age")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none" />
        {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
      </div>

      <div>
        <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
        <select id="sex" {...register("sex")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none">
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Prefer not to say</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="heightCm" className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
          <input id="heightCm" type="number" {...register("heightCm")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none" />
          {errors.heightCm && <p className="text-red-500 text-xs mt-1">{errors.heightCm.message}</p>}
        </div>
        <div>
          <label htmlFor="weightKg" className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
          <input id="weightKg" type="number" {...register("weightKg")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none" />
          {errors.weightKg && <p className="text-red-500 text-xs mt-1">{errors.weightKg.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">Activity level</label>
        <select id="activityLevel" {...register("activityLevel")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none">
          <option value="sedentary">Sedentary (desk job, no exercise)</option>
          <option value="light">Light (1-3x/week)</option>
          <option value="moderate">Moderate (3-5x/week)</option>
          <option value="active">Active (6-7x/week)</option>
          <option value="very_active">Very active (2x/day)</option>
        </select>
      </div>

      <div>
        <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
        <select id="goal" {...register("goal")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none">
          <option value="lose">Lose weight</option>
          <option value="maintain">Maintain weight</option>
          <option value="gain">Gain muscle</option>
        </select>
      </div>

      <div>
        <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">Cuisine region</label>
        <select id="region" {...register("region")} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none">
          <option value="north_indian">North Indian</option>
          <option value="south_indian">South Indian</option>
          <option value="west_indian">West Indian</option>
          <option value="east_indian">East Indian</option>
          <option value="global">Global / Other</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-green-600 py-3 text-white font-medium hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Get started"}
      </button>
    </form>
  );
}
