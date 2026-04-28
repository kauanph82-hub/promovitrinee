import { Link } from 'react-router-dom';
import { getPlatform, formatPrice, calcDiscount } from '../utils/platform';

export default function ProductCard({ product }) {
  const platform = getPlatform(product.platform);
  const discount = calcDiscount(product.original_price, product.promo_price);
  const mainImage = product.images?.[0]?.url || null;

  return (
    <Link
      to={`/produto/${product.id}`}
      className="relative flex h-full select-none flex-col justify-between rounded-2xl border border-stone-200 p-3 shadow-sm transition-shadow hover:shadow-md bg-white"
    >
      <div className="relative flex size-full flex-col">
        {/* Loja */}
        <div className="flex items-center gap-1 mb-2">
          {platform.img ? <img src={platform.img} alt={platform.label} className="w-4 h-4 rounded object-cover" /> : <span className="text-xs">{platform.emoji}</span>}
          <span className="text-xs text-stone-500 truncate">{platform.domain || platform.label}</span>
          {product.featured && <span className="text-yellow-500 text-xs ml-auto">⭐</span>}
        </div>

        {/* Imagem */}
        <div className="relative flex justify-center mb-2">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.title}
              loading="lazy"
              className="w-full aspect-square rounded-xl object-cover"
            />
          ) : (
            <div className="w-full aspect-square rounded-xl bg-stone-100 flex items-center justify-center text-3xl">
              🛍️
            </div>
          )}
          {discount && (
            <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg">
              -{discount}%
            </div>
          )}
        </div>

        {/* Título */}
        <p className="text-xs text-stone-700 line-clamp-2 min-h-8 break-words mb-2">
          {product.title}
        </p>

        {/* Preços */}
        <div className="flex items-baseline gap-1 flex-wrap mt-auto">
          {product.promo_price ? (
            <>
              {product.original_price > 0 && product.original_price !== product.promo_price && (
                <span className="text-xs text-stone-400 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
              <span className="text-sm font-bold text-stone-800">
                {formatPrice(product.promo_price)}
              </span>
            </>
          ) : product.original_price > 0 ? (
            <span className="text-sm font-bold text-stone-800">
              {formatPrice(product.original_price)}
            </span>
          ) : (
            <span className="text-xs text-stone-400 italic">Ver preço</span>
          )}
        </div>
      </div>
    </Link>
  );
}
