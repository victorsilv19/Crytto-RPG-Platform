# Divisão de tarefas — Migração para Kubernetes (Minikube)

Projeto: **Crytto RPG Platform** · Equipe: Pedro, Victor, Pablo e Felipe

**Objetivo:** executar toda a aplicação (frontend, backend, banco de dados e emulador de Cloud Storage) dentro de um cluster **Minikube**, sem rodar nenhum componente diretamente na máquina local. Não é uma aplicação nova: é a adaptação da já existente.

---

## 1. Arquitetura-alvo

```
Navegador → Service frontend (NodePort) → Pods frontend (nginx)
                                              │  /api
                                              ▼
                                  Service backend (ClusterIP) → 2+ Pods backend
                                              │                        │
                                              ▼                        ▼
                                  Service postgres (ClusterIP)   Service gcs (ClusterIP)
                                  └ PVC + Secret                  └ avatares (fake-gcs-server)
```

| Componente | Imagem | Porta | Recursos Kubernetes |
|---|---|---|---|
| Frontend | build do `Dockerfile` (raiz) | 80 | Deployment + Service (NodePort) |
| Backend | build do `backend/Dockerfile` | 3001 | Deployment (**2 réplicas**) + Service (ClusterIP) |
| Banco | `postgres:16-alpine` | 5432 | Deployment + PVC + Service (ClusterIP) |
| Storage (demo) | `fsouza/fake-gcs-server` | 4443 | Deployment + Service |
| Configuração | — | — | Namespace `crytto`, ConfigMap, Secret |

### Estrutura de pastas combinada

```
k8s/
  00-namespace.yaml
  10-config.yaml          # ConfigMap + Secret
  20-postgres.yaml        # PVC + Deployment + Service
  25-gcs.yaml             # Deployment + Service do emulador
  30-backend.yaml         # Deployment (2 réplicas) + Service
  40-frontend.yaml        # Deployment + Service
  deploy.ps1              # sobe tudo em ordem
docs/evidencias/          # prints de cada integrante
```

### Combinados da equipe
- Namespace: **`crytto`**. Nomes dos Services: `postgres`, `gcs`, `backend`, `frontend`.
- Labels padrão: `app: <componente>`.
- Uma branch por pessoa (`k8s/pedro-db`, `k8s/victor-backend`, `k8s/pablo-frontend`, `k8s/felipe-docs`) e junção na `main` por Pull Request.
- Nada de segredos reais commitados: senhas do banco são apenas de demonstração.

---

## 2. Divisão por integrante

### Pedro — Banco de dados e configuração
**Arquivos:** `k8s/00-namespace.yaml`, `k8s/10-config.yaml`, `k8s/20-postgres.yaml`, `k8s/25-gcs.yaml`

- [x] Criar o **Namespace** `crytto`.
- [x] **Secret** com `POSTGRES_PASSWORD` e `DATABASE_URL`.
- [x] **ConfigMap** com `PORT`, `PGSSL=false`, `GCS_BUCKET_NAME`, `GCS_EMULATOR_HOST` e `GCS_PUBLIC_BASE_URL`.
- [x] **PersistentVolumeClaim**, **Deployment** do `postgres:16-alpine` e **Service** `postgres` (ClusterIP, 5432).
- [x] `readinessProbe` do Postgres usando `pg_isready`.
- [x] **Deployment e Service** do `gcs` (`fsouza/fake-gcs-server`, porta 4443, mesmos argumentos do `docker-compose.yml`).

**Evidências:**
- `kubectl get pvc,secret,configmap -n crytto`
- Teste de persistência: criar dados, apagar o pod do Postgres, conferir que os dados continuam.

---

### Felipe — Backend e alta disponibilidade
**Arquivos:** `k8s/30-backend.yaml` e pequena alteração em `backend/src/app.js`

- [ ] **Deployment** do backend com **`replicas: 2`**, lendo variáveis do ConfigMap e do Secret.
- [ ] `readinessProbe` e `livenessProbe` em `/health`.
- [ ] **Service** `backend` (ClusterIP, 3001).
- [ ] **Mudança no código:** devolver o nome do pod (`os.hostname()`) no `/health` e em um header `X-Served-By`. Sem isso não há como **provar o balanceamento** entre os pods.
- [ ] Garantir o arranque correto: o `initDb` roda ao iniciar e o Postgres pode demorar. Usar `initContainer` que espera o banco, ou retry no backend.
- [ ] Atualizar os testes do backend se o `/health` mudar.

**Evidências:**
- `kubectl get pods -n crytto -o wide` (2 pods do backend).
- Laço de `curl` mostrando **nomes de pods diferentes** (balanceamento).
- Apagar um pod do backend e mostrar o Kubernetes **recriando automaticamente**.

---

### Pablo — Frontend, rede e acesso
**Arquivos:** `k8s/40-frontend.yaml` e ajuste em `nginx.conf`

