require('dotenv').config(); // PRIMEIRA LINHA - OBRIGATÓRIO
const { createClient } = require('@supabase/supabase-js');

console.log('🔧 Configurando Supabase...');
console.log('URL:', process.env.SUPABASE_URL);
console.log('Service Key:', process.env.SUPABASE_SERVICE_KEY ? 'Configurada ✅' : '❌ NÃO ENCONTRADA');

// Validação
if (!process.env.SUPABASE_URL) {
  throw new Error('❌ SUPABASE_URL não está configurada! Adicione nas variáveis de ambiente.');
}

if (!process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('❌ SUPABASE_SERVICE_KEY não está configurada! Adicione nas variáveis de ambiente.');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // service key para operações no backend
);

console.log('✅ Supabase configurado com sucesso!');

module.exports = supabase;
