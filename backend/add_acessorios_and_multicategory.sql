-- ================================================================
-- MIGRAÇÃO: Adiciona categoria Acessórios + suporte a multi-categorias
-- Execute este SQL no Supabase SQL Editor
-- ================================================================

-- 1. Adiciona categoria Acessórios
INSERT INTO categories (name, slug, icon, description)
VALUES ('Acessórios', 'acessorios', '💍', 'Bolsas, relógios, óculos e acessórios de moda')
ON CONFLICT (slug) DO NOTHING;

-- 2. Cria tabela de relação N:N entre produtos e categorias
CREATE TABLE IF NOT EXISTS product_categories (
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- 3. Índices para performance
CREATE INDEX IF NOT EXISTS idx_product_categories_product  ON product_categories(product_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_category ON product_categories(category_id);

-- 4. RLS
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "product_categories visíveis publicamente" ON product_categories
  FOR SELECT USING (true);

-- 5. Migra os dados existentes: copia category_id atual para a nova tabela
INSERT INTO product_categories (product_id, category_id)
SELECT id, category_id
FROM products
WHERE category_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- ================================================================
-- PRONTO! Agora cada produto pode ter múltiplas categorias.
-- A coluna category_id em products é mantida para compatibilidade.
-- ================================================================
