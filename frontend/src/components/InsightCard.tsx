"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Volume2, Maximize2, Zap, BrainCircuit, Type } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  title?: string;
  image?: string; // Base64
  explanation: string;
  insight: string;
  type?: string;
  tabIndex?: number;
}

export default function InsightCard({ title, image, explanation, insight, type, tabIndex = 0 }: InsightCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(explanation);
      utterance.lang = "es-ES";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <article 
      className="glass-card flex flex-col h-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={tabIndex}
      aria-labelledby={`card-title-${title}`}
    >
      {/* Visual Header */}
      <div className="relative h-48 lg:h-56 overflow-hidden rounded-t-2xl bg-black/40">
        {image ? (
          <Image 
            src={`data:image/png;base64,${image}`} 
            alt={title || "Imagen detectada por IA"} 
            fill
            className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-2">
            <Zap className="w-10 h-10 opacity-20" />
            <span className="text-xs font-mono uppercase tracking-widest opacity-40">Procesamiento Visual AI</span>
          </div>
        )}
        
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            className="p-2 glass rounded-lg text-white/70 hover:text-neon-blue hover:bg-white/10 transition-all"
            aria-label="Maximizar imagen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {type && (
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 bg-neon-blue/20 text-neon-blue border border-neon-blue/40 rounded-full text-xs font-bold backdrop-blur-md">
              {type}
            </span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-6 flex-1 flex flex-col gap-5">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 rounded-lg bg-neon-gold/10 text-neon-gold border border-neon-gold/20">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neon-gold/80">Análisis Cognitivo</h4>
              <p className="text-sm text-gray-300 leading-relaxed font-medium">
                {insight}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 rounded-lg bg-neon-blue/10 text-neon-blue border border-neon-blue/20">
              <Type className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neon-blue/80">Explicación Pedagógica</h4>
              <p className="text-base text-white/90 leading-relaxed font-medium">
                {explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <button 
            onClick={handleSpeak}
            className="flex items-center gap-2 text-xs font-bold text-neon-blue hover:text-white transition-colors group/btn"
            aria-label={`Escuchar explicación de ${title}`}
          >
            <div className="p-2 bg-neon-blue/10 rounded-lg group-hover/btn:bg-neon-blue transition-colors">
              <Volume2 className={cn("w-4 h-4 transition-colors", isHovered && "animate-pulse")} />
            </div>
            <span>ESCUCHAR ANÁLISIS</span>
          </button>
          
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">Verified by VISION-AI</span>
          </div>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neon-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </article>
  );
}
