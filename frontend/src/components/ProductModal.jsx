import { useState, useEffect } from 'react';
import { getPlatform, formatPrice, calcDiscount } from '../utils/platform';

export default function ProductModal({ product, onClose }) {
  const [activeImg, setActiveImg] = useState(0);
  const [copied, setCopied] = useState(null);

  const platform = getPlatform(product.platform);
  const discount = calcDiscount(product.original_price, product.promo_price);
  const images = product.images || [];

  // Fecha com ESC
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function copyCoupon(code) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  function goToStore() {
    window.open(product.affiliate_link, '_blank', 'noopener,noreferrer');
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[95vh] flex flex-col animate-slide-up">
        {/* Header do modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <span className={`badge-platform ${platform.color}`}>
            {platform.emoji} {platform.label}
          </span>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-500 text-lg transition-colors">
            ✕
          </button>
        </div>

        {/* Conteúdo scrollável */}
        <div className="overflow-y-auto flex-1">
          {/* Galeria */}
          {images.length > 0 && (
            <div className="bg-stone-50">
              <div className="aspect-video sm:aspect-[4/3] overflow-hidden">
                <img
                  src={images[activeImg]?.url}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImg(i)}
                      className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImg === i ? 'border-brand-500' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Infos */}
          <div className="p-5 space-y-4">
            {/* Título e desconto */}
            <div>
              {discount && (
                <span className="inline-block bg-red-100 text-red-700 text-sm font-bold px-3 py-1 rounded-full mb-2">
                  🔥 {discount}% OFF
                </span>
              )}
              <h2 className="font-display font-bold text-lg text-stone-900 leading-snug">
                {product.title}
              </h2>
            </div>

            {/* Preço */}
            <div className="flex items-baseline gap-3 flex-wrap">
              {product.original_price && (
                <span className="text-stone-400 line-through text-sm">
                  {formatPrice(product.original_price)}
                </span>
              )}
              {product.promo_price && (
                <span className="text-2xl font-bold text-brand-600">
                  {formatPrice(product.promo_price)}
                </span>
              )}
              {!product.promo_price && !product.original_price && (
                <span className="text-stone-400 italic text-sm">Ver preço no site</span>
              )}
            </div>

            {/* Descrição */}
            {product.description && (
              <p className="text-stone-600 text-sm leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <span key={tag} className="text-xs bg-stone-100 text-stone-600 px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Cupons */}
            {product.coupons?.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-display font-semibold text-stone-900 flex items-center gap-2">
                  🏷️ Cupons de desconto
                </h3>
                {product.coupons.map(coupon => (
                  <div key={coupon.id} className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3">
                    <div className="flex-1 min-w-0">
                      <code className="text-green-800 font-bold text-base tracking-widest">
                        {coupon.code}
                      </code>
                      {coupon.description && (
                        <p className="text-green-700 text-xs mt-0.5">{coupon.description}</p>
                      )}
                      {coupon.discount && (
                        <p className="text-green-600 text-xs font-semibold">{coupon.discount}</p>
                      )}
                      {coupon.expires_at && (
                        <p className="text-stone-400 text-xs">
                          Válido até {new Date(coupon.expires_at).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => copyCoupon(coupon.code)}
                      className="shrink-0 text-xs font-semibold px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {copied === coupon.code ? '✓ Copiado!' : 'Copiar'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA fixo */}
        <div className="p-4 border-t border-stone-100 bg-white">
          <button onClick={goToStore} className="btn-primary w-full text-base py-3.5 flex items-center justify-center gap-2">
            🛒 Ver no site
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
          <p className="text-center text-xs text-stone-400 mt-2">
            Você será redirecionado para {platform.label}
          </p>
        </div>
      </div>
    </div>
  );
}
