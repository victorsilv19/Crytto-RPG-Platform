# Documentação da Pipeline CI/CD

## 1. Visão Geral

A Crytto RPG Platform utiliza **GitHub Actions** como ferramenta de CI/CD para automatizar o processo de **build, validação, testes, análise de qualidade e deploy** da aplicação no Google Cloud Run.

A pipeline é executada automaticamente a cada `push` ou `pull request` nas branches `main` e `develop`.

---

## 2. Ferramenta Utilizada

| Item | Detalhe |
|---|---|
| **Ferramenta CI/CD** | GitHub Actions |
| **Cloud Provider** | Google Cloud Platform (Cloud Run) |
| **Container Registry** | Google Container Registry (GCR) |
| **Banco de Dados** | Postgres gerenciado (Neon/Supabase) |
| **Repositório** | GitHub |

---

## 3. Arquitetura da Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                    GITHUB ACTIONS (CI/CD)                           │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────────┐   │
│  │ backend-build │  │ frontend-build│  │     code-quality       │   │
│  │              │  │              │  │     (CodeQL)            │   │
│  │ • Checkout   │  │ • Checkout   │  │ • Análise estática      │   │
│  │ • npm ci     │  │ • npm ci     │  │ • Varredura de          │   │
│  │ • lint       │  │ • lint       │  │   segurança             │   │
│  │ • test       │  │ • test       │  │                        │   │
│  │ • docker     │  │ • build      │  │                        │   │
│  │   build      │  │ • docker     │  │                        │   │
│  └──────┬───────┘  │   build      │  └──────────┬──────────────┘   │
│         │          └──────┬───────┘             │                   │
│         └──────────────────┼────────────────────┘                   │
│                            ▼                                        │
│                    ┌──────────────┐                                 │
│                    │   deploy     │                                 │
│                    │  (só main)   │                                 │
│                    └──────┬───────┘                                 │
└───────────────────────────┼─────────────────────────────────────────┘
                            ▼
              ┌─────────────────────────┐
              │   GOOGLE CLOUD RUN      │
              │  • crytto-backend       │
              │  • crytto-frontend      │
              └─────────────────────────┘
```

---

## 4. Fluxo de Execução

### Etapa 1: Checkout do código
- O GitHub Actions faz o `checkout` do repositório na branch em que o evento ocorreu.

### Etapa 2: Instalação de dependências
- **Backend:** `npm ci` na pasta `backend/`
- **Frontend:** `npm ci` na raiz (com `--legacy-peer-deps`)

### Etapa 3: Qualidade de código (Lint)
- **Backend:** `npm run lint` (ESLint)
- **Frontend:** `npm run lint` (ESLint + TypeScript ESLint)

### Etapa 4: Testes automatizados
- **Backend:** `npm test` (Jest + Supertest, 14 testes)
- **Frontend:** `npm test` (Vitest, 13 testes)

### Etapa 5: Build de produção
- **Backend:** build da imagem Docker
- **Frontend:** `npm run build` (Vite) + build da imagem Docker

### Etapa 6: Análise estática de segurança
- **CodeQL:** varredura de vulnerabilidades no código JavaScript/TypeScript

### Etapa 7: Deploy automático (apenas na branch `main`)
1. Autentica no Google Cloud via Service Account (`GCP_SA_KEY`)
2. Build e push das imagens Docker para o GCR (com tag do commit SHA)
3. Deploy do backend no Cloud Run (`crytto-backend`)
4. Deploy do frontend no Cloud Run (`crytto-frontend`) com `VITE_API_URL` apontando para a URL do backend
5. Atualiza o CORS do backend com a URL do frontend
6. **Validação do deploy:** health check no backend (`/health`) e verificação HTTP 200 no frontend

---

## 5. Gatilhos (Triggers)

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  workflow_dispatch:   # Execução manual pelo botão "Run workflow"
```

| Gatilho | Branch | Ação |
|---|---|---|
| `push` | `main` | Build + Testes + Deploy |
| `push` | `develop` | Build + Testes (sem deploy) |
| `pull_request` | `main` | Build + Testes (validação pré-merge) |
| `pull_request` | `develop` | Build + Testes (validação pré-merge) |
| `workflow_dispatch` | qualquer | Execução manual |