- [ ] **Deployment** e **Service** do frontend (NodePort, ou Ingress se preferirem).
- [ ] **Ponto crítico:** o `nginx.conf` atual usa `resolver 127.0.0.11`, que é o DNS do Docker e **não existe no Kubernetes**. Trocar para o DNS do cluster (`kube-dns.kube-system.svc.cluster.local`) e apontar o proxy para `backend.crytto.svc.cluster.local:3001`. Sem isso o `/api` não funciona dentro do cluster.
- [ ] Manter compatibilidade com o `docker compose` (ou criar um `nginx.k8s.conf` separado).
- [ ] Resolver a **URL pública das imagens de avatar**: o ConfigMap já define `GCS_PUBLIC_BASE_URL=/storage`, então o backend devolve URLs relativas (`/storage/<bucket>/<objeto>`). Basta o nginx encaminhar `/storage/` para o Service `gcs` com `Host: gcs:4443` (exemplo pronto no comentário de `k8s/25-gcs.yaml`).
- [ ] Testar o acesso: `minikube service frontend -n crytto --url` (ou `minikube tunnel`).
- [ ] Conferir no navegador: login, marketplace, perfil e upload de avatar.

**Evidências:**
- Aplicação aberta no navegador (marketplace e perfil funcionando).
- Upload de avatar funcionando dentro do cluster.
- `kubectl get svc -n crytto`.

---

### Victor — Imagens, Minikube, README e evidências
**Arquivos:** `Dockerfile`, `backend/Dockerfile`, `.dockerignore`, `k8s/deploy.ps1`, `README.md`, `docs/evidencias/`

- [ ] Revisar e ajustar os **Dockerfiles** (frontend e backend) e criar `.dockerignore`.
- [ ] Definir como as imagens chegam ao Minikube:
  - `minikube image build -t crytto-backend:latest ./backend`
  - `minikube image build -t crytto-frontend:latest .`
  - Nos manifestos: `imagePullPolicy: Never` (ou `IfNotPresent`).
- [ ] Script `k8s/deploy.ps1`: sobe o Minikube, constrói as imagens e aplica os manifestos em ordem.
- [ ] **README.md** com o passo a passo para reproduzir do zero (pré-requisitos, iniciar o Minikube, disponibilizar as imagens, aplicar os manifestos, acessar a aplicação, problemas comuns).
- [ ] Reunir as **evidências** de todos em `docs/evidencias/` e conferir a lista de entrega.

**Evidências:**
- `minikube status`, `minikube start`.
- `kubectl get pods,svc,deployments -n crytto`.

---

## 3. Ordem sugerida

1. **Felipe e Pedro começam juntos:** Minikube e imagens (Felipe), banco e configuração (Pedro).
2. **Victor e Pablo seguem em paralelo** assim que existir o namespace, o ConfigMap e o `postgres`, mesmo que incompletos.
3. **No fim, todos juntos:** teste completo em um cluster limpo (`minikube delete` e subir tudo de novo) e tirada dos prints.

---

## 4. Roteiro da demonstração de disponibilidade

Todos precisam saber executar isto na apresentação:

```powershell
# 1) Réplicas
kubectl get pods -n crytto -o wide

# 2) Balanceamento: o nome do pod que respondeu deve variar
for ($i=0; $i -lt 10; $i++) { curl.exe -s http://<URL>/api/health; "" }

# 3) Auto-recuperação: apagar um pod e ver o Kubernetes recriar
kubectl delete pod <nome-do-pod-backend> -n crytto
kubectl get pods -n crytto -w

# 4) Persistência do banco: apagar o pod do Postgres e conferir os dados
kubectl delete pod -l app=postgres -n crytto
```

---

## 5. Checklist da entrega (GitHub)

- [ ] Código-fonte com as adaptações necessárias
- [ ] Dockerfiles de cada componente
- [ ] Manifestos em `k8s/` (Deployments, Services, ConfigMap, Secret, PVC)
- [ ] `README.md` com o passo a passo no Minikube
- [ ] Evidências em `docs/evidencias/`: Pods, Services, Deployments e a aplicação em execução
- [ ] Pelo menos 2 réplicas de um componente, com balanceamento demonstrado
- [ ] Recriação automática de Pod demonstrada
- [ ] ConfigMap e/ou Secret em uso
- [ ] Nenhum componente rodando fora do cluster durante a demonstração

---

## 6. Requisitos do trabalho (resumo)

1. **Preparação:** projeto do Mensal 1, conteinerizado com Docker, imagens disponíveis no Minikube.
2. **Implantação:** Minikube local, YAMLs com Deployments e Services, frontend ↔ backend ↔ banco se comunicando.
3. **Disponibilidade:** 2+ réplicas, balanceamento demonstrado, recriação automática de Pod, ConfigMaps/Secrets.
4. **Funcionamento:** aplicação completa e acessível pelo navegador, tudo dentro do cluster.
5. **Entrega:** repositório GitHub com código, Dockerfiles, manifestos, README e evidências.
