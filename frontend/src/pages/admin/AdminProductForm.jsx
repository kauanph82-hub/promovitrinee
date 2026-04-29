import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { PLATFORMS } from '../../utils/platform';

const EMPTY_COUPON = { code: '', description: '', discount: '', expires_at: '' };

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '', description: '', original_price: '', promo_price: '',
    affiliate_link: '', platform: 'shopee', category_id: '',
    tags: '', featured: false, best_seller: false, active: true,
    rating: '', sales_count: '',
    images: [],
    coupons: [],
  });

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data));

    if (isEdit) {
      setLoading(true);
      api.get(`/products/${id}`)
        .then(({ data }) => {
          setForm({
            title: data.title || '',
            description: data.description || '',
            original_price: data.original_price || '',
            promo_price: data.promo_price || '',
            affiliate_link: data.affiliate_link || '',
            platform: data.platform || 'shopee',
            category_id: data.category_id || '',
            tags: (data.tags || []).join(', '),
            featured: data.featured || false,
            best_seller: data.best_seller || false,
            active: data.active !== false,
            rating: data.rating || '',
            sales_count: data.sales_count || '',
            images: (data.images || []).map(i => i.url),
            coupons: (data.coupons || []).map(c => ({
              code: c.code || '',
              description: c.description || '',
              discount: c.discount || '',
              expires_at: c.expires_at ? c.expires_at.slice(0, 10) : ''
            })),
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  // Upload de imagens
  async function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(f => formData.append('images', f));
      const { data } = await api.post('/upload/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm(prev => ({ ...prev, images: [...prev.images, ...data.urls] }));
    } catch {
      setError('Erro ao fazer upload das imagens');
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index) {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  }

  function moveImage(from, to) {
    setForm(prev => {
      const imgs = [...prev.images];
      [imgs[from], imgs[to]] = [imgs[to], imgs[from]];
      return { ...prev, images: imgs };
    });
  }

  // Cupons
  function addCoupon() {
    setForm(prev => ({ ...prev, coupons: [...prev.coupons, { ...EMPTY_COUPON }] }));
  }

  function updateCoupon(index, field, value) {
    setForm(prev => {
      const coupons = [...prev.coupons];
      coupons[index] = { ...coupons[index], [field]: value };
      return { ...prev, coupons };
    });
  }

  function removeCoupon(index) {
    setForm(prev => ({ ...prev, coupons: prev.coupons.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      ...form,
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      promo_price: form.promo_price ? parseFloat(form.promo_price) : null,
      rating: form.rating !== '' ? parseFloat(form.rating) : null,
      sales_count: form.sales_count !== '' ? parseInt(form.sales_count) : null,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };

    try {
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      navigate('/silva-admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar produto');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-400">Carregando...</div>;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-stone-900 text-white px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link to="/silva-admin" className="text-stone-400 hover:text-white transition-colors">← Voltar</Link>
          <h1 className="font-display font-bold text-lg">
            {isEdit ? 'Editar produto' : 'Novo produto'}
          </h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">{error}</div>
        )}

        {/* Informações básicas */}
        <section className="bg-white rounded-2xl border border-stone-100 p-5 space-y-4">
          <h2 className="font-display font-semibold text-stone-900">📝 Informações básicas</h2>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Título do produto *</label>
            <input className="input" value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="Ex: Tênis Nike Air Max 270 Preto Masculino" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Descrição</label>
            <textarea className="input min-h-[100px] resize-y" value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Descreva o produto, destaque os benefícios, material, tamanhos disponíveis..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Preço original (R$)</label>
              <input type="number" step="0.01" className="input" value={form.original_price}
                onChange={e => set('original_price', e.target.value)} placeholder="199.90" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Preço promocional (R$)</label>
              <input type="number" step="0.01" className="input" value={form.promo_price}
                onChange={e => set('promo_price', e.target.value)} placeholder="149.90" />
            </div>
          </div>

          {/* Avaliação e Vendas — OPCIONAIS */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                ⭐ Avaliação <span className="text-stone-400 font-normal">(opcional, 0–5)</span>
              </label>
              <input
                type="number" step="0.1" min="0" max="5"
                className="input"
                value={form.rating}
                onChange={e => set('rating', e.target.value)}
                placeholder="Ex: 4.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                🛒 Vendas <span className="text-stone-400 font-normal">(opcional)</span>
              </label>
              <input
                type="number" min="0"
                className="input"
                value={form.sales_count}
                onChange={e => set('sales_count', e.target.value)}
                placeholder="Ex: 1200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Link de Promoção! *</label>
            <input type="url" className="input" value={form.affiliate_link}
              onChange={e => set('affiliate_link', e.target.value)}
              placeholder="https://..." required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Plataforma *</label>
              <select className="input" value={form.platform} onChange={e => set('platform', e.target.value)} required>
                {Object.entries(PLATFORMS).map(([k, v]) => (
                  <option key={k} value={k}>{v.emoji} {v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Categoria *</label>
              <select className="input" value={form.category_id} onChange={e => set('category_id', e.target.value)} required>
                <option value="">Selecionar...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Tags (separadas por vírgula)</label>
            <input className="input" value={form.tags} onChange={e => set('tags', e.target.value)}
              placeholder="promoção, lançamento, exclusivo, frete grátis" />
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)}
                className="w-4 h-4 accent-brand-500" />
              <span className="text-sm font-medium text-stone-700">⭐ Produto em destaque</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={form.best_seller} onChange={e => set('best_seller', e.target.checked)}
                className="w-4 h-4 accent-brand-500" />
              <span className="text-sm font-medium text-stone-700">🔥 Mais vendido da semana</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)}
                className="w-4 h-4 accent-brand-500" />
              <span className="text-sm font-medium text-stone-700">✅ Publicado</span>
            </label>
          </div>
        </section>

        {/* Fotos */}
        <section className="bg-white rounded-2xl border border-stone-100 p-5 space-y-4">
          <h2 className="font-display font-semibold text-stone-900">📸 Fotos do produto</h2>

          <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${uploading ? 'border-brand-400 bg-brand-50' : 'border-stone-200 hover:border-brand-400 hover:bg-brand-50'}`}>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
            {uploading ? (
              <><div className="text-3xl animate-spin">⏳</div><p className="mt-2 text-sm text-brand-600">Fazendo upload...</p></>
            ) : (
              <><div className="text-3xl">📤</div><p className="mt-2 text-sm text-stone-600 font-medium">Clique para adicionar fotos</p>
              <p className="text-xs text-stone-400">PNG, JPG, WebP · até 5MB cada · múltiplas permitidas</p></>
            )}
          </label>

          {form.images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {form.images.map((url, i) => (
                <div key={url} className="relative group aspect-square rounded-xl overflow-hidden bg-stone-100">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  {i === 0 && (
                    <div className="absolute top-1 left-1 bg-brand-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">Principal</div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    {i > 0 && (
                      <button type="button" onClick={() => moveImage(i, i - 1)}
                        className="bg-white/90 text-stone-700 text-xs px-2 py-1 rounded-lg">←</button>
                    )}
                    <button type="button" onClick={() => removeImage(i)}
                      className="bg-red-500 text-white text-xs px-2 py-1 rounded-lg">✕</button>
                    {i < form.images.length - 1 && (
                      <button type="button" onClick={() => moveImage(i, i + 1)}
                        className="bg-white/90 text-stone-700 text-xs px-2 py-1 rounded-lg">→</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Cupons */}
        <section className="bg-white rounded-2xl border border-stone-100 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-stone-900">🏷️ Cupons de desconto</h2>
            <button type="button" onClick={addCoupon} className="btn-secondary text-sm py-2">
              + Adicionar cupom
            </button>
          </div>

          {form.coupons.length === 0 ? (
            <p className="text-stone-400 text-sm text-center py-4">Nenhum cupom adicionado</p>
          ) : (
            form.coupons.map((coupon, i) => (
              <div key={i} className="bg-stone-50 rounded-xl p-4 space-y-3 relative">
                <button type="button" onClick={() => removeCoupon(i)}
                  className="absolute top-3 right-3 text-stone-400 hover:text-red-500 transition-colors text-sm">✕</button>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Código do cupom *</label>
                    <input className="input text-sm" value={coupon.code}
                      onChange={e => updateCoupon(i, 'code', e.target.value.toUpperCase())}
                      placeholder="PROMO10" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Desconto</label>
                    <input className="input text-sm" value={coupon.discount}
                      onChange={e => updateCoupon(i, 'discount', e.target.value)}
                      placeholder="10% OFF ou R$20 de desconto" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Descrição</label>
                    <input className="input text-sm" value={coupon.description}
                      onChange={e => updateCoupon(i, 'description', e.target.value)}
                      placeholder="Válido para novos usuários" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Válido até</label>
                    <input type="date" className="input text-sm" value={coupon.expires_at}
                      onChange={e => updateCoupon(i, 'expires_at', e.target.value)} />
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Botões */}
        <div className="flex gap-3 pb-8">
          <Link to="/silva-admin" className="btn-secondary flex-1 text-center py-3">Cancelar</Link>
          <button type="submit" disabled={saving} className="btn-primary flex-1 py-3">
            {saving ? 'Salvando...' : isEdit ? '✓ Salvar alterações' : '+ Publicar produto'}
          </button>
        </div>
      </form>
    </div>
  );
}
