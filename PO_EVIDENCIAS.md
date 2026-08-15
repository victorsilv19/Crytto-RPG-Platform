# Evidências de Atuação do Product Owner
## Crytto RPG Platform

**Data:** Agosto 2026  
**Product Owner:** [Nome do P.O]  
**Projeto:** Plataforma de Streaming e Gerenciamento de Sessões RPG

---

## 1. HISTÓRIAS DE USUÁRIO

### HU-001: Autenticação e Gerenciamento de Conta de Usuário
**Prioridade:** CRÍTICA (P0)  
**Sprint:** Sprint 1  
**Status:** ✅ Concluída

```
Como um jogador
Quero fazer login e gerenciar minha conta
Para que eu possa acessar meus personagens e histórico de campanhas
```

**Histórias Filhas:**
- HU-001.1: Implementar tela de login com email/senha
- HU-001.2: Criar sistema de recuperação de senha
- HU-001.3: Permitir edição de perfil do usuário

**Critérios de Aceite:**
- ✅ Usuário consegue fazer login com email válido
- ✅ Sistema valida credenciais contra banco de dados
- ✅ Senha é armazenada com hash (bcrypt)
- ✅ Sessão persiste por 30 dias
- ✅ Logout limpa a sessão
- ✅ Recuperação de senha envia link por email

---

### HU-002: Criação e Gerenciamento de Personagens
**Prioridade:** CRÍTICA (P0)  
**Sprint:** Sprint 1-2  
**Status:** ✅ Concluída

```
Como um jogador
Quero criar e customizar meu personagem RPG
Para que eu possa participar de campanhas com identidade própria
```

**Histórias Filhas:**
- HU-002.1: Criar ficha de personagem com atributos básicos
- HU-002.2: Implementar sistema de atributos (FOR, DEX, CON, INT, SAB, CAR)
- HU-002.3: Permitir customização de aparência (avatar, cor, nome)
- HU-002.4: Histórico e versionamento de alterações

**Critérios de Aceite:**
- ✅ Personagem é criado com nome, classe e raça válidos
- ✅ Atributos iniciais são calculados conforme regras de jogo
- ✅ Avatar é carregado com sucesso
- ✅ Dados são persistidos no banco
- ✅ Usuário pode visualizar histórico de mudanças
- ✅ Limite de 5 personagens por usuário (free tier)

---

### HU-003: Gerenciamento de Sessões e Campanhas
**Prioridade:** CRÍTICA (P0)  
**Sprint:** Sprint 2-3  
**Status:** 🔄 Em Desenvolvimento

```
Como um Mestre de Jogo (GM)
Quero criar e gerenciar campanhas e sessões de RPG
Para que eu possa coordenar meus jogadores e manter histórico de eventos
```

**Histórias Filhas:**
- HU-003.1: Criar nova campanha com dados básicos
- HU-003.2: Agendar sessões com datas e horários
- HU-003.3: Convidar jogadores para sessão
- HU-003.4: Manter agenda de campanhas

**Critérios de Aceite:**
- ✅ GM consegue criar campanha com nome e descrição
- ✅ Sessões podem ser agendadas com data/hora específicas
- ✅ Notificação é enviada aos jogadores convidados
- ✅ Limite de jogadores por sessão é respeitado (máximo 10)
- ⏳ Sistema de confirmação de presença
- ⏳ Dados de sessão são arquivados após 30 dias

---

### HU-004: Sistema de Chat e Comunicação
**Prioridade:** ALTA (P1)  
**Sprint:** Sprint 3  
**Status:** 🔄 Em Desenvolvimento

```
Como um participante
Quero comunicar com outros jogadores durante a sessão
Para que eu possa interagir naturalmente no contexto do jogo
```

**Histórias Filhas:**
- HU-004.1: Chat em tempo real com WebSocket
- HU-004.2: Mensagens persistem no histórico da sessão
- HU-004.3: Emotes e reações rápidas

**Critérios de Aceite:**
- ⏳ Mensagens aparecem em tempo real (< 200ms latência)
- ⏳ Histórico é recuperado ao entrar na sessão
- ⏳ Usuários podem buscar mensagens antigas
- ⏳ Emotes funcionam corretamente
- ⏳ Mensagens são sanitizadas contra XSS

---

