import { Link } from 'react-router-dom';
import { getPlatform, formatPrice, calcDiscount } from '../utils/platform';

export default function ProductCard({ product }) {
  const platform = getPlatform(product.platform);
  const discount = calcDiscount(product.original_price, product.promo_price);
  const mainImage = product.images?.[0]?.url || null;

  return (
    <Link
      to={`/produto/${product.id}`}
      className="relative flex h-full select-none flex-col justify-between rounded-2xl border border-stone-200 p-4 shadow-sm transition-shadow hover:shadow-md bg-white"
    >
      <div className="relative flex size-full flex-row gap-4 lg:flex-col">
        {/* Loja - só desktop */}
        <div className="items-center hidden pb-3 lg:flex gap-1">
          <span className="text-sm text-stone-500 truncate">{platform.emoji} {platform.label}</span>
          {product.featured && <span className="text-yellow-500 text-xs">⭐</span>}
        </div>

        {/* Imagem */}
        <div className="relative flex justify-center shrink-0">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.title}
              loading="lazy"
              className="size-[100px] md:size-[160px] lg:size-[180px] self-center rounded-xl object-cover"
            />
          ) : (
            <div className="size-[100px] md:size-[160px] lg:size-[180px] rounded-xl bg-stone-100 flex items-center justify-center text-3xl">
              🛍️
            </div>
          )}
          {/* Badge desconto */}
          {discount && (
            <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg">
              -{discount}%
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex size-full flex-col pb-3 justify-between border-b border-stone-100">
          {/* Loja - só mobile */}
          <div className="flex items-center lg:hidden mb-1 gap-1">
            <span className="text-xs text-stone-500">{platform.emoji} {platform.label}</span>
          </div>

          {/* Título */}
          <p className="text-sm text-stone-700 mt-1 line-clamp-2 min-h-10 w-full break-words">
            {product.title}
          </p>

          {/* Preços */}
          <div className="flex items-baseline gap-2 flex-wrap mt-2">
            {product.promo_price ? (
              <>
                {product.original_price > 0 && product.original_price !== product.promo_price && (
                  <span className="text-xs text-stone-400 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
                <span className="text-base font-bold text-stone-800">
                  {formatPrice(product.promo_price)}
                </span>
              </>
            ) : product.original_price > 0 ? (
              <span className="text-base font-bold text-stone-800">
                {formatPrice(product.original_price)}
              </span>
            ) : (
              <span className="text-sm text-stone-400 italic">Ver preço no site</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
