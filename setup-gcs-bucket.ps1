# Cria (uma vez) o bucket do Cloud Storage usado para os avatares e libera as permissões necessárias.
# Pré-requisito: gcloud autenticado com permissão de admin no projeto.

$PROJECT_ID = "crytto-rpg-2026"
$REGION     = "us-central1"
$BUCKET     = "crytto-rpg-2026-avatars"   # precisa ser igual ao GCS_BUCKET_NAME do deploy.ps1

Write-Host "=== 1. Habilitando API do Cloud Storage ===" -ForegroundColor Cyan
gcloud services enable storage.googleapis.com --project $PROJECT_ID

Write-Host "`n=== 2. Criando bucket (acesso uniforme) ===" -ForegroundColor Cyan
gcloud storage buckets create "gs://$BUCKET" `
  --project $PROJECT_ID `
  --location $REGION `
  --uniform-bucket-level-access

Write-Host "`n=== 3. Leitura publica dos objetos (as imagens sao exibidas direto no navegador) ===" -ForegroundColor Cyan
gcloud storage buckets add-iam-policy-binding "gs://$BUCKET" `
  --member="allUsers" `
  --role="roles/storage.objectViewer"

Write-Host "`n=== 4. Permissao de escrita para a service account do Cloud Run (backend) ===" -ForegroundColor Cyan
$PROJECT_NUMBER = gcloud projects describe $PROJECT_ID --format="value(projectNumber)"
$RUN_SA = "$PROJECT_NUMBER-compute@developer.gserviceaccount.com"
gcloud storage buckets add-iam-policy-binding "gs://$BUCKET" `
  --member="serviceAccount:$RUN_SA" `
  --role="roles/storage.objectCreator"

Write-Host "`nOK! Bucket gs://$BUCKET pronto. Rode deploy.ps1 para publicar o backend com GCS_BUCKET_NAME." -ForegroundColor Green
