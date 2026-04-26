// Teste rápido do token do Telegram
require('dotenv').config();
const axios = require('axios');

const token = process.env.TELEGRAM_BOT_TOKEN;

console.log('🔍 Testando token do Telegram...');
console.log('Token (últimos 3 chars):', token ? token.slice(-3) : '❌ NÃO ENCONTRADO');

axios.get(`https://api.telegram.org/bot${token}/getMe`)
  .then(response => {
    console.log('✅ TOKEN VÁLIDO!');
    console.log('Bot:', response.data.result);
  })
  .catch(error => {
    console.error('❌ TOKEN INVÁLIDO!');
    console.error('Erro:', error.response?.data || error.message);
  });
