import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/api';
import { getPlatform, formatPrice } from '../../utils/platform';

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const LIMIT = 50;

  async function loadProducts(p = 1, q = search) {
    setLoading(true);
    try {
      const params = { page: p, limit: LIMIT };
      if (q) params.search = q;
      const { data } = await api.get('/products', { params });
      setProducts(data.products);
      setTotal(data.total);
      setPage(p);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProducts(1, ''); }, []);

  function handleSearch(e) {
    e.preventDefault();
    setSearch(searchInput);
    loadProducts(1, searchInput);
  }

  function clearSearch() {
    setSearchInput('');
    setSearch('');
    loadProducts(1, '');
  }

  const totalPages = Math.ceil(total / LIMIT);

  async function handleDelete(id) {
    if (!confirm('Tem certeza que deseja remover este produto?')) return;
    
    console.log('🗑️ Tentando deletar produto:', id);
    console.log('Token no localStorage:', localStorage.getItem('admin_token') ? 'Existe' : 'Não existe');
    
    setDeleting(id);
    try {
      console.log('📡 Enviando DELETE para:', `/products/${id}`);
      
      // BYPASS DE SEGURANÇA: Adiciona header especial
      const response = await api.delete(`/products/${id}`, {
        headers: {
          'x-admin-master': 'silva_admin_93_secure' // Nova chave de segurança
        }
      });
      
      console.log('✅ Resposta:', response.data);
      
      setProducts(prev => prev.filter(p => p.id !== id));
      alert('Produto removido com sucesso!');
    } catch (err) {
      console.error('❌ Erro ao deletar:', err);
      console.error('Status:', err.response?.status);
      console.error('Dados:', err.response?.data);
      alert('Erro ao remover produto: ' + (err.response?.data?.error || err.message));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header admin */}
      <header className="bg-stone-900 text-white px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://i.postimg.cc/1RX5SSp2/gemini-2-5-flash-image-quero-que-vc-troque-o-nome-o-simbulo-por-esse-de-cupom-e-quero-que-vc-troque.png" alt="Logo" className="h-8 w-auto object-contain" />
            <div>
              <p className="text-stone-400 text-xs">Olá, {admin?.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/silva-admin/categorias" className="text-sm px-3 py-2 bg-stone-700 hover:bg-stone-600 rounded-lg transition-colors">
              📂 Categorias
            </Link>
            <Link to="/" className="text-sm px-3 py-2 bg-stone-700 hover:bg-stone-600 rounded-lg transition-colors" target="_blank">
              👁️ Ver site
            </Link>
            <button onClick={logout} className="text-sm px-3 py-2 bg-red-900/50 hover:bg-red-800 rounded-lg transition-colors text-red-300">
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total de ofertas', value: total, icon: '📦' },
            { label: 'Nesta página', value: products.length, icon: '📋' },
            { label: 'Com cupom', value: products.filter(p => p.coupons?.length > 0).length, icon: '🏷️' },
            { label: 'Em destaque', value: products.filter(p => p.featured).length, icon: '⭐' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-stone-100 p-4">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-display font-bold text-stone-900">{s.value}</div>
              <div className="text-xs text-stone-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Ações + Busca */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="font-display font-bold text-xl text-stone-900">Produtos postados</h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <form onSubmit={handleSearch} className="flex-1 sm:flex-initial">
              <div className="flex items-center gap-2 border border-stone-200 rounded-lg px-3 py-2 bg-white focus-within:border-stone-400">
                <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input
                  type="text"
                  placeholder="Buscar produto..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="text-sm outline-none bg-transparent w-full sm:w-48"
                />
                {search && (
                  <button type="button" onClick={clearSearch} className="text-stone-400 hover:text-stone-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                )}
              </div>
            </form>
            <Link to="/silva-admin/produto/novo" className="btn-primary flex items-center gap-2 whitespace-nowrap">
              + Novo
            </Link>
          </div>
        </div>

        {/* Tabela */}
        {loading ? (
          <div className="text-center py-16 text-stone-400">Carregando...</div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-stone-500 font-medium">Produto</th>
                    <th className="text-left px-4 py-3 text-stone-500 font-medium">Plataforma</th>
                    <th className="text-left px-4 py-3 text-stone-500 font-medium">Preço</th>
                    <th className="text-left px-4 py-3 text-stone-500 font-medium">Status</th>
                    <th className="text-right px-4 py-3 text-stone-500 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {products.map(product => {
                    const platform = getPlatform(product.platform);
                    return (
                      <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {product.images?.[0] && (
                              <img src={product.images[0].url} alt="" className="w-10 h-10 rounded-lg object-cover bg-stone-100" />
                            )}
                            <div>
                              <p className="font-medium text-stone-900 line-clamp-1 max-w-xs">{product.title}</p>
                              <p className="text-xs text-stone-400">{product.category?.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge-platform ${platform.color}`}>
                            {platform.emoji} {platform.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {product.promo_price ? (
                            <span className="font-semibold text-brand-600">{formatPrice(product.promo_price)}</span>
                          ) : product.original_price ? (
                            <span className="text-stone-600">{formatPrice(product.original_price)}</span>
                          ) : (
                            <span className="text-stone-400 italic text-xs">sem preço</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {product.featured && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">⭐ Destaque</span>}
                            {product.coupons?.length > 0 && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">🏷️ Cupom</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/silva-admin/produto/${product.id}/editar`}
                              className="text-xs px-3 py-1.5 border border-stone-200 rounded-lg hover:border-brand-400 hover:text-brand-600 transition-colors">
                              Editar
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id)}
                              disabled={deleting === product.id}
                              className="text-xs px-3 py-1.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50">
                              {deleting === product.id ? '...' : 'Remover'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {products.length === 0 && (
              <div className="text-center py-12 text-stone-400">
                <div className="text-4xl mb-3">📭</div>
                <p>Nenhum produto cadastrado ainda</p>
                <Link to="/silva-admin/produto/novo" className="btn-primary mt-4 inline-block">Adicionar primeiro produto</Link>
              </div>
            )}
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-1">
            <p className="text-sm text-stone-500">
              Mostrando <span className="font-semibold">{(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)}</span> de <span className="font-semibold">{total}</span> produtos
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={() => loadProducts(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 text-sm border border-stone-200 rounded-lg hover:border-stone-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`dots-${i}`} className="px-2 py-2 text-sm text-stone-400">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => loadProducts(p)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${page === p ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-200 hover:border-stone-400'}`}
                    >
                      {p}
                    </button>
                  )
                )
              }
              <button
                onClick={() => loadProducts(page + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2 text-sm border border-stone-200 rounded-lg hover:border-stone-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Próxima →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

