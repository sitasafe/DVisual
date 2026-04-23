from app.schemas.document import AskResponse
from app.services.rag_service import rag_store

async def ask_question(file_id: str, question: str, context: str = None) -> AskResponse:
    # 1. Recuperar contexto semántico usando RAG (FAISS + SentenceTransformers)
    relevant_chunks = rag_store.search(question, top_k=3)
    rag_context = "\n".join(relevant_chunks)
    
    if not rag_context and not context:
        return AskResponse(
            answer="Lo siento, no he encontrado información en la base de datos (Vector DB) que coincida con la pregunta.",
            confidence=0.1
        )
        
    # 2. Generación simulada conectable a un LLM final
    generated_answer = (
        f"Al inspeccionar tu consulta: '{question}'...\n\n"
        f"**Contexto recabado por FAISS RAG**:\n{rag_context[:400]}...\n\n"
        f"**Respuesta Pedagógica e Inclusiva**:\nCon base en los extractos anteriores, "
        "la respuesta es positiva. Este es el espacio reservado para la inferencia del LLM."
    )

    return AskResponse(
        answer=generated_answer,
        confidence=0.92
    )
