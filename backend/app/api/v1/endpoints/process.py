from fastapi import APIRouter, HTTPException
from app.schemas.document import ProcessRequest, ProcessResponse
from app.services.document_service import process_document

router = APIRouter()

@router.post("/", response_model=ProcessResponse, summary="Process an uploaded document (OCR/Text Extract)")
async def process_file(request: ProcessRequest):
    try:
        result = await process_document(request.file_id, request.extract_text, request.analyze_images)
        return result
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado al procesar el documento: {str(e)}")
