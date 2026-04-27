import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductModal from '../components/ProductModal';
import api from '../utils/api';
import { formatPrice, calcDiscount, getPlatform } from '../utils/platform';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [platform, setPlatform] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

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

  function handleSearch(e) {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ busca: searchInput.trim() });
    }
    setSearchOpen(false);
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20 lg:pb-0">

      {/* ── HEADER DESKTOP ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-sm">

        {/* Linha principal desktop */}
        <div className="hidden lg:flex items-center gap-4 px-4 py-3 max-w-screen-xl mx-auto">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <span className="font-bold text-xl text-stone-900">🔥 Promo<span className="text-orange-500">Vitrine</span></span>
          </Link>

          {/* Busca */}
          <div className="flex-1 max-w-xl">
            <form onSubmit={handleSearch} className="flex items-center gap-2 border border-stone-300 rounded-full px-4 py-2 focus-within:border-orange-400 bg-white">
              <span className="text-stone-400">🔍</span>
              <input
                type="text"
                placeholder="Pesquisar oferta"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="flex-1 text-sm outline-none text-stone-700 placeholder:text-stone-400"
              />
            </form>
          </div>

          {/* Categorias dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-bold text-stone-700 hover:text-stone-900 px-2 py-2">
              Categorias <span className="text-xs">▾</span>
            </button>
            <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-stone-200 rounded-xl shadow-lg p-4 min-w-[200px] z-50">
              <Link to="/" className="block text-sm text-stone-600 hover:text-orange-500 py-1">🔥 Todas</Link>
              {categories.map(cat => (
                <Link key={cat.id} to={`/categoria/${cat.slug}`} className="block text-sm text-stone-600 hover:text-orange-500 py-1">
                  {cat.icon} {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Lojas dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-bold text-stone-700 hover:text-stone-900 px-2 py-2">
              Lojas <span className="text-xs">▾</span>
            </button>
            <div className="absolute top-full left-0 hidden group-hover:block bg-white border border-stone-200 rounded-xl shadow-lg p-4 min-w-[160px] z-50">
              {['shopee','amazon','mercadolivre','aliexpress','shein','magalu','americanas'].map(k => (
                <button key={k} onClick={() => setPlatform(prev => prev === k ? '' : k)} className={`block w-full text-left text-sm py-1 capitalize hover:text-orange-500 ${platform === k ? 'text-orange-500 font-bold' : 'text-stone-600'}`}>
                  {k === 'mercadolivre' ? 'Mercado Livre' : k === 'magalu' ? 'Magazine Luiza' : k.charAt(0).toUpperCase() + k.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Admin */}
          <Link to="/silva-admin" className="shrink-0 hover:opacity-80 transition-opacity ml-auto">
            <img src="https://i.postimg.cc/j2vrqS1Z/Oakley-Plantaris-50-s-ADS-Painting-study-of-retro-advertisements-oakley-oakleybr-oakley-oakle.jpg" alt="Admin" className="w-9 h-9 rounded-full object-cover border-2 border-stone-200" />
          </Link>
        </div>

        {/* Linha de categorias desktop */}
        <div className="hidden lg:flex items-center gap-1 px-4 pb-2 max-w-screen-xl mx-auto overflow-x-auto">
          <Link to="/" className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-full bg-orange-500 text-white">🔥 Todas</Link>
          {categories.map(cat => (
            <Link key={cat.id} to={`/categoria/${cat.slug}`} className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full bg-stone-100 text-stone-700 hover:bg-orange-100 hover:text-orange-700 whitespace-nowrap transition-colors">
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>

        {/* ── HEADER MOBILE ── */}
        <div className="flex lg:hidden items-center justify-between px-3 py-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-lg hover:bg-stone-100">
              <div className="space-y-1">
                <span className="block w-5 h-0.5 bg-stone-600"></span>
                <span className="block w-5 h-0.5 bg-stone-600"></span>
                <span className="block w-5 h-0.5 bg-stone-600"></span>
              </div>
            </button>
            <Link to="/"><span className="font-bold text-lg text-stone-900">🔥 Promo<span className="text-orange-500">Vitrine</span></span></Link>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-full hover:bg-stone-100 text-stone-500">🔍</button>
            <Link to="/silva-admin">
              <img src="https://i.postimg.cc/j2vrqS1Z/Oakley-Plantaris-50-s-ADS-Painting-study-of-retro-advertisements-oakley-oakleybr-oakley-oakle.jpg" alt="Admin" className="w-8 h-8 rounded-full object-cover border border-stone-200" />
            </Link>
          </div>
        </div>

        {/* Busca mobile expandida */}
        {searchOpen && (
          <div className="lg:hidden px-3 pb-3">
            <form onSubmit={handleSearch} className="flex items-center gap-2 border border-stone-300 rounded-full px-4 py-2 bg-white">
              <span className="text-stone-400">🔍</span>
              <input autoFocus type="text" placeholder="Pesquisar oferta" value={searchInput} onChange={e => setSearchInput(e.target.value)} className="flex-1 text-sm outline-none" />
            </form>
          </div>
        )}

        {/* Menu mobile */}
        {menuOpen && (
          <div className="lg:hidden border-t border-stone-100 px-3 py-2 flex flex-wrap gap-1">
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-xs font-bold px-3 py-1.5 rounded-full bg-orange-500 text-white">🔥 Todas</Link>
            {categories.map(cat => (
              <Link key={cat.id} to={`/categoria/${cat.slug}`} onClick={() => setMenuOpen(false)} className="text-xs font-medium px-3 py-1.5 rounded-full bg-stone-100 text-stone-700 whitespace-nowrap">
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* ── BANNER CAROUSEL (placeholder) ── */}
      <div className="w-full bg-stone-100 border-b border-stone-200">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="w-full h-[120px] md:h-[200px] lg:h-[280px] bg-stone-200 rounded-2xl flex items-center justify-center text-stone-400 text-sm">
            Banner — aguardando link
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4">

        {/* ── LOJAS PARCEIRAS ── */}
        <div className="py-6 border-b border-stone-100">
          <p className="text-stone-800 text-lg font-bold mb-4">Lojas Parceiras</p>
          <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
            {[
              { name: 'Shopee',         key: 'shopee',        img: 'https://i.postimg.cc/138ZnL1n/br-50009109-2e3301fdd34755e5e0f48c608ba6fc16.jpg' },
              { name: 'Amazon',         key: 'amazon',        img: 'https://i.postimg.cc/Qtg0CNQH/Minecraft-(English-Arabic-Box)-Play-Station-4-Edizione-Regno-Unito.jpg' },
              { name: 'Mercado Livre',  key: 'mercadolivre',  img: 'https://i.postimg.cc/0j2dNY2y/Escola-de-E-commerce-Aprenda-a-viver-de-vendas-online.jpg' },
              { name: 'AliExpress',     key: 'aliexpress',    img: 'https://i.postimg.cc/J405V52G/download-(4).jpg' },
              { name: 'Shein',          key: 'shein',         img: 'https://i.postimg.cc/7L83z8Y0/SHEIN-icon.jpg' },
              { name: 'Magazine Luiza', key: 'magalu',        img: 'https://i.postimg.cc/PJRZr0RJ/Link-Loja-Magalu.jpg' },
              { name: 'Americanas',     key: 'americanas',    img: 'https://i.postimg.cc/T3mmf7qQ/JOVEM-APRENDIZ-LOJAS-AMERICANAS-2019-Inscricoes-Abertas.jpg' },
            ].map(loja => (
              <button key={loja.key} onClick={() => setPlatform(prev => prev === loja.key ? '' : loja.key)}
                className={`flex flex-col items-center gap-1 shrink-0 transition-opacity ${platform === loja.key ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
                <img src={loja.img} alt={loja.name} className={`w-14 h-14 rounded-2xl object-cover border-2 transition-colors ${platform === loja.key ? 'border-orange-500' : 'border-stone-200'}`} />
                <span className="text-[11px] text-stone-500 font-medium whitespace-nowrap">{loja.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── RECOMENDADAS (carrossel) ── */}
        {products.length > 0 && (
          <div className="py-6 border-b border-stone-100">
            <p className="text-stone-800 text-lg font-bold mb-4">Recomendadas</p>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
              {products.slice(0, 6).map(p => {
                const plat = getPlatform(p.platform);
                const img = p.images?.[0]?.url;
                return (
                  <div key={p.id} onClick={() => setSelected(p)} className="shrink-0 w-[200px] bg-white border border-stone-200 rounded-2xl p-4 cursor-pointer hover:shadow-md transition-shadow flex flex-col gap-2">
                    <span className="text-xs text-stone-400 truncate">{plat.emoji} {plat.label}</span>
                    <div className="flex justify-center">
                      {img ? <img src={img} alt={p.title} className="w-[120px] h-[120px] object-cover rounded-xl" /> : <div className="w-[120px] h-[120px] bg-stone-100 rounded-xl flex items-center justify-center text-3xl">🛍️</div>}
                    </div>
                    <p className="text-sm text-stone-700 line-clamp-2 min-h-10">{p.title}</p>
                    <p className="text-base font-bold text-stone-800">
                      {p.promo_price > 0 ? formatPrice(p.promo_price) : p.original_price > 0 ? formatPrice(p.original_price) : 'Ver preço'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── OFERTAS + FILTROS ── */}
        <div className="py-6">
          <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-stone-800 text-xl font-bold">Ofertas</h1>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button onClick={() => setPlatform('')} className={`flex items-center gap-1 shrink-0 text-xs font-bold px-4 py-2 rounded-full border transition-all ${!platform ? 'bg-orange-500 border-orange-500 text-white' : 'border-stone-200 text-stone-600 hover:border-stone-400'}`}>
                ⚡ Destaques
              </button>
              {['shopee','amazon','mercadolivre','aliexpress','shein','magalu','americanas'].map(k => {
                const plat = getPlatform(k);
                return (
                  <button key={k} onClick={() => setPlatform(prev => prev === k ? '' : k)}
                    className={`flex items-center gap-1 shrink-0 text-xs font-bold px-4 py-2 rounded-full border transition-all ${platform === k ? 'bg-orange-500 border-orange-500 text-white' : 'border-stone-200 text-stone-600 hover:border-stone-300'}`}>
                    {plat.emoji} {plat.label}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-stone-400 text-sm mb-4">
            {search ? `"${search}" · ` : ''}
            <span className="font-semibold text-stone-600">{total}</span> ofertas
          </p>

          {/* Grid */}
          {loading && products.length === 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-stone-200 p-4 animate-pulse">
                  <div className="flex gap-4 lg:flex-col">
                    <div className="size-[100px] lg:size-[180px] rounded-xl bg-stone-200 shrink-0" />
                    <div className="flex-1 space-y-2 pt-2">
                      <div className="h-3 bg-stone-200 rounded w-1/3" />
                      <div className="h-3 bg-stone-200 rounded" />
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
              <p className="text-sm mt-1">Pode demorar até 1 minuto.</p>
              <button onClick={() => loadProducts(1)} className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full text-sm font-semibold">Tentar novamente</button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-stone-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-medium">Nenhuma oferta encontrada</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {products.map(p => {
                  const plat = getPlatform(p.platform);
                  const img = p.images?.[0]?.url;
                  const discount = calcDiscount(p.original_price, p.promo_price);
                  return (
                    <div key={p.id} onClick={() => setSelected(p)} className="relative flex h-full select-none flex-col justify-between rounded-2xl border border-stone-200 p-4 shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer">
                      <div className="relative flex size-full flex-row gap-4 lg:flex-col">
                        {/* Loja — só desktop */}
                        <div className="hidden lg:flex items-center gap-1 pb-3">
                          <span className="text-sm text-stone-500 truncate">{plat.emoji} {plat.label}</span>
                        </div>
                        {/* Imagem */}
                        <div className="relative flex justify-center shrink-0">
                          {img
                            ? <img src={img} alt={p.title} loading="lazy" className="size-[100px] md:size-[160px] lg:size-[180px] self-center rounded-xl object-cover" />
                            : <div className="size-[100px] md:size-[160px] lg:size-[180px] rounded-xl bg-stone-100 flex items-center justify-center text-3xl">🛍️</div>
                          }
                          {discount && <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg">-{discount}%</div>}
                        </div>
                        {/* Info */}
                        <div className="flex size-full flex-col pb-3 justify-between border-b border-stone-100">
                          {/* Loja — só mobile */}
                          <div className="flex items-center lg:hidden mb-1 gap-1">
                            <span className="text-xs text-stone-500">{plat.emoji} {plat.label}</span>
                          </div>
                          <p className="text-sm text-stone-700 mt-1 line-clamp-2 min-h-10 break-words">{p.title}</p>
                          <div className="flex items-baseline gap-2 flex-wrap mt-2">
                            {p.promo_price > 0 ? (
                              <>
                                {p.original_price > 0 && p.original_price !== p.promo_price && (
                                  <span className="text-xs text-stone-400 line-through">{formatPrice(p.original_price)}</span>
                                )}
                                <span className="text-base font-bold text-stone-800">{formatPrice(p.promo_price)}</span>
                              </>
                            ) : p.original_price > 0 ? (
                              <span className="text-base font-bold text-stone-800">{formatPrice(p.original_price)}</span>
                            ) : (
                              <span className="text-sm text-stone-400 italic">Ver preço no site</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-stone-400 text-sm border-t border-stone-100 mt-4">
        <p>🔥 PromoVitrine · Economize sempre</p>
        <p className="text-xs mt-1">Os links são de afiliado. Ao comprar, você apoia este site sem custo extra.</p>
      </footer>

      {/* Modal */}
      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}

      {/* ── NAVBAR MOBILE FIXA ── */}
      <nav className="fixed bottom-0 left-0 z-20 h-16 w-full flex items-center justify-around border-t border-stone-200 bg-white shadow-lg lg:hidden">
        <Link to="/" className="flex flex-col items-center gap-0.5 text-orange-500">
          <span className="text-xl">🔥</span>
          <span className="text-[10px] font-bold">Ofertas</span>
        </Link>
        <button onClick={() => setSearchOpen(true)} className="flex flex-col items-center gap-0.5 text-stone-400">
          <span className="text-xl">🔍</span>
          <span className="text-[10px] font-medium">Buscar</span>
        </button>
        <Link to="/categoria/games" className="flex flex-col items-center gap-0.5 text-stone-400">
          <span className="text-xl">🎮</span>
          <span className="text-[10px] font-medium">Games</span>
        </Link>
        <Link to="/silva-admin" className="flex flex-col items-center gap-0.5 text-stone-400">
          <img src="https://i.postimg.cc/j2vrqS1Z/Oakley-Plantaris-50-s-ADS-Painting-study-of-retro-advertisements-oakley-oakleybr-oakley-oakle.jpg" alt="Admin" className="w-6 h-6 rounded-full object-cover" />
          <span className="text-[10px] font-medium">Admin</span>
        </Link>
      </nav>
    </div>
  );
}
