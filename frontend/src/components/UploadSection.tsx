"use client";
import { useState } from "react";
import { uploadFile, processDocument } from "@/lib/api";

const MAX_FILE_SIZE_MB = 10;
const VALID_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/webp"];

interface Props {
  onProcessed: (fileId: string, content: string) => void;
}

export default function UploadSection({ onProcessed }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg("");
    setStatus("idle");
    const selected = e.target.files?.[0];
    
    if (selected) {
      if (!VALID_TYPES.includes(selected.type)) {
        setErrorMsg("Formato no válido. Usa PDF, PNG, JPG o WEBP.");
        setFile(null);
        e.target.value = "";
        return;
      }
      if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setErrorMsg(`El archivo excede el límite de ${MAX_FILE_SIZE_MB}MB.`);
        setFile(null);
        e.target.value = "";
        return;
      }
      setFile(selected);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMsg("Selecciona un archivo primero.");
      return;
    }
    
    setStatus("uploading");
    setErrorMsg("");
    
    try {
      const uploadRes = await uploadFile(file);
      if (!uploadRes?.data?.file_id) throw new Error("Respuesta inválida al subir el archivo.");
      
      const fileId = uploadRes.data.file_id;
      
      setStatus("processing");
      const processRes = await processDocument(fileId, true, true);
      
      setStatus("done");
      onProcessed(fileId, processRes.content || "Documento procesado correctamente.");
    } catch (error: any) {
      setStatus("error");
      setErrorMsg(error.message || "Fallo en la conexión o procesamiento.");
    }
  };

  return (
    <section aria-labelledby="upload-heading" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 id="upload-heading" className="text-xl font-bold mb-4 text-gray-800">Cargar Documento</h2>
      
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona documento a explorar (PDF/PNG/JPG) - Máx {MAX_FILE_SIZE_MB}MB
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".pdf,image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            disabled={status === "uploading" || status === "processing"}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
            aria-describedby="file-upload-help"
          />
          <p id="file-upload-help" className="sr-only">Se permiten documentos formato PDF o Imágenes estadísticas. Tamaño máximo {MAX_FILE_SIZE_MB}MB.</p>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || status === "uploading" || status === "processing"}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
          aria-busy={status === "uploading" || status === "processing"}
        >
          {status === "idle" && "Subir y Analizar Documento"}
          {status === "uploading" && "Subiendo archivo..."}
          {status === "processing" && "Análisis Multimodal e Indexación..."}
          {status === "done" && "Procesado Correctamente"}
          {status === "error" && "Reintentar Subida"}
        </button>

        <div aria-live="polite" aria-atomic="true" className="mt-2 text-sm font-medium">
          {errorMsg && <p className="text-red-600" role="alert">{errorMsg}</p>}
          {status === "done" && <p className="text-green-600">El documento ha sido cargado exitosamente. Puedes consultarlo en el chat a continuación.</p>}
        </div>
      </div>
    </section>
  );
}
