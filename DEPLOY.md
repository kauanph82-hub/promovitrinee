# 🚀 Guia de Deploy - PromoVitrine

## 📋 Checklist Pré-Deploy

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Schema do banco executado no Supabase
- [ ] Bucket `product-images` criado no Supabase Storage
- [ ] Admin criado no banco de dados
- [ ] Bot do Telegram configurado
- [ ] .gitignore configurado (não subir .env)

## 🗄️ 1. Configurar Supabase

### 1.1 Criar Projeto
1. Acesse https://supabase.com
2. Crie um novo projeto
3. Anote a URL e as chaves (anon key e service key)

### 1.2 Executar Schema
1. Vá em SQL Editor
2. Cole o conteúdo de `backend/schema.sql`
3. Execute (Run)
4. Verifique se todas as tabelas foram criadas

### 1.3 Criar Admin
1. Execute o arquivo `backend/create_admin_silva.sql`
2. Ou crie manualmente com:
```sql
INSERT INTO admin (username, password_hash)
VALUES ('@silva.93', '$2a$10$kNGiRh5A64drkSQHNdm1wugjk/APOo9r30wL5Kxu..3BFXj7xPKke');
```

### 1.4 Criar Bucket de Imagens
1. Vá em Storage
2. Crie um novo bucket chamado `product-images`
3. Marque como **Public**
4. Configure:
   - Tamanho máximo: 50MB
   - Tipos permitidos: image/jpeg, image/png, image/webp, image/gif

## 🤖 2. Configurar Bot do Telegram

### 2.1 Criar Bot
1. Abra o Telegram e procure por @BotFather
2. Envie `/newbot`
3. Escolha um nome e username
4. Copie o token fornecido

### 2.2 Obter Chat ID
1. Envie uma mensagem para o bot
2. Acesse: `https://api.telegram.org/bot<SEU_TOKEN>/getUpdates`
3. Procure por `"chat":{"id":` e copie o número

## 📦 3. Deploy do Backend na Vercel

### 3.1 Preparar Repositório
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/promo-site.git
git push -u origin main
```

### 3.2 Deploy na Vercel
1. Acesse https://vercel.com
2. Clique em "New Project"
3. Importe seu repositório do GitHub
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: (deixe vazio)
   - **Output Directory**: (deixe vazio)

### 3.3 Variáveis de Ambiente
Adicione no painel da Vercel:

```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-anon-key
SUPABASE_SERVICE_KEY=sua-service-key
JWT_SECRET=sua-chave-secreta-jwt-aleatoria
TELEGRAM_BOT_TOKEN=seu-token-do-bot
ADMIN_CHAT_ID=seu-chat-id
PORT=3001
FRONTEND_URL=https://seu-frontend.vercel.app
NODE_ENV=production
```

### 3.4 Deploy
1. Clique em "Deploy"
2. Aguarde o build
3. Copie a URL gerada (ex: `https://seu-backend.vercel.app`)

## 🎨 4. Deploy do Frontend na Vercel

### 4.1 Criar Novo Projeto
1. Na Vercel, clique em "New Project"
2. Selecione o mesmo repositório
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4.2 Variáveis de Ambiente
Adicione:

```
VITE_API_URL=https://seu-backend.vercel.app/api
```

### 4.3 Deploy
1. Clique em "Deploy"
2. Aguarde o build
3. Acesse a URL gerada

## ✅ 5. Testar o Sistema

### 5.1 Testar Frontend
1. Acesse `https://seu-frontend.vercel.app`
2. Navegue pelo site
3. Acesse `/silva-admin`
4. Faça login com `@silva.93` / `@admin.93`

### 5.2 Testar Bot
1. Abra o Telegram
2. Procure seu bot
3. Envie `/start`
4. Envie um link da Shopee
5. Teste o comando `/p`

### 5.3 Verificar Logs
- **Backend**: Vercel Dashboard > Seu Projeto > Logs
- **Frontend**: Console do navegador (F12)

## 🔧 6. Configurações Adicionais

### 6.1 Domínio Customizado (Opcional)
1. Na Vercel, vá em Settings > Domains
2. Adicione seu domínio
3. Configure o DNS conforme instruções

### 6.2 CORS
O backend já está configurado para aceitar:
- Domínios locais (desenvolvimento)
- Domínios `.vercel.app` (produção)
- Domínio customizado (adicione em `FRONTEND_URL`)

### 6.3 Webhook do Telegram (Opcional)
Para melhor performance, configure webhook:
```bash
curl -X POST https://api.telegram.org/bot<TOKEN>/setWebhook \
  -d "url=https://seu-backend.vercel.app/webhook"
```

## 🐛 7. Troubleshooting

### Erro 500 no Backend
- Verifique as variáveis de ambiente
- Confira os logs na Vercel
- Teste as credenciais do Supabase

### Bot não responde
- Verifique o token do bot
- Confirme que o backend está rodando
- Teste com `/start`

### CORS Error
- Adicione a URL do frontend em `FRONTEND_URL`
- Verifique se está usando HTTPS

### Imagens não carregam
- Confirme que o bucket é público
- Verifique a URL do Supabase
- Teste o upload manualmente

## 📊 8. Monitoramento

### Vercel Analytics
1. Ative no painel da Vercel
2. Monitore performance e erros

### Supabase Dashboard
1. Monitore uso do banco
2. Verifique storage usage
3. Analise logs de queries

## 🔄 9. Atualizações

Para atualizar o sistema:

```bash
git add .
git commit -m "Descrição da atualização"
git push
```

A Vercel fará o deploy automático!

## 📞 10. Suporte

- **Supabase**: https://supabase.com/docs
- **Vercel**: https://vercel.com/docs
- **Telegram Bot API**: https://core.telegram.org/bots/api

---

✅ **Deploy concluído com sucesso!**
