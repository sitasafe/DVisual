#!/bin/bash
echo "🔥 Iniciando entornos locales (Frontend y Backend)..."

# Detener los procesos al salir
trap "kill 0" SIGINT

# 1. Ejecutar Backend
echo ">> Iniciando FastAPI (Backend)..."
(
    cd backend
    if [ -f "venv/Scripts/activate" ]; then
        source venv/Scripts/activate
    else
        source venv/bin/activate
    fi
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
) &
PID_BACKEND=$!

# 2. Ejecutar Frontend
echo ">> Iniciando Next.js (Frontend)..."
(
    cd frontend
    npm run dev
) &
PID_FRONTEND=$!

echo "✅ Backend ejecutándose en: http://localhost:8000/docs"
echo "✅ Frontend ejecutándose en: http://localhost:3000"
echo "--- Presiona Ctrl+C para finalizar ambos servicios ---"

wait
