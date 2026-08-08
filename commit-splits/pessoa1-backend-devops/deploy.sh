#!/bin/bash
# deploy.sh - Script de deploy para Google Cloud Run
# Pré-requisitos:
#   - gcloud CLI instalado e autenticado
#   - DATABASE_URL exportado no seu shell apontando para um Postgres gerenciado (Neon/Supabase)
#     Ex.: export DATABASE_URL="postgres://user:pass@host/db?sslmode=require"

set -e

PROJECT_ID="crytto-rpg-2026"        # Project ID do GCP
REGION="us-central1"
BACKEND_IMAGE="gcr.io/$PROJECT_ID/crytto-backend"
FRONTEND_IMAGE="gcr.io/$PROJECT_ID/crytto-frontend"

if [ -z "$DATABASE_URL" ]; then
  echo "ERRO: exporte DATABASE_URL antes de rodar. Ex.: export DATABASE_URL='postgres://...'"
  exit 1
fi

echo "=== Build e push do Backend ==="
docker build -t $BACKEND_IMAGE ./backend
docker push $BACKEND_IMAGE

echo "=== Deploy do Backend no Cloud Run ==="
gcloud run deploy crytto-backend \
  --image $BACKEND_IMAGE \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 3001 \
  --memory 512Mi \
  --set-env-vars "DATABASE_URL=$DATABASE_URL" \
  --project $PROJECT_ID

# Pega a URL do backend gerada pelo Cloud Run
BACKEND_URL=$(gcloud run services describe crytto-backend \
  --platform managed \
  --region $REGION \
  --format 'value(status.url)' \
  --project $PROJECT_ID)

echo "Backend URL: $BACKEND_URL"

echo "=== Build e push do Frontend ==="
docker build \
  --build-arg VITE_API_URL=$BACKEND_URL \
  -t $FRONTEND_IMAGE .
docker push $FRONTEND_IMAGE

echo "=== Deploy do Frontend no Cloud Run ==="
gcloud run deploy crytto-frontend \
  --image $FRONTEND_IMAGE \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 80 \
  --memory 256Mi \
  --project $PROJECT_ID

FRONTEND_URL=$(gcloud run services describe crytto-frontend \
  --platform managed \
  --region $REGION \
  --format 'value(status.url)' \
  --project $PROJECT_ID)

# Atualiza o backend com a URL do frontend para restringir CORS
echo "=== Restringindo CORS do backend para $FRONTEND_URL ==="
gcloud run services update crytto-backend \
  --region $REGION \
  --update-env-vars "FRONTEND_URL=$FRONTEND_URL" \
  --project $PROJECT_ID

echo ""
echo "=== Deploy concluído! ==="
echo "Frontend: $FRONTEND_URL"
echo "Backend:  $BACKEND_URL"
