import os
import json
from PIL import Image
from app.schemas.document import ProcessResponse
from app.services.pdf_service import extract_pdf_content
from app.services.image_service import extract_text_from_image, interpretar_grafico
from app.services.rag_service import rag_store

async def process_document(file_id: str, extract_text: bool, analyze_images: bool) -> ProcessResponse:
    upload_dir = "uploads"
    file_path = None
    
    if not os.path.exists(upload_dir):
        raise FileNotFoundError("Directory not found")
        
    for f in os.listdir(upload_dir):
        if f.startswith(file_id):
            file_path = os.path.join(upload_dir, f)
            break
            
    if not file_path:
        raise FileNotFoundError(f"El archivo con ID {file_id} no existe en servidor.")

    parsed_text = ""
    analysis_results = []

    if file_path.lower().endswith(".pdf"):
        pdf_data = extract_pdf_content(file_path)
        parsed_text = pdf_data["text"]
        
        if analyze_images and pdf_data.get("images"):
            for img in pdf_data["images"]:
                analysis = interpretar_grafico(img)
                analysis_results.append(analysis)
                
    elif file_path.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
        img = Image.open(file_path)
        if extract_text:
            parsed_text = extract_text_from_image(img)
        if analyze_images:
            analysis_results.append(interpretar_grafico(img))
            
    # Indexar en FAISS (RAG Vector DB)
    if extract_text and parsed_text:
        rag_store.add_document(parsed_text)
        
    # Formatear la salida textual
    final_output = f"Longitud de texto indexado en Vector DB: {len(parsed_text)} chars.\n\n"
    if analysis_results:
        final_output += "Resultados del Análisis de Imágenes / Gráficos:\n"
        for i, res in enumerate(analysis_results):
            final_output += f"--- Gráfico {i+1} ---\n{json.dumps(res, indent=2, ensure_ascii=False)}\n\n"

    return ProcessResponse(
        file_id=file_id,
        status="success",
        content=final_output
    )
