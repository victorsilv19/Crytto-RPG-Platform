const { Storage } = require("@google-cloud/storage");

// Em produção (Cloud Run) a autenticação usa a service account do próprio serviço
// (Application Default Credentials). Em dev local há duas opções:
//  - GOOGLE_APPLICATION_CREDENTIALS apontando para uma chave JSON (bucket real), ou
//  - GCS_EMULATOR_HOST apontando para o fake-gcs-server do docker-compose (demo offline).
// Sem GCS_BUCKET_NAME o upload fica desabilitado, sem quebrar o resto da API.
const emulatorHost = process.env.GCS_EMULATOR_HOST || "";
const storage = new Storage(emulatorHost ? { apiEndpoint: emulatorHost, projectId: "crytto-local" } : {});
const bucketName = process.env.GCS_BUCKET_NAME || "";

// Base das URLs devolvidas ao navegador. No emulador o host interno (fake-gcs:4443)
// não é alcançável pelo browser, então a URL pública é configurável.
const publicBaseUrl = (process.env.GCS_PUBLIC_BASE_URL || "https://storage.googleapis.com").replace(/\/$/, "");

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function isStorageConfigured() {
  return Boolean(bucketName);
}

function isEmulator() {
  return Boolean(emulatorHost);
}

function publicUrlFor(objectName) {
  return `${publicBaseUrl}/${bucketName}/${objectName}`;
}

// No emulador o bucket não existe até ser criado; em produção ele é provisionado
// por setup-gcs-bucket.ps1 e a service account só precisa gravar objetos.
async function ensureBucket() {
  if (!isStorageConfigured() || !isEmulator()) return;
  const [exists] = await storage.bucket(bucketName).exists();
  if (!exists) {
    await storage.createBucket(bucketName);
    console.log(`[storage] bucket '${bucketName}' criado no emulador`);
  }
}

function extensionFor(mimetype) {
  switch (mimetype) {
    case "image/jpeg": return "jpg";
    case "image/png": return "png";
    case "image/webp": return "webp";
    case "image/gif": return "gif";
    default: return "bin";
  }
}

/**
 * Sobe a imagem de avatar para o bucket do Cloud Storage e devolve a URL pública do objeto.
 * @param {Buffer} buffer conteúdo do arquivo
 * @param {string} mimetype content-type enviado pelo cliente
 * @param {string} userId usado para nomear o objeto (ex.: avatars/<userId>-<timestamp>.png)
 */
async function uploadAvatar(buffer, mimetype, userId) {
  if (!isStorageConfigured()) {
    throw new Error("GCS_BUCKET_NAME não configurado no backend");
  }
  if (!ALLOWED_MIME_TYPES.has(mimetype)) {
    throw new Error("Formato de imagem não suportado (use JPEG, PNG, WEBP ou GIF)");
  }

  const safeUserId = String(userId).replace(/[^a-zA-Z0-9_-]/g, "_");
  const objectName = `avatars/${safeUserId}-${Date.now()}.${extensionFor(mimetype)}`;
  const file = storage.bucket(bucketName).file(objectName);

  await file.save(buffer, {
    resumable: false, // arquivos pequenos (≤5MB): upload simples, uma única requisição
    contentType: mimetype,
    metadata: { contentType: mimetype, cacheControl: "public, max-age=31536000" },
  });

  return publicUrlFor(objectName);
}

/** Lista os objetos do bucket (usado na demonstração para mostrar o que está no Cloud Storage). */
async function listAvatars() {
  if (!isStorageConfigured()) {
    throw new Error("GCS_BUCKET_NAME não configurado no backend");
  }
  const [files] = await storage.bucket(bucketName).getFiles({ prefix: "avatars/" });
  return files.map((f) => ({
    name: f.name,
    size: Number(f.metadata.size || 0),
    contentType: f.metadata.contentType,
    updated: f.metadata.updated,
    url: publicUrlFor(f.name),
  }));
}

module.exports = { uploadAvatar, listAvatars, ensureBucket, isStorageConfigured, isEmulator };
