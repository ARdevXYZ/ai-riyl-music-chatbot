"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

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
      const botMessage: Message = { sender: "bot", text: data.response };

      setMessages((prev) => [...prev, botMessage]);
      setInput("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4 app-title">
        🎵 Ai RIYL Music Recommendations
      </h1>
      <div className="w-full max-w-md border p-4 h-96 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "user" ? "text-right text-green-600" : "text-left text-gray-100"}
          >
            {msg.sender === "bot" ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : (
              <p>{msg.text}</p>
            )}
          </div>
        ))}
      </div>
      <input
        className="border p-2 w-full max-w-md"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a band or artist..."
      />
      <button className="mt-2 px-4 py-2 bg-blue-500 text-white" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
}
