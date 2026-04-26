import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Só verifica uma vez
    if (verified) return;
    
    console.log('🔐 useAuth - Verificando token...');
    const token = localStorage.getItem('admin_token');
    console.log('🔐 Token encontrado:', token ? 'SIM' : 'NÃO');
    
    if (!token) { 
      console.log('🔐 Sem token, pulando verificação');
      setLoading(false);
      setVerified(true);
      return; 
    }

    // Verifica se o token ainda é válido
    api.get('/auth/me')
      .then(({ data }) => {
        console.log('✅ Admin verificado:', data);
        setAdmin(data);
      })
      .catch((err) => {
        console.error('❌ Erro ao verificar admin:', err.response?.status);
        // Só remove o token se for erro de autenticação
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.log('🔐 Token inválido, removendo...');
          localStorage.removeItem('admin_token');
        }
      })
      .finally(() => {
        console.log('🔐 Verificação concluída');
        setLoading(false);
        setVerified(true);
      });
  }, [verified]); // Executa apenas uma vez

  async function login(username, password) {
    console.log('🔐 Tentando login:', username);
    try {
      const { data } = await api.post('/auth/login', { username, password });
      console.log('✅ Login bem-sucedido:', data);
      console.log('🔑 Token recebido:', data.token ? 'SIM' : 'NÃO');
      
      localStorage.setItem('admin_token', data.token);
      setAdmin({ username: data.username });
      
      console.log('✅ Token salvo no localStorage');
    } catch (err) {
      console.error('❌ Erro no login:', err.response?.data);
      throw err;
    }
  }

  function logout() {
    console.log('🔐 Logout');
    localStorage.removeItem('admin_token');
    setAdmin(null);
    setVerified(false);
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
