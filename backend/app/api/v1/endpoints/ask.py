from fastapi import APIRouter, HTTPException
from app.schemas.document import AskRequest, AskResponse
from app.services.ai_service import ask_question

router = APIRouter()

@router.post("/", response_model=AskResponse, summary="Ask multimodal questions about the document")
async def ask_endpoint(request: AskRequest):
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="La pregunta de origen no puede estar vacía.")
        
    try:
        answer = await ask_question(request.file_id, request.question, request.context)
        return answer
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fallo al procesar la respuesta AI/RAG: {str(e)}")
