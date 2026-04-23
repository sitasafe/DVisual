"use client";
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import InsightCard from "@/components/InsightCard";
import UploadSection from "@/components/UploadSection";
import ChatSection from "@/components/ChatSection";
import { FileText, Cpu, Layers, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [charCount, setCharCount] = useState<number>(0);
  const [insights, setInsights] = useState<any[]>([]);

  const handleProcessed = (fileId: string, count: number, results: any[]) => {
    setActiveFileId(fileId);
    setCharCount(count);
    setInsights(results);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-10 relative">
        {/* Background Decorations */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-blue/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-10 relative z-10">
          {/* Hero Section */}
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full w-fit">
                <Sparkles className="w-4 h-4 text-neon-blue" />
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Multimodal AI Ecosystem</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tighter text-white">
                Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-gold">VISION-AI</span>
              </h1>
              <p className="text-gray-500 text-lg max-w-2xl font-medium leading-relaxed">
                Transformando la complejidad visual en explicaciones pedagógicas inclusivas mediante modelos RAG y visión computacional.
              </p>
            </div>
            
            <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-gray-600">
              <span className="flex items-center gap-1.5 underline underline-offset-4 decoration-neon-blue/40">WCAG 2.1 COMPLIANT</span>
              <span className="w-1 h-1 rounded-full bg-gray-700" />
              <span>v1.2.4</span>
            </div>
          </header>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
              label="Memoria RAG (Chars)" 
              value={charCount.toLocaleString()} 
              icon={Layers} 
              sublabel="Indexados"
              color="blue"
            />
            <StatCard 
              label="Insights Detectados" 
              value={insights.length} 
              icon={Cpu} 
              sublabel="En tiempo real"
              color="gold"
            />
            <StatCard 
              label="Documento Activo" 
              value={activeFileId ? "Activo" : "Ninguno"} 
              icon={FileText} 
              sublabel={activeFileId ? "Verificado" : "Esperando..."}
              color="purple"
            />
          </div>

          {/* Bento Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Control & Analysis Column */}
            <div className="lg:col-span-4 space-y-8 h-fit">
              <UploadSection onProcessed={handleProcessed} />
              
              <div className={cn(
                "p-6 rounded-2xl glass border border-white/5 space-y-4 transition-opacity",
                !activeFileId && "opacity-50 grayscale"
              )}>
                 <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">System Logs</h3>
                 <div className="space-y-3 font-mono text-[10px]">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                       <span className="text-gray-600">FAISS Indexing</span>
                       <span className="text-neon-blue">SUCCESS</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                       <span className="text-gray-600">OCR Engine</span>
                       <span className="text-neon-gold">WAITING</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-gray-600">TTS Ready</span>
                       <span className="text-green-500">READY</span>
                    </div>
                 </div>
              </div>
            </div>

            {/* Interaction & Insights Column */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Chat - Takes more weight if no insights */}
              <div className={cn("transition-all duration-700", insights.length > 0 ? "h-[450px]" : "h-[650px]")}>
                <ChatSection fileId={activeFileId || ""} />
              </div>

              {/* Dynamic Insight Cards Grid */}
              {insights.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                  {insights.map((ins, idx) => (
                    <InsightCard
                      key={idx}
                      title={`Hallazgo Visual ${idx + 1}`}
                      image={ins.image_base64}
                      insight={ins.insight}
                      explanation={ins.explicacion_pedagogica}
                      type={ins.tipo_grafico}
                      tabIndex={0}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Credits */}
        <footer className="mt-20 py-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-[10px] font-bold tracking-widest gap-4 italic">
           <div className="flex items-center gap-2 text-gray-700 uppercase">
              <span className="w-1 h-1 rounded-full bg-neon-blue" />
              <span>Orquestación de IA Visionaria en tiempo real</span>
           </div>
           <div className="text-neon-gold/50 flex items-center gap-4">
              <span>© | Engineered by Eng. Willan Álvarez C. | 2026 |</span>
           </div>
        </footer>
      </main>
    </div>
  );
}
