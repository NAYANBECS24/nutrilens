import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { VISION_MODEL, genai } from "@/lib/gemini/client";
import { MEAL_ANALYSIS_SYSTEM_PROMPT } from "@/lib/gemini/prompts";
import { MealAnalysisSchema, type ApiResponse, type MealAnalysis } from "@/lib/gemini/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RequestSchema = z.object({
  imageBase64: z.string().min(1),
});

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<MealAnalysis>>> {
  const body: unknown = await req.json();
  const parsed = RequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "INVALID_REQUEST", message: "imageBase64 is required" } },
      { status: 400 },
    );
  }

  try {
    const response = await genai.models.generateContent({
      model: VISION_MODEL,
      contents: [
        {
          role: "user",
          parts: [
            { text: MEAL_ANALYSIS_SYSTEM_PROMPT },
            { inlineData: { mimeType: "image/jpeg", data: parsed.data.imageBase64 } },
          ],
        },
      ],
      config: { responseMimeType: "application/json" },
    });

    const text = response.text ?? "{}";
    const jsonData: unknown = JSON.parse(text);
    const meal = MealAnalysisSchema.parse(jsonData);

    return NextResponse.json({ ok: true, data: meal });
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: "AI_ERROR", message: "Meal analysis failed. Please try again." } },
      { status: 500 },
    );
  }
}
