# Documento Técnico de Arquitetura — Crytto RPG Platform

## 1. Visão Geral

A Crytto RPG Platform é uma aplicação web para streaming e gerenciamento de sessões de RPG. A solução é composta por um frontend React (SPA) e um backend Node.js/Express com banco de dados SQLite, ambos containerizados e implantados no Google Cloud Run.

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
│  │              Volume Persistente                       │   │
│  │              SQLite (crytto.db)                       │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐   │
│  │         Google Container Registry (GCR)               │   │
│  │         Armazena as imagens Docker                    │   │
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
- **Banco de dados:** SQLite via `better-sqlite3`
- **Responsabilidade:** API REST, regras de negócio, persistência de dados

### 3.3 Banco de Dados (SQLite)
- **Tabelas:** `users`, `characters`, `marketplace_items`, `purchases`, `calendar_events`
- **Persistência:** Volume montado no Cloud Run

---

## 4. Serviços Google Cloud Utilizados

| Serviço | Uso | Justificativa |
|---|---|---|
| **Cloud Run** | Hospedagem dos containers | Serverless, escala automática, paga só pelo uso, sem gerenciar servidores |
| **Container Registry (GCR)** | Armazenamento das imagens Docker | Integrado nativamente ao Cloud Run |
| **Cloud Build** (futuro CI/CD) | Pipeline de build automático | Integração com GitHub para deploy automático |

---

## 5. Justificativa Técnica das Escolhas

### Por que Google Cloud?
- Plano gratuito generoso (Cloud Run: 2 milhões de requisições/mês grátis)
- Fácil deploy de containers sem configurar infraestrutura
- Interface simples para estudantes e projetos acadêmicos

### Por que Cloud Run?
- **Sem servidor para gerenciar:** deploy direto de imagem Docker
- **Escala para zero:** quando não há tráfego, não gera custo
- **HTTPS automático:** certificado SSL provisionado automaticamente
- **Ideal para MVPs e projetos acadêmicos**

### Por que SQLite?
- Simplicidade: sem necessidade de provisionar um servidor de banco de dados separado
- Suficiente para o volume de dados do projeto acadêmico
- Custo zero (sem Cloud SQL)

---

## 6. Fluxo de Comunicação

1. Usuário acessa a URL do **crytto-frontend** via HTTPS
2. O nginx serve os arquivos estáticos do React
3. Requisições para `/api/*` são redirecionadas pelo nginx para o **crytto-backend**
4. O backend processa a requisição, consulta/atualiza o SQLite e retorna JSON
5. O frontend atualiza a interface com os dados recebidos

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

- SQLite não é ideal para múltiplos usuários simultâneos em alta escala
- Sem autenticação real (login/senha ou OAuth)
- Sem sistema de upload de arquivos real (imagens via URL)
- Dados do SQLite podem ser perdidos se o container for recriado sem volume persistente configurado corretamente

---

## 10. Melhorias Futuras

- Migrar SQLite para **Cloud SQL (PostgreSQL)** para maior escalabilidade
- Implementar autenticação com **Firebase Auth** ou **Google Identity Platform**
- Adicionar **Cloud Storage** para upload de imagens e assets
- Implementar **CI/CD com Cloud Build** integrado ao GitHub
- Adicionar **Cloud CDN** para melhor performance global

---

## 11. Como Fazer o Deploy

### Pré-requisitos
1. Instalar [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
2. Instalar [Docker Desktop](https://www.docker.com/products/docker-desktop/)
3. Criar um projeto no [Google Cloud Console](https://console.cloud.google.com)

### Passos
```bash
# 1. Autenticar no Google Cloud
gcloud auth login
gcloud config set project SEU_PROJECT_ID

# 2. Habilitar APIs necessárias
gcloud services enable run.googleapis.com containerregistry.googleapis.com

# 3. Configurar Docker para usar o GCR
gcloud auth configure-docker

# 4. Editar o PROJECT_ID no deploy.sh e executar
chmod +x deploy.sh
./deploy.sh
```

### Testar localmente antes do deploy
```bash
docker-compose up --build
# Acesse http://localhost
```
