"use client";
import React, { useState, useCallback } from "react";
import { FileUp, CheckCircle2, AlertCircle, Loader2, Sparkles, Files } from "lucide-react";
import { uploadFile, processDocument } from "@/lib/api";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE_MB = 10;
const VALID_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/webp"];

interface Props {
  onProcessed: (fileId: string, charCount: number, results: any[]) => void;
}

export default function UploadSection({ onProcessed }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) validateAndSetFile(selected);
  };

  const validateAndSetFile = (selected: File) => {
    setErrorMsg("");
    setStatus("idle");
    
    if (!VALID_TYPES.includes(selected.type)) {
      setErrorMsg("Formato no compatible. Usa PDF o Imágenes.");
      setFile(null);
      return;
    }
    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`Límite excedido (${MAX_FILE_SIZE_MB}MB).`);
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) validateAndSetFile(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    setErrorMsg("");
    
    try {
      const uploadRes = await uploadFile(file);
      const fileId = uploadRes.data.file_id;
      
      setStatus("processing");
      const processRes = await processDocument(fileId, true, true);
      
      setStatus("done");
      onProcessed(fileId, processRes.char_count || 0, processRes.analysis_results || []);
    } catch (error: any) {
      setStatus("error");
      setErrorMsg(error.message || "Error en el pipeline de IA.");
    }
  };

  return (
    <section className={cn(
      "glass-card p-8 flex flex-col items-center text-center gap-6 border-2 border-dashed transition-all duration-500",
      isDragging ? "border-neon-blue bg-neon-blue/5 scale-[1.02]" : "border-white/10"
    )}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
    >
      <div className="relative group">
        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-2 group-hover:neon-glow-blue transition-all duration-500">
          {status === "processing" || status === "uploading" ? (
            <Loader2 className="w-10 h-10 text-neon-blue animate-spin" />
          ) : status === "done" ? (
            <CheckCircle2 className="w-10 h-10 text-neon-blue" />
          ) : (
            <FileUp className={cn("w-10 h-10 text-gray-400 group-hover:text-neon-blue transition-colors", isDragging && "animate-bounce")} />
          )}
        </div>
        {status === "idle" && (
           <div className="absolute -top-2 -right-2 bg-neon-blue p-1.5 rounded-full shadow-lg shadow-neon-blue/40 animate-float">
             <Sparkles className="w-3 h-3 text-black" />
           </div>
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold tracking-tight text-white uppercase">Carga Multimodal</h2>
        <p className="text-sm text-gray-500 max-w-[200px] mx-auto font-medium leading-relaxed">
          Suelte su PDF o imagen aquí para iniciar el análisis pedagógico inclusivo.
        </p>
      </div>

      <div className="w-full space-y-4">
        {file && status === "idle" && (
          <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl animate-in fade-in slide-in-from-bottom-2">
            <Files className="w-5 h-5 text-neon-blue" />
            <div className="flex-1 text-left">
              <p className="text-xs font-bold text-gray-300 truncate max-w-[150px]">{file.name}</p>
              <p className="text-[10px] text-gray-500 font-mono uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        )}

        <label className="cursor-pointer block">
          <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,image/*" />
          <button
            onClick={status === "idle" ? handleUpload : undefined}
            disabled={status === "uploading" || status === "processing"}
            className={cn(
              "w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-widest transition-all duration-300 relative overflow-hidden group/btn",
              status === "idle" ? "bg-white text-black hover:bg-neon-blue active:scale-95" : "bg-white/5 text-gray-500 cursor-not-allowed border border-white/10"
            )}
          >
            <span className="relative z-10 uppercase">
              {status === "idle" ? "Analizar Ahora" : status === "uploading" ? "Subiendo..." : status === "processing" ? "Pensando..." : "Listo"}
            </span>
            {status === "idle" && (
              <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            )}
          </button>
        </label>
      </div>

      <div aria-live="polite" className="h-6">
        {errorMsg && (
          <div className="flex items-center gap-2 text-red-400 text-xs font-bold animate-in zoom-in">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </section>
  );
}