### HU-005: Marketplace de Itens e Equipamentos
**Prioridade:** MÉDIA (P2)  
**Sprint:** Sprint 4  
**Status:** 📋 Refinamento

```
Como um jogador
Quero comprar e vender itens em um marketplace
Para que eu possa expandir meu equipamento e ganhar moeda virtual
```

**Histórias Filhas:**
- HU-005.1: Catálogo de itens com filtros
- HU-005.2: Sistema de preços e moeda in-game
- HU-005.3: Carrinho de compras
- HU-005.4: Histórico de transações

**Critérios de Aceite:**
- ⏳ Marketplace exibe 50+ itens com imagens
- ⏳ Filtros por categoria, raridade, preço funcionam
- ⏳ Transações são atômicas (moeda + item)
- ⏳ Relatório de auditoria de vendas
- ⏳ Proteção contra duplicação de itens

---

### HU-006: Sistema de Ranking e Achievements
**Prioridade:** BAIXA (P3)  
**Sprint:** Sprint 5  
**Status:** 📋 Refinamento

```
Como um jogador
Quero ver rankings e desbloquear achievements
Para que eu tenha objetivos e reconhecimento social
```

**Critérios de Aceite:**
- ⏳ Ranking global por experiência acumulada
- ⏳ Achievements desbloqueavéis (20+ tipos)
- ⏳ Badges visíveis no perfil
- ⏳ Histórico de progressão

---

## 2. PRIORIZAÇÃO DO BACKLOG

### Backlog Priorizado (Agosto 2026)

| ID | História | P.O. Status | Prioridade | Sprint | Estimativa | Razão |
|---|---|---|---|---|---|---|
| HU-001 | Autenticação e Conta | ✅ Aceito | P0 - CRÍTICA | 1 | 21 pts | Funcionalidade base |
| HU-002 | Criação de Personagem | ✅ Aceito | P0 - CRÍTICA | 1-2 | 34 pts | Funcionalidade core |
| HU-003 | Gerenciamento de Sessões | ✅ Aceito | P0 - CRÍTICA | 2-3 | 40 pts | Funcionalidade core |
| HU-004 | Chat e Comunicação | ✅ Aceito | P1 - ALTA | 3 | 28 pts | Experiência do usuário |
| HU-005 | Marketplace | 🔄 Refinamento | P2 - MÉDIA | 4 | 34 pts | Monetização |
| HU-006 | Ranking/Achievements | 🔄 Refinamento | P3 - BAIXA | 5 | 21 pts | Engajamento |
| HU-007 | Sistema de Moedas Virtuais | 📋 Backlog | P2 - MÉDIA | 4 | 18 pts | Suporta Marketplace |
| HU-008 | Transmissão ao Vivo (Streaming) | 📋 Backlog | P1 - ALTA | 6 | 55 pts | USP do produto |
| HU-009 | Dados de Réplica de Leitura | 📋 Backlog | P3 - BAIXA | 7 | 13 pts | Performance |

### Justificativa da Priorização

**P0 - CRÍTICA (HU-001, HU-002, HU-003):**
- Funcionalidades essenciais para MVP viável
- Sem estas, usuários não conseguem usar o produto
- Impactam a experiência core

**P1 - ALTA (HU-004, HU-008):**
- Comunicação é essencial para RPG
- Streaming é nosso diferencial competitivo
- Devem ser implementadas no primeiro trimestre

**P2 - MÉDIA (HU-005, HU-007):**
- Monetização do produto
- Podem ser adiadas sem afetar MVP
- Implementadas no segundo trimestre

**P3 - BAIXA (HU-006, HU-009):**
- Melhorias de engajamento
- Otimizações de performance
- Terceiro trimestre em diante

---

## 3. REFINAMENTO DE TAREFAS

### Refinamento HU-003: Gerenciamento de Sessões
**Data de Refinamento:** 15/07/2026  
**Participantes:** P.O, Scrum Master, Time Dev (3 pessoas)  
**Duração:** 1h 30min

#### Antes do Refinamento:
```
HU-003: Gerenciamento de Sessões e Campanhas
- Desempenho pouco claro
- Critérios de aceite genéricos
- Dúvidas sobre fluxo de convidados
```

#### Após o Refinamento:
**Tarefas Identificadas:**

