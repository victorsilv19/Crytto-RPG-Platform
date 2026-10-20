# Evidências da implantação no Minikube

Salve nesta pasta capturas de tela reais da execução. Não inclua tokens, credenciais, valores secretos ou arquivos `.env`.

## Capturas esperadas

1. `01-minikube-status.png` — saída de `minikube status`.
2. `02-recursos-kubernetes.png` — saída de `kubectl get pods,svc,deployments -n crytto`.
3. `03-balanceamento.png` — chamadas repetidas a `/api/health` exibindo os nomes de pods diferentes.
4. `04-autorecuperacao.png` — remoção de um Pod do backend e sua recriação pelo Deployment.
5. `05-aplicacao.png` — aplicação aberta no navegador, incluindo as telas previstas pela equipe.
6. `06-persistencia.png` — dados preservados após a recriação do Pod do Postgres, se essa demonstração fizer parte da entrega.

Use os comandos do roteiro em `DIVISAO-KUBERNETES.md` e nomeie cada captura conforme a lista acima. Os nomes dos arquivos não significam que a evidência já foi coletada; adicione apenas capturas verificadas.
