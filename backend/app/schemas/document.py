from pydantic import BaseModel
from typing import Optional

class ProcessRequest(BaseModel):
    file_id: str
    extract_text: bool = True
    analyze_images: bool = False

class ProcessResponse(BaseModel):
    file_id: str
    status: str
    content: Optional[str] = None
    
class AskRequest(BaseModel):
    file_id: str
    question: str
    context: Optional[str] = None

class AskResponse(BaseModel):
    answer: str
    confidence: float
