import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import api from '../utils/api';
import { PLATFORMS } from '../utils/platform';

const PLATFORMS_LIST = Object.entries(PLATFORMS).map(([k, v]) => ({ key: k, ...v }));

const LOJAS = [
  { name: 'Shopee',         key: 'shopee',        img: 'https://i.postimg.cc/c1Mb4hhF/download-(3).jpg' },
  { name: 'Amazon',         key: 'amazon',        img: 'https://i.postimg.cc/Qtg0CNQH/Minecraft-(English-Arabic-Box)-Play-Station-4-Edizione-Regno-Unito.jpg' },
  { name: 'Mercado Livre',  key: 'mercadolivre',  img: 'https://i.postimg.cc/0j2dNY2y/Escola-de-E-commerce-Aprenda-a-viver-de-vendas-online.jpg' },
  { name: 'AliExpress',     key: 'aliexpress',    img: 'https://i.postimg.cc/J405V52G/download-(4).jpg' },
  { name: 'Shein',          key: 'shein',         img: 'https://i.postimg.cc/7L83z8Y0/SHEIN-icon.jpg' },
  { name: 'Magazine Luiza', key: 'magalu',        img: 'https://i.postimg.cc/PJRZr0RJ/Link-Loja-Magalu.jpg' },
  { name: 'Americanas',     key: 'americanas',    img: 'https://i.postimg.cc/T3mmf7qQ/JOVEM-APRENDIZ-LOJAS-AMERICANAS-2019-Inscricoes-Abertas.jpg' },
];

