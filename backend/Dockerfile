FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema requeridas para OCR y OpenCV
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-spa \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Render o PaaS suele asignar un PORT aleatorio externo.
ENV PORT=8000

# Usamos sh -c para expandir la variable al iniciar
CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"
