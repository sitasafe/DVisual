"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageSquare } from "lucide-react";
import { askQuestion } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatSection({ fileId }: { fileId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !fileId || isLoading) return;
    
    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const data = await askQuestion(fileId, userMsg);
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: No pude obtener respuesta de la IA." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="glass flex flex-col rounded-2xl h-full border border-white/10 overflow-hidden shadow-2xl relative min-h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-neon-blue/10 text-neon-blue">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-sm uppercase tracking-wider">Chat Interactivo RAG</h2>
            <p className="text-[10px] text-gray-500 font-mono">MODEL: VISION-AI 1.0 (PROD)</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-neon-blue/10 border border-neon-blue/20 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
          <span className="text-[10px] font-bold text-neon-blue">ONLINE</span>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="m-auto text-center space-y-4 max-w-[280px]">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 inline-block animate-float">
              <Sparkles className="w-12 h-12 text-neon-blue mx-auto opacity-50" />
            </div>
            <p className="text-gray-500 text-sm font-medium">
              Sube un documento para habilitar el análisis conversacional en este espacio.
            </p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={cn("flex flex-col gap-2 max-w-[85%]", m.role === "user" ? "self-end items-end" : "self-start items-start")}>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed font-medium transition-all duration-300 shadow-lg",
                m.role === "user" 
                  ? "bg-neon-blue text-black font-bold shadow-neon-blue/20 rounded-tr-none" 
                  : "glass text-gray-200 border border-white/10 rounded-tl-none"
              )}>
                {m.content}
              </div>
              <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase px-1">
                {m.role === "user" ? "Tú" : "Vision-AI Assistant"}
              </span>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-2 items-center text-neon-blue opacity-70 italic text-sm">
            <span className="w-2 h-2 bg-neon-blue rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-neon-blue rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 bg-neon-blue rounded-full animate-bounce [animation-delay:0.4s]" />
            <span className="ml-2 font-mono text-[10px] uppercase tracking-widest font-bold">Procesando...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/5 border-t border-white/10">
        <form onSubmit={handleSend} className="relative group">
          <input
            type="text"
            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20 transition-all placeholder:text-gray-600 text-white"
            placeholder={fileId ? "Haz una pregunta sobre el documento..." : "Carga un archivo para preguntar"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!fileId || isLoading}
            aria-label="Mensaje para la IA"
          />
          <button
            type="submit"
            disabled={!fileId || isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-neon-blue text-black rounded-lg hover:bg-white hover:text-black transition-all disabled:bg-white/5 disabled:text-gray-600 shadow-lg shadow-neon-blue/30"
            aria-label="Enviar pregunta"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </section>
  );
}
