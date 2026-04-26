import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Páginas públicas
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';

// Páginas admin
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminCategories from './pages/admin/AdminCategories';

function PrivateRoute({ children }) {
  const { admin, loading } = useAuth();
  
  // Não loga em produção para evitar poluição
  // console.log('🔐 PrivateRoute - Admin:', admin);
  // console.log('🔐 PrivateRoute - Loading:', loading);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-stone-400">
        Carregando...
      </div>
    );
  }
  
  // PROTEÇÃO ATIVADA: Redireciona para login se não estiver autenticado
  if (!admin) {
    console.log('❌ Não autenticado, redirecionando para login');
    return <Navigate to="/silva-admin/login" replace />;
  }
  
  // console.log('✅ Autenticado:', admin.username);
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Público */}
          <Route path="/" element={<Home />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
          <Route path="/categoria/:slug" element={<CategoryPage />} />

          {/* Admin - Nova rota /silva-admin */}
          <Route path="/silva-admin/login" element={<AdminLogin />} />
          
          {/* ROTA DE EMERGÊNCIA - REMOVER DEPOIS */}
          <Route path="/admin-force" element={<AdminDashboard />} />
          
          <Route path="/silva-admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/silva-admin/produto/novo" element={<PrivateRoute><AdminProductForm /></PrivateRoute>} />
          <Route path="/silva-admin/produto/:id/editar" element={<PrivateRoute><AdminProductForm /></PrivateRoute>} />
          <Route path="/silva-admin/categorias" element={<PrivateRoute><AdminCategories /></PrivateRoute>} />

          {/* Redireciona rotas antigas */}
          <Route path="/admin/*" element={<Navigate to="/silva-admin" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
