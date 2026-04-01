import fitz  # PyMuPDF
import io
from PIL import Image

def extract_pdf_content(file_path: str) -> dict:
    """Extrae el texto y las imágenes de un PDF"""
    doc = fitz.open(file_path)
    text_content = []
    images = []
    
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text_content.append(page.get_text())
        
        # Extracción de imágenes en la página actual
        image_list = page.get_images(full=True)
        for img_index, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image = Image.open(io.BytesIO(image_bytes))
            images.append(image)
            
    return {"text": "\n".join(text_content), "images": images}
