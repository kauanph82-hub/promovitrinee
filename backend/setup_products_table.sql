-- ================================================================
-- SQL PARA CONFIGURAR TABELA PRODUCTS E PERMISSÕES PARA O BOT
-- Execute este SQL no Supabase SQL Editor
-- ================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── TABELA: products ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title          TEXT NOT NULL,
  description    TEXT,
  original_price NUMERIC(10, 2),
  promo_price    NUMERIC(10, 2),
  affiliate_link TEXT NOT NULL,
  platform       TEXT NOT NULL CHECK (platform IN ('shopee','mercadolivre','amazon','aliexpress','shein','magalu','americanas','other')),
  category_id    UUID,
  tags           TEXT[] DEFAULT '{}',
  featured       BOOLEAN DEFAULT FALSE,
  active         BOOLEAN DEFAULT TRUE,
  views          INTEGER DEFAULT 0,
  clicks         INTEGER DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABELA: product_images ───────────────────────────────────
CREATE TABLE IF NOT EXISTS product_images (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  "order"    INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── ÍNDICES para melhor performance ─────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_platform ON products(platform);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);

-- ── RLS (Row Level Security) ─────────────────────────────────
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Remove policies antigas se existirem
DROP POLICY IF EXISTS "Produtos visíveis publicamente" ON products;
DROP POLICY IF EXISTS "Imagens visíveis publicamente" ON product_images;
DROP POLICY IF EXISTS "Backend pode inserir produtos" ON products;
DROP POLICY IF EXISTS "Backend pode inserir imagens" ON product_images;
DROP POLICY IF EXISTS "Backend pode atualizar produtos" ON products;
DROP POLICY IF EXISTS "Backend pode deletar produtos" ON products;

-- ── POLICIES DE LEITURA (público) ────────────────────────────
CREATE POLICY "Produtos visíveis publicamente" 
  ON products FOR SELECT 
  USING (active = true);

CREATE POLICY "Imagens visíveis publicamente" 
  ON product_images FOR SELECT 
  USING (true);

-- ── POLICIES DE ESCRITA (service_role) ───────────────────────
-- Estas policies permitem INSERT/UPDATE/DELETE quando usando service_key
-- O bot usa a service_key, então terá permissão total

CREATE POLICY "Backend pode inserir produtos" 
  ON products FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Backend pode atualizar produtos" 
  ON products FOR UPDATE 
  USING (true);

CREATE POLICY "Backend pode deletar produtos" 
  ON products FOR DELETE 
  USING (true);

CREATE POLICY "Backend pode inserir imagens" 
  ON product_images FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Backend pode atualizar imagens" 
  ON product_images FOR UPDATE 
  USING (true);

CREATE POLICY "Backend pode deletar imagens" 
  ON product_images FOR DELETE 
  USING (true);

-- ── VERIFICAÇÃO ──────────────────────────────────────────────
-- Teste se está funcionando:
SELECT 'Tabelas criadas com sucesso!' as status;
SELECT COUNT(*) as total_produtos FROM products;
SELECT COUNT(*) as total_imagens FROM product_images;
