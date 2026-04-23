import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from app.core.logger import logger

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
dimension = embedding_model.get_sentence_embedding_dimension()

class DocumentRAG:
    def __init__(self):
        self.index = faiss.IndexFlatL2(dimension)
        self.chunks = []
        self._query_cache = {}

    def add_document(self, text: str, chunk_size: int = 400):
        if not text.strip(): 
            return
            
        # Invalida caché termporal del RAG ante nuevos documentos
        self._query_cache.clear()
        logger.info("Caché FAISS RAG invalidado.")
        
        words = text.split()
        added_chunks = 0
        for i in range(0, len(words), chunk_size):
            chunk = " ".join(words[i:i+chunk_size])
            if chunk.strip():
                vector = embedding_model.encode([chunk])
                self.index.add(np.array(vector, dtype=np.float32))
                self.chunks.append(chunk)
                added_chunks += 1
                
        logger.info(f"Se vectorizaron exitosamente {added_chunks} chunk(s) al índice RAG.")

    def search(self, query: str, top_k: int = 3) -> list:
        if self.index.ntotal == 0: 
            return []
            
        cache_key = f"{query}_{top_k}"
        # 1. Caché Básica para Mitigar Latencia Redundante
        if cache_key in self._query_cache:
            logger.info(f"HIT en RAG Caché para consulta: '{query[:20]}...'")
            return self._query_cache[cache_key]
            
        logger.info(f"MISS en RAG Caché. Calculando embeddings para '{query[:20]}...'")
        query_vector = embedding_model.encode([query])
        distances, indices = self.index.search(np.array(query_vector, dtype=np.float32), top_k)
        
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx < len(self.chunks):
                results.append(self.chunks[idx])
                
        self._query_cache[cache_key] = results
        return results

rag_store = DocumentRAG()