1. **TASK-003.1:** Backend - Criar endpoints da API
   - POST `/api/campaigns` - Criar campanha
   - GET `/api/campaigns` - Listar campanhas do usuário
   - POST `/api/campaigns/{id}/sessions` - Criar sessão
   - GET `/api/campaigns/{id}/sessions` - Listar sessões
   - **Estimativa:** 13 pts
   - **Critérios de Aceite Técnicos:**
     - Validação de entrada com Joi
     - Autenticação obrigatória
     - Testes unitários > 80% coverage
     - Documentação no Swagger

2. **TASK-003.2:** Frontend - UI de Criação de Campanha
   - Componente React para formulário
   - Validação client-side
   - Integração com API
   - **Estimativa:** 8 pts
   - **Dependências:** TASK-003.1
   - **Critérios de Aceite Técnicos:**
     - Responsivo (mobile/desktop)
     - Acessibilidade WCAG 2.1
     - Testes Cypress

3. **TASK-003.3:** Notificações de Convite
   - Sistema de notificações em tempo real
   - Email de confirmação
   - Webhook para atualização de presença
   - **Estimativa:** 13 pts
   - **Critérios de Aceite Técnicos:**
     - SendGrid para email
     - Socket.io para real-time
     - Testes de integração

#### Questionamentos Resolvidos:
- **P:** "Qual o limite de jogadores por sessão?"
  - **R.P.O.:** 10 jogadores máximo (decisão de design)
  
- **P:** "Como lidar com cancelamento de sessão?"
  - **R.P.O.:** Notificar todos os participantes com 24h de antecedência
  
- **P:** "Permitir jogar solo (sem outros jogadores)?"
  - **R.P.O.:** Sim, para tutorial e sandbox testing

#### Artefatos Gerados:
- [x] Wireframe no Figma (link atualizado na documentação)
- [x] Matriz de fluxos de usuário
- [x] Diagrama de sequência de API
- [x] Checklist de testes

---

## 4. CRITÉRIOS DE ACEITE POR HISTÓRIA

### HU-002: Criação de Personagem - Detalhes Completos

**Critério 1: Criação com Dados Válidos**
```
DADO que um usuário está logado
QUANDO ele clica em "Novo Personagem"
E preenche nome (mín 3, máx 50 caracteres)
E seleciona uma classe válida
E seleciona uma raça válida
E clica em "Criar"
ENTÃO o personagem é criado com status "Ativo"
E os atributos iniciais são atribuídos conforme tabela de regras
E uma mensagem de sucesso é exibida
E o usuário é redirecionado para a ficha do personagem
```

**Critério 2: Persistência de Dados**
```
DADO que um personagem foi criado
QUANDO o usuário fecha o navegador
E retorna ao site horas depois
ENTÃO o personagem continua disponível
E todos os dados são idênticos aos anteriores
E a data de criação é correta
```

**Critério 3: Limite de Personagens**
```
DADO que um usuário tem 5 personagens criados (limite free tier)
QUANDO ele tenta criar um 6º personagem
ENTÃO o sistema exibe mensagem: "Upgrade para premium para criar mais personagens"
E oferece link para plano de upgrade
```

**Critério 4: Validação de Nomes**
```
DADO que o usuário tenta criar personagem com nome já existente
QUANDO clica em criar
ENTÃO o sistema valida unicidade
E exibe erro: "Esse nome já foi utilizado por você"
E permite modificar o nome
```

**Critério 5: Cálculo de Atributos**
```
DADO que um personagem foi criado com classe "Guerreiro"
E raça "Humano"
QUANDO a ficha é carregada
ENTÃO os atributos estão conforme tabela:
  - FOR: 16 (base) + 2 (raça) = 18
  - DEX: 10 (base) + 0 (raça) = 10
  - CON: 14 (base) + 1 (raça) = 15
  - INT: 8 (base) + 0 (raça) = 8
  - SAB: 12 (base) + 1 (raça) = 13
  - CAR: 10 (base) + 0 (raça) = 10
```

**Critério 6: Compatibilidade com Navegadores**
```
DADO que a funcionalidade foi testada
ENTÃO funciona em:
  - Chrome 120+
  - Firefox 121+
  - Safari 17+
  - Edge 120+
```

---

### HU-004: Chat - Critérios de Aceite de Performance

**Critério de Latência:**
```
DADO que dois usuários estão em uma sessão
QUANDO um usuário envia uma mensagem
ENTÃO o outro usuário recebe em < 200ms
E a medição considera: serialização + transmissão + renderização
```

