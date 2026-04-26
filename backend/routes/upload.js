const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Multer em memória (não salva no disco)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB por imagem
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Apenas imagens são permitidas'), false);
    }
    cb(null, true);
  }
});

// POST /api/upload/images — faz upload de múltiplas imagens (admin)
router.post('/images', authMiddleware, upload.array('images', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Nenhuma imagem enviada' });
  }

  try {
    const urls = [];

    for (const file of req.files) {
      const ext = file.mimetype.split('/')[1];
      const fileName = `products/${uuidv4()}.${ext}`;

      const { error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      urls.push(publicUrl);
    }

    res.json({ urls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer upload das imagens' });
  }
});

// DELETE /api/upload/image — remove imagem do storage (admin)
router.delete('/image', authMiddleware, async (req, res) => {
  const { path } = req.body;
  if (!path) return res.status(400).json({ error: 'Path da imagem é obrigatório' });

  const { error } = await supabase.storage.from('product-images').remove([path]);
  if (error) return res.status(500).json({ error: 'Erro ao remover imagem' });

  res.json({ message: 'Imagem removida com sucesso' });
});

module.exports = router;
