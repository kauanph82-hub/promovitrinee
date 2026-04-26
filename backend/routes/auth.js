const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('\n🔐 ===== TENTATIVA DE LOGIN =====');
  console.log('Usuário:', username);
  console.log('Senha fornecida:', password ? '***' + password.slice(-3) : 'vazia');
  console.log('JWT_SECRET configurado:', process.env.JWT_SECRET ? 'SIM' : 'NÃO');

  if (!username || !password) {
    console.log('❌ Usuário ou senha não fornecidos');
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }

  try {
    console.log('🔍 Buscando usuário no banco...');
    console.log('Tabela: admin');
    console.log('Username procurado:', username);
    console.log('Supabase URL:', process.env.SUPABASE_URL);
    console.log('Supabase Service Key:', process.env.SUPABASE_SERVICE_KEY ? 'Configurada' : 'NÃO CONFIGURADA');
    
    const { data: admin, error } = await supabase
      .from('admin')
      .select('*')
      .eq('username', username)
      .single();

    console.log('📊 Resultado da query:');
    console.log('Data:', admin);
    console.log('Error:', error);

    if (error) {
      console.error('❌ Erro Supabase:', error);
      console.error('Código do erro:', error.code);
      console.error('Mensagem:', error.message);
      console.error('Detalhes:', error.details);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    if (!admin) {
      console.log('❌ Usuário não encontrado no banco');
      console.log('Username buscado:', username);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    console.log('✅ Usuário encontrado:', admin.username);
    console.log('Hash no banco:', admin.password_hash.substring(0, 20) + '...');

    console.log('🔐 Comparando senha...');
    const senhaCorreta = await bcrypt.compare(password, admin.password_hash);
    
    if (!senhaCorreta) {
      console.log('❌ SENHA INCORRETA');
      console.log('Senha digitada:', password);
      console.log('Hash esperado:', admin.password_hash);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    console.log('✅ Senha correta!');
    console.log('🔑 Gerando token JWT...');

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Token gerado com sucesso');
    console.log('Token (primeiros 20 chars):', token.substring(0, 20) + '...');
    console.log('================================\n');

    res.json({ token, username: admin.username });
  } catch (err) {
    console.error('💥 ERRO FATAL no login:', err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// GET /api/auth/me — verifica se o token ainda é válido
router.get('/me', authMiddleware, (req, res) => {
  res.json({ username: req.admin.username });
});

module.exports = router;
