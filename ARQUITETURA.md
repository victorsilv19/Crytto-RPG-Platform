# Documento Técnico de Arquitetura — Crytto RPG Platform

## 1. Visão Geral

A Crytto RPG Platform é uma aplicação web para streaming e gerenciamento de sessões de RPG. A solução é composta por um frontend React (SPA) e um backend Node.js/Express com banco de dados Postgres, ambos containerizados e implantados no Google Cloud Run. O processo de integração e implantação é automatizado por uma pipeline de CI/CD utilizando GitHub Actions.

---

## 2. Arquitetura da Solução

```
┌─────────────────────────────────────────────────────────────┐
│                        USUÁRIO                              │
│                    (Navegador Web)                          │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│               GOOGLE CLOUD PLATFORM                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Google Cloud Run                        │   │
│  │                                                      │   │
│  │  ┌──────────────────┐    ┌──────────────────────┐   │   │
│  │  │   crytto-frontend │    │   crytto-backend      │   │   │
│  │  │   (nginx + React) │───▶│   (Node.js/Express)   │   │   │
│  │  │   Porta 80        │    │   Porta 3001          │   │   │
│  │  └──────────────────┘    └──────────┬───────────┘   │   │
│  │                                      │               │   │
│  └──────────────────────────────────────┼───────────────┘   │
│                                         │                   │
│  ┌──────────────────────────────────────▼───────────────┐   │
│  │          Postgres Gerenciado (Neon/Supabase)          │   │
│  │          Persistência externa ao Cloud Run            │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐   │
│  │         Google Container Registry (GCR)               │   │
│  │         Armazena as imagens Docker                    │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐   │
│  │            GitHub Actions (CI/CD)                     │   │
│  │  Build → Testes → Lint → Deploy automático           │   │
│  └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Componentes da Aplicação

### 3.1 Frontend (crytto-frontend)
- **Tecnologia:** React 18 + TypeScript + Vite + Tailwind CSS
- **Containerização:** Docker com build multi-stage (Node para build, nginx para servir)
- **Responsabilidade:** Interface do usuário, navegação entre telas, consumo da API REST

### 3.2 Backend (crytto-backend)
- **Tecnologia:** Node.js + Express
- **Banco de dados:** Postgres via driver `pg`, apontando para um serviço gerenciado (Neon ou Supabase). SSL habilitado por padrão em produção.
- **Responsabilidade:** API REST, regras de negócio, persistência de dados.

### 3.3 Banco de Dados (Postgres)
- **Tabelas:** `users`, `characters`, `marketplace_items`, `purchases`, `calendar_events`.
- **Colunas JSONB:** `banner_colors`, `settings`, `stats`, `skills`, `tags`, `images`, `players` — permitem evoluir o modelo sem migrações complexas.
- **Persistência:** externa ao Cloud Run — os containers podem ser recriados/escalados sem perda de dados.

---

## 4. Serviços Utilizados

| Serviço | Uso | Justificativa |
|---|---|---|
| **Google Cloud Run** | Hospedagem dos containers | Serverless, escala automática, HTTPS gerenciado, plano gratuito generoso. |
| **Google Container Registry (GCR)** | Armazenamento das imagens Docker | Integrado nativamente ao Cloud Run. |
| **Neon / Supabase (Postgres)** | Banco de dados gerenciado | Free tier, backups automáticos, persistência independente do Cloud Run. |
| **GitHub Actions (CI/CD)** | Pipeline de build, testes e deploy | Integração nativa com GitHub, sem custo para repositórios públicos, permite automação completa. |

---

## 5. Justificativa Técnica das Escolhas

### Por que Google Cloud Run?
- **Sem servidor para gerenciar:** deploy direto de imagem Docker.
- **Escala para zero:** sem tráfego = sem custo.
- **HTTPS automático:** certificado SSL provisionado automaticamente.
- **Plano gratuito generoso** (2 milhões de requisições/mês grátis).

### Por que Postgres gerenciado (Neon / Supabase)?
- **Persistência real:** o filesystem do Cloud Run é efêmero, então SQLite embarcado não serviria.
- **Free tier suficiente** para um projeto acadêmico com múltiplos usuários.
- **Suporte nativo a JSONB**, ideal para os campos flexíveis do modelo (settings, stats, tags).
- **SSL/TLS ponta a ponta** por padrão.

---

## 6. Fluxo de Comunicação

1. Usuário acessa a URL do **crytto-frontend** via HTTPS.
2. O nginx serve os arquivos estáticos do React.
3. O SPA gera/recupera um `crytto-user-id` anônimo no `localStorage` e chama `POST /api/users` para garantir o registro; depois hidrata perfil, saldo, personagens, itens do marketplace e agenda a partir da API.
4. Toda criação/edição/remoção (personagens, itens, eventos, perfil, saldo) chama a API REST do backend.
5. O backend valida, aplica a lógica de negócio (ex.: transação atômica de compra em `/api/marketplace/:id/purchase`) e persiste no Postgres.

---

## 7. Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/users/:id` | Busca dados do usuário |
| POST | `/api/users` | Cria/recupera usuário |
| PUT | `/api/users/:id` | Atualiza perfil |
| PUT | `/api/users/:id/balance` | Atualiza saldo de Crytts |
| GET | `/api/characters/:userId` | Lista personagens do usuário |
| POST | `/api/characters` | Cria personagem |
| PUT | `/api/characters/:id` | Atualiza personagem |
| DELETE | `/api/characters/:id` | Remove personagem |
| GET | `/api/marketplace` | Lista itens do marketplace |
| POST | `/api/marketplace` | Publica item |
| POST | `/api/marketplace/:id/purchase` | Compra item |
| GET | `/api/purchases/:userId` | Lista compras do usuário |
| GET | `/api/calendar/:userId` | Lista eventos do calendário |
| POST | `/api/calendar` | Cria evento |
| PUT | `/api/calendar/:id` | Atualiza evento |
| DELETE | `/api/calendar/:id` | Remove evento |
| GET | `/health` | Health check |

