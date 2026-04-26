-- ================================================================
-- SCHEMA COMPLETO — Execute este SQL no Supabase SQL Editor
-- ================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── TABELA: admin ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username   TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABELA: categories ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  icon        TEXT DEFAULT '🏷️',
  description TEXT,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── TABELA: products ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title          TEXT NOT NULL,
  description    TEXT,
  original_price NUMERIC(10, 2),
  promo_price    NUMERIC(10, 2),
  affiliate_link TEXT NOT NULL,
  platform       TEXT NOT NULL CHECK (platform IN ('shopee','mercadolivre','amazon','aliexpress','shein','magalu','americanas','other')),
  category_id    UUID REFERENCES categories(id) ON DELETE SET NULL,
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

-- ── TABELA: product_coupons ──────────────────────────────────
CREATE TABLE IF NOT EXISTS product_coupons (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  code        TEXT NOT NULL,
  description TEXT,
  discount    TEXT,
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── ÍNDICES para melhor performance ─────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_platform ON products(platform);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_coupons_product ON product_coupons(product_id);

-- ── RLS (Row Level Security) ─────────────────────────────────
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;

-- Policies: leitura pública para produtos ativos
CREATE POLICY "Produtos visíveis publicamente" ON products
  FOR SELECT USING (active = true);

CREATE POLICY "Categorias visíveis publicamente" ON categories
  FOR SELECT USING (active = true);

CREATE POLICY "Imagens visíveis publicamente" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Cupons visíveis publicamente" ON product_coupons
  FOR SELECT USING (true);

-- O backend usa a service_key, então ignora as policies nas operações admin.
-- As policies acima protegem o banco caso a anon_key seja exposta no frontend.

-- ── CATEGORIAS INICIAIS ──────────────────────────────────────
INSERT INTO categories (name, slug, icon, description) VALUES
  ('Roupas Femininas',   'roupas-femininas',   '👗', 'Moda, vestidos, blusas e muito mais'),
  ('Roupas Masculinas',  'roupas-masculinas',  '👕', 'Camisetas, calças, tênis e acessórios'),
  ('Eletrônicos',        'eletronicos',        '📱', 'Smartphones, tablets, acessórios tech'),
  ('Informática',        'informatica',        '💻', 'Notebooks, periféricos, componentes'),
  ('Casa e Decoração',   'casa-decoracao',     '🏠', 'Móveis, utensílios e decoração'),
  ('Beleza e Saúde',     'beleza-saude',       '💄', 'Maquiagem, skincare e cuidados pessoais'),
  ('Esporte e Lazer',    'esporte-lazer',      '⚽', 'Equipamentos, roupas esportivas'),
  ('Calçados',           'calcados',           '👟', 'Tênis, sandálias, botas e mais'),
  ('Bebês e Crianças',   'bebes-criancas',     '🍼', 'Roupas, brinquedos e acessórios infantis'),
  ('Pets',               'pets',               '🐾', 'Ração, acessórios e cuidados para pets'),
  ('Cozinha',            'cozinha',            '🍳', 'Utensílios, eletrodomésticos e alimentos'),
  ('Livros e Cursos',    'livros-cursos',      '📚', 'Educação, literatura e desenvolvimento'),
  ('Games',              'games',              '🎮', 'Consoles, jogos e acessórios gamer'),
  ('Automotivo',         'automotivo',         '🚗', 'Acessórios e peças para veículos'),
  ('Ferramentas',        'ferramentas',        '🔧', 'Ferramentas e equipamentos de trabalho')
ON CONFLICT (slug) DO NOTHING;

-- ── ADMIN INICIAL ─────────────────────────────────────────────
-- ATENÇÃO: Substitua o hash abaixo pelo hash real gerado com bcrypt.
-- Para gerar: node -e "const b=require('bcryptjs');b.hash('SUA_SENHA',10).then(console.log)"
-- O hash abaixo corresponde à senha: admin123 (TROQUE ANTES DE PUBLICAR!)
INSERT INTO admin (username, password_hash)
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.')
ON CONFLICT (username) DO NOTHING;

-- ── STORAGE: crie o bucket manualmente no painel do Supabase ──
-- Nome: product-images
-- Tipo: Public
-- Limite: 50MB por arquivo
-- MIME types permitidos: image/jpeg, image/png, image/webp, image/gif
