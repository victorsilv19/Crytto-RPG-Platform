# Crytto RPG Platform

  Aplicação Web para streaming e gerenciamento de sessões de RPG. Frontend React (Vite + Tailwind) e backend Node.js/Express com Postgres, ambos containerizados e implantados no Google Cloud Run com pipeline CI/CD automatizada.

  ## Arquitetura resumida

  - **Frontend:** React 18 + TypeScript + Vite servido por nginx no Cloud Run.
  - **Backend:** Node.js/Express expondo API REST em `/api/*`.
  - **Banco:** Postgres gerenciado (Neon ou Supabase) — persistência real e independente do ciclo de vida dos containers.
  - **Deploy:** pipeline CI/CD com GitHub Actions → build, testes, lint, CodeQL e deploy automático no Cloud Run.
  - **Kubernetes:** toda a stack também roda localmente em um cluster Minikube. Veja [Execução no Kubernetes (Minikube)](#execução-no-kubernetes-minikube).

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
  O compose também sobe um emulador do Google Cloud Storage (`fake-gcs-server`, porta 4443) — veja a demonstração abaixo.

  Para rodar somente o frontend em modo dev (Vite; `/api` é encaminhado para `http://localhost:3001`):

  ```bash
  npm install
  npm run dev
  ```

  ## Execução no Kubernetes (Minikube)

  Toda a aplicação roda dentro de um cluster **Minikube**: frontend (2 réplicas), backend (2 réplicas), banco Postgres e emulador do Cloud Storage. Nenhum componente roda direto na máquina; usamos apenas `minikube` e `kubectl` para construir, implantar e acessar.

  ### Arquitetura no cluster

  ```
  Navegador → Service frontend (NodePort) → 2 Pods frontend (nginx)
                                                │ /api        │ /storage
                                                ▼             ▼
                                    Service backend      Service gcs ──► Pod gcs (fake-gcs-server + PVC)
                                    (ClusterIP, 3001)    (ClusterIP, 4443)
                                         │
                                         ▼
                                    2 Pods backend ──► Service postgres ──► Pod postgres (+ PVC)
  ```

  | Componente | Imagem | Recursos Kubernetes | Arquivo |
  |---|---|---|---|
  | Namespace | — | `Namespace` `crytto` | [k8s/00-namespace.yaml](./k8s/00-namespace.yaml) |
  | Configuração | — | `ConfigMap` `crytto-config`, `Secret` `crytto-secret` | [k8s/10-config.yaml](./k8s/10-config.yaml) |
  | Banco | `postgres:16-alpine` | `PersistentVolumeClaim`, `Deployment`, `Service` (ClusterIP 5432) | [k8s/20-postgres.yaml](./k8s/20-postgres.yaml) |
  | Storage | `fsouza/fake-gcs-server` | `PersistentVolumeClaim`, `Deployment`, `Service` (ClusterIP 4443) | [k8s/25-gcs.yaml](./k8s/25-gcs.yaml) |
  | Backend | `crytto-backend:latest` ([backend/Dockerfile](./backend/Dockerfile)) | `Deployment` (**2 réplicas**), `Service` (ClusterIP 3001) | [k8s/30-backend.yaml](./k8s/30-backend.yaml) |
  | Frontend | `crytto-frontend:latest` ([Dockerfile](./Dockerfile)) | `ConfigMap` do nginx, `Deployment` (**2 réplicas**), `Service` (NodePort 30080) | [k8s/40-frontend.yaml](./k8s/40-frontend.yaml) |

  Como os componentes se encontram:
  - O backend lê `DATABASE_URL` do Secret e as demais variáveis do ConfigMap. Ele acessa o banco pelo nome do Service, `postgres:5432`, e um `initContainer` espera o banco ficar pronto antes de subir.
  - O nginx do frontend encaminha `/api/` para o Service `backend` e `/storage/` (avatares) para o Service `gcs`. O navegador fala só com o frontend. No cluster, essa configuração vem do ConfigMap `frontend-nginx-config`, montado por cima do `nginx.conf` da imagem; o `nginx.conf` da raiz continua sendo o do `docker compose`.
  - Banco e storage usam volumes persistentes (PVC), então os dados sobrevivem à recriação dos Pods.

  ### Pré-requisitos

  - [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e **em execução**.
  - [Minikube](https://minikube.sigs.k8s.io/docs/start/) e [kubectl](https://kubernetes.io/docs/tasks/tools/) no `PATH`.
  - PowerShell, com o terminal aberto na raiz do repositório.

  Conferir:

  ```powershell
  docker info --format "{{.ServerVersion}}"
  minikube version
  kubectl version --client
  ```

  ### Passo a passo

  **1. Iniciar o cluster**

  ```powershell
  minikube start --driver=docker
  minikube status
  ```

  **2. Disponibilizar as imagens no Minikube**

  As imagens são construídas **dentro** do Minikube, sem registry. Por isso os Deployments usam `imagePullPolicy: IfNotPresent`.

  ```powershell
  minikube image build -t crytto-backend:latest ./backend
  minikube image build -t crytto-frontend:latest .
  minikube image ls | Select-String crytto
  ```

  **3. Aplicar os manifestos (nesta ordem)**

  ```powershell
  kubectl apply -f k8s/00-namespace.yaml
  kubectl apply -f k8s/10-config.yaml
  kubectl apply -f k8s/20-postgres.yaml
  kubectl apply -f k8s/25-gcs.yaml
  kubectl apply -f k8s/30-backend.yaml
  kubectl apply -f k8s/40-frontend.yaml
  ```

  **4. Aguardar tudo ficar pronto**

  ```powershell
  kubectl rollout status deployment/postgres -n crytto
  kubectl rollout status deployment/gcs -n crytto
  kubectl rollout status deployment/backend -n crytto
  kubectl rollout status deployment/frontend -n crytto
  kubectl get pods,svc,deployments -n crytto
  ```

  Na primeira vez o Minikube baixa as imagens do Postgres e do emulador, o que pode levar alguns minutos.

  **5. Acessar a aplicação**

  ```powershell
  minikube service frontend -n crytto --url
  ```

  Abra no navegador a URL impressa (ex.: `http://127.0.0.1:5xxxx`). No Windows, **mantenha esse terminal aberto**: o comando mantém o túnel até o cluster enquanto estiver rodando.

  > **Atalho:** os passos 1 a 4 estão automatizados em `.\k8s\deploy.ps1`. Se a execução de scripts estiver bloqueada, rode antes `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`.

  ### Demonstrações exigidas

  **Réplicas e balanceamento de carga.** O backend tem 2 réplicas, e cada resposta traz o header `X-Served-By` com o nome do Pod que atendeu:

  ```powershell
  kubectl get pods -n crytto -l app=backend -o wide
  kubectl run backend-curl --rm -i --restart=Never --image=curlimages/curl:8.10.1 -n crytto -- sh -c 'for i in 1 2 3 4 5 6 7 8 9 10; do curl -s -D - http://backend:3001/health -o /dev/null | grep -i "^X-Served-By:"; done'
  ```

  As linhas devem alternar entre os dois nomes de Pod. Também é possível ver pelo frontend, usando a URL do passo 5:

  ```powershell
  $url = "http://127.0.0.1:5xxxx"   # URL do passo 5
  1..10 | ForEach-Object { (curl.exe -s -D - -o NUL "$url/api/marketplace" | Select-String "X-Served-By").Line }
  ```

  **Recriação automática de Pod.**

  ```powershell
  kubectl get pods -n crytto -l app=backend
  kubectl delete pod <nome-de-um-pod-backend> -n crytto
  kubectl get pods -n crytto -l app=backend -w     # Ctrl+C para sair
  ```

  O Deployment cria um Pod novo, com outro nome, para voltar a ter 2 réplicas.

  **ConfigMap e Secret.**

  ```powershell
  kubectl get configmap,secret -n crytto
  kubectl describe configmap crytto-config -n crytto
  kubectl describe secret crytto-secret -n crytto    # mostra só os tamanhos, não os valores
  ```

  **Persistência do banco.** Crie um item no Marketplace (botão "Vender Item"), apague o Pod do Postgres e recarregue a página: o item continua lá.

  ```powershell
  kubectl delete pod -l app=postgres -n crytto
  kubectl rollout status deployment/postgres -n crytto
  ```

  ### Evidências

  As capturas de tela ficam em [docs/evidencias/](./docs/evidencias/). O roteiro com o comando de cada print está em [docs/evidencias/README.md](./docs/evidencias/README.md).

  ### Parar e limpar

  ```powershell
  minikube stop                        # desliga o cluster e mantém os dados
  kubectl delete namespace crytto      # remove a aplicação e os dados (PVCs)
  minikube delete                      # apaga o cluster inteiro
  ```

  ### Problemas comuns

  - **`minikube start` falha com erro de Docker API:** o Docker Desktop não está aberto. Abra, espere ficar pronto e tente de novo.
  - **`ImagePullBackOff` / `ErrImageNeverPull`:** a imagem não foi construída no Minikube. Refaça o passo 2 e confira com `minikube image ls`.
  - **Pod do backend parado em `Init:0/1`:** o `initContainer` ainda espera o Postgres. Veja `kubectl get pods -n crytto` e `kubectl logs deploy/postgres -n crytto`.
  - **Pod ou volume `Pending`:** investigue com `kubectl describe pod <pod> -n crytto` e `kubectl describe pvc -n crytto`.
  - **Erros na API (`/api`):** `kubectl logs deploy/backend -n crytto` e `kubectl logs deploy/frontend -n crytto`.
  - **Avatares não carregam:** confira se o nginx encaminha `/storage/` para o Service `gcs` (`GCS_PUBLIC_BASE_URL=/storage` no ConfigMap).
  - **Mudou o código e o cluster não atualizou:** refaça o build da imagem (passo 2) e rode `kubectl rollout restart deployment/<nome> -n crytto`.

  A divisão de tarefas da equipe para esta entrega está em [docs/DIVISAO-KUBERNETES.md](./docs/DIVISAO-KUBERNETES.md).

  ## Cloud Storage (upload de avatar)

  O avatar do perfil é enviado pelo backend (`POST /api/users/:id/avatar`, multipart, campo `avatar`, até 5MB)
  para um bucket do Google Cloud Storage; a URL pública do objeto é salva em `users.avatar_url`.

  - **Produção:** `setup-gcs-bucket.ps1` cria o bucket e as permissões; `deploy.ps1`/CI definem `GCS_BUCKET_NAME`.
    A autenticação usa a service account do Cloud Run (sem chave JSON).
  - **Demo local:** `docker compose up --build` já aponta o backend para o emulador (`GCS_EMULATOR_HOST`).

  Roteiro de demonstração: entrar → Meu Perfil → Editar Perfil → botão de upload → escolher imagem.
  O avatar aparece no cabeçalho e o objeto pode ser conferido em `GET /api/storage/avatars`
  (ou, em produção, no console do Cloud Storage / `gcloud storage ls gs://<bucket>/avatars/`).

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
  | `GCS_BUCKET_NAME` | Backend | Bucket dos avatares. Vazio desativa o upload. |
  | `GCS_EMULATOR_HOST` | Backend | Endereço do emulador do Cloud Storage (só em ambiente local). |
  | `GCS_PUBLIC_BASE_URL` | Backend | Base das URLs de avatar devolvidas ao navegador. |

  No Kubernetes essas variáveis vêm do `ConfigMap` `crytto-config` e do `Secret` `crytto-secret` ([k8s/10-config.yaml](./k8s/10-config.yaml)).

  ## Documentação da entrega

  - [ARQUITETURA.md](./ARQUITETURA.md) — Documento técnico de arquitetura
  - [docs/PIPELINE-CICD.md](./docs/PIPELINE-CICD.md) — Documentação da Pipeline CI/CD
  - [docs/SPRINT-REVIEW.md](./docs/SPRINT-REVIEW.md) — Relatório da Sprint Review
  - [docs/PO-SM-ATUACAO.md](./docs/PO-SM-ATUACAO.md) — Atuação do PO e Scrum Master
  - [k8s/](./k8s/) — Manifestos Kubernetes (Minikube)
  - [docs/DIVISAO-KUBERNETES.md](./docs/DIVISAO-KUBERNETES.md) — Divisão de tarefas da migração para Kubernetes
  - [docs/evidencias/](./docs/evidencias/) — Evidências da execução no Minikube