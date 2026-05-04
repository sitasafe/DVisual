import fitz  # PyMuPDF
import io
from PIL import Image
import logging

logger = logging.getLogger(__name__)

def extract_pdf_content(file_path: str, max_images: int = 3) -> dict:
    """Extrae el texto y un número limitado de imágenes de un PDF para evitar OOM (Out Of Memory) en Render"""
    try:
        doc = fitz.open(file_path)
    except Exception as e:
        logger.error(f"Error opening PDF {file_path}: {e}")
        return {"text": "", "images": []}

    text_content = []
    images = []
    images_extracted = 0
    
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text_content.append(page.get_text())
        
        # Extracción de imágenes en la página actual (Limitado)
        if images_extracted < max_images:
            image_list = page.get_images(full=True)
            for img_index, img in enumerate(image_list):
                if images_extracted >= max_images:
                    break
                    
                xref = img[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                
                try:
                    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
                    # Downscale if image is too large to save memory
                    if image.width > 1200 or image.height > 1200:
                        image.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
                        
                    images.append(image)
                    images_extracted += 1
                except Exception as e:
                    logger.error(f"Error procesando imagen {xref} en página {page_num}: {e}")
            
    doc.close()
    return {"text": "\n".join(text_content), "images": images}
