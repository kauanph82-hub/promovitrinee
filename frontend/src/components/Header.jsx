import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ categories = [] }) {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) navigate(`/?busca=${encodeURIComponent(search.trim())}`);
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-stone-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Topo */}
        <div className="flex items-center gap-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🔥</span>
            <span className="font-display font-bold text-xl text-stone-900">
              Promo<span className="text-brand-500">Vitrine</span>
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar ofertas..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input pr-10 bg-stone-50"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-brand-500 transition-colors">
                🔍
              </button>
            </div>
          </form>

          {/* Logo Admin - Acesso rápido */}
          <Link 
            to="/silva-admin" 
            className="hidden md:block shrink-0 hover:opacity-80 transition-opacity"
            title="Acesso Admin"
          >
            <img 
              src="https://i.postimg.cc/j2vrqS1Z/Oakley-Plantaris-50-s-ADS-Painting-study-of-retro-advertisements-oakley-oakleybr-oakley-oakle.jpg" 
              alt="Admin" 
              className="w-10 h-10 rounded-full object-cover border-2 border-stone-200 hover:border-brand-500 transition-colors"
            />
          </Link>

          {/* Hamburger mobile */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-stone-100">
            <div className="space-y-1.5">
              <span className="block w-5 h-0.5 bg-stone-600 transition-all"></span>
              <span className="block w-5 h-0.5 bg-stone-600"></span>
              <span className="block w-5 h-0.5 bg-stone-600 transition-all"></span>
            </div>
          </button>
        </div>

        {/* Categorias */}
        <nav className={`${menuOpen ? 'flex' : 'hidden'} md:flex flex-wrap gap-1 pb-2 overflow-x-auto`}>
          <Link to="/" className="text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-500 text-white whitespace-nowrap">
            🔥 Todas
          </Link>
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/categoria/${cat.slug}`}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-stone-100 text-stone-700 hover:bg-brand-100 hover:text-brand-700 whitespace-nowrap transition-colors"
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
          
          {/* Logo Admin Mobile */}
          <Link 
            to="/silva-admin" 
            className="md:hidden flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-stone-800 text-white hover:bg-brand-600 whitespace-nowrap transition-colors"
          >
            <img 
              src="https://i.postimg.cc/j2vrqS1Z/Oakley-Plantaris-50-s-ADS-Painting-study-of-retro-advertisements-oakley-oakleybr-oakley-oakle.jpg" 
              alt="Admin" 
              className="w-5 h-5 rounded-full object-cover"
            />
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
