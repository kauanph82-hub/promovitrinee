# 🚀 GUIA COMPLETO: DEPLOY RENDER + VERCEL

## 📊 SITUAÇÃO ATUAL

✅ **Frontend (.env.production)**: Já está apontando para `https://promovitrinee.onrender.com/api`  
❌ **Backend (Render)**: Não está rodando por causa do Root Directory errado  
✅ **Código no GitHub**: Está atualizado  

---

## 🎯 PARTE 1: CORRIGIR O RENDER (BACKEND)

### 1. Acesse o Render Dashboard
👉 https://dashboard.render.com

### 2. Clique no seu serviço "promovitrine-backend"

### 3. Vá em SETTINGS e configure:

```
Root Directory: backend
Build Command: npm install
Start Command: npm start
Environment: Node
```

**IMPORTANTE:** Clique em "Save Changes" após cada alteração!

### 4. Vá em ENVIRONMENT e adicione estas variáveis:

| Variável | Valor | Onde pegar |
|----------|-------|------------|
| `NODE_ENV` | `production` | Digite manualmente |
| `SUPABASE_URL` | `https://xxx.supabase.co` | Supabase → Settings → API → Project URL |
| `SUPABASE_SERVICE_KEY` | `eyJhbGc...` | Supabase → Settings → API → service_role key (⚠️ SECRETA!) |
| `JWT_SECRET` | `minhasenha123` | Crie uma senha forte qualquer |
| `TELEGRAM_BOT_TOKEN` | `123456:ABC...` | BotFather no Telegram |
| `ADMIN_CHAT_ID` | `987654321` | Seu ID do Telegram |
| `FRONTEND_URL` | `https://promovitrinee.vercel.app` | URL do seu site na Vercel |

### 5. Forçar Deploy Manual

1. Vá em **Manual Deploy** (menu lateral)
2. Clique em **Deploy latest commit**
3. Aguarde 2-3 minutos

### 6. Verificar os Logs

1. Vá em **Logs** (menu lateral)
2. Procure por: `🚀 Servidor rodando na porta 10000`
3. Se aparecer isso = **SUCESSO!** ✅

---

## 🎯 PARTE 2: CONFIGURAR A VERCEL (FRONTEND)

### 1. Acesse o Vercel Dashboard
👉 https://vercel.com/dashboard

### 2. Clique no seu projeto "promovitrinee"

### 3. Vá em SETTINGS → Environment Variables

### 4. Adicione esta variável:

```
Name: VITE_API_URL
Value: https://promovitrinee.onrender.com/api
Environment: Production
```

**IMPORTANTE:** Marque apenas "Production"!

### 5. Forçar Redeploy

1. Vá em **Deployments** (menu superior)
2. Clique nos 3 pontinhos do último deploy
3. Clique em **Redeploy**
4. Aguarde 1-2 minutos

---

## 🧪 PARTE 3: TESTAR SE FUNCIONOU

### Teste 1: Backend está rodando?

Abra no navegador:
```
https://promovitrinee.onrender.com/api/health
```

**Deve aparecer:**
```json
{"status":"ok","timestamp":"2026-04-26T..."}
```

Se aparecer isso = Backend funcionando! ✅

---

### Teste 2: Frontend carrega?

Abra no navegador:
```
https://promovitrinee.vercel.app
```

Deve aparecer a página inicial com os produtos.

---

### Teste 3: Login do Admin funciona?

Abra no navegador:
```
https://promovitrinee.vercel.app/silva-admin/login
```

Tente fazer login com:
- Email: `silva@admin.com`
- Senha: (a senha que você criou no banco)

Se conseguir entrar = **TUDO FUNCIONANDO!** 🎉

---

## ❌ ERROS COMUNS E SOLUÇÕES

### Erro 1: "Application failed to respond"
**Causa:** Root Directory não está configurado como `backend`  
**Solução:** Vá em Settings → Root Directory → Digite `backend` → Save

### Erro 2: "Cannot find module 'express'"
**Causa:** npm install não rodou corretamente  
**Solução:** Vá em Manual Deploy → Clear build cache & deploy

### Erro 3: "SUPABASE_URL is not defined"
**Causa:** Falta variável de ambiente  
**Solução:** Vá em Environment → Adicione todas as variáveis → Redeploy

### Erro 4: "CORS error" no frontend
**Causa:** FRONTEND_URL não está configurada no backend  
**Solução:** Adicione `FRONTEND_URL=https://promovitrinee.vercel.app` no Render

### Erro 5: Página 404 no /silva-admin
**Causa:** vercel.json não está funcionando  
**Solução:** O arquivo já existe, só precisa fazer redeploy na Vercel

---

## 📸 TIRE PRINTS DESTES LUGARES SE DER ERRO

1. **Render → Logs** (últimas 20 linhas)
2. **Render → Settings** (Root Directory e Commands)
3. **Render → Environment** (lista de variáveis, sem mostrar os valores)
4. **Vercel → Deployments** (status do último deploy)
5. **Console do navegador** (F12 → Console, se der erro no frontend)

---

## 🎯 RESUMO DO QUE VOCÊ PRECISA FAZER AGORA

1. [ ] Render → Settings → Root Directory = `backend`
2. [ ] Render → Environment → Adicionar 7 variáveis
3. [ ] Render → Manual Deploy → Deploy latest commit
4. [ ] Render → Logs → Verificar se aparece "Servidor rodando"
5. [ ] Testar: `https://promovitrinee.onrender.com/api/health`
6. [ ] Vercel → Redeploy (se necessário)
7. [ ] Testar: `https://promovitrinee.vercel.app`
8. [ ] Testar login: `https://promovitrinee.vercel.app/silva-admin/login`

---

## 💡 DICA FINAL

O Render demora uns 2-3 minutos para fazer o deploy. Não se preocupe se demorar um pouco!

Se depois de seguir TODOS os passos ainda não funcionar, me mande:
- Print dos Logs do Render
- Print das configurações (Settings)
- Mensagem de erro que aparece no navegador (se houver)
