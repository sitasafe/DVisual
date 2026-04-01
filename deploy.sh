#!/bin/bash
REPO_URL=$1

echo "======================================"
echo "🚀 DEPLOY AUTOMATIZADO 1-CLICK        "
echo "======================================"

if [ -z "$REPO_URL" ]; then
    echo "❌ Error: Debes proveer la URL del repositorio de origen."
    echo ">> Uso: ./deploy.sh <URL_GITHUB_REPO>"
    echo ">> Ejemplo: ./deploy.sh https://github.com/usuario/saas-multimodal.git"
    exit 1
fi

echo "Inicializando Git, consolidando código y enviando a pipeline (Render/Vercel)..."

# Reasegurar que los scripts del sistema sean legibles y ejecutables
chmod +x setup.sh run.sh deploy.sh 2>/dev/null

git init
git add .
git commit -m "init"
git branch -M main
git remote add origin $REPO_URL
git push -u origin main

echo "======================================"
echo "🎯 Código empujado hacia $REPO_URL exitosamente."
echo ">> Vercel y Render (Railway) deberían capturar los webhooks para desplegar el entorno completo."
echo "======================================"
