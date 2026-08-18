"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  
  // hook useChat dari Vercel AI SDK ini ajaib bro! 
  // Dia otomatis nyambung ke /api/chat yang kita buat tadi
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fungsi untuk otomatis scroll ke chat paling bawah setiap ada pesan baru
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      {/* Tombol Gelembung (Floating Button) */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 h-14 px-6 rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl z-[9999] gap-2",
          isOpen ? "hidden" : "flex"
        )}
      >
        <MessageSquare className="h-5 w-5" />
        <span className="font-medium text-sm">Tanya AI Assistant</span>
      </Button>

      {/* Jendela Kotak Chat */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-[9999] w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] flex-col rounded-2xl border bg-background shadow-2xl transition-all duration-300 ease-in-out",
          isOpen ? "flex opacity-100 scale-100" : "hidden opacity-0 scale-95 pointer-events-none"
        )}
      >
        {/* Header (Bagian Atas) */}
        <div className="flex items-center justify-between border-b px-4 py-3 bg-primary text-primary-foreground rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <h3 className="font-semibold text-sm">AI Sneakers Assistant</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-primary-foreground/20 text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Area Pesan Chat */}
        <div className="flex-1 p-4 bg-muted/20 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 mt-20">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Halo! Aku asisten cerdas AI Sneakers.<br/>Tanyain Saja Ke Aku Ya!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex w-max max-w-[85%] flex-col gap-2 rounded-xl px-4 py-2 text-sm",
                    m.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground rounded-br-none"
                      : "bg-background border rounded-bl-none shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-2 text-[10px] opacity-70 mb-1">
                    {m.role === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                    {m.role === "user" ? "Kamu" : "AI Assistant"}
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background border w-max px-4 py-2 rounded-xl rounded-bl-none">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Mengetik...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Tempat Ngetik (Form Input) */}
        <div className="p-3 border-t bg-background rounded-b-2xl">
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ketik pesan..."
              className="flex-1 border-muted-foreground/20 focus-visible:ring-primary bg-muted/30"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="rounded-full">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