---

## 6. Estratégia de Deploy

### Imagens Docker
- **Backend:** `gcr.io/crytto-rpg-2026/crytto-backend:{sha}`
- **Frontend:** `gcr.io/crytto-rpg-2026/crytto-frontend:{sha}`

Cada build recebe o SHA do commit como tag, permitindo **rollback** rápido para qualquer versão anterior.

### Cloud Run
O deploy é feito com `gcloud run deploy`, configurando:
- **Backend:** porta `3001`, memória `512Mi`, variável `DATABASE_URL` (do Secret do GitHub)
- **Frontend:** porta `80`, memória `256Mi`, variável `VITE_API_URL` (URL do backend gerada automaticamente)

### Validação do Deploy
1. `sleep 15` para aguardar o serviço ficar ativo
2. `curl` no `/health` do backend — espera `{ status: "ok", db: "up" }`
3. `curl` no frontend — espera HTTP 200

Se qualquer validação falhar, a pipeline é **interrompida automaticamente** (exit 1).

---

## 7. Variáveis e Secrets Necessários

| Secret/Variável | Onde | Descrição |
|---|---|---|
| `GCP_SA_KEY` | GitHub Secret | JSON da Service Account do GCP com permissão de deploy |
| `DATABASE_URL` | GitHub Secret | Connection string do Postgres gerenciado |
| `PROJECT_ID` | Workflow env | `crytto-rpg-2026` |
| `REGION` | Workflow env | `us-central1` |

---

## 8. Tratamento de Falhas

- **Falha no lint:** pipeline interrompida — problema de qualidade de código
- **Falha nos testes:** pipeline interrompida — regressão de funcionalidade
- **Falha no build:** pipeline interrompida — erro de compilação
- **Falha no deploy:** pipeline interrompida — rollback manual via Cloud Run console
- **Falha no health check:** deploy marcado como falha — permite rollback

Toda falha gera **notificação no GitHub** (status do commit/PR fica vermelho) e o histórico de execução fica disponível na aba **Actions**.

---

## 9. Boas Práticas DevOps Adotadas

1. **Infraestrutura como Código (IaC):** Dockerfiles e docker-compose versionados no Git
2. **CI/CD automatizado:** nenhum passo manual de build/deploy
3. **Validação em múltiplas camadas:** lint → testes → build → análise de segurança → deploy → health check
4. **Versionamento de imagens:** tag SHA do commit permite rollback rápido
5. **Segurança:** secrets armazenados no GitHub (nunca no código-fonte)
6. **Estratégia de branches:** `main` (produção) + `develop` (integração) + Pull Requests
7. **Execução manual:** `workflow_dispatch` permite disparo manual para demonstração
8. **Ambientes separados:** deploy apenas na branch `main`; `develop` é validada sem deploy

---

## 10. Evidências de Execução

### Como visualizar o histórico de builds
1. Acesse o repositório no GitHub
2. Clique na aba **Actions**
3. Selecione o workflow **"CI/CD Pipeline"**
4. Clique em qualquer execução para ver:
   - Tempo de execução de cada job
   - Logs detalhados de cada step
   - Status de sucesso/falha
   - Artefatos gerados

### Execuções típicas
| Branch | Evento | Jobs executados | Deploy |
|---|---|---|---|
| `main` | push | backend-build, frontend-build, code-quality, deploy | ✅ Sim |
| `develop` | push | backend-build, frontend-build, code-quality | ❌ Não |
| `main` | PR | backend-build, frontend-build, code-quality | ❌ Não |
| qualquer | manual | backend-build, frontend-build, code-quality | ❌ Não |

---

## 11. Melhorias Futuras

- [ ] Adicionar testes de integração E2E (Playwright/Cypress)
- [ ] Substituir GCR por **Artifact Registry**
- [ ] Adicionar deploy em staging (branch `develop`) antes de produção
- [ ] Implementar **canary deployment** no Cloud Run
- [ ] Migrar secrets para **Google Secret Manager**
- [ ] Adicionar **Slack/Discord notifications** em falhas
- [ ] Gerar relatório de cobertura de código no PR (Codecov)