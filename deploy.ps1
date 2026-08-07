# deploy.ps1 - Deploy para Google Cloud Run (Windows / PowerShell)
# Pre-requisitos:
#   - gcloud CLI instalado e autenticado (gcloud auth login)
#   - Docker Desktop rodando
#   - Variavel de ambiente DATABASE_URL apontando para um Postgres gerenciado (Neon/Supabase)
#     Ex.: $env:DATABASE_URL = "postgres://user:pass@host/db?sslmode=require"

$ErrorActionPreference = "Stop"

$PROJECT_ID     = "crytto-rpg-2026"
$REGION         = "us-central1"
$BACKEND_IMAGE  = "gcr.io/$PROJECT_ID/crytto-backend"
$FRONTEND_IMAGE = "gcr.io/$PROJECT_ID/crytto-frontend"

if ([string]::IsNullOrEmpty($env:DATABASE_URL)) {
    Write-Error "ERRO: defina DATABASE_URL antes de rodar. Ex.: `$env:DATABASE_URL = 'postgres://...'"
    exit 1
}

Write-Host "=== Build e push do Backend ===" -ForegroundColor Cyan
docker build -t $BACKEND_IMAGE ./backend
docker push $BACKEND_IMAGE

Write-Host "=== Deploy do Backend no Cloud Run ===" -ForegroundColor Cyan
gcloud run deploy crytto-backend `
  --image $BACKEND_IMAGE `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --port 3001 `
  --memory 512Mi `
  --set-env-vars "DATABASE_URL=$env:DATABASE_URL" `
  --project $PROJECT_ID

$BACKEND_URL = gcloud run services describe crytto-backend `
  --platform managed `
  --region $REGION `
  --format 'value(status.url)' `
  --project $PROJECT_ID

Write-Host "Backend URL: $BACKEND_URL" -ForegroundColor Green

Write-Host "=== Build e push do Frontend ===" -ForegroundColor Cyan
docker build --build-arg VITE_API_URL=$BACKEND_URL -t $FRONTEND_IMAGE .
docker push $FRONTEND_IMAGE

Write-Host "=== Deploy do Frontend no Cloud Run ===" -ForegroundColor Cyan
gcloud run deploy crytto-frontend `
  --image $FRONTEND_IMAGE `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --port 80 `
  --memory 256Mi `
  --project $PROJECT_ID

$FRONTEND_URL = gcloud run services describe crytto-frontend `
  --platform managed `
  --region $REGION `
  --format 'value(status.url)' `
  --project $PROJECT_ID

Write-Host "=== Restringindo CORS do backend para $FRONTEND_URL ===" -ForegroundColor Cyan
gcloud run services update crytto-backend `
  --region $REGION `
  --update-env-vars "FRONTEND_URL=$FRONTEND_URL" `
  --project $PROJECT_ID

Write-Host ""
Write-Host "=== Deploy concluido! ===" -ForegroundColor Green
Write-Host "Frontend: $FRONTEND_URL"
Write-Host "Backend:  $BACKEND_URL"
