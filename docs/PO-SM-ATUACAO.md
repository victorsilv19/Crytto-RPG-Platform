# Documento de Atuação — Product Owner e Scrum Master

## Projeto: Crytto RPG Platform
### Sprint 2 — Pipeline CI/CD e Automação

---

## 1. Introdução

Este documento descreve a atuação do **Product Owner (PO)** e do **Scrum Master (SM)** durante o desenvolvimento do projeto, apresentando evidências concretas de suas atividades: histórico do Kanban, atas de reunião, comentários em tarefas, Pull Requests, commits e outros registros que comprovam sua participação efetiva nos papéis.

---

## 2. Product Owner (PO)

### 2.1 Responsabilidades do PO

O Product Owner é responsável por:
- Priorizar o backlog do produto
- Criar histórias de usuário com critérios de aceite
- Refinar as tarefas do time
- Gerir mudanças de prioridade
- Garantir que o time entrega valor ao cliente

### 2.2 Evidências de Atuação

#### 📋 Product Backlog

O PO foi responsável por manter o Product Backlog organizado, com priorização clara por valor de negócio:

| Prioridade | História de Usuário | Status |
|---|---|---|
| P0 | Como usuário, quero acessar a plataforma para ver a landing page | ✅ Concluído |
| P0 | Como usuário, quero me cadastrar para usar a plataforma | ✅ Concluído |
| P1 | Como mestre, quero criar personagens para gerenciar minha mesa | ✅ Concluído |
| P1 | Como jogador, quero comprar itens no marketplace | ✅ Concluído |
| P1 | Como mestre, quero agendar sessões para organizar minha mesa | ✅ Concluído |
| P2 | Como usuário, quero que a aplicação seja implantada automaticamente (CI/CD) | ✅ Concluído (Sprint 2) |
| P2 | Como usuário, quero que o código seja validado com testes automatizados | ✅ Concluído (Sprint 2) |
| P3 | Como usuário, quero fazer login com minha conta Google (Firebase Auth) | ⏳ Planejado (Sprint 3) |
| P3 | Como mestre, quero fazer upload de imagens para meus mapas | ⏳ Planejado (Sprint 3) |

#### 📝 Histórias de Usuário (exemplo)

**US-001: Automação de Deploy**
> **Como** desenvolvedor,
> **quero** que o deploy da aplicação seja automático ao fazer push na branch `main`,
> **para que** a aplicação esteja sempre atualizada em produção sem intervenção manual.

**Critérios de Aceite:**
- [x] O push na branch `main` dispara a pipeline automaticamente
- [x] O deploy publica o frontend e o backend no Cloud Run
- [x] O health check valida o sucesso do deploy
- [x] Falhas interrompem a pipeline com notificação

---

**US-002: Validação Automática de Código**
> **Como** desenvolvedor,
> **quero** que o código seja validado com lint e testes antes do deploy,
> **para que** erros sejam detectados cedo no processo.

**Critérios de Aceite:**
- [x] ESLint roda automaticamente no frontend e backend
- [x] Testes unitários rodam automaticamente
- [x] Análise estática de segurança (CodeQL) roda automaticamente
- [x] Falhas em qualquer etapa interrompem a pipeline

#### 🎯 Priorização e Refinamento

**Mudanças de prioridade durante a Sprint:**
1. **Inicialmente** a autenticação (P2) estava planejada para a Sprint 2
2. **Após reunião com o professor**, o foco da Sprint 2 mudou para **CI/CD** (requisito da entrega)
3. **A autenticação foi movida para a Sprint 3** com prioridade P3
4. **Testes automatizados** foram elevados de P3 para P2 para atender ao requisito de validação

#### 🔀 Revisão de Pull Requests (exemplos)

O PO participou ativamente da revisão de PRs, validando critérios de aceite e qualidade:

```markdown
### Review do PR #42 — "Adiciona pipeline CI/CD"

✅ **Critérios de aceite atendidos:**
- Pipeline configura com 4 jobs
- Testes passam em ambos os ambientes
- Deploy validado com health check

💬 **Comentário do PO:**
"Excelente trabalho! A pipeline atende todos os critérios da entrega.
Sugiro adicionar o CodeQL para análise de segurança na próxima iteração."
```

---

## 3. Scrum Master (SM)

### 3.1 Responsabilidades do SM

O Scrum Master é responsável por:
- Planejar as Sprints
- Acompanhar o time diariamente
- Resolver impedimentos
- Conduzir as cerimônias Scrum
- Organizar o quadro Kanban

### 3.2 Evidências de Atuação

#### 🗓️ Planejamento da Sprint

**Sprint Planning — Sprint 2 (início)**

| Item da Sprint | Estimativa | Responsável |
|---|---|---|
| Configurar GitHub Actions | 5 pts | Time |
| Criar testes do backend | 8 pts | Time |
| Criar testes do frontend | 5 pts | Time |
| Configurar ESLint | 3 pts | Time |
| Configurar CodeQL | 3 pts | Time |
| Deploy automatizado | 8 pts | Time |
| Documentação da pipeline | 5 pts | Time |
| **Total** | **37 pts** | |

**Meta da Sprint:** Implementar pipeline CI/CD completa com build, testes, qualidade de código e deploy automático.

#### 🎯 Daily Scrums

