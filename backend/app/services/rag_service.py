import numpy as np
from app.core.logger import logger

class DocumentRAG:
    def __init__(self):
        self.chunks = []
        self._query_cache = {}

    def add_document(self, text: str, chunk_size: int = 400):
        if not text.strip(): 
            return
            
        # Invalida caché termporal
        self._query_cache.clear()
        
        words = text.split()
        added_chunks = 0
        for i in range(0, len(words), chunk_size):
            chunk = " ".join(words[i:i+chunk_size])
            if chunk.strip():
                self.chunks.append(chunk)
                added_chunks += 1
                
        logger.info(f"Se indexaron exitosamente {added_chunks} chunk(s) en modo DEMO (Ultra-ligero).")

    def search(self, query: str, top_k: int = 3) -> list:
        if not self.chunks: 
            return []
            
        # En el modo Demo Gratuito, simplemente devolvemos los primeros fragmentos
        # Esto evita cargar PyTorch en la memoria RAM y salva el servidor de colapsar
        return self.chunks[:top_k]

rag_store = DocumentRAG()
