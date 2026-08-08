# Pessoa 1 — Backend & DevOps/Infra

Arquivos para commitar (mantendo a estrutura de pastas do repositório):

## Configuração raiz
- `.env.example` (modificado)
- `package.json` (modificado)
- `package-lock.json` (novo)
- `tsconfig.json` (novo)

## Documentação
- `README.md` (modificado)
- `ARQUITETURA.md` (modificado)

## Docker / Infra
- `Dockerfile` (modificado)
- `docker-compose.yml` (modificado)
- `nginx.conf` (modificado)
- `deploy.sh` (modificado)
- `deploy.ps1` (novo)

## Backend (Node)
- `backend/package.json` (modificado)
- `backend/src/index.js` (modificado)

## Como aplicar
1. Extraia o zip na raiz do repositório (sobrescrevendo os arquivos existentes).
2. Confira com `git status` / `git diff` antes de commitar.
3. Sugestão de commit: `chore(infra): atualiza docker, nginx, deploy e backend`.
