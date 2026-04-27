export const PLATFORMS = {
  shopee:        { label: 'Shopee',        color: 'bg-orange-100 text-orange-700', emoji: '🛍️', img: 'https://i.postimg.cc/138ZnL1n/br-50009109-2e3301fdd34755e5e0f48c608ba6fc16.jpg' },
  mercadolivre:  { label: 'Mercado Livre', color: 'bg-yellow-100 text-yellow-700', emoji: '🛒', img: 'https://i.postimg.cc/0j2dNY2y/Escola-de-E-commerce-Aprenda-a-viver-de-vendas-online.jpg' },
  amazon:        { label: 'Amazon',        color: 'bg-amber-100  text-amber-700',  emoji: '📦', img: 'https://i.postimg.cc/Qtg0CNQH/Minecraft-(English-Arabic-Box)-Play-Station-4-Edizione-Regno-Unito.jpg' },
  aliexpress:    { label: 'AliExpress',    color: 'bg-red-100    text-red-700',    emoji: '✈️', img: 'https://i.postimg.cc/J405V52G/download-(4).jpg' },
  shein:         { label: 'Shein',         color: 'bg-pink-100   text-pink-700',   emoji: '👗', img: 'https://i.postimg.cc/7L83z8Y0/SHEIN-icon.jpg' },
  magalu:        { label: 'Magazine',      color: 'bg-blue-100   text-blue-700',   emoji: '🏪', img: 'https://i.postimg.cc/PJRZr0RJ/Link-Loja-Magalu.jpg' },
  americanas:    { label: 'Americanas',    color: 'bg-red-100    text-red-800',    emoji: '🏬', img: 'https://i.postimg.cc/T3mmf7qQ/JOVEM-APRENDIZ-LOJAS-AMERICANAS-2019-Inscricoes-Abertas.jpg' },
  other:         { label: 'Outro',         color: 'bg-stone-100  text-stone-600',  emoji: '🔗', img: null },
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
