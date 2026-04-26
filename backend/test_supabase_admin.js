// Script para testar se o Supabase consegue buscar o usuário
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('🔍 Testando conexão com Supabase...\n');

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? 'Configurada ✅' : '❌ NÃO ENCONTRADA');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

console.log('\n📡 Buscando usuário @silva.93 na tabela admin...\n');

supabase
  .from('admin')
  .select('*')
  .eq('username', '@silva.93')
  .single()
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ ERRO:', error);
      console.error('Código:', error.code);
      console.error('Mensagem:', error.message);
      console.error('Detalhes:', error.details);
      console.error('\n⚠️ O usuário NÃO foi encontrado ou há erro de conexão!');
    } else if (data) {
      console.log('✅ SUCESSO! Usuário encontrado:');
      console.log('ID:', data.id);
      console.log('Username:', data.username);
      console.log('Password Hash:', data.password_hash.substring(0, 30) + '...');
      console.log('Created At:', data.created_at);
      console.log('\n✅ A conexão está funcionando!');
    } else {
      console.log('❌ Nenhum dado retornado');
    }
  })
  .catch(err => {
    console.error('💥 ERRO FATAL:', err.message);
  });
