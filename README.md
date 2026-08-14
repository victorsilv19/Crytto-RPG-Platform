# Crytto RPG Platform

  Aplicação Web para streaming e gerenciamento de sessões de RPG. Frontend React (Vite + Tailwind) e backend Node.js/Express com Postgres, ambos containerizados e implantados no Google Cloud Run com pipeline CI/CD automatizada.

  ## Arquitetura resumida

  - **Frontend:** React 18 + TypeScript + Vite servido por nginx no Cloud Run.
  - **Backend:** Node.js/Express expondo API REST em `/api/*`.
  - **Banco:** Postgres gerenciado (Neon ou Supabase) — persistência real e independente do ciclo de vida dos containers.
  - **Deploy:** pipeline CI/CD com GitHub Actions → build, testes, lint, CodeQL e deploy automático no Cloud Run.

  Detalhes técnicos completos: [ARQUITETURA.md](./ARQUITETURA.md).

  ## CI/CD (Pipeline)

  A pipeline é automatizada com GitHub Actions. Ao fazer push na branch `main`, o fluxo executa:

  1. Checkout do código
  2. Instalação de dependências
  3. Lint (qualidade de código)
  4. Testes automatizados (Jest + Vitest)
  5. Build de produção (Vite + Docker)
  6. Análise estática de segurança (CodeQL)
  7. Deploy automático no Google Cloud Run
  8. Validação do deploy (health check)

  Documentação completa da pipeline: [docs/PIPELINE-CICD.md](./docs/PIPELINE-CICD.md)

  ## Testes

  ```bash
  # Testes do backend (Jest + Supertest)
  cd backend && npm install && npm test

  # Testes do frontend (Vitest)
  npm install && npm test
  ```

  ## Desenvolvimento local

  Toda a stack sobe com um comando (Postgres + backend + frontend):

  ```bash
  docker compose up --build
  ```

  Depois abra `http://localhost`. O nginx do frontend faz proxy de `/api/*` para o backend.

  Para rodar somente o frontend em modo dev (Vite):

  ```bash
  npm install
  npm run dev
  ```

  ## Deploy no Google Cloud Run

  ### Deploy Automatizado (CI/CD)
  O deploy é realizado automaticamente pelo **GitHub Actions** ao fazer push na branch `main`.
  Os secrets `GCP_SA_KEY` e `DATABASE_URL` devem estar configurados no repositório GitHub.

  ### Deploy Manual (Fallback)
  #### Pré-requisitos
  1. Instalar [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) e [Docker Desktop](https://www.docker.com/products/docker-desktop/).
  2. Criar um projeto no Google Cloud Console e habilitar as APIs Cloud Run e Container Registry.
  3. Provisionar um Postgres gerenciado gratuito (recomendado [Neon](https://neon.tech) ou [Supabase](https://supabase.com)) e copiar a connection string.

  #### Passos
  ```bash
  # 1. Autenticar
  gcloud auth login
  gcloud config set project SEU_PROJECT_ID
  gcloud auth configure-docker

  # 2. Habilitar APIs
  gcloud services enable run.googleapis.com containerregistry.googleapis.com

  # 3. Exportar a connection string do Postgres
  export DATABASE_URL="postgres://user:pass@host/db?sslmode=require"

  # 4. Editar o PROJECT_ID em deploy.sh e executar
  chmod +x deploy.sh
  ./deploy.sh
  ```

  Ao final o script imprime as URLs públicas do frontend e do backend. O frontend é buildado com `VITE_API_URL` apontando para a URL do backend; o CORS do backend é restringido para a URL do frontend automaticamente.

  ## Variáveis de ambiente

  Ver [.env.example](./.env.example).

  | Variável | Onde | Descrição |
  |---|---|---|
  | `VITE_API_URL` | Frontend (build) | URL do backend. Vazio = mesma origem (proxy nginx). |
  | `PORT` | Backend | Porta HTTP (Cloud Run injeta automaticamente). |
  | `DATABASE_URL` | Backend | Connection string do Postgres. |
  | `PGSSL` | Backend | `false` desativa TLS (útil para Postgres local). |
  | `FRONTEND_URL` | Backend | Origem permitida no CORS em produção. |

  ## Documentação da entrega

  - [ARQUITETURA.md](./ARQUITETURA.md) — Documento técnico de arquitetura
  - [docs/PIPELINE-CICD.md](./docs/PIPELINE-CICD.md) — Documentação da Pipeline CI/CD
  - [docs/SPRINT-REVIEW.md](./docs/SPRINT-REVIEW.md) — Relatório da Sprint Review
  - [docs/PO-SM-ATUACAO.md](./docs/PO-SM-ATUACAO.md) — Atuação do PO e Scrum Master