# 🚀 Deploy no Render - PromoVitrine

## 📋 Pré-requisitos

- [ ] Conta no GitHub
- [ ] Conta no Render (https://render.com)
- [ ] Conta no Vercel (https://vercel.com)
- [ ] Conta no Supabase (https://supabase.com)
- [ ] Código no GitHub

---

## 🗄️ PASSO 1: Configurar Supabase

### 1.1 Criar Projeto
1. Acesse https://supabase.com
2. Crie um novo projeto
3. Anote: **URL** e **Service Key** (Settings > API)

### 1.2 Executar Schema
1. Vá em **SQL Editor**
2. Cole o conteúdo de `backend/schema.sql`
3. Clique em **Run**

### 1.3 Criar Admin
1. Execute `backend/create_admin_silva.sql`
2. Ou manualmente:
```sql
INSERT INTO admin (username, password_hash)
VALUES ('@silva.93', '$2a$10$kNGiRh5A64drkSQHNdm1wugjk/APOo9r30wL5Kxu..3BFXj7xPKke');
```

### 1.4 Criar Bucket de Imagens
1. Vá em **Storage**
2. Crie bucket: `product-images`
3. Marque como **Public**
4. Configure:
   - Tamanho máximo: 50MB
   - Tipos: image/jpeg, image/png, image/webp, image/gif

---

## 🤖 PASSO 2: Configurar Bot do Telegram

### 2.1 Criar Bot
1. Abra o Telegram
2. Procure: **@BotFather**
3. Envie: `/newbot`
4. Escolha nome e username
5. **Copie o token**

### 2.2 Obter Chat ID
1. Envie uma mensagem para o bot
2. Acesse: `https://api.telegram.org/bot<SEU_TOKEN>/getUpdates`
3. Procure: `"chat":{"id":`
4. **Copie o número**

---

## 🔧 PASSO 3: Deploy do Backend no Render

### 3.1 Criar Web Service
1. Acesse: https://dashboard.render.com
2. Clique em **"New +"** > **"Web Service"**
3. Conecte seu repositório GitHub: `Promovitrine`
4. Configure:
   - **Name**: `promovitrine-backend`
   - **Region**: Oregon (Free)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 3.2 Adicionar Variáveis de Ambiente
Em **Environment**, adicione:

```
NODE_ENV=production
TELEGRAM_BOT_TOKEN=seu-token-aqui
ADMIN_CHAT_ID=seu-chat-id-aqui
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua-service-key-aqui
JWT_SECRET=sua-chave-secreta-jwt-aleatoria
FRONTEND_URL=https://seu-frontend.vercel.app
```

**⚠️ IMPORTANTE**: 
- `PORT` não precisa configurar (Render fornece automaticamente)
- `JWT_SECRET` deve ser uma string aleatória longa

### 3.3 Deploy
1. Clique em **"Create Web Service"**
2. Aguarde o build (5-10 minutos)
3. **Copie a URL** gerada (ex: `https://promovitrine-backend.onrender.com`)

---

## 🎨 PASSO 4: Atualizar Frontend

### 4.1 Editar .env.production
Abra `frontend/.env.production` e substitua:

```env
VITE_API_URL=https://promovitrine-backend.onrender.com/api
```

Pela URL real do seu backend no Render.

### 4.2 Commit e Push
```bash
git add .
git commit -m "Configurado URL do backend Render"
git push
```

---

## 🌐 PASSO 5: Deploy do Frontend no Vercel

### 5.1 Criar Projeto
1. Acesse: https://vercel.com
2. Clique em **"Add New..."** > **"Project"**
3. Importe: `Promovitrine`
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 5.2 Variáveis de Ambiente (Opcional)
O Vite já vai usar o `.env.production`, mas você pode adicionar:

```
VITE_API_URL=https://promovitrine-backend.onrender.com/api
```

### 5.3 Deploy
1. Clique em **"Deploy"**
2. Aguarde o build (2-3 minutos)
3. **Copie a URL** (ex: `https://promovitrine.vercel.app`)

---

## 🔄 PASSO 6: Atualizar CORS no Backend

### 6.1 Atualizar FRONTEND_URL no Render
1. Volte ao Render
2. Vá em **Environment**
3. Edite `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://promovitrine.vercel.app
   ```
4. Salve (vai fazer redeploy automático)

---

## ✅ PASSO 7: Testar o Sistema

### 7.1 Testar Frontend
1. Acesse: `https://promovitrine.vercel.app`
2. Navegue pelo site
3. Veja se os produtos carregam

### 7.2 Testar Admin
1. Acesse: `https://promovitrine.vercel.app/silva-admin`
2. Login: `@silva.93` / `@admin.93`
3. Teste criar/editar/deletar produtos

### 7.3 Testar Bot
1. Abra o Telegram
2. Procure seu bot
3. Envie: `/start`
4. Envie um link da Shopee
5. Verifique se aparece no site

---

## 🐛 Troubleshooting

### Backend não inicia
- Verifique os logs no Render Dashboard
- Confirme que todas as variáveis estão configuradas
- Teste a conexão com Supabase

### Frontend não conecta na API
- Verifique se `VITE_API_URL` está correto
- Abra o Console do navegador (F12)
- Veja se há erros de CORS

### Bot não responde
- Verifique o token no Render
- Confirme que o backend está rodando
- Teste: `https://api.telegram.org/bot<TOKEN>/getMe`

### CORS Error
- Confirme que `FRONTEND_URL` está correto no Render
- Aguarde o redeploy após alterar variáveis
- Limpe o cache do navegador

---

## 📊 Monitoramento

### Render
- Dashboard > Logs (ver logs em tempo real)
- Dashboard > Metrics (uso de recursos)

### Vercel
- Dashboard > Deployments (histórico)
- Dashboard > Analytics (tráfego)

### Supabase
- Dashboard > Database (uso do banco)
- Dashboard > Storage (uso de storage)

---

## 💰 Limites do Plano Free

### Render Free:
- ✅ 750 horas/mês
- ⚠️ Dorme após 15 min de inatividade
- ⚠️ Demora ~30s para acordar
- ✅ SSL automático

### Vercel Free:
- ✅ 100 GB bandwidth/mês
- ✅ Sempre ativo
- ✅ SSL automático
- ✅ Deploy automático

### Supabase Free:
- ✅ 500 MB database
- ✅ 1 GB storage
- ✅ 2 GB bandwidth/mês

---

## 🎉 Pronto!

Seu sistema está no ar:
- **Site**: https://promovitrine.vercel.app
- **Admin**: https://promovitrine.vercel.app/silva-admin
- **API**: https://promovitrine-backend.onrender.com/api

---

## 📝 Notas Importantes

1. **Render Free dorme**: O backend vai dormir após 15 min sem uso. A primeira requisição vai demorar ~30s.

2. **Manter ativo**: Use um serviço como UptimeRobot (https://uptimerobot.com) para fazer ping a cada 5 minutos.

3. **Bot do Telegram**: Funciona mesmo com o backend dormindo - ele acorda quando recebe mensagem.

4. **Atualizações**: Qualquer push no GitHub faz redeploy automático no Vercel e Render.

---

✅ **Deploy concluído com sucesso!**