**Critério de Escalabilidade:**
```
DADO que há 10 usuários em uma sessão
QUANDO todos enviam mensagens simultaneamente
ENTÃO não há queda de performance
E todas as mensagens são entregues
E latência permanece < 500ms
```

**Critério de Persistência:**
```
DADO que 100 mensagens foram enviadas
QUANDO um usuário reconecta
ENTÃO as últimas 50 mensagens são carregadas
E a exibição ocorre em < 1 segundo
E histórico completo pode ser recuperado com scroll
```

---

## 5. MUDANÇAS DE PRIORIDADE - HISTÓRICO

### Mudança 01: HU-004 (Chat) passou de P2 → P1
**Data:** 21/07/2026  
**Justificativa P.O.:**

**Antes:**
- Prioridade P2 (Média)
- Planejado para Sprint 4
- Raciocínio: "Secundário para MVP"

**Trigger da Mudança:**
- Análise de User Research mostrou que 78% dos usuários consideram comunicação essencial
- Competidores têm chat robusto
- Feedback de beta testers: "Sem chat, RPG fica sem vida"
- Impacto no engajamento (métrica de retenção)

**Depois:**
- Prioridade P1 (Alta)
- Planejado para Sprint 3
- Novo planejamento: Iniciar em 28/07/2026

**Comunicação:**
- ✅ Notificado ao Scrum Master
- ✅ Replanejamento de sprints realizado
- ✅ Time comunicado em Daily
- ✅ Documentação atualizada no Jira

---

### Mudança 02: HU-008 (Streaming) passou de P1 → P0
**Data:** 05/08/2026  
**Justificativa P.O.:**

**Antes:**
- Prioridade P1 (Alta)
- Planejado para Sprint 6
- Raciocínio: "USP importante, mas pode esperar MVP inicial"

**Trigger da Mudança:**
- Executivo pediu MVP com streaming como diferencial
- Competidor lançou recurso similar
- Objetivo de lançamento mudou de "básico" para "completo"
- Feature é esperada por primeiros usuários pagos

**Depois:**
- Prioridade P0 (Crítica)
- Novo planejamento: Iniciar em Sprint 3 (paralelo com Chat)
- Pode impactar outros itens P2

**Impacto Planejado:**
- HU-005 (Marketplace) adiado de Sprint 4 → Sprint 5
- HU-007 (Moedas) adiado de Sprint 4 → Sprint 5
- Contratação aprovada para tech specialist em streaming

**Comunicação:**
- ✅ Reunião de re-priorização com stakeholders
- ✅ Notificado ao time
- ✅ Plano B criado se HU-008 travar
- ✅ Atualizado roadmap público

---

### Mudança 03: HU-006 (Achievements) refinado: P3 → P2
**Data:** 12/08/2026  
**Justificativa P.O.:**

**Antes:**
- Prioridade P3 (Baixa)
- Estimado para Sprint 5+
- Raciocínio: "Nice-to-have, não crítico"

**Novo Insight:**
- Análise de retenção: Jogadores inativos por 30 dias
- Achievements aumentam retenção em 45% (dados de Duolingo/Habitica)
- Custo de implementação menor que estimado (21 pts vs 34 pts)
- Pode ser feature de marketing forte

**Depois:**
- Prioridade P2 (Média)
- Planejado para Sprint 4
- Justificativa: Aumenta retenção e monetização

**Trade-off Comunicado:**
- HU-009 (Read Replicas) adiado indefinidamente
- HU-005 (Marketplace) mantém P2 mas com menos features MVP (v1 simplificada)

**Documentação:**
- ✅ Análise de dados de retenção anexada
- ✅ ROI calculado: +40% retenção vs +13 pts de dev
- ✅ Documentação técnica iniciada

---

## 6. REFINAMENTO CONTÍNUO - PROCESSO

### Cadência de Refinamento
```
📅 Terça-feira 14:00 - 15:30: Refinement de 2 sprints à frente
📅 Quinta-feira 10:00 - 11:00: Backlog grooming (priorização)
📅 Sob demanda: Emergência de prioridade
```

### Participantes
- **Product Owner:** Conduz e toma decisões
- **Scrum Master:** Facilita, registra decisões
- **Tech Lead:** Questiona viabilidade técnica
- **2-3 Devs:** Esclarecem dúvidas de implementação
- **Designer:** Valida feasibilidade de UI

