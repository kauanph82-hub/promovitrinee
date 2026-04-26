const jwt = require('jsonwebtoken');

// Lista de usuários admin autorizados
const ADMIN_USERS = ['@silva.93', 'admin', 'kauanphellipe2022@gmail.com'];

module.exports = (req, res, next) => {
  console.log('🔐 Middleware auth chamado');
  console.log('🔐 URL:', req.url);
  console.log('🔐 Method:', req.method);
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    console.log('❌ Token não fornecido');
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    
    console.log('✅ Token decodificado:', decoded);
    console.log('🔐 Usuário:', decoded.username);
    
    // Verifica se é um usuário autorizado
    if (ADMIN_USERS.includes(decoded.username)) {
      console.log('✅ ADMIN AUTORIZADO');
      return next();
    }
    
    console.log('❌ Usuário não autorizado:', decoded.username);
    return res.status(403).json({ error: 'Acesso negado' });
    
  } catch (err) {
    console.error('❌ Erro de autenticação:', err.message);
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
};
