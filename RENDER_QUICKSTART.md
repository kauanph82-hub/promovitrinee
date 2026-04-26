# ⚡ Render - Guia Rápido

## 🚀 Deploy em 5 Passos

### 1️⃣ Supabase (5 min)
```
1. Criar projeto em supabase.com
2. Executar backend/schema.sql
3. Executar backend/create_admin_silva.sql
4. Criar bucket "product-images" (público)
5. Copiar URL e Service Key
```

### 2️⃣ Telegram Bot (2 min)
```
1. @BotFather > /newbot
2. Copiar token
3. Enviar mensagem pro bot
4. Acessar: https://api.telegram.org/bot<TOKEN>/getUpdates
5. Copiar chat ID
```

### 3️⃣ Backend no Render (10 min)
```
1. render.com > New Web Service
2. Conectar GitHub: Promovitrine
3. Root Directory: backend
4. Build: npm install
5. Start: npm start
6. Adicionar variáveis de ambiente:
   - TELEGRAM_BOT_TOKEN
   - ADMIN_CHAT_ID
   - SUPABASE_URL
   - SUPABASE_SERVICE_KEY
   - JWT_SECRET (string aleatória)
   - FRONTEND_URL (adicionar depois)
   - NODE_ENV=production
7. Deploy!
8. Copiar URL gerada
```

### 4️⃣ Atualizar Frontend (1 min)
```bash
# Editar frontend/.env.production
VITE_API_URL=https://seu-backend.onrender.com/api

# Commit
git add .
git commit -m "URL do Render configurada"
git push
```

### 5️⃣ Frontend no Vercel (5 min)
```
1. vercel.com > New Project
2. Importar: Promovitrine
3. Root Directory: frontend
4. Framework: Vite
5. Deploy!
6. Copiar URL gerada
7. Voltar no Render > Environment
8. Atualizar FRONTEND_URL com a URL do Vercel
```

---

## ✅ URLs Finais

- **Site**: https://seu-projeto.vercel.app
- **Admin**: https://seu-projeto.vercel.app/silva-admin
- **API**: https://seu-backend.onrender.com/api
- **Bot**: @seu_bot no Telegram

---

## 🔐 Credenciais

- **Admin**: @silva.93 / @admin.93

---

## ⚠️ Importante

1. **Render Free dorme** após 15 min sem uso
2. Primeira requisição demora ~30s (acordar)
3. Use UptimeRobot para manter ativo (opcional)

---

## 🐛 Problemas Comuns

### "Cannot connect to API"
→ Verifique `VITE_API_URL` no `.env.production`

### "CORS Error"
→ Atualize `FRONTEND_URL` no Render

### "Bot não responde"
→ Verifique `TELEGRAM_BOT_TOKEN` no Render

---

✅ **Pronto para deploy!**
