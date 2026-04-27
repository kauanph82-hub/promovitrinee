export const PLATFORMS = {
  shopee:        { label: 'Shopee',        domain: 'shopee.com.br',        color: 'bg-orange-100 text-orange-700', emoji: '🛍️', img: 'https://i.postimg.cc/138ZnL1n/br-50009109-2e3301fdd34755e5e0f48c608ba6fc16.jpg' },
  mercadolivre:  { label: 'Mercado Livre', domain: 'mercadolivre.com.br',  color: 'bg-yellow-100 text-yellow-700', emoji: '🛒', img: 'https://i.postimg.cc/0j2dNY2y/Escola-de-E-commerce-Aprenda-a-viver-de-vendas-online.jpg' },
  amazon:        { label: 'Amazon',        domain: 'amazon.com.br',        color: 'bg-amber-100  text-amber-700',  emoji: '📦', img: 'https://i.postimg.cc/Qtg0CNQH/Minecraft-(English-Arabic-Box)-Play-Station-4-Edizione-Regno-Unito.jpg' },
  aliexpress:    { label: 'AliExpress',    domain: 'aliexpress.com',       color: 'bg-red-100    text-red-700',    emoji: '✈️', img: 'https://i.postimg.cc/J405V52G/download-(4).jpg' },
  shein:         { label: 'Shein',         domain: 'shein.com.br',         color: 'bg-pink-100   text-pink-700',   emoji: '👗', img: 'https://i.postimg.cc/7L83z8Y0/SHEIN-icon.jpg' },
  magalu:        { label: 'Magazine',      domain: 'magazineluiza.com.br', color: 'bg-blue-100   text-blue-700',   emoji: '🏪', img: 'https://i.postimg.cc/PJRZr0RJ/Link-Loja-Magalu.jpg' },
  americanas:    { label: 'Americanas',    domain: 'americanas.com.br',    color: 'bg-red-100    text-red-800',    emoji: '🏬', img: 'https://i.postimg.cc/T3mmf7qQ/JOVEM-APRENDIZ-LOJAS-AMERICANAS-2019-Inscricoes-Abertas.jpg' },
  tiktok:        { label: 'TikTok Shop',   domain: 'tiktok.com/shop',      color: 'bg-gray-100   text-gray-800',   emoji: '🎵', img: 'https://i.postimg.cc/GtKwsqTP/download-(6).jpg' },
  other:         { label: 'Outro',         domain: null,                   color: 'bg-stone-100  text-stone-600',  emoji: '🔗', img: null },
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
