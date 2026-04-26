# 🔧 Configuração de Variáveis de Ambiente no Render

## ⚠️ IMPORTANTE: Nome das Variáveis

O seu código usa `SUPABASE_SERVICE_KEY`, mas você pode ter configurado como `SUPABASE_KEY` no Render.

### ✅ Nomes CORRETOS das Variáveis:

Configure exatamente com estes nomes no Render:

```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua-service-key-aqui
JWT_SECRET=sua-chave-secreta-jwt
TELEGRAM_BOT_TOKEN=seu-token-do-bot
ADMIN_CHAT_ID=seu-chat-id
FRONTEND_URL=https://seu-site.vercel.app
NODE_ENV=production
```

## 📋 Passo a Passo no Render

### 1. Acesse o Dashboard
- Vá em: https://dashboard.render.com
- Clique no serviço "promovitrine-backend"

### 2. Vá em Environment
- No menu lateral, clique em "Environment"
- Você verá a lista de variáveis

### 3. Verifique os Nomes
**CRÍTICO**: O nome deve ser exatamente `SUPABASE_SERVICE_KEY` (não `SUPABASE_KEY`)

Se estiver errado:
1. Clique no ícone de lápis (Edit) ao lado da variável
2. Mude o nome para `SUPABASE_SERVICE_KEY`
3. Clique em "Save Changes"

### 4. Valores Necessários

| Variável | Onde Encontrar | Exemplo |
|----------|----------------|---------|
| `SUPABASE_URL` | Supabase → Settings → API | https://xxx.supabase.co |
| `SUPABASE_SERVICE_KEY` | Supabase → Settings → API → service_role key | eyJhbGc... (longo) |
| `JWT_SECRET` | Qualquer string segura | minha-chave-super-secreta-123 |
| `TELEGRAM_BOT_TOKEN` | BotFather no Telegram | 1234567890:ABC... |
| `ADMIN_CHAT_ID` | @userinfobot no Telegram | 123456789 |
| `FRONTEND_URL` | URL da Vercel após deploy | https://seu-site.vercel.app |
| `NODE_ENV` | Fixo | production |

## 🔍 Como Verificar se Está Correto

### Opção 1: Logs do Render
Após salvar as variáveis, vá em "Logs" e procure por:
```
🔧 Configurando Supabase...
URL: https://seu-projeto.supabase.co
Service Key: Configurada ✅
```

Se aparecer `❌ NÃO ENCONTRADA`, a variável está com nome errado!

### Opção 2: Teste Manual
Depois que o serviço estiver "Live", teste:
```bash
curl https://promovitrinee.onrender.com/api/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"2026-04-26T..."}
```

## 🚨 Problemas Comuns

### 1. "SUPABASE_SERVICE_KEY não encontrada"
**Causa**: Variável com nome errado (ex: `SUPABASE_KEY`)
**Solução**: Renomeie para `SUPABASE_SERVICE_KEY`

### 2. "Cannot find module 'dotenv'"
**Causa**: Build não instalou dependências
**Solução**: Verifique se `Build Command` está como `npm install`

### 3. "Port 3001 already in use"
**Causa**: Código está usando porta fixa
**Solução**: Já está correto no código (`process.env.PORT || 3001`)

### 4. Bot não inicia
**Causa**: `TELEGRAM_BOT_TOKEN` ou `ADMIN_CHAT_ID` incorretos
**Solução**: Verifique os valores no Telegram

## 📝 Checklist Final

Antes de salvar, confirme:

- [ ] `SUPABASE_URL` começa com `https://`
- [ ] `SUPABASE_SERVICE_KEY` é a **service_role** key (não a anon key)
- [ ] `JWT_SECRET` tem pelo menos 16 caracteres
- [ ] `TELEGRAM_BOT_TOKEN` tem formato `número:letras`
- [ ] `ADMIN_CHAT_ID` é um número (pode ser negativo)
- [ ] `FRONTEND_URL` é a URL completa da Vercel
- [ ] `NODE_ENV` está como `production`

## 🎯 Após Configurar

1. Clique em "Save Changes"
2. O Render vai fazer redeploy automaticamente
3. Aguarde 2-3 minutos
4. Verifique os logs
5. Teste o endpoint de health

## 💡 Dica Extra

Se quiser testar localmente com as mesmas variáveis:
1. Copie o arquivo `backend/.env.example`
2. Renomeie para `backend/.env`
3. Cole os mesmos valores que você colocou no Render
4. Rode `npm start` na pasta backend

---

**Depois de configurar, volte aqui e me diga o que aparece nos logs do Render!**
