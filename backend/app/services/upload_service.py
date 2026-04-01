import os
import uuid
import aiofiles
from fastapi import UploadFile, HTTPException
from app.core.logger import logger

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Firmas digitales (Magic Numbers) para prevenir inyecciones binarias
MAGIC_NUMBERS = {
    "pdf": b"%PDF",
    "png": b"\x89PNG",
    "jpeg": b"\xff\xd8",
    "webp": b"RIFF"
}

async def validate_file_signature(content: bytes) -> bool:
    for signature in MAGIC_NUMBERS.values():
        if content.startswith(signature):
            return True
    return False

async def handle_file_upload(file: UploadFile) -> dict:
    file_id = str(uuid.uuid4())
    extension = os.path.splitext(file.filename)[1].lower()
    
    content = await file.read()
    
    # 1. Sanitización de Archivos PDF/Images
    if not await validate_file_signature(content):
        logger.warning(f"Violación de seguridad detectada. Firma inválida en {file.filename}")
        raise HTTPException(
            status_code=400, 
            detail="Fallo de seguridad: El archivo está corrupto o su formato fue adulterado maliciosamente."
        )
        
    saved_filename = f"{file_id}{extension}"
    file_path = os.path.join(UPLOAD_DIR, saved_filename)
    
    async with aiofiles.open(file_path, 'wb') as out_file:
        await out_file.write(content)
        
    logger.info(f"Archivo sanitizado y subido con éxito. ID: {file_id} | Size: {len(content)} bytes")
    
    return {
        "file_id": file_id,
        "filename": file.filename,
        "content_type": file.content_type,
        "path": file_path,
        "size": len(content)
    }
