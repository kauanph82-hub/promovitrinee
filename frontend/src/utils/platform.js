export const PLATFORMS = {
  shopee:        { label: 'Shopee',        color: 'bg-orange-100 text-orange-700', emoji: '🛍️' },
  mercadolivre:  { label: 'Mercado Livre', color: 'bg-yellow-100 text-yellow-700', emoji: '🛒' },
  amazon:        { label: 'Amazon',        color: 'bg-amber-100  text-amber-700',  emoji: '📦' },
  aliexpress:    { label: 'AliExpress',    color: 'bg-red-100    text-red-700',    emoji: '✈️' },
  shein:         { label: 'Shein',         color: 'bg-pink-100   text-pink-700',   emoji: '👗' },
  magalu:        { label: 'Magazine',      color: 'bg-blue-100   text-blue-700',   emoji: '🏪' },
  americanas:    { label: 'Americanas',    color: 'bg-red-100    text-red-800',    emoji: '🏬' },
  other:         { label: 'Outro',         color: 'bg-stone-100  text-stone-600',  emoji: '🔗' },
};

export function getPlatform(key) {
  return PLATFORMS[key] || PLATFORMS.other;
}

export function formatPrice(value) {
  if (!value) return null;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function calcDiscount(original, promo) {
  if (!original || !promo) return null;
  return Math.round((1 - promo / original) * 100);
}