---

## 8. Aspectos de Segurança

- **HTTPS obrigatório:** Cloud Run provisiona SSL automaticamente
- **CORS configurado:** apenas origens autorizadas podem consumir a API
- **Sem dados sensíveis expostos:** nenhuma credencial no código-fonte
- **Variáveis de ambiente:** configurações sensíveis via Cloud Run environment variables
- **Limitação:** autenticação de usuários não implementada nesta versão (melhoria futura)

---

## 9. Limitações da Solução Atual

- Sem autenticação real — identidade do usuário é anexada a um UUID persistido no `localStorage`.
- Upload de arquivos ainda não está implementado (imagens por URL).
- Streams, chat ao vivo e ranking ainda usam dados mock (não fazem parte da persistência avaliada).

---

## 10. CI/CD (Integração Contínua e Deploy Contínuo)

A pipeline de CI/CD é implementada com **GitHub Actions** (veja `.github/workflows/ci-cd.yml`):

### Etapas da Pipeline
1. **Checkout do código** — obtém o código do repositório
2. **Instalação de dependências** — `npm ci` no frontend e backend
3. **Lint (qualidade)** — ESLint valida o código
4. **Testes automatizados** — Jest (backend) e Vitest (frontend)
5. **Build de produção** — Vite + Docker build
6. **CodeQL** — análise estática de segurança
7. **Deploy automático** — Google Cloud Run (apenas na branch `main`)
8. **Validação do deploy** — health check e HTTP 200

### Gatilhos
- `push` em `main` → build + testes + deploy
- `push` em `develop` → build + testes (sem deploy)
- `pull_request` → validação pré-merge

### Documentação completa
Veja [docs/PIPELINE-CICD.md](./docs/PIPELINE-CICD.md)

---

## 11. Melhorias Futuras

- Implementar autenticação com **Firebase Auth** ou **Google Identity Platform**.
- Adicionar **Cloud Storage** para upload de imagens e assets.
- Implementar **deploy canário (canary deployment)** no Cloud Run.
- Migrar para **Artifact Registry** (substituição do GCR).
- Migrar `DATABASE_URL` para o **Secret Manager** do GCP.
- Adicionar **Cloud CDN** para melhor performance global.
- Configurar **notificações de falhas** da pipeline (Slack/Discord).

---

## 12. Como Fazer o Deploy

### Pré-requisitos
1. Instalar [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
2. Instalar [Docker Desktop](https://www.docker.com/products/docker-desktop/)
3. Criar um projeto no [Google Cloud Console](https://console.cloud.google.com)
4. Provisionar um Postgres gerenciado gratuito (**Neon** ou **Supabase**) e copiar a `DATABASE_URL`.

### Deploy Automatizado (CI/CD)
O deploy é feito automaticamente pelo **GitHub Actions** ao fazer push na branch `main`.
Os secrets `GCP_SA_KEY` e `DATABASE_URL` devem estar configurados no repositório.

### Deploy Manual (Fallback)
```bash
# 1. Autenticar no Google Cloud
gcloud auth login
gcloud config set project SEU_PROJECT_ID

# 2. Habilitar APIs necessárias
gcloud services enable run.googleapis.com containerregistry.googleapis.com

# 3. Configurar Docker para usar o GCR
gcloud auth configure-docker

# 4. Exportar a connection string do Postgres
export DATABASE_URL="postgres://user:pass@host/db?sslmode=require"

# 5. Editar o PROJECT_ID no deploy.sh e executar
chmod +x deploy.sh
./deploy.sh
```

### Testar localmente antes do deploy
```bash
docker compose up --build
# Acesse http://localhost
```
