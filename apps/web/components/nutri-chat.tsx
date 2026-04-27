"use client";

import { Bot, Send, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = { role: "user" | "assistant"; content: string };

const quickPrompts = [
  "I ate biryani for lunch. What should dinner be?",
  "Suggest a high-protein Indian snack.",
  "How do I balance rice and roti today?",
];

export default function NutriChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function sendPrompt(prompt: string) {
    if (!prompt.trim() || streaming) return;

    const userMsg: Message = { role: "user", content: prompt.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStreaming(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            content: m.content,
          })),
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data) as { text: string };
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last?.role === "assistant") {
                updated[updated.length - 1] = { ...last, content: last.content + parsed.text };
              }
              return updated;
            });
          } catch {
            // skip malformed SSE chunk
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === "assistant" && !last.content) {
          updated[updated.length - 1] = { ...last, content: "Sorry, something went wrong. Please try again." };
        }
        return updated;
      });
    } finally {
      setStreaming(false);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    await sendPrompt(input);
  }

  return (
    <div className="flex min-h-[calc(100dvh-5rem)] flex-col bg-[#f5f7f1]">
      <header className="mx-auto w-full max-w-md px-4 pt-5">
        <div className="rounded-[28px] bg-slate-950 p-5 text-white shadow-xl shadow-emerald-950/10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-300 text-slate-950">
              <Bot size={22} aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-black">NutriLens Coach</h1>
              <p className="text-xs text-slate-300">Gemini-ready with demo fallback</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-md flex-1 space-y-4 overflow-y-auto px-4 pb-36 pt-4" aria-live="polite" aria-label="Chat messages">
        {messages.length === 0 && (
          <div className="mt-6 rounded-[28px] bg-white p-5 text-center shadow-sm ring-1 ring-slate-200">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
              <Sparkles size={22} aria-hidden="true" />
            </div>
            <p className="font-black text-slate-950">Ask for a smarter next bite</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Try: "I ate biryani for lunch, what should dinner be?"
            </p>
            <div className="mt-4 space-y-2 text-left">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void sendPrompt(prompt)}
                  className="w-full rounded-2xl bg-slate-50 px-3 py-3 text-left text-sm font-semibold leading-snug text-slate-700 ring-1 ring-slate-200 transition hover:bg-emerald-50 hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-emerald-700 text-white"
                  : "bg-white text-slate-800 shadow-sm ring-1 ring-slate-200"
              }`}
            >
              {msg.role === "assistant" ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content || "…"}</ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="fixed bottom-20 left-0 right-0 z-30 px-4">
        <form
          onSubmit={sendMessage}
          className="mx-auto flex w-full max-w-md gap-2 rounded-[28px] border border-slate-200 bg-white/95 p-3 shadow-2xl shadow-slate-950/10 backdrop-blur"
        >
          <label htmlFor="chat-input" className="sr-only">Type a message</label>
          <input
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={streaming ? "Coach is thinking..." : "Ask your coach..."}
            disabled={streaming}
            className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            aria-label="Send message"
            className="rounded-2xl bg-slate-950 p-3 text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 disabled:opacity-50"
          >
            <Send size={18} aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}
