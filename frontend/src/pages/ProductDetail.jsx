import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { getPlatform, formatPrice, calcDiscount } from '../utils/platform';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-400">Carregando...</div>;
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="text-5xl">😕</div>
      <p className="text-xl font-display font-semibold">Produto não encontrado</p>
      <Link to="/" className="btn-primary">Voltar à vitrine</Link>
    </div>
  );

  const platform = getPlatform(product.platform);
  const discount = calcDiscount(product.original_price, product.promo_price);

  function copyCoupon(code) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-stone-400 mb-6">
          <Link to="/" className="hover:text-brand-500 transition-colors">Início</Link>
          <span>›</span>
          {product.category && (
            <>
              <Link to={`/categoria/${product.category.slug}`} className="hover:text-brand-500 transition-colors">
                {product.category.name}
              </Link>
              <span>›</span>
            </>
          )}
          <span className="text-stone-600 truncate max-w-xs">{product.title}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Galeria */}
            <div className="bg-stone-50 p-4">
              {product.images?.length > 0 ? (
                <>
                  <div className="aspect-square rounded-xl overflow-hidden mb-3">
                    <img src={product.images[activeImg]?.url} alt={product.title} className="w-full h-full object-contain" />
                  </div>
                  {product.images.length > 1 && (
                    <div className="flex gap-2 flex-wrap">
                      {product.images.map((img, i) => (
                        <button key={img.id} onClick={() => setActiveImg(i)}
                          className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? 'border-brand-500' : 'border-transparent opacity-60'}`}>
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-square rounded-xl bg-stone-200 flex items-center justify-center text-5xl">🛍️</div>
              )}
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col">
              <span className={`badge-platform ${platform.color} self-start mb-3`}>{platform.emoji} {platform.label}</span>

              <h1 className="font-display font-bold text-xl text-stone-900 leading-snug mb-4">{product.title}</h1>

              {/* Preço */}
              <div className="flex items-baseline gap-3 flex-wrap mb-2">
                {product.original_price && <span className="text-stone-400 line-through">{formatPrice(product.original_price)}</span>}
                {product.promo_price && <span className="text-3xl font-bold text-brand-600">{formatPrice(product.promo_price)}</span>}
                {discount && <span className="bg-red-100 text-red-700 text-sm font-bold px-2 py-1 rounded-lg">-{discount}%</span>}
              </div>

              {product.description && <p className="text-stone-600 text-sm leading-relaxed mb-4">{product.description}</p>}

              {/* Cupons */}
              {product.coupons?.length > 0 && (
                <div className="mb-5 space-y-2">
                  <h3 className="font-semibold text-stone-900 text-sm">🏷️ Cupons de desconto</h3>
                  {product.coupons.map(c => (
                    <div key={c.id} className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3">
                      <div className="flex-1">
                        <code className="text-green-800 font-bold tracking-wider">{c.code}</code>
                        {c.description && <p className="text-xs text-green-700 mt-0.5">{c.description}</p>}
                        {c.discount && <p className="text-xs font-semibold text-green-600">{c.discount}</p>}
                      </div>
                      <button onClick={() => copyCoupon(c.code)}
                        className="text-xs font-semibold px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        {copied === c.code ? '✓ Copiado!' : 'Copiar'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Tags */}
              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {product.tags.map(tag => (
                    <span key={tag} className="text-xs bg-stone-100 text-stone-500 px-3 py-1 rounded-full">#{tag}</span>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="mt-auto">
                <a href={product.affiliate_link} target="_blank" rel="noopener noreferrer"
                  className="btn-primary w-full text-base py-4 flex items-center justify-center gap-2">
                  🛒 Ver no {platform.label}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <p className="text-center text-xs text-stone-400 mt-2">Link de afiliado · Sem custo extra para você</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="btn-secondary inline-flex items-center gap-2">
            ← Voltar às ofertas
          </Link>
        </div>
      </div>
    </div>
  );
}
