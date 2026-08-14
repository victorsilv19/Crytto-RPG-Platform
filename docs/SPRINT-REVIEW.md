# Relatório da Sprint Review

## Projeto: Crytto RPG Platform
### Sprint 2 — Pipeline CI/CD e Automação

---

## 1. Visão Geral da Sprint

| Item | Detalhe |
|---|---|
| **Sprint** | Sprint 2 |
| **Duração** | 2 semanas |
| **Objetivo** | Implementar pipeline CI/CD automatizada e evoluir a aplicação |
| **Resultado** | Pipeline GitHub Actions funcional com build, testes, lint, CodeQL e deploy automático no Google Cloud Run |

---

## 2. Funcionalidades Concluídas

### 2.1 Pipeline CI/CD (✅ Concluída)
- [x] Pipeline GitHub Actions com 4 jobs: `backend-build`, `frontend-build`, `code-quality`, `deploy`
- [x] Build automatizado do frontend (Vite) e backend (Node.js)
- [x] Instalação de dependências automatizada (`npm ci`)
- [x] Deploy automático no Google Cloud Run com validação de health check

### 2.2 Testes Automatizados (✅ Concluída)
- [x] **Backend (Jest + Supertest):** 14 testes cobrindo rotas da API
  - Health check
  - CRUD de usuários
  - Listagem e busca no marketplace
  - Compra de itens (fluxo completo com transação)
  - Criação de personagens
  - Criação de eventos de calendário
- [x] **Frontend (Vitest):** 13 testes cobrindo utilitários
  - Persistência de navegação (localStorage)
  - Armazenamento de personagens (CRUD)

### 2.3 Qualidade de Código (✅ Concluída)
- [x] ESLint configurado para backend e frontend
- [x] TypeScript ESLint para arquivos `.ts`/`.tsx`
- [x] Análise estática de segurança com **GitHub CodeQL**
- [x] ESLint configurado com regras para React Hooks e React Refresh

### 2.4 Deploy Automatizado (✅ Concluída)
- [x] Script `deploy.sh` e `deploy.ps1` mantidos como fallback manual
- [x] Pipeline automatizada com deploy via GitHub Actions
- [x] Versionamento de imagens Docker por SHA do commit
- [x] Validação automática pós-deploy (health check + HTTP 200)

### 2.5 Documentação (✅ Concluída)
- [x] `ARQUITETURA.md` atualizado
- [x] `docs/PIPELINE-CICD.md` criado (documentação completa da pipeline)
- [x] `README.md` atualizado com instruções

---

## 3. Funcionalidades Pendentes

| Funcionalidade | Status | Justificativa |
|---|---|---|
| Autenticação real (Firebase Auth) | ⏳ Pendente | Complexidade alta; priorizada para Sprint 3 |
| Upload de arquivos (Cloud Storage) | ⏳ Pendente | Depende de autenticação |
| Testes E2E (Playwright/Cypress) | ⏳ Pendente | Depende de ambiente de staging estável |
| Stream ao vivo real (WebRTC) | ⏳ Pendente | Funcionalidade complexa; requer infraestrutura dedicada |
| Chat em tempo real (WebSocket) | ⏳ Pendente | Depende de infraestrutura de streaming |
| Ranking do líder | ⏳ Pendente | Backend pronto, falta integração completa no frontend |
| Deploy em staging (branch develop) | ⏳ Pendente | Boa prática para Sprint 3 |

---

## 4. Retrospectiva da Sprint

### 4.1 O que funcionou bem ✅
- **Organização com Git/GitHub:** commits atômicos, branches e Pull Requests bem estruturados
- **Trabalho em equipe:** distribuição clara de tarefas no Kanban
- **Comunicação:** Daily Scrums regulares e atas de reunião registradas
- **Ambiente Docker:** facilidade de rodar a stack completa localmente
- **Documentação colaborativa:** ARQUITETURA.md e README sempre atualizados

### 4.2 O que poderia melhorar ⚠️
- **Cobertura de testes:** ainda abaixo de 80% no frontend — ampliar testes de componentes
- **Tempo de execução do build:** dependências do frontend são pesadas (~2min)
- **Processo de code review:** nem todos os PRs tiveram review de 2+ integrantes
- **Automação de tarefas repetitivas:** criação de templates de issue/PR

### 4.3 Lições aprendidas 📚
- Importância de validar o pipeline cedo, mesmo com código incompleto
- `npm ci` é mais confiável que `npm install` em ambientes CI
- Cobertura de testes reduz regressões quando o projeto cresce
- CodeQL detectou 1 vulnerabilidade de segurança que foi corrigida antes do deploy
- Docker multi-stage reduz significativamente o tamanho da imagem final

---

## 5. Principais Desafios Encontrados

1. **Configuração do Google Cloud:** criar a Service Account com permissões mínimas necessárias para o deploy
2. **CORS em produção:** o backend precisava da URL correta do frontend, resolvido com atualização automática via pipeline
3. **Dependências com peer conflicts:** o frontend exigia `--legacy-peer-deps` para instalar
4. **Testes do backend com Postgres:** necessário mockar o pool do `pg` para testar sem banco real
5. **Tempo de build:** otimizado com cache de dependências no GitHub Actions (`actions/setup-node` com cache)

---

## 6. Melhorias Planejadas para a Próxima Sprint

### Pipeline CI/CD
- [ ] Adicionar deploy em staging (branch `develop`)
- [ ] Substituir GCR por **Artifact Registry** (recomendação Google)
- [ ] Adicionar notificações em falhas (Slack/Discord)
- [ ] Implementar **canary deployment** no Cloud Run
- [ ] Gerar relatório de cobertura de código nos PRs

### Aplicação
- [ ] Implementar autenticação com **Firebase Auth**
- [ ] Upload de imagens com **Cloud Storage**
- [ ] Chat em tempo real com WebSocket
- [ ] Testes E2E com Playwright
- [ ] Migrar para **Google Secret Manager**

### Processo
- [ ] Criar template de Pull Request e Issue
- [ ] Definir regras de branch protection no GitHub
- [ ] Realizar code review obrigatório em todos os PRs
- [ ] Ampliar cobertura de testes para >80%

---

## 7. Próximos Passos

1. Iniciar Sprint 3 com foco em **autenticação**
2. Migrar secrets para **Google Secret Manager**
3. Implementar deploy em staging
4. Ampliar cobertura de testes de componentes do frontend
5. Integrar **Codecov** para visualizar cobertura nos PRs

---

## 8. Equipe

| Papel | Integrante |
|---|---|
| **Product Owner** | _[Preencher]_ |
| **Scrum Master** | _[Preencher]_ |
| **Desenvolvedor** | _[Preencher]_ |
| **Desenvolvedor** | _[Preencher]_ |
| **Desenvolvedor** | _[Preencher]_ |

---

## 9. Evidências

- **Kanban:** [Link do quadro Trello/Jira/GitHub Projects]
- **Repositório:** [Link do GitHub](https://github.com/victorsilv19/Crytto-RPG-Platform)
- **Pipeline (Actions):** [Link para Actions do repositório]
- **Aplicação em produção:** [Link do Cloud Run frontend]
- **Aplicação backend:** [Link do Cloud Run backend]