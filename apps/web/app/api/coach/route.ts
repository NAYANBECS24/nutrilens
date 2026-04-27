import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { TEXT_MODEL, genai } from "@/lib/gemini/client";
import { buildCoachSystemPrompt } from "@/lib/gemini/prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MessageSchema = z.object({
  role: z.enum(["user", "model"]),
  content: z.string(),
});

const RequestSchema = z.object({
  messages: z.array(MessageSchema),
  profileJson: z.string().default("{}"),
  mealsJson: z.string().default("[]"),
  targetsJson: z.string().default("{}"),
});

export async function POST(req: NextRequest): Promise<Response> {
  const body: unknown = await req.json();
  const parsed = RequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: { code: "INVALID_REQUEST", message: "Invalid request body" } },
      { status: 400 },
    );
  }

  const { messages, profileJson, mealsJson, targetsJson } = parsed.data;
  const systemPrompt = buildCoachSystemPrompt({
    profileJson,
    mealsJson,
    targetsJson,
    nowIso: new Date().toISOString(),
  });

  const contents = messages.map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  const stream = await genai.models.generateContentStream({
    model: TEXT_MODEL,
    config: { systemInstruction: systemPrompt },
    contents,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.text ?? "";
        if (text) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