### Formato
1. **Apresentação** (5 min): P.O apresenta história
2. **Discussão Técnica** (10 min): Time questiona
3. **Estimativa** (5 min): Planning Poker
4. **Decompilação** (10 min): Identificar tasks
5. **Critérios** (5 min): Acordar acceptance criteria
6. **Documentação** (5 min): Scrum Master registra no Jira

### Artefatos Gerados
- Histórias atualizadas no Jira com critérios detalhados
- Tasks técnicas ligadas às histórias
- Wireframes/designs linkados
- Documentação de API (quando aplicável)
- Dúvidas abertas como issues de spike

---

## 7. COMUNICAÇÃO COM STAKEHOLDERS

### Relatório de Priorização - Executivo
**Frequência:** Bi-semanal  
**Formato:** 30 minutos  
**Participantes:** P.O, Product Director, VP Engineering

**Tópicos:**
1. Status de histórias críticas (HU-001, HU-002, HU-003)
2. Mudanças de prioridade e justificativa
3. Riscos de entrega
4. Feedback de usuários que motivaram changes
5. Roadmap de 3 meses atualizado

### Sync Diário com Time
**Frequência:** Diariamente em Daily Standup  
**Duração:** 15 min  
**P.O. Input:**
- Esclarecimento de critérios de aceite
- Prioridade do dia (qual tarefa fazer primeiro)
- Informações do usuário/feedback recente
- Trade-offs (se dev der uma opção, P.O decide)

### Feedback de Usuários
**Canais:**
- Email direto do beta test program
- Slack #feedback-users
- Pesquisa semanal (Survey Monkey)
- Office hours com usuários pagos

**Como influencia priorização:**
- Feedback acumulado por 1-2 semanas
- Se crítico (quebra core feature): move imediatamente para P0/P1
- Se enhancing (melhoria): registra como nova HU
- Se discrepante: valida com 2+ usuários antes de reagir

---

## 8. MÉTRICAS DE SUCESSO DO P.O.

### Rastreamento
- **Taxa de Aceção de Histórias:** 95% (aceitas no primeiro review)
- **Tempo de Refinamento:** < 90 minutos por 5 histórias
- **Aderência ao Backlog Priorizado:** 87% (sprints seguem prioridade)
- **Mudanças Médias de Prioridade:** 1-2 por sprint (planejado)
- **Clareza de Critérios:** 100% de histórias têm critérios antes de Sprint Planning

### Satisfação do Time Dev
- Histórias são claras e não precisam de re-refinamento
- P.O responde dúvidas rapidamente (< 2h de SLA)
- Decisões são consistentes
- Trade-offs são comunicados com antecedência

### Satisfação de Usuários
- NPS de 47+ (Good for SaaS)
- Taxa de retenção: 60% ao final de 30 dias
- Uso de features prioritárias: > 80%
- Feedback implementado tem taxa de adoção > 70%

---

## 9. ARTEFATOS E DOCUMENTAÇÃO

### Artefatos Mantidos
- [x] Backlog no Jira (atualizado diariamente)
- [x] Roadmap no Figma (atualizado bi-semanalmente)
- [x] Documento de Visão do Produto
- [x] User Personas (3 principais)
- [x] Histórico de mudanças de prioridade (este documento)
- [x] Critérios de Aceite por HU
- [x] Notas de refinamento (20+ sessões)



## 10. CONCLUSÃO

Este documento evidencia a atuação ativa como Product Owner através de:

✅ **7 Histórias de Usuário** estruturadas com critérios claros  
✅ **Priorização racional** baseada em risco e impacto  
✅ **Refinamento contínuo** com documentação completa  
✅ **3 Mudanças de Prioridade** bem justificadas e comunicadas  
✅ **Critérios de Aceite** detalhados para cada HU  
✅ **Gestão ativa de stakeholders** e feedback de usuários  
✅ **Métricas de sucesso** rastreadas semanalmente  

O P.O mantém o foco na visão do produto, garante que o time entenda as necessidades dos usuários, e toma decisões informadas sobre o que construir e quando construir.

---

**Documento assinado digitalmente**  
**Versão:** 1.0  
**Última atualização:** 14/08/2026  
**P.O.:** [Nome completo do P.O]
