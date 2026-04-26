# 🛠️ Comandos Úteis - PromoVitrine

## 📦 Instalação

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## 🚀 Desenvolvimento

### Iniciar Backend
```bash
cd backend
npm start
# ou com auto-reload
npm run dev
```

### Iniciar Frontend
```bash
cd frontend
npm run dev
```

### Iniciar Ambos (em terminais separados)
```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd frontend && npm run dev
```

## 🔨 Build

### Build Frontend
```bash
cd frontend
npm run build
```

### Preview do Build
```bash
cd frontend
npm run preview
```

## 🗄️ Banco de Dados

### Executar Schema Completo
```sql
-- Cole o conteúdo de backend/schema.sql no SQL Editor do Supabase
```

### Criar Admin
```sql
-- Execute backend/create_admin_silva.sql
-- Ou manualmente:
INSERT INTO admin (username, password_hash)
VALUES ('@silva.93', '$2a$10$kNGiRh5A64drkSQHNdm1wugjk/APOo9r30wL5Kxu..3BFXj7xPKke');
```

### Gerar Hash de Senha
```bash
node -e "const b=require('bcryptjs');b.hash('SUA_SENHA',10).then(console.log)"
```

### Verificar Produtos
```sql
SELECT id, title, platform, active, created_at 
FROM products 
ORDER BY created_at DESC 
LIMIT 10;
```

### Limpar Produtos de Teste
```sql
DELETE FROM products WHERE title LIKE '%teste%';
```

## 🤖 Bot do Telegram

### Testar Token do Bot
```bash
cd backend
node test_bot_token.js
```

### Obter Chat ID
```bash
curl https://api.telegram.org/bot<SEU_TOKEN>/getUpdates
```

### Configurar Webhook (Produção)
```bash
curl -X POST https://api.telegram.org/bot<TOKEN>/setWebhook \
  -d "url=https://seu-backend.vercel.app/webhook"
```

### Remover Webhook
```bash
curl -X POST https://api.telegram.org/bot<TOKEN>/deleteWebhook
```

## 🔍 Debug

### Ver Logs do Backend (Local)
```bash
cd backend
npm start
# Logs aparecem no terminal
```

### Ver Logs do Frontend (Local)
```bash
# Abra o navegador
# Pressione F12
# Vá na aba Console
```

### Testar API Manualmente
```bash
# Listar produtos
curl http://localhost:3001/api/products

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"@silva.93","password":"@admin.93"}'

# Criar produto (com token)
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"title":"Teste","affiliate_link":"https://shopee.com.br/teste","platform":"shopee","category_id":"UUID_DA_CATEGORIA"}'
```

## 🧹 Limpeza

### Limpar node_modules
```bash
# Backend
cd backend
rm -rf node_modules
npm install

# Frontend
cd frontend
rm -rf node_modules
npm install
```

### Limpar Cache do Vite
```bash
cd frontend
rm -rf node_modules/.vite
npm run dev
```

### Limpar Build
```bash
cd frontend
rm -rf dist
npm run build
```

## 📊 Monitoramento

### Ver Uso do Supabase
```sql
-- Contar produtos
SELECT COUNT(*) FROM products;

-- Contar por plataforma
SELECT platform, COUNT(*) 
FROM products 
GROUP BY platform;

-- Produtos mais visualizados
SELECT title, views, clicks 
FROM products 
ORDER BY views DESC 
LIMIT 10;
```

### Ver Tamanho do Storage
```sql
-- No painel do Supabase > Storage
-- Ou via API:
```

```bash
curl https://seu-projeto.supabase.co/storage/v1/bucket/product-images \
  -H "Authorization: Bearer SUA_SERVICE_KEY"
```

## 🔄 Git

### Commit e Push
```bash
git add .
git commit -m "Descrição da mudança"
git push
```

### Criar Branch
```bash
git checkout -b feature/nova-funcionalidade
git push -u origin feature/nova-funcionalidade
```

### Voltar para Main
```bash
git checkout main
git pull
```

## 🚨 Emergência

### Parar Servidor na Porta 3001
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### Resetar Banco (CUIDADO!)
```sql
-- Apaga TODOS os produtos
TRUNCATE products CASCADE;

-- Apaga TODAS as categorias
TRUNCATE categories CASCADE;

-- Reexecute o schema.sql depois
```

### Backup do Banco
```bash
# No painel do Supabase
# Settings > Database > Backups
# Ou exporte via SQL:
```

```sql
COPY products TO '/tmp/products_backup.csv' CSV HEADER;
```

## 📝 Variáveis de Ambiente

### Verificar se estão carregadas
```bash
cd backend
node -e "require('dotenv').config(); console.log(process.env.SUPABASE_URL)"
```

### Listar todas
```bash
cd backend
node -e "require('dotenv').config(); console.log(process.env)"
```

## 🎯 Testes Rápidos

### Testar Supabase
```bash
cd backend
node test_supabase.js
```

### Testar Admin
```bash
cd backend
node test_supabase_admin.js
```

### Testar Senha
```bash
cd backend
node test_password.js
```

---

💡 **Dica**: Salve este arquivo para consulta rápida durante o desenvolvimento!
