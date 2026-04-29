-- ================================================================
-- MIGRAÇÃO: Multi-categorias por produto
-- Execute no Supabase SQL Editor
-- ================================================================

-- 1. Tabela de relação N:N
CREATE TABLE IF NOT EXISTS product_categories (
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_pc_product  ON product_categories(product_id);
CREATE INDEX IF NOT EXISTS idx_pc_category ON product_categories(category_id);

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "product_categories visíveis publicamente"
  ON product_categories FOR SELECT USING (true);

-- 2. Migra dados existentes (copia category_id atual para a nova tabela)
INSERT INTO product_categories (product_id, category_id)
SELECT id, category_id FROM products WHERE category_id IS NOT NULL
ON CONFLICT DO NOTHING;
