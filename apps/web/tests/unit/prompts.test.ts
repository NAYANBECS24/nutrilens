import { describe, expect, it } from "vitest";

import { MEAL_ANALYSIS_SYSTEM_PROMPT, buildCoachSystemPrompt, buildVoiceExtractionPrompt } from "@/lib/gemini/prompts";

describe("MEAL_ANALYSIS_SYSTEM_PROMPT", () => {
  it("instructs JSON-only response", () => {
    expect(MEAL_ANALYSIS_SYSTEM_PROMPT).toContain("Return ONLY a JSON object");
  });
  it("mentions Indian cuisine names", () => {
    expect(MEAL_ANALYSIS_SYSTEM_PROMPT).toContain("roti");
  });
});

describe("buildCoachSystemPrompt", () => {
  it("injects all context variables", () => {
    const result = buildCoachSystemPrompt({
      profileJson: '{"goal":"lose"}',
      mealsJson: "[]",
      targetsJson: '{"kcal":1800}',
      nowIso: "2026-04-27T12:00:00Z",
    });
    expect(result).toContain('{"goal":"lose"}');
    expect(result).toContain("2026-04-27T12:00:00Z");
    expect(result).toContain('{"kcal":1800}');
  });
});

describe("buildVoiceExtractionPrompt", () => {
  it("embeds the transcript", () => {
    const result = buildVoiceExtractionPrompt("two rotis and dal");
    expect(result).toContain("two rotis and dal");
  });
});
