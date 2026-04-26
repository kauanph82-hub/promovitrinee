-- ================================================================
-- SQL PARA CRIAR USUÁRIO ADMIN - SILVA
-- Execute este SQL no Supabase SQL Editor
-- ================================================================

-- Garante que a tabela admin existe
CREATE TABLE IF NOT EXISTS admin (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username   TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Remove usuário antigo se existir
DELETE FROM admin WHERE username = '@silva.93';

-- Cria novo usuário admin
-- Usuário: @silva.93
-- Senha: @admin.93
-- Hash gerado com bcrypt (10 rounds)
INSERT INTO admin (username, password_hash)
VALUES ('@silva.93', '$2a$10$kNGiRh5A64drkSQHNdm1wugjk/APOo9r30wL5Kxu..3BFXj7xPKke')
ON CONFLICT (username) DO UPDATE 
SET password_hash = '$2a$10$kNGiRh5A64drkSQHNdm1wugjk/APOo9r30wL5Kxu..3BFXj7xPKke',
    created_at = NOW();

-- Verificar se foi criado com sucesso
SELECT 
  id,
  username,
  created_at,
  'Usuário criado com sucesso!' as status
FROM admin 
WHERE username = '@silva.93';

-- ================================================================
-- CREDENCIAIS DE ACESSO:
-- ================================================================
-- Usuário: @silva.93
-- Senha: @admin.93
-- 
-- Acesse: http://localhost:5173/silva-admin/login
-- ================================================================
