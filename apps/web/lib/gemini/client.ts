import { GoogleGenAI } from "@google/genai";

const apiKey = process.env["GEMINI_API_KEY"] ?? process.env["GCP_API_KEY"] ?? "";

export const genai = new GoogleGenAI({ apiKey });

export const VISION_MODEL = process.env["VERTEX_AI_MODEL_VISION"] ?? "gemini-2.5-pro";
export const TEXT_MODEL = process.env["VERTEX_AI_MODEL_TEXT"] ?? "gemini-2.5-flash";
