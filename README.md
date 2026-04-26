# 🔥 PromoVitrine - Sistema de Ofertas com Bot do Telegram

Sistema completo de gerenciamento de ofertas da Shopee com integração ao Telegram e painel administrativo.

## 📋 Funcionalidades

- ✅ Bot do Telegram para postagem automática e manual de produtos
- ✅ Scraping automático de dados da Shopee (título, preço, imagem)
- ✅ Painel administrativo completo
- ✅ Sistema de autenticação JWT
- ✅ Upload de imagens para Supabase Storage
- ✅ Categorização de produtos
- ✅ Sistema de cupons de desconto
- ✅ Modo manual de postagem com parse inteligente

## 🚀 Tecnologias

### Backend
- Node.js + Express
- Supabase (PostgreSQL + Storage)
- Telegraf (Bot do Telegram)
- JWT para autenticação
- Axios + Cheerio para scraping

### Frontend
- React + Vite
- React Router
- Tailwind CSS
- Axios

## 📦 Estrutura do Projeto

```
promo-site/
├── backend/
│   ├── config/
│   │   └── supabase.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   └── upload.js
│   ├── bot.js
│   ├── server.js
│   ├── schema.sql
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── utils/
│   └── .env.example
└── README.md
```

## 🔧 Configuração Local

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/promo-site.git
cd promo-site
```

### 2. Configure o Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-publica
SUPABASE_SERVICE_KEY=sua-service-key
JWT_SECRET=sua-chave-secreta-jwt
TELEGRAM_BOT_TOKEN=seu-token-do-bot
ADMIN_CHAT_ID=seu-chat-id
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 3. Configure o Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
```

Edite o arquivo `.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

### 4. Configure o Banco de Dados

Execute o arquivo `backend/schema.sql` no SQL Editor do Supabase para criar todas as tabelas necessárias.

Depois, execute `backend/create_admin_silva.sql` para criar o usuário admin.

### 5. Inicie os servidores

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Acesse: http://localhost:5173

## 🌐 Deploy na Vercel

### Backend

1. Crie um novo projeto na Vercel
2. Conecte seu repositório GitHub
3. Configure o Root Directory como `backend`
4. Adicione as variáveis de ambiente no painel da Vercel
5. Deploy!

### Frontend

1. Crie outro projeto na Vercel
2. Conecte o mesmo repositório
3. Configure o Root Directory como `frontend`
4. Adicione a variável `VITE_API_URL` apontando para a URL do backend
5. Deploy!

## 🔐 Credenciais Padrão

- **Usuário**: @silva.93
- **Senha**: @admin.93
- **Rota Admin**: /silva-admin

## 📱 Comandos do Bot

### Modo Automático
Envie qualquer link da Shopee e o bot extrai automaticamente:
```
https://shopee.com.br/produto
```

### Modo Manual (/p)
Formato livre e inteligente:
```
/p https://shopee.com.br/produto 49.90 Camiseta de algodão premium
/p https://shopee.com.br/produto 49.90
/p https://shopee.com.br/produto
```

Com foto: Envie uma foto com a legenda acima.

## 🗄️ Schema do Banco de Dados

Veja o arquivo `backend/schema.sql` para o schema completo.

### Tabelas Principais:
- `admin` - Usuários administradores
- `categories` - Categorias de produtos
- `products` - Produtos/ofertas
- `product_images` - Imagens dos produtos
- `product_coupons` - Cupons de desconto

### Storage Buckets:
- `product-images` - Armazenamento de imagens (público)

## 📝 Notas Importantes

1. **Supabase Service Key**: Use a Service Key no backend para bypass de RLS
2. **CORS**: Configurado para aceitar domínios da Vercel automaticamente
3. **Bot do Telegram**: Funciona apenas quando o backend está rodando
4. **Scraping**: Pode falhar se a Shopee bloquear, use o modo manual (/p)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e de uso pessoal.

## 👤 Autor

Desenvolvido para gerenciamento de ofertas da Shopee.

---

**Dúvidas?** Consulte a documentação do Supabase e Vercel para mais detalhes sobre deploy.
