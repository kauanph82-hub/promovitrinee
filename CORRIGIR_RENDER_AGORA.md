# 🚨 CORREÇÃO URGENTE DO RENDER

## ❌ O PROBLEMA
O Render está tentando rodar o projeto da **raiz**, mas o `package.json` está em `backend/`.

---

## ✅ SOLUÇÃO (SIGA EXATAMENTE NESTA ORDEM)

### PASSO 1: Configurar o Root Directory no Render

1. Acesse: https://dashboard.render.com
2. Clique no seu serviço **promovitrine-backend**
3. Vá em **Settings** (menu lateral esquerdo)
4. Procure por **Root Directory**
5. Digite: `backend`
6. Clique em **Save Changes**

---

### PASSO 2: Verificar Build e Start Commands

Ainda em **Settings**, confirme:

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment**: `Node`

Se estiver diferente, corrija e clique em **Save Changes**.

---

### PASSO 3: Adicionar TODAS as Variáveis de Ambiente

Vá em **Environment** (menu lateral) e adicione:

```
SUPABASE_URL = (você já tem, confirme se está correto)
SUPABASE_SERVICE_KEY = (copie do Supabase → Settings → API → service_role key)
JWT_SECRET = (crie uma senha forte, ex: minhasenhasupersecreta123)
TELEGRAM_BOT_TOKEN = (do BotFather)
ADMIN_CHAT_ID = (seu ID do Telegram)
FRONTEND_URL = (URL da Vercel, ex: https://promovitrinee.vercel.app)
NODE_ENV = production
```

**IMPORTANTE:** Clique em **Save Changes** após adicionar cada variável!

---

### PASSO 4: Forçar um Novo Deploy

1. Vá em **Manual Deploy** (menu lateral)
2. Clique em **Deploy latest commit**
3. Aguarde 2-3 minutos
4. Vá em **Logs** e acompanhe

---

## 📋 CHECKLIST DE VERIFICAÇÃO

Antes de fazer o deploy, confirme:

- [ ] Root Directory = `backend`
- [ ] Build Command = `npm install`
- [ ] Start Command = `npm start`
- [ ] Todas as 7 variáveis de ambiente estão configuradas
- [ ] SUPABASE_URL começa com `https://`
- [ ] FRONTEND_URL começa com `https://`

---

## 🔍 COMO SABER SE DEU CERTO

Nos **Logs** do Render, você deve ver:

```
🚀 Servidor rodando na porta 10000
```

Se aparecer isso, o backend está funcionando! ✅

---

## ❌ SE AINDA DER ERRO

Tire um print dos **Logs** (últimas 20 linhas) e me envie.

Os erros mais comuns são:

1. **"Cannot find module"** → Root Directory errado
2. **"SUPABASE_URL is not defined"** → Falta variável de ambiente
3. **"Port already in use"** → Render está tentando usar porta errada (ignore, ele corrige sozinho)

---

## 🎯 PRÓXIMO PASSO: CONFIGURAR A VERCEL

Depois que o Render funcionar, vamos configurar a Vercel para o frontend se conectar corretamente.

Na Vercel, você precisa adicionar a variável:

```
VITE_API_URL = https://seu-backend.onrender.com
```

(Substitua pela URL real do seu backend no Render)
