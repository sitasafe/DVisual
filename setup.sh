#!/bin/bash
echo "🚀 Configurando Entorno de Desarrollo SaaS Multimodal..."

# 1. Configurar Backend
echo "📦 Configurando Backend (Python)..."
cd backend
python -m venv venv
# Activar según OS (Windows Bash/WSL/Linux/Mac)
if [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi
pip install --upgrade pip
pip install -r requirements.txt
cd ..

# 2. Configurar Frontend
echo "📦 Configurando Frontend (Node)..."
cd frontend
npm install
cd ..

# 3. Copiar envs
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "📄 Se ha creado un archivo .env desde el template de ejemplo."
fi

echo "✅ Configuración inicial completada con éxito."
