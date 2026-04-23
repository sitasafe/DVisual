from pydantic import BaseModel, Field
from typing import Optional

class ProcessRequest(BaseModel):
    file_id: str
    extract_text: bool = True
    analyze_images: bool = False

class ProcessResponse(BaseModel):
    file_id: str
    status: str
    content: Optional[str] = None
    char_count: int = 0
    analysis_results: list[dict] = Field(default_factory=list)
    
class AskRequest(BaseModel):
    file_id: str
    question: str
    context: Optional[str] = None

class AskResponse(BaseModel):
    answer: str
    confidence: float