export default function Home() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [platform, setPlatform] = useState('');

  const search = searchParams.get('busca') || '';
  const LIMIT = 24;

  const loadCategories = useCallback(async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(Array.isArray(data) ? data : []);
    } catch { setCategories([]); }
  }, []);

  const loadProducts = useCallback(async (p = 1, append = false) => {
    setLoading(true);
    setError(false);
    try {
      const params = { page: p, limit: LIMIT };
      if (search) params.search = search;
      if (platform) params.platform = platform;
      const { data } = await api.get('/products', { params });
      const arr = Array.isArray(data?.products) ? data.products : [];
      const tot = typeof data?.total === 'number' ? data.total : 0;
      setProducts(prev => append ? [...(prev || []), ...arr] : arr);
      setTotal(tot);
      setPage(p);
    } catch {
      setError(true);
      if (!append) { setProducts([]); setTotal(0); }
    } finally { setLoading(false); }
  }, [search, platform]);

  useEffect(() => { loadCategories(); }, [loadCategories]);
  useEffect(() => { loadProducts(1); }, [loadProducts]);

  const hasMore = products.length < total;

  return (
    <div className="min-h-screen bg-stone-50 pb-20 lg:pb-0">
      <Header categories={categories} />

      {/* Lojas Parceiras */}
      <div className="bg-white py-4 px-4 border-b border-stone-100">
        <p className="text-center text-xs text-stone-400 font-medium mb-3">Lojas Parceiras</p>
        <div className="flex items-center gap-4 overflow-x-auto pb-1 justify-start sm:justify-center scrollbar-none">
          {LOJAS.map(loja => (
            <button
              key={loja.key}
              onClick={() => setPlatform(prev => prev === loja.key ? '' : loja.key)}
              className={`flex flex-col items-center gap-1 shrink-0 transition-opacity ${platform === loja.key ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            >
              <img src={loja.img} alt={loja.name} className={`w-12 h-12 rounded-xl object-cover border-2 transition-colors ${platform === loja.key ? 'border-orange-500' : 'border-stone-200'}`} />
              <span className="text-[10px] text-stone-500 font-medium whitespace-nowrap">{loja.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Header da seção + filtros de plataforma */}
        <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-stone-800 text-xl font-bold">Ofertas</h1>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setPlatform('')}
              className={`flex items-center gap-1 shrink-0 text-xs font-bold px-4 py-2 rounded-full border transition-all ${!platform ? 'bg-stone-800 text-white border-stone-800' : 'border-stone-200 text-stone-600 hover:border-stone-400'}`}
            >
              ⚡ Todas
            </button>
            {PLATFORMS_LIST.filter(p => p.key !== 'other').map(p => (
              <button
                key={p.key}
                onClick={() => setPlatform(prev => prev === p.key ? '' : p.key)}
                className={`flex items-center gap-1 shrink-0 text-xs font-bold px-4 py-2 rounded-full border transition-all ${platform === p.key ? `${p.color} border-transparent` : 'border-stone-200 text-stone-600 hover:border-stone-300'}`}
              >
                {p.emoji} {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contagem */}
        <p className="text-stone-400 text-sm mb-4">
          {search ? `"${search}" · ` : ''}
          <span className="font-semibold text-stone-600">{total}</span> ofertas
        </p>

        {/* Grid */}
        {loading && products.length === 0 ? (
          <div className="grid grid-flow-row grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-stone-200 p-4 animate-pulse">
                <div className="flex gap-4 lg:flex-col">
                  <div className="size-[100px] lg:size-[180px] rounded-xl bg-stone-200 shrink-0" />
                  <div className="flex-1 space-y-2 pt-2">
                    <div className="h-3 bg-stone-200 rounded w-1/3" />
                    <div className="h-3 bg-stone-200 rounded" />
                    <div className="h-3 bg-stone-200 rounded w-4/5" />
                    <div className="h-4 bg-stone-200 rounded w-1/4 mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-stone-400">
            <div className="text-5xl mb-4">⏳</div>
            <p className="text-lg font-medium">Servidor acordando...</p>
            <p className="text-sm mt-1">Pode demorar até 1 minuto. Aguarde e recarregue.</p>
            <button onClick={() => loadProducts(1)} className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors">
              Tentar novamente
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-medium">Nenhuma oferta encontrada</p>
            <p className="text-sm mt-1">Tente outros filtros ou volte mais tarde</p>
          </div>
        ) : (
          <>
            <div className="grid grid-flow-row grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {products.map(p => (
                <div key={p.id} onClick={() => setSelected(p)} className="cursor-pointer">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="text-center mt-8">
                <button onClick={() => loadProducts(page + 1, true)} disabled={loading} className="px-8 py-3 border border-stone-300 rounded-full text-sm font-semibold text-stone-600 hover:border-stone-500 transition-colors disabled:opacity-50">
                  {loading ? 'Carregando...' : 'Ver mais ofertas'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}

      {/* Footer */}
      <footer className="text-center py-8 text-stone-400 text-sm border-t border-stone-100 mt-12">
        <p>🔥 PromoVitrine · Economize sempre</p>
        <p className="text-xs mt-1">Os links são de afiliado. Ao comprar, você apoia este site sem custo extra.</p>
      </footer>

      {/* Navbar mobile fixa no bottom (estilo Promobit) */}
      <nav className="fixed bottom-0 left-0 z-20 h-16 w-full flex items-center justify-around border-t border-stone-200 bg-white shadow-lg lg:hidden">
        <Link to="/" className="flex flex-col items-center gap-1 text-orange-500">
          <span className="text-xl">🔥</span>
          <span className="text-[10px] font-bold">Ofertas</span>
        </Link>
        <Link to="/categoria/eletronicos-audio-e-video" className="flex flex-col items-center gap-1 text-stone-400">
          <span className="text-xl">📱</span>
          <span className="text-[10px] font-medium">Eletrônicos</span>
        </Link>
        <Link to="/categoria/moda-e-calcados-femininos" className="flex flex-col items-center gap-1 text-stone-400">
          <span className="text-xl">👗</span>
          <span className="text-[10px] font-medium">Moda</span>
        </Link>
        <Link to="/silva-admin" className="flex flex-col items-center gap-1 text-stone-400">
          <img src="https://i.postimg.cc/j2vrqS1Z/Oakley-Plantaris-50-s-ADS-Painting-study-of-retro-advertisements-oakley-oakleybr-oakley-oakle.jpg" alt="Admin" className="w-6 h-6 rounded-full object-cover" />
          <span className="text-[10px] font-medium">Admin</span>
        </Link>
      </nav>
    </div>
  );
}
