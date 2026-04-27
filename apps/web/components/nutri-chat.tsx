"use client";

import { Send } from "lucide-react";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = { role: "user" | "assistant"; content: string };

export default function NutriChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || streaming) return;

    const userMsg: Message = { role: "user", content: input.trim() };
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

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b px-4 py-3">
        <h1 className="font-semibold text-gray-900">NutriLens Coach</h1>
        <p className="text-xs text-gray-500">Powered by Gemini 2.5</p>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" aria-live="polite" aria-label="Chat messages">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400 mt-12">
            Ask me anything about your meals and nutrition goals.
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-800"
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

      <form onSubmit={sendMessage} className="border-t px-4 py-3 flex gap-2">
        <label htmlFor="chat-input" className="sr-only">Type a message</label>
        <input
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your coach…"
          disabled={streaming}
          className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          aria-label="Send message"
          className="rounded-xl bg-green-600 p-2 text-white hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-50"
        >
          <Send size={18} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
