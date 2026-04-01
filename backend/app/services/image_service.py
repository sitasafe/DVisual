import cv2
import numpy as np
import pytesseract
from PIL import Image

def process_image_cv(image: Image.Image) -> np.ndarray:
    """Procesamiento base usando OpenCV"""
    # Convertir PIL Image a OpenCV Array
    cv_img = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    # Convertir a escala de grises
    gray = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
    return gray

def extract_text_from_image(image: Image.Image) -> str:
    """Extraer texto usando Tesseract OCR"""
    gray_img = process_image_cv(image)
    text = pytesseract.image_to_string(gray_img, lang="spa+eng")
    return text.strip()

def interpretar_grafico(image: Image.Image) -> dict:
    """
    Simulación de Multimodal AI sobre imagen de gráficos.
    Retorna análisis estructurado bajo criterios de accesibilidad.
    """
    ocr_text = extract_text_from_image(image)
    
    # Aquí se conectaría la LLM Vision / Multimodal (p. ej. GPT-4V, LLaVA interactiva)
    # Por ahora, generamos la estructura obligatoria de salida solicitada:
    return {
        "tipo_grafico": "Detectado: Gráfico de Barras / Lineal (Simulado)",
        "variables": ["X: Periodo (Tiempo)", "Y: Métricas Financieras/Impacto"],
        "tendencias": "La información sugiere una tendencia de crecimiento constante hacia los últimos meses observados.",
        "insight": "El aumento sostenido indica una recepción positiva en la tracción del objetivo primario.",
        "explicacion_pedagogica": (
            "Imagina este gráfico como una escalera. Cada escalón es un periodo de tiempo. "
            "En lugar de que cada escalón mida lo mismo, los últimos escalones son más altos, "
            "lo que indica que hemos subido más rápido de lo esperado."
            f"\nNota técnica (OCR de soporte): {ocr_text[:80] if ocr_text else 'Texto no legible'}"
        )
    }
