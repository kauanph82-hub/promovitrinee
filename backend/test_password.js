// Script para testar se a senha bate com o hash
require('dotenv').config();
const bcrypt = require('bcryptjs');

const senha = '@admin.93';
const hashNoBanco = '$2a$10$kNGiRh5A64drkSQHNdm1wugjk/APOo9r30wL5Kxu..3BFXj7xPKke';

console.log('🔐 Testando senha...');
console.log('Senha:', senha);
console.log('Hash:', hashNoBanco);

bcrypt.compare(senha, hashNoBanco).then(result => {
  if (result) {
    console.log('✅ SENHA CORRETA! O hash bate.');
  } else {
    console.log('❌ SENHA INCORRETA! O hash não bate.');
  }
});
