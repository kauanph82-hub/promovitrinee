import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import api from '../utils/api';

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    api.get('/categories').then(({ data }) => {
      setCategories(data);
      const cat = data.find(c => c.slug === slug);
      setCategory(cat || null);
      if (cat) {
        api.get('/products', { params: { category_id: cat.id, limit: 24, page: 1 } })
          .then(({ data: pd }) => {
            setProducts(pd.products);
            setTotal(pd.total);
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, [slug]);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header categories={categories} />

      {/* Banner categoria */}
      <div className="bg-gradient-to-r from-stone-800 to-stone-700 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-5xl mb-3">{category?.icon || '🏷️'}</div>
          <h1 className="font-display font-extrabold text-3xl">{category?.name || 'Categoria'}</h1>
          {category?.description && <p className="text-stone-300 mt-2">{category.description}</p>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-4 text-sm text-stone-500">
          <Link to="/" className="hover:text-brand-500 transition-colors">Início</Link>
          <span>›</span>
          <span className="text-stone-800 font-medium">{category?.name}</span>
          <span className="ml-auto">{total} ofertas</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-stone-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-stone-200 rounded w-1/2" />
                  <div className="h-3 bg-stone-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-stone-400">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-lg font-medium">Nenhuma oferta nesta categoria ainda</p>
            <Link to="/" className="btn-primary mt-4 inline-block">Ver todas as ofertas</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.map(p => (
              <div key={p.id} onClick={() => setSelected(p)}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
