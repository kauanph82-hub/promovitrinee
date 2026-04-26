import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import api from '../utils/api';
import { PLATFORMS } from '../utils/platform';

const PLATFORMS_LIST = Object.entries(PLATFORMS).map(([k, v]) => ({ key: k, ...v }));

export default function Home() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [platform, setPlatform] = useState('');

  const search = searchParams.get('busca') || '';
  const LIMIT = 24;

  const loadCategories = useCallback(async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch {}
  }, []);

  const loadProducts = useCallback(async (p = 1, append = false) => {
    setLoading(true);
    try {
      const params = { page: p, limit: LIMIT };
      if (search)   params.search = search;
      if (platform) params.platform = platform;

      const { data } = await api.get('/products', { params });
      setProducts(prev => append ? [...prev, ...data.products] : data.products);
      setTotal(data.total);
      setPage(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, platform]);

  useEffect(() => { loadCategories(); }, [loadCategories]);
  useEffect(() => { loadProducts(1); }, [loadProducts]);

  const hasMore = products.length < total;

  return (
    <div className="min-h-screen bg-stone-50">
      <Header categories={categories} />

      {/* Hero */}
      <div className="bg-gradient-to-r from-brand-600 to-orange-500 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl mb-2">
            🔥 As melhores ofertas do dia
          </h1>
          <p className="text-orange-100 text-lg">Promoções selecionadas a dedo para você economizar</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filtros de plataforma */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setPlatform('')}
            className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all ${
              !platform ? 'bg-stone-800 text-white border-stone-800' : 'border-stone-200 text-stone-600 hover:border-stone-400'
            }`}
          >
            Todas as lojas
          </button>
          {PLATFORMS_LIST.filter(p => p.key !== 'other').map(p => (
            <button
              key={p.key}
              onClick={() => setPlatform(p.key)}
              className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all ${
                platform === p.key ? `${p.color} border-transparent` : 'border-stone-200 text-stone-600 hover:border-stone-300'
              }`}
            >
              {p.emoji} {p.label}
            </button>
          ))}
        </div>

        {/* Resultados header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-stone-500 text-sm">
            {search ? `Resultados para "${search}" · ` : ''}
            <span className="font-semibold text-stone-800">{total}</span> ofertas
          </p>
        </div>

        {/* Grid */}
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-stone-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-stone-200 rounded w-1/2" />
                  <div className="h-3 bg-stone-200 rounded" />
                  <div className="h-4 bg-stone-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-medium">Nenhuma oferta encontrada</p>
            <p className="text-sm mt-1">Tente outros filtros ou volte mais tarde</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {products.map(p => (
                <div key={p.id} onClick={() => setSelected(p)}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => loadProducts(page + 1, true)}
                  disabled={loading}
                  className="btn-secondary px-8"
                >
                  {loading ? 'Carregando...' : 'Ver mais ofertas'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}

      {/* Footer */}
      <footer className="text-center py-8 text-stone-400 text-sm border-t border-stone-100 mt-12">
        <p>🔥 PromoVitrine · Economize sempre</p>
        <p className="text-xs mt-1">Os links são de afiliado. Ao comprar, você apoia este site sem custo extra.</p>
      </footer>
    </div>
  );
}
