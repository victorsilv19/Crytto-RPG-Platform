# 🎮 Crytto - Plataforma de RPG Streaming

Uma plataforma completa para streaming de RPG com funcionalidades avançadas para mestres e jogadores.

## ✨ Nova Funcionalidade: Tela de Boas-Vindas

Ao entrar pela primeira vez na plataforma, o usuário é recebido com uma tela de seleção épica onde escolhe seu caminho:

- **🎭 Mestre de RPG**: Acesso completo a ferramentas de criação, streaming e marketplace de vendas
- **🛡️ Jogador**: Experiência focada em assistir streams, participar de jogos e comprar conteúdo

A escolha é salva automaticamente e pode ser alterada depois nas configurações. Para testar novamente a tela de seleção, use o botão "Resetar Tipo" disponível na landing page (modo desenvolvedor).

## 🚀 Deploy no GitHub Pages

### Opção 1: React + Vite (Recomendado)

#### 1. Configuração do Repositório
```bash
# 1. Crie um novo repositório no GitHub
# 2. Clone o repositório
git clone https://github.com/SEU_USUARIO/crytto-platform.git
cd crytto-platform

# 3. Copie todos os arquivos React para o repositório
# 4. Instale as dependências
npm install
```

#### 2. Configuração do Vite
Edite o `vite.config.ts` e altere a linha `base`:
```typescript
base: '/NOME-DO-SEU-REPOSITORIO/', // ex: '/crytto-platform/'
```

#### 3. Configuração do GitHub Pages
1. No GitHub, vá em **Settings** > **Pages**
2. Selecione **Source**: GitHub Actions
3. Crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

#### 4. Deploy
```bash
# Commit e push
git add .
git commit -m "🚀 Deploy inicial do Crytto"
git push origin main

# O deploy será automático via GitHub Actions
```

### Opção 2: Vanilla JS (Simples)

#### 1. Configuração
```bash
# 1. Crie um repositório no GitHub
# 2. Copie os arquivos da pasta /vanilla-js/
# 3. Renomeie index.html para o root do projeto
```

#### 2. GitHub Pages
1. Vá em **Settings** > **Pages**
2. Selecione **Source**: Deploy from a branch
3. Escolha **Branch**: main / root

#### 3. Deploy
```bash
git add .
git commit -m "🎮 Crytto Vanilla JS"
git push origin main

# Acesse: https://SEU_USUARIO.github.io/NOME_REPOSITORIO/
```

### Opção 3: Deploy Manual

#### Usando gh-pages
```bash
# Instalar gh-pages
npm install -g gh-pages

# Build do projeto
npm run build

# Deploy
gh-pages -d dist
```

#### Usando Netlify
1. Faça build: `npm run build`
2. Arraste a pasta `dist` para [netlify.com/drop](https://app.netlify.com/drop)
3. Seu site estará online em minutos!

#### Usando Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🔧 Configurações Importantes

### Router para GitHub Pages
Se usar React Router, adicione ao `index.html`:
```html
<script>
  // Redirect for GitHub Pages
  (function(l) {
    if (l.search[1] === '/' ) {
      var decoded = l.search.slice(1).split('&').map(function(s) { 
        return s.replace(/~and~/g, '&')
      }).join('?');
      window.history.replaceState(null, null,
          l.pathname.slice(0, -1) + decoded + l.hash
      );
    }
  }(window.location))
</script>
```

### 404.html para SPA
Crie um arquivo `public/404.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script>
    var pathSegmentsToKeep = 1;
    var l = window.location;
    l.replace(
      l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
      l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
      l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
      (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
      l.hash
    );
  </script>
</head>
<body></body>
</html>
```

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Deploy automático
npm run deploy

# Verificar problemas
npm run lint
```

## 📱 Funcionalidades Implementadas

### ✅ Sistema Completo
- **Dashboard** - Interface principal com cards de ação rápida
- **Marketplace** - Compra e venda de conteúdo RPG
- **Personagens** - Criação e gerenciamento de fichas
- **Agenda** - Sistema de agendamento de sessões
- **Loja Crytts** - Sistema de moeda virtual
- **Temas** - Personalização completa de cores
- **Sistema de Dados** - Rolagem interativa
- **Persistência** - Dados salvos no localStorage

### 🎨 Design System
- Tema vermelho sangue (#b91c1c) 
- Design responsivo com Tailwind CSS
- Componentes reutilizáveis
- Animações e transições suaves

### 👥 Tipos de Usuário
- **Mestres** - Ferramentas completas de RPG
- **Jogadores** - Interface otimizada para participação

## 🔗 Links Úteis

- [Vite Documentation](https://vitejs.dev/)
- [GitHub Pages](https://pages.github.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Documentation](https://react.dev/)

## 📞 Suporte

Para dúvidas sobre deploy ou configuração:
1. Verifique os logs do GitHub Actions
2. Confirme as configurações do repositório
3. Teste localmente com `npm run preview`

---

**🎮 Boa sorte com sua plataforma Crytto!**