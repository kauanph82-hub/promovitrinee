// Script para testar conexão com Supabase
// Execute: node test_supabase.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('🔍 Testando conexão com Supabase...\n');

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? `${process.env.SUPABASE_KEY.substring(0, 30)}...` : '❌ NÃO ENCONTRADA');
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? `${process.env.SUPABASE_SERVICE_KEY.substring(0, 30)}...` : '❌ NÃO ENCONTRADA');

console.log('\n📡 Criando cliente Supabase...');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

console.log('✅ Cliente criado\n');

console.log('🔍 Testando query na tabela products...');

supabase
  .from('products')
  .select('*')
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ ERRO:', error);
      console.error('\n⚠️ As chaves do Supabase estão INCORRETAS!');
      console.error('Siga as instruções em: backend/PEGAR_CHAVES_SUPABASE.md');
    } else {
      console.log('✅ SUCESSO! Conexão funcionando!');
      console.log('Produtos encontrados:', data.length);
      if (data.length > 0) {
        console.log('Exemplo:', data[0]);
      }
    }
  })
  .catch(err => {
    console.error('❌ ERRO FATAL:', err.message);
  });
