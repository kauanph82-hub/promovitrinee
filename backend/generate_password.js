// Script para gerar hash de senha para admin
// Execute: node generate_password.js

const bcrypt = require('bcryptjs');

const senha = process.argv[2] || 'admin123';

bcrypt.hash(senha, 10).then(hash => {
  console.log('\n🔐 Hash gerado com sucesso!\n');
  console.log('Senha:', senha);
  console.log('Hash:', hash);
  console.log('\nUse este SQL no Supabase:\n');
  console.log(`INSERT INTO admin (username, password_hash)`);
  console.log(`VALUES ('admin', '${hash}')`);
  console.log(`ON CONFLICT (username) DO UPDATE SET password_hash = '${hash}';\n`);
});

// Uso:
// node generate_password.js minhasenha123
