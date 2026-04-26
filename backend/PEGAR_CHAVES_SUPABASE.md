# 🔑 Como Pegar as Chaves Corretas do Supabase

## Passo a Passo:

1. **Acesse o Supabase Dashboard:**
   - Vá em: https://supabase.com/dashboard
   - Faça login
   - Selecione seu projeto: `whketymnaeeztwrjdnta`

2. **Vá em Settings (Configurações):**
   - No menu lateral, clique em **Settings** (ícone de engrenagem)
   - Clique em **API**

3. **Copie as Chaves:**
   
   **Project URL:**
   ```
   https://whketymnaeeztwrjdnta.supabase.co
   ```
   
   **anon public (Project API key):**
   - Procure por "Project API keys"
   - Copie a chave que começa com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Esta é a `SUPABASE_KEY`
   
   **service_role (Secret key):**
   - Role a página até "Service Role"
   - Clique em "Reveal" para mostrar a chave
   - Copie a chave que começa com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Esta é a `SUPABASE_SERVICE_KEY`

4. **Cole no .env:**
   ```env
   SUPABASE_URL=https://whketymnaeeztwrjdnta.supabase.co
   SUPABASE_KEY=cole_aqui_a_anon_key
   SUPABASE_SERVICE_KEY=cole_aqui_a_service_role_key
   ```

## ⚠️ IMPORTANTE:
- As chaves são JWTs longos (começam com `eyJ...`)
- NÃO adicione aspas
- NÃO adicione espaços
- A service_role key é SECRETA, nunca exponha no frontend!
