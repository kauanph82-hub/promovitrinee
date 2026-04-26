# ✅ Checklist de Deploy - PromoVitrine

Use este checklist para garantir que tudo está configurado antes do deploy.

## 📋 Pré-Deploy

### Arquivos de Configuração
- [ ] `.gitignore` criado na raiz
- [ ] `.gitignore` criado em `backend/`
- [ ] `.gitignore` criado em `frontend/`
- [ ] `.env.example` criado em `backend/`
- [ ] `.env.example` criado em `frontend/`
- [ ] `vercel.json` criado em `backend/`
- [ ] `README.md` criado na raiz
- [ ] `DEPLOY.md` criado na raiz

### Variáveis de Ambiente
- [ ] Arquivo `.env` do backend NÃO está no Git
- [ ] Arquivo `.env` do frontend NÃO está no Git
- [ ] Todas as variáveis estão documentadas no `.env.example`

## 🗄️ Supabase

### Projeto
- [ ] Projeto criado no Supabase
- [ ] URL do projeto anotada
- [ ] Anon Key anotada
- [ ] Service Key anotada (NUNCA exponha no frontend!)

### Banco de Dados
- [ ] Schema executado (`backend/schema.sql`)
- [ ] Tabelas criadas:
  - [ ] `admin`
  - [ ] `categories`
  - [ ] `products`
  - [ ] `product_images`
  - [ ] `product_coupons`
- [ ] Categorias iniciais inseridas
- [ ] Admin criado (`backend/create_admin_silva.sql`)
- [ ] RLS (Row Level Security) ativado
- [ ] Policies configuradas

### Storage
- [ ] Bucket `product-images` criado
- [ ] Bucket configurado como público
- [ ] Tamanho máximo: 50MB
- [ ] MIME types configurados (jpeg, png, webp, gif)
- [ ] Policies de storage configuradas

## 🤖 Telegram Bot

### Configuração
- [ ] Bot criado via @BotFather
- [ ] Token do bot anotado
- [ ] Chat ID obtido
- [ ] Bot testado localmente
- [ ] Comandos funcionando:
  - [ ] `/start`
  - [ ] `/p` (postagem manual)
  - [ ] Links automáticos da Shopee

## 💻 Backend

### Código
- [ ] Todas as rotas testadas localmente
- [ ] CORS configurado para Vercel
- [ ] Variáveis de ambiente usando `process.env`
- [ ] Service Key usada (não anon key)
- [ ] JWT_SECRET configurado
- [ ] Logs de erro implementados

### Testes Locais
- [ ] Servidor inicia sem erros
- [ ] Login funciona
- [ ] CRUD de produtos funciona
- [ ] Upload de imagens funciona
- [ ] Bot conecta ao Telegram
- [ ] Scraping da Shopee funciona

## 🎨 Frontend

### Código
- [ ] Variável `VITE_API_URL` configurada
- [ ] Rotas `/silva-admin` funcionando
- [ ] Login funciona
- [ ] Dashboard carrega produtos
- [ ] Criar produto funciona
- [ ] Editar produto funciona
- [ ] Deletar produto funciona
- [ ] Imagens carregam corretamente

### Build
- [ ] `npm run build` executa sem erros
- [ ] Build gera pasta `dist/`
- [ ] Preview funciona (`npm run preview`)

## 📦 Git e GitHub

### Repositório
- [ ] Repositório criado no GitHub
- [ ] `.gitignore` funcionando (`.env` não está no Git)
- [ ] Código commitado
- [ ] Push para `main` realizado
- [ ] README.md visível no GitHub

## 🚀 Deploy Vercel

### Backend
- [ ] Projeto criado na Vercel
- [ ] Repositório conectado
- [ ] Root Directory: `backend`
- [ ] Variáveis de ambiente configuradas:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_KEY`
  - [ ] `SUPABASE_SERVICE_KEY`
  - [ ] `JWT_SECRET`
  - [ ] `TELEGRAM_BOT_TOKEN`
  - [ ] `ADMIN_CHAT_ID`
  - [ ] `PORT`
  - [ ] `FRONTEND_URL`
  - [ ] `NODE_ENV=production`
- [ ] Deploy realizado
- [ ] URL do backend anotada
- [ ] Logs verificados (sem erros)

### Frontend
- [ ] Projeto criado na Vercel
- [ ] Repositório conectado
- [ ] Root Directory: `frontend`
- [ ] Framework: Vite
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Variável `VITE_API_URL` configurada (URL do backend)
- [ ] Deploy realizado
- [ ] URL do frontend anotada
- [ ] Site acessível

## 🧪 Testes Pós-Deploy

### Frontend
- [ ] Site carrega sem erros
- [ ] Produtos aparecem na home
- [ ] Categorias funcionam
- [ ] Detalhes do produto abrem
- [ ] Links da Shopee funcionam
- [ ] Rota `/silva-admin` acessível
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Criar produto funciona
- [ ] Editar produto funciona
- [ ] Deletar produto funciona
- [ ] Upload de imagens funciona
- [ ] Logout funciona

### Backend
- [ ] API responde: `https://seu-backend.vercel.app/api/health`
- [ ] Login retorna token
- [ ] Produtos são listados
- [ ] CORS permite frontend
- [ ] Logs não mostram erros críticos

### Bot do Telegram
- [ ] Bot responde no Telegram
- [ ] `/start` funciona
- [ ] Link da Shopee é processado
- [ ] Produto aparece no site
- [ ] Comando `/p` funciona
- [ ] Upload de foto funciona
- [ ] Produto com foto aparece no site

## 🔒 Segurança

### Verificações
- [ ] `.env` NÃO está no GitHub
- [ ] Service Key NÃO está exposta no frontend
- [ ] JWT_SECRET é aleatório e seguro
- [ ] Senha do admin foi alterada (não usar padrão)
- [ ] CORS configurado corretamente
- [ ] RLS ativado no Supabase
- [ ] Bucket de imagens é público (mas upload requer service key)

## 📊 Monitoramento

### Configurado
- [ ] Vercel Analytics ativado (opcional)
- [ ] Logs do backend acessíveis
- [ ] Logs do frontend acessíveis (console)
- [ ] Dashboard do Supabase monitorado

## 📝 Documentação

### Criada
- [ ] README.md completo
- [ ] DEPLOY.md com instruções
- [ ] COMANDOS_UTEIS.md para referência
- [ ] Variáveis documentadas em `.env.example`
- [ ] Schema SQL documentado

## 🎉 Deploy Concluído!

Se todos os itens estão marcados, seu deploy está completo e funcionando!

### URLs Importantes
- **Frontend**: https://seu-frontend.vercel.app
- **Backend**: https://seu-backend.vercel.app
- **Admin**: https://seu-frontend.vercel.app/silva-admin
- **Supabase**: https://seu-projeto.supabase.co

### Credenciais
- **Admin**: @silva.93 / @admin.93
- **Bot**: @seu_bot no Telegram

---

🚀 **Parabéns! Seu sistema está no ar!**
