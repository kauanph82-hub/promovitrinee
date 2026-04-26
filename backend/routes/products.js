const express = require('express');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/products — lista todos os produtos (público)
router.get('/', async (req, res) => {
  const { category_id, platform, search, page = 1, limit = 24 } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        images:product_images(id, url, order),
        coupons:product_coupons(id, code, description, discount, expires_at)
      `, { count: 'exact' })
      .eq('active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category_id) query = query.eq('category_id', category_id);
    if (platform) query = query.eq('platform', platform);
    if (search) query = query.ilike('title', `%${search}%`);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ products: data, total: count, page: Number(page), limit: Number(limit) });
  } catch (err) {
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
        images:product_images(id, url, order),
        coupons:product_coupons(id, code, description, discount, expires_at)
      `)
      .eq('id', req.params.id)
      .eq('active', true)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Produto não encontrado' });

    // Ordena imagens pelo campo order
    data.images?.sort((a, b) => a.order - b.order);

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
    affiliate_link, platform, category_id,
    images, coupons, tags, featured
  } = req.body;

  if (!title || !affiliate_link || !category_id || !platform) {
    return res.status(400).json({ error: 'Título, link, categoria e plataforma são obrigatórios' });
  }

  try {
    // Cria o produto
    const { data: product, error } = await supabase
      .from('products')
      .insert([{
        title, description,
        original_price: original_price || null,
        promo_price: promo_price || null,
        affiliate_link, platform, category_id,
        tags: tags || [],
        featured: featured || false,
        active: true
      }])
      .select()
      .single();

    if (error) throw error;

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
    affiliate_link, platform, category_id,
    images, coupons, tags, featured, active
  } = req.body;

  try {
    // Atualiza o produto
    const { error } = await supabase
      .from('products')
      .update({
        title, description,
        original_price: original_price || null,
        promo_price: promo_price || null,
        affiliate_link, platform, category_id,
        tags: tags || [],
        featured, active,
        updated_at: new Date()
      })
      .eq('id', req.params.id);

    if (error) throw error;

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
