import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductModal from '../components/ProductModal';
import api from '../utils/api';
import { formatPrice, calcDiscount, getPlatform } from '../utils/platform';

const LOJAS = [
  { name: 'Shopee',         key: 'shopee',        img: 'https://i.postimg.cc/138ZnL1n/br-50009109-2e3301fdd34755e5e0f48c608ba6fc16.jpg',        domain: 'shopee.com.br' },
  { name: 'Amazon',         key: 'amazon',        img: 'https://i.postimg.cc/Qtg0CNQH/Minecraft-(English-Arabic-Box)-Play-Station-4-Edizione-Regno-Unito.jpg', domain: 'amazon.com.br' },
  { name: 'Mercado Livre',  key: 'mercadolivre',  img: 'https://i.postimg.cc/0j2dNY2y/Escola-de-E-commerce-Aprenda-a-viver-de-vendas-online.jpg', domain: 'mercadolivre.com.br' },
  { name: 'AliExpress',     key: 'aliexpress',    img: 'https://i.postimg.cc/J405V52G/download-(4).jpg',                                         domain: 'aliexpress.com' },
  { name: 'Shein',          key: 'shein',         img: 'https://i.postimg.cc/7L83z8Y0/SHEIN-icon.jpg',                                           domain: 'shein.com.br' },
  { name: 'Magazine Luiza', key: 'magalu',        img: 'https://i.postimg.cc/PJRZr0RJ/Link-Loja-Magalu.jpg',                                     domain: 'magazineluiza.com.br' },
  { name: 'Americanas',     key: 'americanas',    img: 'https://i.postimg.cc/T3mmf7qQ/JOVEM-APRENDIZ-LOJAS-AMERICANAS-2019-Inscricoes-Abertas.jpg', domain: 'americanas.com.br' },
];

