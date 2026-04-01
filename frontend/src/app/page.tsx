"use client";
import { useState } from "react";
import UploadSection from "@/components/UploadSection";
import ChatSection from "@/components/ChatSection";

export default function Dashboard() {
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [extractedContent, setExtractedContent] = useState<string | null>(null);

  const handleProcessed = (fileId: string, content: string) => {
    setActiveFileId(fileId);
    setExtractedContent(content);
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="mb-6 border-b border-gray-200 pb-4">
          <h1 className="text-3xl md:text-3xl font-extrabold text-gray-900 tracking-tight" tabIndex={0}>
            SaaS Multimodal Inclusivo
          </h1>
          <p className="text-gray-600 mt-2 text-base md:text-lg" tabIndex={0}>
            Plataforma accesible que utiliza modelos RAG y análisis computacional visual (WCAG 2.1 Compatible).
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:h-[75vh]">
          {/* Columna Izquierda: Controles y Contexto del Documento */}
          <div className="lg:col-span-1 space-y-6 flex flex-col md:h-full">
            <UploadSection onProcessed={handleProcessed} />
            
            <section 
              aria-labelledby="results-heading" 
              className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[300px]"
            >
              <h2 id="results-heading" className="text-xl font-bold mb-4 text-gray-800">
                Memoria Extraída / Insights Estructurales
              </h2>
              <div 
                className="flex-1 overflow-y-auto pr-2" 
                tabIndex={0} 
                aria-live="polite"
              >
                {extractedContent ? (
                  <div className="prose prose-sm prose-blue text-sm whitespace-pre-wrap max-w-none text-gray-700 bg-gray-50 p-4 rounded border border-gray-100">
                    {extractedContent}
                  </div>
                ) : (
                  <p className="text-gray-500 italic mt-4 text-center">
                    Los metadatos, descripciones y hallazgos automáticos del documento aparecerán aquí una vez procesados.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Columna Derecha: RAG Chat Interactivo */}
          <div className="lg:col-span-2 md:h-full min-h-[500px]">
            <ChatSection fileId={activeFileId || ""} />
          </div>
        </div>
      </div>
    </main>
  );
}
