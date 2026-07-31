#!/bin/bash
# deploy.sh - Script de deploy para Google Cloud Run
# Pré-requisitos: gcloud CLI instalado e autenticado

PROJECT_ID="seu-project-id"        # <-- substitua pelo seu Project ID do GCP
REGION="us-central1"
BACKEND_IMAGE="gcr.io/$PROJECT_ID/crytto-backend"
FRONTEND_IMAGE="gcr.io/$PROJECT_ID/crytto-frontend"

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
  --project $PROJECT_ID

# Pega a URL do backend gerada pelo Cloud Run
BACKEND_URL=$(gcloud run services describe crytto-backend \
  --platform managed \
  --region $REGION \
  --format 'value(status.url)' \
  --project $PROJECT_ID)

echo "Backend URL: $BACKEND_URL"

echo "=== Build e push do Frontend ==="
# Injeta a URL do backend no build do frontend
VITE_API_URL=$BACKEND_URL docker build \
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

echo ""
echo "=== Deploy concluído! ==="
echo "Frontend: $FRONTEND_URL"
echo "Backend:  $BACKEND_URL"
