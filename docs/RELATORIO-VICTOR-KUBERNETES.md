# Relatório de contribuição — Victor

## Objetivo

Preparar o build das imagens, o fluxo de implantação no Minikube, o guia de execução e a organização das evidências para a adaptação Kubernetes do Crytto RPG Platform.

## Situação encontrada

- O projeto já tinha Dockerfiles separados para frontend e backend e um `docker-compose.yml` para execução local.
- O Dockerfile do frontend instalava dependências sem usar o lockfile.
- O Dockerfile do backend também não copiava o lockfile e instalava dependências de produção por meio de `npm install`.
- Ainda não havia `.dockerignore`, pasta `k8s/` ou pasta `docs/evidencias/`.
- Os manifestos atribuídos aos demais integrantes ainda não estavam no checkout no momento desta implementação. Portanto, o deploy completo no cluster e a coleta de evidências reais permanecem pendentes.

## Trabalho realizado

### Imagens

- Atualizado o build do frontend para usar `npm ci` com o `package-lock.json` existente e preservar a opção `--legacy-peer-deps` já usada pelo projeto.
- Atualizado o backend para instalar somente dependências de produção com `npm ci` e seu lockfile.
- O processo do backend agora usa o usuário não privilegiado `node` na imagem.
- Criado `.dockerignore` na raiz para excluir dependências locais, artefatos de build, arquivos de ambiente e conteúdo não necessário para a imagem.

### Implantação Minikube

- Criado `k8s/deploy.ps1`, que verifica previamente os seis manifestos combinados, exige `minikube` e `kubectl`, inicia o cluster, constrói as imagens dentro do Minikube e aplica os arquivos na ordem definida pela equipe.
- Após aplicar os recursos, o script aguarda os Deployments `postgres`, `gcs`, `backend` e `frontend`. Falhas dos comandos interrompem o processo com erro em vez de indicar sucesso indevido.

### Documentação e evidências

- Adicionado ao README um procedimento de implantação com pré-requisitos, build/aplicação, acesso e diagnóstico de problemas comuns.
- Criado `docs/evidencias/README.md` com a lista e convenção para capturas reais, sem registrar resultados que ainda não foram coletados.

## Validação e pendências

- A alteração foi organizada na branch `k8s/victor-backend`, conforme o padrão solicitado.
- `npm run build` do frontend concluiu com sucesso; o Vite exibiu o aviso já esperado de um chunk JavaScript acima de 500 kB.
- Os testes do backend passaram: 1 suíte e 14 testes (`npm test --prefix backend -- --runInBand`).
- O script `k8s/deploy.ps1` passou pela análise sintática do PowerShell.
- A implantação real não pode ser validada neste checkout enquanto os manifestos da equipe não estiverem presentes. O script verifica e informa essa pendência.
- Docker, Minikube e `kubectl` não estão disponíveis neste ambiente; por isso, os builds das imagens e a implantação no cluster não foram executados.
- As capturas de Minikube e aplicação devem ser adicionadas após a implantação integrada.
- O autor do commit foi configurado localmente como `Victor Silveira` com o e-mail associado à conta GitHub informado e confirmado pelo usuário. O remoto do projeto pertence a `victorsilv19`.
