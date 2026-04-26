const express = require('express');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/categories — lista todas (público)
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('categories')
    .select('*, product_count:products(count)')
    .eq('active', true)
    .order('name');

  if (error) return res.status(500).json({ error: 'Erro ao buscar categorias' });
  res.json(data);
});

// POST /api/categories — cria categoria (admin)
router.post('/', authMiddleware, async (req, res) => {
  const { name, slug, icon, description } = req.body;
  if (!name || !slug) return res.status(400).json({ error: 'Nome e slug são obrigatórios' });

  const { data, error } = await supabase
    .from('categories')
    .insert([{ name, slug, icon: icon || '🏷️', description, active: true }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Erro ao criar categoria' });
  res.status(201).json(data);
});

// PUT /api/categories/:id — edita (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  const { name, slug, icon, description, active } = req.body;
  const { data, error } = await supabase
    .from('categories')
    .update({ name, slug, icon, description, active })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: 'Erro ao atualizar categoria' });
  res.json(data);
});

// DELETE /api/categories/:id — desativa (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  const { error } = await supabase
    .from('categories')
    .update({ active: false })
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ error: 'Erro ao remover categoria' });
  res.json({ message: 'Categoria removida com sucesso' });
});

module.exports = router;
