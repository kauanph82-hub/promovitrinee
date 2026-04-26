import { Link } from 'react-router-dom';
import { getPlatform, formatPrice, calcDiscount } from '../utils/platform';

export default function ProductCard({ product }) {
  const platform = getPlatform(product.platform);
  const discount = calcDiscount(product.original_price, product.promo_price);
  const mainImage = product.images?.[0]?.url || '/placeholder.png';

  return (
    <Link to={`/produto/${product.id}`} className="card group block">
      {/* Imagem */}
      <div className="relative aspect-square bg-stone-50 overflow-hidden">
        <img
          src={mainImage}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Badge desconto */}
        {discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{discount}%
          </div>
        )}
        {/* Badge destaque */}
        {product.featured && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-lg">
            ⭐ Destaque
          </div>
        )}
        {/* Tem cupom */}
        {product.coupons?.length > 0 && (
          <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
            🏷️ Cupom disponível
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        {/* Platform badge */}
        <span className={`badge-platform ${platform.color} mb-2`}>
          {platform.emoji} {platform.label}
        </span>

        {/* Título */}
        <p className="text-sm font-medium text-stone-800 leading-tight line-clamp-2 mb-2">
          {product.title}
        </p>

        {/* Preços */}
        <div className="flex items-baseline gap-2 flex-wrap">
          {product.promo_price ? (
            <>
              {product.original_price && (
                <span className="text-xs text-stone-400 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
              <span className="text-base font-bold text-brand-600">
                {formatPrice(product.promo_price)}
              </span>
            </>
          ) : product.original_price ? (
            <span className="text-base font-bold text-brand-600">
              {formatPrice(product.original_price)}
            </span>
          ) : (
            <span className="text-sm text-stone-400 italic">Ver preço no site</span>
          )}
        </div>

        {/* Tags */}
        {product.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
