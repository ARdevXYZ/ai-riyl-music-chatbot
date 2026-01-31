"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface ChatItem {
  id: string;
  title: string;
  query: string;
  createdAt: number;
  messages: Message[];
}

const HISTORY_KEY = "aimr_history_v1";
const TITLE_LIMIT = 48;

const makeTitle = (text: string) => {
  const trimmed = text.trim();
  if (!trimmed) return "New RIYL";
  return trimmed.length > TITLE_LIMIT ? `${trimmed.slice(0, TITLE_LIMIT)}…` : trimmed;
};

const makeId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

function Spinner() {
  return (
    <div className="flex items-center gap-2 text-pollen">
      <span className="h-4 w-4 rounded-full border-2 border-[#333333] border-t-[#FFFF00] animate-spin" />
      <span className="text-sm">Finding your curated music rex ...</span>
    </div>
  );
}

function Sidebar({
  chats,
  selectedChatId,
  onSelectChat,
  onDeleteChat,
  onNewChat,
  searchValue,
  onSearchChange,
}: {
  chats: ChatItem[];
  selectedChatId: string | null;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onNewChat: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b border-dotted border-pollen">
        <div className="text-sm font-medium tracking-wide text-pollen">AI RIYL Music Recommendations</div>
        <button
          className="mt-3 w-full rounded-lg border border-pollen bg-black px-3 py-2 text-sm text-pollen cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          onClick={onNewChat}
          aria-label="New Chat"
        >
          New RIYL
        </button>
        <div className="mt-3">
          <input
            className="w-full rounded-lg border border-pollen bg-black px-3 py-2 text-sm text-pollen placeholder:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            aria-label="Search history"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {chats.length === 0 ? (
          <div className="px-3 py-4 text-sm text-pollen">No chats yet</div>
        ) : (
          <div className="space-y-1">
            <h3 className="text-sm font-medium tracking-wide italic uppercase mt-2 mb-2" aria-label="Your History" title="Your History">Your History</h3>
            {chats.map((chat) => {
              const isActive = chat.id === selectedChatId;
              return (
                <div
                  key={chat.id}
                  className={`group flex min-w-0 items-center justify-between rounded-lg px-3 py-2 text-sm bg-zinc-900 hover:bg-zinc-900 ${
                    isActive ? "text-pollen" : "text-pollen"
                  }`}
                >
                  <button
                    className="min-w-0 flex-1 truncate-text !bg-zinc-900 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    onClick={() => onSelectChat(chat.id)}
                    aria-label={`Open chat ${chat.title}`}
                  >
                    {chat.title}
                  </button>
                  <button
                    className="ml-2 shrink-0 rounded p-1 !bg-zinc-900 text-pollen hover:text-pollen focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    onClick={() => onDeleteChat(chat.id)}
                    aria-label="Delete chat"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function MainPanel({
  messages,
  input,
  onInputChange,
  onSend,
  loading,
  bottomRef,
}: {
  messages: Message[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  loading: boolean;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 space-y-4">
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-pollen bg-black p-6 text-sm text-pollen">
              Ask for music recommendations and get curated suggestions (RIYL).
            </div>
          ) : (
            messages.map((msg, index) => {
              if (msg.sender === "bot" && !msg.text.trim()) return null;
              return (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed border ${
                      msg.sender === "user"
                      ? "bg-zinc-950 text-pollen border-pollen"
                      : "bg-zinc-950 text-pollen border-pollen"
                    }`}
                  >
                    {msg.sender === "bot" ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
                  </div>
                </div>
              );
            })
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-pollen bg-black px-4 py-3">
                <Spinner />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="bg-black backdrop-blur">
        <div className="mx-auto w-full max-w-3xl px-4 py-4">
          <div className="flex items-center gap-2 rounded-xl border border-pollen bg-black px-3 py-2">
            <input
              className="flex-1 !bg-black text-sm text-pollen placeholder:text-slate-100 focus:outline-none"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && onSend()}
              placeholder="Type a band or artist ..."
              disabled={loading}
              aria-label="Message input"
            />
            <button
              className="rounded-lg bg-black border border-pollen px-3 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              onClick={onSend}
              disabled={loading}
              title="Generate recommendations"
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppShell({
  chats,
  selectedChatId,
  onSelectChat,
  onDeleteChat,
  onNewChat,
  searchValue,
  onSearchChange,
  messages,
  input,
  onInputChange,
  onSend,
  loading,
  bottomRef,
}: {
  chats: ChatItem[];
  selectedChatId: string | null;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onNewChat: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  messages: Message[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  loading: boolean;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isSidebarOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen bg-black text-pollen">
      <aside className="hidden md:flex w-72 shrink-0 border-r border-pollen bg-black">
        <Sidebar
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={onSelectChat}
          onDeleteChat={onDeleteChat}
          onNewChat={onNewChat}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
        />
      </aside>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        <div className="md:hidden flex items-center gap-3 border-b border-pollen bg-black px-4 py-3">
          <button
            className="rounded-lg border border-pollen bg-black p-2 text-pollen hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            ☰
          </button>
          <div className="text-sm font-semibold">AI Music Recommendations</div>
        </div>
        <MainPanel
          messages={messages}
          input={input}
          onInputChange={onInputChange}
          onSend={onSend}
          loading={loading}
          bottomRef={bottomRef}
        />
      </main>
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            className="absolute inset-0 bg-black"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-pollen bg-black shadow-2xl">
            <div className="flex items-center justify-end border-b border-pollen px-4 py-3">
              <button
                className="rounded-lg bg-black border border-pollen px-3 py-2 text-sm font-semibold text-white hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                X
              </button>
            </div>
            <Sidebar
              chats={chats}
              selectedChatId={selectedChatId}
              onSelectChat={(id) => {
                onSelectChat(id);
                setIsSidebarOpen(false);
              }}
              onDeleteChat={onDeleteChat}
              onNewChat={() => {
                onNewChat();
                setIsSidebarOpen(false);
              }}
              searchValue={searchValue}
              onSearchChange={onSearchChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(HISTORY_KEY) : null;
    if (!stored) return;
    try {
      const parsed: ChatItem[] = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setChats(parsed);
        if (parsed[0]) {
          setSelectedChatId(parsed[0].id);
          setMessages(parsed[0].messages || []);
        }
      }
    } catch {
      setChats([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const filteredChats = useMemo(() => {
    const term = searchValue.trim().toLowerCase();
    if (!term) return chats;
    return chats.filter((chat) =>
      `${chat.title} ${chat.query}`.toLowerCase().includes(term)
    );
  }, [chats, searchValue]);

  const startNewChat = () => {
    setSelectedChatId(null);
    setMessages([]);
    setInput("");
  };

  const selectChat = (id: string) => {
    const chat = chats.find((c) => c.id === id);
    if (!chat) return;
    setSelectedChatId(id);
    setMessages(chat.messages || []);
    setInput("");
  };

  const deleteChat = (id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (selectedChatId === id) {
      setSelectedChatId(null);
      setMessages([]);
      setInput("");
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    const userMessage: Message = { sender: "user", text: userText };
    const botPlaceholder: Message = { sender: "bot", text: "" };
    const optimisticMessages: Message[] = [...messages, userMessage, botPlaceholder];

    let chatId = selectedChatId;
    if (!chatId) {
      const newChatId = makeId();
      chatId = newChatId;
      const newChat: ChatItem = {
        id: newChatId,
        title: makeTitle(userText),
        query: userText,
        createdAt: Date.now(),
        messages: optimisticMessages,
      };
      setChats((prev) => [newChat, ...prev]);
      setSelectedChatId(newChatId);
    } else {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, messages: optimisticMessages } : chat
        )
      );
    }

    setMessages(optimisticMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response");
      }

      const data: { response: string } = await res.json();
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: "bot", text: data.response };
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === chatId ? { ...chat, messages: updated } : chat
          )
        );
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
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === chatId ? { ...chat, messages: updated } : chat
          )
        );
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      chats={filteredChats}
      selectedChatId={selectedChatId}
      onSelectChat={selectChat}
      onDeleteChat={deleteChat}
      onNewChat={startNewChat}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      messages={messages}
      input={input}
      onInputChange={setInput}
      onSend={sendMessage}
      loading={loading}
      bottomRef={bottomRef}
    />
  );
}
