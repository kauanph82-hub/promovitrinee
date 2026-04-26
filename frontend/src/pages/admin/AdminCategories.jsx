import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const EMPTY = { name: '', slug: '', icon: '🏷️', description: '' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await api.get('/categories');
    setCategories(data);
  }

  function autoSlug(name) {
    return name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function setField(k, v) {
    setForm(prev => ({
      ...prev,
      [k]: v,
      ...(k === 'name' && !editing ? { slug: autoSlug(v) } : {})
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) {
        const { data } = await api.put(`/categories/${editing}`, form);
        setCategories(prev => prev.map(c => c.id === editing ? data : c));
      } else {
        const { data } = await api.post('/categories', form);
        setCategories(prev => [...prev, data]);
      }
      setForm(EMPTY);
      setEditing(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  function startEdit(cat) {
    setEditing(cat.id);
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon, description: cat.description || '' });
  }

  async function handleDelete(id) {
    if (!confirm('Remover esta categoria?')) return;
    await api.delete(`/categories/${id}`);
    setCategories(prev => prev.filter(c => c.id !== id));
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-stone-900 text-white px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link to="/silva-admin" className="text-stone-400 hover:text-white transition-colors">← Voltar</Link>
          <h1 className="font-display font-bold text-lg">📂 Gerenciar Categorias</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 grid sm:grid-cols-2 gap-6">
        {/* Form */}
        <section className="bg-white rounded-2xl border border-stone-100 p-5">
          <h2 className="font-display font-semibold text-stone-900 mb-4">
            {editing ? 'Editar categoria' : 'Nova categoria'}
          </h2>

          {error && <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Ícone</label>
                <input className="input text-center text-xl" value={form.icon}
                  onChange={e => setField('icon', e.target.value)} maxLength={2} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-stone-600 mb-1">Nome *</label>
                <input className="input" value={form.name}
                  onChange={e => setField('name', e.target.value)} placeholder="Eletrônicos" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Slug (URL) *</label>
              <input className="input font-mono text-sm" value={form.slug}
                onChange={e => setField('slug', e.target.value)} placeholder="eletronicos" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Descrição</label>
              <input className="input" value={form.description}
                onChange={e => setField('description', e.target.value)} placeholder="Breve descrição da categoria" />
            </div>
            <div className="flex gap-2 pt-1">
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm(EMPTY); }}
                  className="btn-secondary flex-1 py-2.5 text-sm">Cancelar</button>
              )}
              <button type="submit" disabled={saving} className="btn-primary flex-1 py-2.5 text-sm">
                {saving ? 'Salvando...' : editing ? 'Salvar' : 'Criar categoria'}
              </button>
            </div>
          </form>
        </section>

        {/* Lista */}
        <section className="bg-white rounded-2xl border border-stone-100 p-5">
          <h2 className="font-display font-semibold text-stone-900 mb-4">
            Categorias ({categories.length})
          </h2>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors">
                <span className="text-xl">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-800 text-sm">{cat.name}</p>
                  <p className="text-xs text-stone-400 font-mono">{cat.slug}</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => startEdit(cat)}
                    className="text-xs px-2.5 py-1 border border-stone-200 rounded-lg hover:border-brand-400 hover:text-brand-600 transition-colors">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(cat.id)}
                    className="text-xs px-2.5 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
