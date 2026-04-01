import os
from fastapi import APIRouter, File, UploadFile, HTTPException
from typing import Any
from app.services.upload_service import handle_file_upload

router = APIRouter()
MAX_FILE_SIZE = 10 * 1024 * 1024 # 10MB

@router.post("/", summary="Upload PDF or Image documents", response_description="File upload tracking ID and metadata")
async def upload_file(file: UploadFile = File(...)) -> Any:
    valid_types = ["application/pdf", "image/jpeg", "image/png", "image/webp"]
    if file.content_type not in valid_types:
        raise HTTPException(
            status_code=400, 
            detail=f"Tipo de archivo no soportado. Tipos permitidos: {', '.join(valid_types)}"
        )
    
    file_info = await handle_file_upload(file)
    
    if file_info["size"] > MAX_FILE_SIZE:
        # Prevent oversized files mapping abuse
        if os.path.exists(file_info["path"]):
            os.remove(file_info["path"])
        raise HTTPException(status_code=413, detail="El archivo sobrepasa el límite permitido de 10MB para extracción OCR.")
        
    return {"message": "Archivo cargado exitosamente", "data": file_info}
