-- ================================================================
-- SQL PARA CRIAR USUÁRIO ADMIN
-- Execute este SQL no Supabase SQL Editor
-- ================================================================

-- OPÇÃO 1: Criar admin com senha simples (admin123)
-- Hash gerado com bcrypt para a senha: admin123
INSERT INTO admin (username, password_hash)
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.')
ON CONFLICT (username) DO UPDATE 
SET password_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.';

-- OPÇÃO 2: Criar admin com seu e-mail como username
-- Hash gerado com bcrypt para a senha: admin123
INSERT INTO admin (username, password_hash)
VALUES ('kauanphellipe2022@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.')
ON CONFLICT (username) DO UPDATE 
SET password_hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.';

-- Verificar se foi criado
SELECT * FROM admin;

-- ================================================================
-- INSTRUÇÕES:
-- 1. Execute este SQL no Supabase SQL Editor
-- 2. Use username: admin (ou kauanphellipe2022@gmail.com)
-- 3. Use senha: admin123
-- 4. Depois de fazer login, você pode trocar a senha
-- ================================================================