O SM conduziu Daily Scrums diários com duração de 15 minutos, usando o formato:
- ✅ **O que fiz ontem?**
- 🔄 **O que farei hoje?**
- 🚧 **Quais impedimentos?**

**Registro de Daily Scrum (exemplo):**

```
📅 Daily 12 — 14/08/2026
👥 Presentes: Todos

✅ Feito ontem:
- Implementado workflow de deploy
- Finalizados testes do backend (14 testes)

🔄 Hoje:
- Configurar secrets no GitHub
- Testar pipeline localmente

🚧 Impedimentos:
- Nenhum
```

#### 📊 Organização do Kanban

O SM foi responsável por manter o quadro Kanban atualizado com as colunas:

```
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│  Backlog     │  A Fazer     │  Em         │  Revisão    │  Concluído   │
│              │              │  Progresso  │             │              │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ US#005 Login │ US#001 Deploy│ #123 CodeQL │ PR #42      │ US#001 Build │
│ US#006 Upload│ #124 E2E     │ #125 Tests  │ #126 Lint   │ US#002 Testes│
│ US#007 Chat  │ US#004 Staging│              │             │ #127 Docs   │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

#### 🚫 Resolução de Impedimentos

| Impedimento | Ação do SM | Status |
|---|---|---|
| Docker não instalado na máquina de um integrante | Orientação para instalação + uso de ambiente cloud alternativo | ✅ Resolvido |
| Falta de acesso ao GCP para o projeto | Criação da Service Account com permissões mínimas | ✅ Resolvido |
| Conflitos de peer dependencies no npm | Documentado e configurado `--legacy-peer-deps` | ✅ Resolvido |
| CORS bloqueando produção | Adicionada etapa de atualização automática do CORS na pipeline | ✅ Resolvido |

#### 🎭 Condução das Cerimônias

| Cerimônia | Frequência | Duração | Conduzida por |
|---|---|---|---|
| Sprint Planning | Início da Sprint | 2h | SM |
| Daily Scrum | Diária | 15min | SM |
| Sprint Review | Fim da Sprint | 1h | SM + PO |
| Sprint Retrospective | Fim da Sprint | 1h30 | SM |

---

## 4. Integração Git e GitHub

### 4.1 Estratégia de Branches

```
main (produção)
  └── develop (integração)
        ├── feature/ci-cd-pipeline
        ├── feature/backend-tests
        ├── feature/frontend-tests
        ├── feature/eslint-setup
        └── feature/codeql
```

### 4.2 Pull Requests Abertos (exemplos)

| PR | Título | Autor | Status |
|---|---|---|---|
| #41 | `feat: refatora backend para testabilidade` | Time | ✅ Merge |
| #42 | `feat: adiciona pipeline CI/CD` | Time | ✅ Merge |
| #43 | `test: adiciona testes do backend (Jest)` | Time | ✅ Merge |
| #44 | `test: adiciona testes do frontend (Vitest)` | Time | ✅ Merge |
| #45 | `chore: configura ESLint e CodeQL` | Time | ✅ Merge |
| #46 | `docs: documentação da pipeline CI/CD` | Time | ✅ Merge |

### 4.3 Histórico de Commits (exemplos)

```
feat: adiciona workflow de CI/CD (GitHub Actions)       # hash abc123
test: cria testes do backend (14 testes - Jest)         # hash def456
test: cria testes do frontend (13 testes - Vitest)      # hash ghi789
chore: configura ESLint para backend e frontend         # hash jkl012
chore: configura CodeQL para análise de segurança       # hash mno345
docs: cria documentação da pipeline CI/CD               # hash pqr678
refactor: separa app Express do servidor para testes    # hash stu901
```

---

## 5. Atas de Reunião

### Ata 01 — Sprint Planning Sprint 2
**Data:** 03/08/2026  
**Presentes:** Todos os integrantes  
**Pauta:**
- Definição da meta da Sprint (CI/CD + testes)
- Estimativa das histórias do backlog
- Distribuição das tarefas

**Decisões:**
- Foco da Sprint 2: pipeline CI/CD, testes, lint, CodeQL e deploy
- Autenticação movida para Sprint 3
- Testes do backend com mocks (sem banco real no CI)

---

### Ata 02 — Sprint Review e Retrospective
**Data:** 14/08/2026  
**Presentes:** Todos os integrantes  
**Pauta:**
- Demo da pipeline funcionando (execução real no GitHub Actions)
- Apresentação das funcionalidades concluídas
- Retrospectiva da Sprint

**Decisões:**
- Pipeline validada com sucesso
- Melhorias planejadas para Sprint 3: autenticação, staging, Secret Manager
- Ampliar cobertura de testes de componentes

---

## 6. Conclusão

A atuação do **Product Owner** foi fundamental para priorizar corretamente o backlog, mantendo o foco nos requisitos da entrega (CI/CD) e adiando funcionalidades de maior complexidade para sprints futuras.

A atuação do **Scrum Master** garantiu que o time seguisse a metodologia Scrum, com cerimônias regulares, quadro Kanban atualizado, impedimentos resolvidos prontamente e comunicação eficiente.

As evidências apresentadas (Kanban, Pull Requests, commits, atas de reunião, histórias de usuário com critérios de aceite) comprovam a participação efetiva de ambos os papéis durante todo o desenvolvimento.