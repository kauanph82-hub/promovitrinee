# 📦 Configuração do Supabase Storage

## Criar Bucket de Imagens

### Passo 1: Acessar Storage
1. Acesse seu projeto no Supabase
2. Clique em "Storage" no menu lateral
3. Clique em "Create a new bucket"

### Passo 2: Configurar Bucket
- **Name**: `product-images`
- **Public bucket**: ✅ Marque como público
- **File size limit**: 50 MB
- **Allowed MIME types**: 
  - image/jpeg
  - image/png
  - image/webp
  - image/gif

### Passo 3: Configurar Políticas (RLS)

Execute este SQL no SQL Editor:

```sql
-- Política para leitura pública
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Política para upload (service key)
CREATE POLICY "Service Role Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'product-images' );

-- Política para atualização (service key)
CREATE POLICY "Service Role Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'product-images' );

-- Política para deleção (service key)
CREATE POLICY "Service Role Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'product-images' );
```

### Passo 4: Testar Upload

Use este código Node.js para testar:

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://seu-projeto.supabase.co',
  'sua-service-key'
);

async function testUpload() {
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload('test.jpg', fileBuffer, {
      contentType: 'image/jpeg'
    });
  
  if (error) {
    console.error('Erro:', error);
  } else {
    console.log('Sucesso:', data);
  }
}
```

### Passo 5: Obter URL Pública

```javascript
const { data } = supabase.storage
  .from('product-images')
  .getPublicUrl('test.jpg');

console.log('URL pública:', data.publicUrl);
```

## ✅ Verificação

Após configurar, teste:

1. Faça upload de uma imagem via bot do Telegram
2. Verifique se a imagem aparece no Storage
3. Acesse a URL pública da imagem
4. Confirme que a imagem carrega no site

## 🔒 Segurança

- ✅ Bucket público permite leitura de qualquer um
- ✅ Upload/Update/Delete requerem service key
- ✅ Service key nunca deve ser exposta no frontend
- ✅ Use sempre a service key no backend

## 📊 Limites

- **Tamanho máximo por arquivo**: 50 MB
- **Storage total (Free tier)**: 1 GB
- **Bandwidth (Free tier)**: 2 GB/mês

Para aumentar, considere upgrade do plano Supabase.
