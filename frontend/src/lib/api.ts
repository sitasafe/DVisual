const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

async function fetchWithErrorHandling(url: string, options: RequestInit) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {
        throw new Error(`Error del servidor (${res.status}): ${res.statusText}`);
      }
      throw new Error(errorData.detail || `Error en la petición: ${res.status}`);
    }
    return await res.json();
  } catch (error: any) {
    console.error(`API Error en ${url}:`, error);
    throw new Error(error.message || "Error de red o servidor inalcanzable.");
  }
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return fetchWithErrorHandling(`${API_URL}/upload/`, { 
      method: "POST", 
      body: formData 
  });
}

export async function processDocument(fileId: string, extractText = true, analyzeImages = true) {
  return fetchWithErrorHandling(`${API_URL}/process/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_id: fileId, extract_text: extractText, analyze_images: analyzeImages }),
  });
}

export async function askQuestion(fileId: string, question: string) {
  return fetchWithErrorHandling(`${API_URL}/ask/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_id: fileId, question }),
  });
}
