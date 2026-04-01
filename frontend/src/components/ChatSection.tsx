"use client";
import { useState, useRef, useEffect } from "react";
import { askQuestion } from "@/lib/api";

export default function ChatSection({ fileId }: { fileId: string }) {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
        endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !fileId || loading) return;
    
    const userQ = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userQ }]);
    setLoading(true);

    try {
      const res = await askQuestion(fileId, userQ);
      setMessages(prev => [...prev, { role: "assistant", content: res.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Error al procesar la pregunta, por favor intente nuevamente." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section aria-labelledby="chat-heading" className="flex flex-col h-full border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
      <h2 id="chat-heading" className="sr-only">Chat interactivo del documento</h2>
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4" 
        role="log" 
        aria-live="polite" 
        aria-atomic="false"
        tabIndex={0}
      >
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center italic mt-10">
            Sube y procesa un documento para habilitar preguntas en este espacio.
          </p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`p-4 rounded-lg max-w-[85%] text-sm md:text-base ${msg.role === "user" ? "bg-blue-600 text-white ml-auto" : "bg-gray-100 text-gray-900 border border-gray-200"}`}>
              <strong className="sr-only">{msg.role === "user" ? "Tú dices:" : "Asistente Multimodal dice:"}</strong>
              <span className="whitespace-pre-wrap leading-relaxed">{msg.content}</span>
            </div>
          ))
        )}
        {loading && (
          <div aria-label="El asistente está escribiendo su respuesta..." className="text-gray-500 p-2 text-sm italic">
             <span aria-hidden="true">Generando respuesta semántica...</span>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>
      <form onSubmit={handleAsk} className="p-4 border-t border-gray-200 flex gap-2 bg-gray-50">
        <label htmlFor="chat-input" className="sr-only">Formulario para enviar nueva pregunta al documento</label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ej: ¿Cuáles son las métricas clave del trimestre? o ¿Qué indica el Gráfico 2?"
          disabled={!fileId || loading}
          className="flex-1 items-center px-4 py-3 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-800"
          aria-disabled={!fileId || loading}
        />
        <button
          type="submit"
          disabled={!fileId || loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 lg:px-8 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed outline-none transition"
          aria-label="Enviar pregunta al asistente"
        >
          Enviar
        </button>
      </form>
    </section>
  );
}
