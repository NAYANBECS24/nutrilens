import { SpeechClient } from "@google-cloud/speech";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { TEXT_MODEL, genai } from "@/lib/gemini/client";
import { buildVoiceExtractionPrompt } from "@/lib/gemini/prompts";
import { MealAnalysisSchema, type ApiResponse, type MealAnalysis } from "@/lib/gemini/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RequestSchema = z.object({
  audioBase64: z.string().min(1),
  mimeType: z.string().default("audio/webm"),
});

const speechClient = new SpeechClient();

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<MealAnalysis>>> {
  const body: unknown = await req.json();
  const parsed = RequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "INVALID_REQUEST", message: "audioBase64 is required" } },
      { status: 400 },
    );
  }

  try {
    const [sttResponse] = await speechClient.recognize({
      audio: { content: parsed.data.audioBase64 },
      config: {
        encoding: "WEBM_OPUS",
        sampleRateHertz: 48000,
        languageCode: "en-IN",
        alternativeLanguageCodes: ["hi-IN"],
      },
    });

    const transcript =
      sttResponse.results
        ?.map((r) => r.alternatives?.[0]?.transcript)
        .filter(Boolean)
        .join(" ") ?? "";

    if (!transcript.trim()) {
      return NextResponse.json(
        { ok: false, error: { code: "NO_TRANSCRIPT", message: "Could not understand audio. Please try again." } },
        { status: 422 },
      );
    }

    const prompt = buildVoiceExtractionPrompt(transcript);
    const response = await genai.models.generateContent({
      model: TEXT_MODEL,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" },
    });

    const text = response.text ?? "{}";
    const meal = MealAnalysisSchema.parse(JSON.parse(text));

    return NextResponse.json({ ok: true, data: meal });
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: "STT_ERROR", message: "Voice processing failed. Please try again." } },
      { status: 500 },
    );
  }
}
