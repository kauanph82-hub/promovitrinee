-- Adiciona a categoria Acessórios
-- Execute no SQL Editor do Supabase
INSERT INTO categories (name, slug, icon, description)
VALUES ('Acessórios', 'acessorios', '💍', 'Bolsas, relógios, óculos e acessórios de moda')
ON CONFLICT (slug) DO NOTHING;
