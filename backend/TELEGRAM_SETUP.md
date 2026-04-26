# 🤖 Configuração do Bot do Telegram

## 1️⃣ Obter seu ADMIN_CHAT_ID

1. Abra o Telegram e procure por: **@userinfobot**
2. Inicie uma conversa com ele (`/start`)
3. Ele vai te enviar seu **Chat ID** (um número como `123456789`)
4. Copie esse número e cole no arquivo `backend/.env`:

```env
ADMIN_CHAT_ID=123456789
```

## 2️⃣ Testar o Bot

1. Reinicie o backend (Ctrl+C e `npm run dev`)
2. Abra o Telegram e procure pelo seu bot (o nome que você deu quando criou)
3. Envie `/start` para o bot
4. Envie um link da Shopee, exemplo:
   ```
   https://shopee.com.br/product/123456789/987654321
   ```

## 3️⃣ O que o Bot Faz

✅ Extrai o título do produto da Shopee  
✅ Baixa a imagem principal  
✅ Faz upload da imagem para o Supabase Storage (`product-images`)  
✅ Salva o produto na tabela `products`  
✅ Vincula a imagem na tabela `product_images`  
✅ Responde com os dados do produto salvo  

## 4️⃣ Segurança

- Apenas o `ADMIN_CHAT_ID` configurado pode usar o bot
- Qualquer outro usuário recebe: "❌ Acesso negado. Este bot é privado."

## 5️⃣ Logs

O bot exibe logs no terminal do backend:
- `🤖 Bot do Telegram iniciado!` — Bot funcionando
- `⚠️ Bot do Telegram desabilitado` — Falta configurar TOKEN ou CHAT_ID

## 6️⃣ Comandos Disponíveis

- `/start` — Mostra instruções do bot
- Enviar link da Shopee — Processa e salva automaticamente