const ADMIN_AVATAR = 'https://i.postimg.cc/j2vrqS1Z/Oakley-Plantaris-50-s-ADS-Painting-study-of-retro-advertisements-oakley-oakleybr-oakley-oakle.jpg';

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
  const [searchInput, setSearchInput] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lojasOpen, setLojasOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  const search = searchParams.get('busca') || '';
  const LIMIT = 24;

  const loadCategories = useCallback(async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(Array.isArray(data) ? data : []);
    } catch { setCategories([]); }
  }, []);

  const loadProducts = useCallback(async (p = 1, append = false) => {
    setLoading(true); setError(false);
    try {
      const params = { page: p, limit: LIMIT };
      if (search) params.search = search;
      if (platform) params.platform = platform;
      const { data } = await api.get('/products', { params });
      const arr = Array.isArray(data?.products) ? data.products : [];
      const tot = typeof data?.total === 'number' ? data.total : 0;
      setProducts(prev => append ? [...(prev || []), ...arr] : arr);
      setTotal(tot); setPage(p);
    } catch {
      setError(true);
      if (!append) { setProducts([]); setTotal(0); }
    } finally { setLoading(false); }
  }, [search, platform]);

  useEffect(() => { loadCategories(); }, [loadCategories]);
  useEffect(() => { loadProducts(1); }, [loadProducts]);

  function handleSearch(e) {
    e.preventDefault();
    if (searchInput.trim()) setSearchParams({ busca: searchInput.trim() });
    setSearchOpen(false);
  }

  const hasMore = products.length < total;

  return (
    <div style={{ fontFamily: "'Rubik', sans-serif" }} className="min-h-screen bg-[#f4f4f4] pb-20 lg:pb-0">

      {/* ── BARRA DE ANÚNCIO TOPO ── */}
      <div className="w-full bg-white h-16 lg:h-10 flex items-center justify-center border-b border-gray-100">
        <div className="text-xs text-gray-400 italic">Espaço para banner de anúncio</div>
      </div>

      {/* ── HEADER FIXO ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">

        {/* DESKTOP */}
        <div className="hidden lg:flex flex-col">
          {/* Linha 1: logo + busca + ações */}
          <div className="flex items-center gap-4 px-4 py-3 max-w-screen-xl mx-auto w-full">
            {/* Logo */}
            <Link to="/" className="shrink-0 flex items-center gap-1">
              <span className="text-[#00AAB5] font-bold text-xl tracking-tight">🔥 PromoVitrine</span>
            </Link>

            {/* Busca */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl">
              <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 h-10 focus-within:border-[#00AAB5] bg-white">
                <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input type="text" placeholder="Pesquisar oferta" value={searchInput} onChange={e => setSearchInput(e.target.value)} className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent" />
              </div>
            </form>

            {/* Ações direita */}
            <div className="flex items-center gap-1 ml-auto">
              <button className="flex flex-col items-center gap-1 w-[90px] py-1 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#00AAB5] text-white text-lg">🔔</span>
                <span className="text-[10px] text-gray-500 text-center leading-tight">Notificações</span>
              </button>
              {/* Avatar admin */}
              <Link to="/silva-admin" className="flex flex-col items-center gap-1 w-[90px] py-1 hover:bg-gray-50 rounded-lg transition-colors">
                <img src={ADMIN_AVATAR} alt="Admin" className="w-10 h-10 rounded-full object-cover border-2 border-gray-200" />
                <span className="text-[10px] text-gray-500 text-center leading-tight truncate w-full px-1">Admin</span>
              </Link>
            </div>
          </div>

          {/* Linha 2: nav */}
          <div className="flex items-center gap-1 px-4 pb-2 max-w-screen-xl mx-auto w-full border-t border-gray-100">
            {/* Categorias dropdown */}
            <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
              <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50">
                Categorias <span className="text-xs">▾</span>
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-xl shadow-lg p-4 min-w-[220px] z-50 max-h-80 overflow-y-auto">
                  <Link to="/" className="block text-sm text-gray-600 hover:text-[#00AAB5] py-1.5 border-b border-gray-100 mb-1">🔥 Todas as categorias</Link>
                  {categories.map(cat => (
                    <Link key={cat.id} to={`/categoria/${cat.slug}`} className="block text-sm text-gray-600 hover:text-[#00AAB5] py-1">
                      {cat.icon} {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Lojas dropdown */}
            <div className="relative" onMouseEnter={() => setLojasOpen(true)} onMouseLeave={() => setLojasOpen(false)}>
              <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50">
                Lojas <span className="text-xs">▾</span>
              </button>
              {lojasOpen && (
                <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50 min-w-max">
                  <div className="grid grid-cols-4 gap-4 mb-3">
                    {LOJAS.map(loja => (
                      <button key={loja.key} onClick={() => { setPlatform(prev => prev === loja.key ? '' : loja.key); setLojasOpen(false); }}
                        className="flex flex-col items-start gap-0.5">
                        <span className="text-xs font-bold text-gray-700">{loja.name}</span>
                        <span className="text-xs text-gray-400">{loja.domain}</span>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setPlatform('')} className="text-xs font-bold text-white bg-[#00AAB5] px-4 py-2 rounded-lg hover:bg-[#008a94] transition-colors">
                    Ver todas as lojas
                  </button>
                </div>
              )}
            </div>

            {/* Links de destaque */}
            <Link to="/silva-admin" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50">Admin</Link>
          </div>
        </div>

        {/* MOBILE */}
        <div className="flex lg:hidden items-center justify-between px-3 py-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full hover:bg-gray-100">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <Link to="/"><span className="text-[#00AAB5] font-bold text-lg">🔥 PromoVitrine</span></Link>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-full hover:bg-gray-100">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
            <Link to="/silva-admin">
              <img src={ADMIN_AVATAR} alt="Admin" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
            </Link>
          </div>
        </div>

        {/* Busca mobile expandida */}
        {searchOpen && (
          <div className="lg:hidden px-3 pb-3">
            <form onSubmit={handleSearch} className="flex items-center gap-2 border border-gray-300 rounded-full px-4 h-10 bg-white focus-within:border-[#00AAB5]">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input autoFocus type="text" placeholder="Pesquisar oferta" value={searchInput} onChange={e => setSearchInput(e.target.value)} className="flex-1 text-sm outline-none bg-transparent" />
            </form>
          </div>
        )}

        {/* Menu mobile */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 px-3 py-2 flex flex-wrap gap-1 bg-white">
            <Link to="/" onClick={() => setMenuOpen(false)} className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#00AAB5] text-white">🔥 Todas</Link>
            {categories.map(cat => (
              <Link key={cat.id} to={`/categoria/${cat.slug}`} onClick={() => setMenuOpen(false)} className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 whitespace-nowrap">
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* ── BANNER CARROSSEL ── */}
      <div className="max-w-screen-xl mx-auto px-4 mt-4">
        <div className="w-full h-[120px] md:h-[200px] lg:h-[280px] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400 text-sm border border-gray-300">
          Banner — aguardando link
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4">

        {/* ── RECOMENDADAS ── */}
        {products.length > 0 && (
          <div className="mt-8">
            <p className="text-gray-800 text-xl font-bold mb-4">Recomendadas</p>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none -mx-1 px-1">
              {products.slice(0, 6).map(p => {
                const plat = getPlatform(p.platform);
                const img = p.images?.[0]?.url;
                const disc = calcDiscount(p.original_price, p.promo_price);
                return (
                  <div key={p.id} onClick={() => setSelected(p)}
                    className="shrink-0 w-[200px] bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer hover:shadow-md transition-shadow flex flex-col gap-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500 truncate">
                      {plat.img && <img src={plat.img} alt={plat.label} className="w-4 h-4 rounded object-cover" />}
                      <span>{plat.domain || plat.label}</span>
                      <span className="text-[#00AAB5]">✓</span>
                    </div>
                    <div className="flex justify-center">
                      {img
                        ? <img src={img} alt={p.title} className="w-[140px] h-[140px] object-cover rounded-xl" />
                        : <div className="w-[140px] h-[140px] bg-gray-100 rounded-xl flex items-center justify-center text-3xl">🛍️</div>
                      }
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2 min-h-10">{p.title}</p>
                    <div className="flex items-baseline gap-1 flex-wrap">
                      {disc && <span className="text-xs text-gray-400 line-through">{formatPrice(p.original_price)}</span>}
                      <span className="text-lg font-bold text-gray-800">
                        {p.promo_price > 0 ? formatPrice(p.promo_price) : p.original_price > 0 ? formatPrice(p.original_price) : 'Ver preço'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── OFERTAS + FILTROS ── */}
        <div className="mt-8 pb-8">
          <div className="flex flex-col gap-4 mb-5 lg:flex-row lg:items-center lg:justify-between">
            <h1 className="text-gray-800 text-xl font-bold lg:text-3xl">Ofertas</h1>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button onClick={() => setPlatform('')}
                className={`flex items-center gap-1 shrink-0 text-xs font-bold px-4 py-2 rounded-full border transition-all ${!platform ? 'bg-[#00AAB5] border-[#00AAB5] text-white' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                ⚡ Destaques
              </button>
              {LOJAS.map(loja => (
                <button key={loja.key} onClick={() => setPlatform(prev => prev === loja.key ? '' : loja.key)}
                  className={`flex items-center gap-1.5 shrink-0 text-xs font-bold px-4 py-2 rounded-full border transition-all ${platform === loja.key ? 'bg-[#00AAB5] border-[#00AAB5] text-white' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                  <img src={loja.img} alt={loja.name} className="w-4 h-4 rounded object-cover" />
                  {loja.name}
                </button>
              ))}
            </div>
          </div>

          <p className="text-gray-400 text-sm mb-4">
            {search ? `"${search}" · ` : ''}
            <span className="font-semibold text-gray-600">{total}</span> ofertas
          </p>

          {/* Grid */}
          {loading && products.length === 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse">
                  <div className="flex gap-4 lg:flex-col">
                    <div className="size-[100px] lg:size-[180px] rounded-xl bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-2 pt-2">
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-4 bg-gray-200 rounded w-1/4 mt-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">⏳</div>
              <p className="text-lg font-medium">Servidor acordando...</p>
              <p className="text-sm mt-1">Pode demorar até 1 minuto.</p>
              <button onClick={() => loadProducts(1)} className="mt-4 px-6 py-2 bg-[#00AAB5] text-white rounded-full text-sm font-semibold hover:bg-[#008a94]">Tentar novamente</button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-lg font-medium">Nenhuma oferta encontrada</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {products.map(p => {
                  const plat = getPlatform(p.platform);
                  const img = p.images?.[0]?.url;
                  const disc = calcDiscount(p.original_price, p.promo_price);
                  return (
                    <div key={p.id} onClick={() => setSelected(p)}
                      className="relative flex h-full select-none flex-col justify-between rounded-2xl border border-gray-200 p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer">
                      <div className="relative flex size-full flex-row gap-4 lg:flex-col">
                        {/* Loja desktop */}
                        <div className="hidden lg:flex items-center gap-1 pb-3">
                          {plat.img && <img src={plat.img} alt={plat.label} className="w-4 h-4 rounded object-cover" />}
                          <span className="text-sm text-gray-500 truncate">{plat.domain || plat.label}</span>
                          <span className="text-[#00AAB5] text-xs">✓</span>
                        </div>
                        {/* Imagem */}
                        <div className="relative flex justify-center shrink-0">
                          {img
                            ? <img src={img} alt={p.title} loading="lazy" className="size-[100px] md:size-[160px] lg:size-[180px] self-center rounded-xl object-cover" />
                            : <div className="size-[100px] md:size-[160px] lg:size-[180px] rounded-xl bg-gray-100 flex items-center justify-center text-3xl">🛍️</div>
                          }
                          {disc && <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg">-{disc}%</div>}
                        </div>
                        {/* Info */}
                        <div className="flex size-full flex-col pb-3 justify-between border-b border-gray-100">
                          {/* Loja mobile */}
                          <div className="flex items-center lg:hidden mb-1 gap-1">
                            {plat.img && <img src={plat.img} alt={plat.label} className="w-4 h-4 rounded object-cover" />}
                            <span className="text-xs text-gray-500">{plat.domain || plat.label}</span>
                            <span className="text-[#00AAB5] text-xs">✓</span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1 line-clamp-2 min-h-10 break-words">{p.title}</p>
                          <div className="flex items-baseline gap-2 flex-wrap mt-2">
                            {p.promo_price > 0 ? (
                              <>
                                {p.original_price > 0 && p.original_price !== p.promo_price && (
                                  <span className="text-sm text-gray-400 line-through">{formatPrice(p.original_price)}</span>
                                )}
                                <span className="text-lg font-bold text-gray-800">{formatPrice(p.promo_price)}</span>
                              </>
                            ) : p.original_price > 0 ? (
                              <span className="text-lg font-bold text-gray-800">{formatPrice(p.original_price)}</span>
                            ) : (
                              <span className="text-sm text-gray-400 italic">Ver preço no site</span>
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
                  <button onClick={() => loadProducts(page + 1, true)} disabled={loading}
                    className="px-8 py-3 border border-gray-300 rounded-full text-sm font-semibold text-gray-600 hover:border-gray-500 transition-colors disabled:opacity-50">
                    {loading ? 'Carregando...' : 'Ver mais ofertas'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-4 border-[#00AAB5] bg-white py-8 text-center text-gray-400 text-sm mt-4">
        <p className="font-medium text-gray-600">🔥 PromoVitrine · Economize sempre</p>
        <p className="text-xs mt-1">Os links são de afiliado. Ao comprar, você apoia este site sem custo extra.</p>
      </footer>

      {/* Modal */}
      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}

      {/* ── NAVBAR MOBILE FIXA (estilo Promobit) ── */}
      <nav className="fixed bottom-0 left-0 z-20 h-20 w-full flex items-start justify-between border-t border-gray-200 bg-white shadow-[0_-2px_4px_0_rgba(19,19,19,0.1)] lg:hidden px-1">
        <Link to="/" className="flex h-full flex-1 flex-col items-center justify-start px-0 pt-4 text-center text-[#00AAB5]">
          <span className="text-xl">🔥</span>
          <p className="text-xs font-bold mt-1">Ofertas</p>
        </Link>
        <button onClick={() => setSearchOpen(true)} className="flex h-full flex-1 flex-col items-center justify-start px-0 pt-4 text-center text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <p className="text-xs font-bold mt-1">Buscar</p>
        </button>
        <button className="flex h-full flex-1 flex-col items-center justify-start px-0 pt-4 text-center text-gray-400">
          <span className="text-xl">❤️</span>
          <p className="text-xs font-bold mt-1">Desejos</p>
        </button>
        <Link to="/silva-admin" className="flex h-full flex-1 flex-col items-center justify-start px-0 pt-4 text-center text-gray-400">
          <span className="text-xl">➕</span>
          <p className="text-xs font-bold mt-1">Sugerir</p>
        </Link>
      </nav>
    </div>
  );
}
