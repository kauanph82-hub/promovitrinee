const express = require('express');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/products — lista todos os produtos (público)
router.get('/', async (req, res) => {
  const { category_id, platform, search, page = 1, limit = 24, best_seller } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        categories:product_categories(category:categories(id, name, slug, icon)),
        images:product_images(id, url, order),
        coupons:product_coupons(id, code, description, discount, expires_at)
      `, { count: 'exact' })
      .eq('active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filtra por categoria: busca tanto na coluna legada quanto na tabela N:N
    if (category_id) {
      query = query.or(`category_id.eq.${category_id},product_categories.category_id.eq.${category_id}`);
    }
    if (platform) query = query.eq('platform', platform);
    if (search) query = query.ilike('title', `%${search}%`);
    if (best_seller === 'true') query = query.eq('best_seller', true);

    const { data, error, count } = await query;
    if (error) throw error;

    // Normaliza: garante que cada produto tenha array de categorias
    const products = (data || []).map(p => ({
      ...p,
      categories: (p.categories || []).map(pc => pc.category).filter(Boolean),
    }));

    res.json({ products, total: count, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// GET /api/products/:id — detalhe do produto (público)
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        categories:product_categories(category:categories(id, name, slug, icon)),
        images:product_images(id, url, order),
        coupons:product_coupons(id, code, description, discount, expires_at)
      `)
      .eq('id', req.params.id)
      .eq('active', true)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Produto não encontrado' });

    // Ordena imagens pelo campo order
    data.images?.sort((a, b) => a.order - b.order);

    // Normaliza categorias
    data.categories = (data.categories || []).map(pc => pc.category).filter(Boolean);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

// POST /api/products — cria produto (admin)
router.post('/', authMiddleware, async (req, res) => {
  console.log('\n📝 ===== REQUISIÇÃO POST /api/products =====');
  console.log('Admin:', req.admin?.username);
  
  const {
    title, description, original_price, promo_price,
    affiliate_link, platform, category_id, category_ids,
    images, coupons, tags, featured, rating, sales_count, best_seller
  } = req.body;

  if (!title || !affiliate_link || !platform) {
    return res.status(400).json({ error: 'Título, link e plataforma são obrigatórios' });
  }

  // Monta lista de categorias: usa category_ids (array) ou category_id (legado)
  const allCategoryIds = category_ids?.length
    ? category_ids
    : category_id ? [category_id] : [];

  if (allCategoryIds.length === 0) {
    return res.status(400).json({ error: 'Selecione pelo menos uma categoria' });
  }

  try {
    // Cria o produto (mantém category_id com a primeira categoria para compatibilidade)
    const { data: product, error } = await supabase
      .from('products')
      .insert([{
        title, description,
        original_price: original_price || null,
        promo_price: promo_price || null,
        affiliate_link, platform,
        category_id: allCategoryIds[0],
        tags: tags || [],
        featured: featured || false,
        best_seller: best_seller || false,
        active: true
      }])
      .select()
      .single();

    if (error) throw error;

    // Insere relações N:N de categorias
    const catRows = allCategoryIds.map(cid => ({ product_id: product.id, category_id: cid }));
    await supabase.from('product_categories').insert(catRows);

    // Insere imagens
    if (images?.length > 0) {
      const imgRows = images.map((url, i) => ({
        product_id: product.id, url, order: i
      }));
      await supabase.from('product_images').insert(imgRows);
    }

    // Insere cupons
    if (coupons?.length > 0) {
      const couponRows = coupons.map(c => ({
        product_id: product.id,
        code: c.code,
        description: c.description || '',
        discount: c.discount || '',
        expires_at: c.expires_at || null
      }));
      await supabase.from('product_coupons').insert(couponRows);
    }

    console.log('✅ Produto criado com sucesso! ID:', product.id);
    res.status(201).json({ message: 'Produto criado com sucesso', id: product.id });
  } catch (err) {
    console.error('❌ Erro ao criar produto:', err);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

// PUT /api/products/:id — edita produto (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  console.log('\n✏️ ===== REQUISIÇÃO PUT /api/products/:id =====');
  console.log('ID:', req.params.id);
  console.log('Admin:', req.admin?.username);
  
  const {
    title, description, original_price, promo_price,
    affiliate_link, platform, category_id, category_ids,
    images, coupons, tags, featured, active, rating, sales_count, best_seller
  } = req.body;

  // Monta lista de categorias
  const allCategoryIds = category_ids?.length
    ? category_ids
    : category_id ? [category_id] : [];

  try {
    // Atualiza o produto
    const { error } = await supabase
      .from('products')
      .update({
        title, description,
        original_price: original_price || null,
        promo_price: promo_price || null,
        affiliate_link, platform,
        category_id: allCategoryIds[0] || null,
        tags: tags || [],
        featured, active,
        best_seller: best_seller || false,
        updated_at: new Date()
      })
      .eq('id', req.params.id);

    if (error) throw error;

    // Recria relações N:N de categorias
    if (allCategoryIds.length > 0) {
      await supabase.from('product_categories').delete().eq('product_id', req.params.id);
      const catRows = allCategoryIds.map(cid => ({ product_id: req.params.id, category_id: cid }));
      await supabase.from('product_categories').insert(catRows);
    }

    // Recria imagens (apaga antigas e insere novas)
    if (images) {
      await supabase.from('product_images').delete().eq('product_id', req.params.id);
      if (images.length > 0) {
        const imgRows = images.map((url, i) => ({ product_id: req.params.id, url, order: i }));
        await supabase.from('product_images').insert(imgRows);
      }
    }

    // Recria cupons
    if (coupons !== undefined) {
      await supabase.from('product_coupons').delete().eq('product_id', req.params.id);
      if (coupons.length > 0) {
        const couponRows = coupons.map(c => ({
          product_id: req.params.id,
          code: c.code,
          description: c.description || '',
          discount: c.discount || '',
          expires_at: c.expires_at || null
        }));
        await supabase.from('product_coupons').insert(couponRows);
      }
    }

    console.log('✅ Produto atualizado com sucesso!');
    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (err) {
    console.error('❌ Erro ao atualizar produto:', err);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

// DELETE /api/products/:id — remove produto (admin)
router.delete('/:id', async (req, res) => {
  const productId = req.params.id;
  
  console.log('\n🗑️ ===== REQUISIÇÃO DELETE =====');
  console.log('ID do produto:', productId);
  
  // BYPASS DE SEGURANÇA: Aceita header especial com hash da senha
  const adminMasterKey = req.headers['x-admin-master'];
  const hasValidToken = req.headers['authorization'];
  
  console.log('🔑 Admin Master Key:', adminMasterKey ? 'Presente' : 'Ausente');
  console.log('🔑 Authorization Token:', hasValidToken ? 'Presente' : 'Ausente');
  
  // Nova chave de segurança baseada na senha @admin.93
  const SECURE_KEY = 'silva_admin_93_secure';
  
  // Verifica se tem o bypass OU o token normal
  if (adminMasterKey === SECURE_KEY) {
    console.log('✅ BYPASS DE SEGURANÇA ATIVADO');
  } else if (hasValidToken) {
    // Valida o token JWT normal
    try {
      const token = hasValidToken.split(' ')[1];
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token JWT válido:', decoded.username);
      req.admin = decoded;
    } catch (err) {
      console.error('❌ Token inválido:', err.message);
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
  } else {
    console.error('❌ Sem autorização');
    return res.status(401).json({ error: 'Autorização necessária' });
  }
  
  console.log('================================\n');
  
  try {
    // Verifica se o produto existe
    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('id, title, active')
      .eq('id', productId)
      .single();
    
    if (checkError || !existingProduct) {
      console.error('❌ Produto não encontrado:', productId);
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    console.log('✅ Produto encontrado:', existingProduct.title);
    
    // Soft delete — apenas desativa (usando service key que bypassa RLS)
    console.log('🔄 Desativando produto...');
    const { data, error } = await supabase
      .from('products')
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq('id', productId)
      .select();
    
    if (error) {
      console.error('❌ Erro ao desativar produto:', error);
      return res.status(500).json({ 
        error: 'Erro ao desativar produto',
        details: error.message 
      });
    }
    
    console.log('✅ Produto desativado com sucesso!');
    
    res.json({ 
      message: 'Produto removido com sucesso',
      product: data[0]
    });
    
  } catch (err) {
    console.error('💥 ERRO FATAL ao remover produto:', err);
    res.status(500).json({ 
      error: 'Erro ao remover produto',
      details: err.message 
    });
  }
});

module.exports = router;
