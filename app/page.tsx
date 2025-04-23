"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Show loading message from bot
    setMessages((prev) => [...prev, { sender: "bot", text: "Loading ..." }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response");
      }

      const data: { response: string } = await res.json();

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: "bot", text: data.response };
        return updated;
      });
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          sender: "bot",
          text: "Something went wrong. Please try again.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4 app-title" aria-title="AI Music Recommendations Generator" title="AI Music Recommendations Generator">
        🎵 AI Music Recommendations Generator
      </h1>
      <div className="w-full max-w-md border p-4 h-96 overflow-y-auto mb-4 bg-gray-900 text-white rounded">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.sender === "user" ? "text-right text-green-400" : "text-left text-gray-200"
            }`}
          >
            {msg.sender === "bot" ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : (
              <p>{msg.text}</p>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <input
        className="border p-2 w-full max-w-md"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a band or artist ..."
        disabled={loading}
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white disabled:opacity-50"
        onClick={sendMessage}
        disabled={loading}
        title="Generate recommendations"
        aria-label="Generate recommendations"
      >
        Send
      </button>
    </div>
  );
}
