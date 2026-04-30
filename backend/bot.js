require('dotenv').config(); // PRIMEIRA LINHA - OBRIGATÓRIO
const { Telegraf } = require('telegraf');
const axios = require('axios');
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');
const supabase = require('./config/supabase');

console.log('📦 Carregando bot.js...');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const GOOGLE_VISION_CREDENTIALS = process.env.GOOGLE_VISION_CREDENTIALS;
const OCR_SPACE_KEY = process.env.OCR_SPACE_KEY || 'K84713721288957';

console.log('🔑 Token do bot (últimos 3 chars):', BOT_TOKEN ? BOT_TOKEN.slice(-3) : '❌ NÃO ENCONTRADO');
console.log('🔧 Admin ID:', ADMIN_CHAT_ID);
console.log('👁️ OCR.space:', OCR_SPACE_KEY ? 'Configurado ✅' : '❌ NÃO CONFIGURADO');

const bot = new Telegraf(BOT_TOKEN);

// ========== SESSÃO EM MEMÓRIA ==========
// Guarda estado por usuário: aguardando categoria ou foto
const sessions = {};

function getSession(userId) {
  if (!sessions[userId]) sessions[userId] = {};
  return sessions[userId];
}

function clearSession(userId) {
  sessions[userId] = {};
}

// ========== OCR.SPACE ==========
async function extractTextFromImage(imageBuffer) {
  console.log('👁️ Enviando imagem para OCR.space...');

  const FormData = require('form-data');
  const form = new FormData();
  form.append('apikey', OCR_SPACE_KEY);
  form.append('language', 'por');
  form.append('isOverlayRequired', 'false');
  form.append('file', imageBuffer, { filename: 'image.jpg', contentType: 'image/jpeg' });

  const { data } = await axios.post('https://api.ocr.space/parse/image', form, {
    headers: form.getHeaders(),
    timeout: 30000,
  });

  console.log('📊 Resposta OCR.space:', JSON.stringify(data).slice(0, 300));

  if (data.IsErroredOnProcessing) {
    throw new Error('OCR.space erro: ' + data.ErrorMessage);
  }

  const text = data.ParsedResults?.[0]?.ParsedText || '';
  console.log('📝 Texto extraído:\n', text);
  return text;
}

// Calcula preço original com desconto aleatório (17%, 29% ou 45%)
function calcOriginalPrice(promoPrice) {
  if (!promoPrice || promoPrice <= 0) return 0;
  const discounts = [17, 29, 45];
  const discount = discounts[Math.floor(Math.random() * discounts.length)];
  const original = promoPrice / (1 - discount / 100);
  return Math.round(original * 100) / 100; // arredonda 2 casas
}

function detectPlatform(link) {
  if (!link) return 'other';
  if (link.includes('shopee')) return 'shopee';
  if (link.includes('mercadolivre') || link.includes('mlb')) return 'mercadolivre';
  if (link.includes('amazon')) return 'amazon';
  if (link.includes('aliexpress')) return 'aliexpress';
  if (link.includes('shein')) return 'shein';
  if (link.includes('magazineluiza') || link.includes('magalu')) return 'magalu';
  if (link.includes('americanas')) return 'americanas';
  if (link.includes('tiktok')) return 'tiktok';
  return 'other';
}

function parseOcrText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Extrai link da Shopee
  const linkMatch = text.match(/(https?:\/\/[^\s]+(?:shopee|shp\.ee|s\.shopee)[^\s]*)/i);
  const link = linkMatch ? linkMatch[1] : null;

  // Extrai preço — pega o maior valor encontrado (evita pegar "16%" como preço)
  let price = 0;
  const priceMatches = [...text.matchAll(/R\$\s*(\d{1,4}[.,]\d{2})/gi)];
  if (priceMatches.length > 0) {
    const prices = priceMatches.map(m => parseFloat(m[1].replace(',', '.')));
    price = Math.max(...prices);
  }

  // Título: ignora linhas curtas, números, preços, links, percentuais, vendas
  const skipPatterns = [
    /https?:\/\//,           // links
    /R\$\s*\d/,              // preços
    /^\d+[.,]\d{2}$/,        // só número decimal
    /^\d+%/,                 // percentual
    /vendido/i,              // "X Vendido(s)"
    /avalia/i,               // avaliações
    /frete/i,                // frete
    /parcela/i,              // parcelamento
    /cupom/i,                // cupom
    /desconto/i,             // desconto
    /^\d+(\.\d+)?$/,         // só números
    /afiliado/i,             // afiliados
    /compartilh/i,           // compartilhar
    /aprender/i,             // "Aprender com Criadores"
    /criador/i,
    /loja/i,                 // nome da loja
    /seguir/i,
    /chat/i,
    /gosto/i,
  ];

  const title = lines.find(l => {
    if (l.length < 15) return false;
    if (skipPatterns.some(p => p.test(l))) return false;
    return true;
  }) || lines.find(l => l.length > 8 && !l.match(/https?:\/\//)) || 'Produto Shopee';

  return { link, price, title };
}

// ========== COMANDO /START ==========
bot.start((ctx) => {
  console.log('--- COMANDO /START RECEBIDO ---');
  console.log('ID do usuário:', ctx.from.id);
  
  ctx.reply(
    '🔥 <b>Opa! Bot da PromoVitrine ativo!</b>\n\n' +
    '<b>MODO PRINT (NOVO!):</b>\n' +
    'Envie uma print do produto com o link na legenda e eu leio tudo automaticamente!\n\n' +
    '<b>MODO AUTOMÁTICO:</b>\n' +
    'Envie um link da Shopee e eu extraio tudo automaticamente.\n\n' +
    '<b>MODO MANUAL (comando /p):</b>\n' +
    'Use formato livre! Exemplos:\n' +
    '• <code>/p https://shopee.com.br/produto 49.90 Camiseta premium</code>\n' +
    '• <code>/p https://shopee.com.br/produto 49.90</code>\n' +
    '• <code>/p https://shopee.com.br/produto</code>\n' +
    '• Com foto: Envie a foto com a legenda acima\n\n' +
    'Aceito links:\n' +
    '• shopee.com.br\n' +
    '• s.shopee.com.br (encurtado)\n' +
    '• shp.ee (encurtado)',
    { parse_mode: 'HTML' }
  );
});

// ========== HANDLER DE FOTO SEM COMANDO (OCR + SESSÃO) ==========
bot.on('photo', async (ctx) => {
  if (ctx.message.caption?.startsWith('/p')) return;

  const userId = ctx.from.id;
  const session = getSession(userId);

  // ── MODO: aguardando foto do produto (após OCR) ──
  if (session.awaitingProductPhoto && session.pendingProduct) {
    console.log('\n📸 ===== FOTO DO PRODUTO RECEBIDA =====');
    try {
      const photo = ctx.message.photo[ctx.message.photo.length - 1];
      const fileLink = await ctx.telegram.getFileLink(photo.file_id);
      const imageUrl = await uploadImageToSupabase(fileLink.href);

      if (imageUrl) {
        await supabase.from('product_images').insert({
          product_id: session.pendingProduct.id,
          url: imageUrl,
          order: (session.pendingProduct.imageCount || 0),
        });
        session.pendingProduct.imageCount = (session.pendingProduct.imageCount || 0) + 1;
        await ctx.reply(`✅ Foto adicionada! (${session.pendingProduct.imageCount} foto(s))\n\nEnvie mais fotos ou digite /fim para finalizar.`);
      }
    } catch (err) {
      ctx.reply('❌ Erro ao salvar foto: ' + err.message);
    }
    return;
  }

  // ── MODO: OCR da print ──
  console.log('\n📸 ===== PRINT RECEBIDA (OCR) =====');

  if (!OCR_SPACE_KEY) {
    return ctx.reply('❌ OCR não configurado. Use /p com o link na legenda.');
  }

  await ctx.reply('⏳ Lendo a print com OCR...');

  try {
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const fileLink = await ctx.telegram.getFileLink(photo.file_id);
    const { data: imageBuffer } = await axios.get(fileLink.href, { responseType: 'arraybuffer' });

    const ocrText = await extractTextFromImage(Buffer.from(imageBuffer));
    if (!ocrText) {
      return ctx.reply('❌ Não consegui ler texto na imagem. Tente usar /p com o link na legenda.');
    }

    const caption = ctx.message.caption || '';
    const captionLink = caption.match(/(https?:\/\/[^\s]+)/i)?.[1];
    const parsed = parseOcrText(ocrText);
    const link = captionLink || parsed.link;

    if (!link) {
      return ctx.reply(
        '❌ Não encontrei o link do produto.\n\nEnvie a print com o link na legenda:\n<code>https://s.shopee.com.br/xxx</code>',
        { parse_mode: 'HTML' }
      );
    }

    // Busca categorias do banco
    const { data: cats } = await supabase.from('categories').select('id, name, icon').eq('active', true).order('name');
    const categories = cats || [];

    // Salva na sessão para usar depois
    session.pendingOcr = { parsed, link, ocrText };

    const escapeHtml = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const catList = categories.map((c, i) => `${i + 1}. ${c.icon} ${c.name}`).join('\n');

    await ctx.reply(
      `📝 <b>Dados extraídos:</b>\n` +
      `📦 Título: ${escapeHtml(parsed.title)}\n` +
      `💰 Preço: ${parsed.price > 0 ? `R$ ${parsed.price.toFixed(2)}` : 'Consultar'}\n` +
      `🔗 Link: ${escapeHtml(link)}\n\n` +
      `📂 <b>Escolha a categoria (responda com o número):</b>\n${catList}`,
      { parse_mode: 'HTML' }
    );

    session.awaitingCategory = true;
    session.categories = categories;

  } catch (err) {
    console.error('💥 Erro no OCR:', err.message);
    ctx.reply('❌ Erro ao processar a print: ' + err.message);
  }
});

// ========== COMANDO /fim — finaliza envio de fotos ==========
bot.command('fim', async (ctx) => {
  const userId = ctx.from.id;
  const session = getSession(userId);

  if (session.pendingProduct) {
    const p = session.pendingProduct;
    clearSession(userId);
    return ctx.reply(
      `✅ <b>Produto finalizado!</b>\n🆔 ID: ${p.id}\n📸 ${p.imageCount || 0} foto(s) salva(s)\n\n💡 Ajuste no Painel Admin se necessário.`,
      { parse_mode: 'HTML' }
    );
  }
  ctx.reply('Nenhum produto pendente.');
});

// ========== COMANDO /p - POSTAGEM LIVRE (PARSE INTELIGENTE) ==========
bot.command('p', async (ctx) => {
  console.log('\n📝 ===== COMANDO /p RECEBIDO =====');
  console.log('ID do usuário:', ctx.from.id);
  
  try {
    let imageUrl = null;
    let text = '';
    
    // Verifica se tem foto
    if (ctx.message.photo) {
      console.log('📸 Foto detectada');
      const photo = ctx.message.photo[ctx.message.photo.length - 1];
      text = ctx.message.caption || '';
      
      // Baixa a foto do Telegram
      console.log('📥 Baixando foto do Telegram...');
      const fileLink = await ctx.telegram.getFileLink(photo.file_id);
      console.log('🔗 Link da foto:', fileLink.href);
      
      // Faz upload para o Supabase
      console.log('☁️ Fazendo upload para Supabase...');
      imageUrl = await uploadImageToSupabase(fileLink.href);
      console.log('✅ Imagem enviada:', imageUrl);
    } else {
      text = ctx.message.text.replace('/p', '').trim();
    }
    
    console.log('📝 Texto recebido:', text);
    
    if (!text) {
      return ctx.reply(
        '❌ <b>Envie algo junto com o comando!</b>\n\n' +
        'Exemplos:\n' +
        '• <code>/p https://shopee.com.br/produto 49.90 Camiseta premium</code>\n' +
        '• <code>/p https://shopee.com.br/produto 49.90</code>\n' +
        '• <code>/p https://shopee.com.br/produto</code>',
        { parse_mode: 'HTML' }
      );
    }
    
    // ========== PARSE INTELIGENTE ==========
    console.log('🧠 Iniciando parse inteligente...');
    
    // Extrai o link (qualquer coisa que comece com http)
    const linkMatch = text.match(/(https?:\/\/[^\s]+)/i);
    let link = linkMatch ? linkMatch[1].trim() : null;
    
    if (!link) {
      return ctx.reply('❌ Não encontrei um link válido! Envie um link da Shopee.');
    }
    
    console.log('🔗 Link encontrado:', link);
    
    // Valida se é Shopee
    if (!link.includes('shopee.com.br') && !link.includes('shp.ee') && !link.includes('s.shopee')) {
      return ctx.reply('❌ O link precisa ser da Shopee!');
    }
    
    // Remove o link do texto para processar o resto
    let remainingText = text.replace(link, '').trim();
    console.log('📝 Texto restante:', remainingText);
    
    // Extrai o preço (primeiro bloco com números)
    let price = 0;
    let priceText = null;
    const priceMatch = remainingText.match(/(?:R\$\s*)?(\d+[,\.]?\d*)/i);
    
    if (priceMatch) {
      priceText = priceMatch[1];
      price = parseFloat(priceText.replace(/[^\d,\.]/g, '').replace(',', '.'));
      if (isNaN(price)) {
        price = 0;
      }
      console.log('💰 Preço encontrado:', price);
      
      // Remove o preço do texto restante
      remainingText = remainingText.replace(priceMatch[0], '').trim();
    } else {
      console.log('⚠️ Preço não encontrado, usando "Consultar"');
    }
    
    // O que sobrou é a descrição
    let description = remainingText.trim();
    if (!description || description.length < 3) {
      description = 'Produto da Shopee';
      console.log('⚠️ Descrição vazia, usando padrão');
    } else {
      console.log('📝 Descrição encontrada:', description);
    }
    
    // Gera título automaticamente (primeiras palavras da descrição)
    let title = description.split(' ').slice(0, 8).join(' ');
    if (title.length > 60) {
      title = title.substring(0, 60) + '...';
    }
    
    console.log('📊 DADOS FINAIS:');
    console.log('Link:', link);
    console.log('Preço:', price);
    console.log('Título:', title);
    console.log('Descrição:', description);
    console.log('Imagem:', imageUrl || 'Não fornecida');
    
    await ctx.reply('⏳ Salvando produto...');
    
    // Salva o produto no banco
    console.log('💾 Salvando produto no banco...');
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        title: title,
        description: description,
        original_price: calcOriginalPrice(price),
        promo_price: price,
        affiliate_link: link,
        platform: 'shopee',
        active: true,
        featured: false,
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erro ao salvar produto:', error);
      return ctx.reply('❌ Erro ao salvar no banco: ' + error.message);
    }
    
    console.log('✅ Produto salvo! ID:', product.id);
    
    // Salva a imagem se fornecida
    if (imageUrl && product) {
      console.log('💾 Salvando imagem na tabela product_images...');
      const { error: imgError } = await supabase
        .from('product_images')
        .insert({
          product_id: product.id,
          url: imageUrl,
          order: 0,
        });
      
      if (imgError) {
        console.error('⚠️ Erro ao salvar imagem:', imgError);
      } else {
        console.log('✅ Imagem vinculada ao produto');
      }
    }
    
    // Resposta de sucesso
    console.log('🎉 POSTAGEM MANUAL CONCLUÍDA!');
    
    const escapeHtml = (text) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    };
    
    const safeTitle = escapeHtml(title);
    const safeLink = escapeHtml(link);
    const priceDisplay = price > 0 ? `R$ ${price.toFixed(2)}` : 'Consultar';
    
    await ctx.reply(
      `✅ <b>Produto salvo com sucesso!</b>\n\n` +
      `📦 <b>Título:</b> ${safeTitle}\n` +
      `💰 <b>Preço:</b> ${priceDisplay}\n` +
      `🆔 <b>ID:</b> ${product.id}\n` +
      `🖼️ <b>Imagem:</b> ${imageUrl ? 'Enviada ✅' : 'Não fornecida'}\n\n` +
      `🔗 <a href="${safeLink}">Ver na Shopee</a>`,
      { parse_mode: 'HTML' }
    );
    
    if (imageUrl) {
      await ctx.replyWithPhoto(imageUrl);
    }
    
  } catch (err) {
    console.error('💥 Erro no comando /p:', err);
    ctx.reply('❌ Erro ao processar: ' + err.message);
  }
});

// Continua na próxima parte...

// ========== HANDLER DE SESSÃO — escolha de categoria ==========
bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const session = getSession(userId);

  // Aguardando escolha de categoria após OCR
  if (session.awaitingCategory && session.pendingOcr) {
    const num = parseInt(ctx.message.text.trim());
    const categories = session.categories || [];

    if (isNaN(num) || num < 1 || num > categories.length) {
      return ctx.reply(`❌ Digite um número entre 1 e ${categories.length}.`);
    }

    const chosenCat = categories[num - 1];
    const { parsed, link } = session.pendingOcr;

    await ctx.reply('⏳ Salvando produto...');

    try {
      const { data: product, error } = await supabase
        .from('products')
        .insert({
          title: parsed.title,
          description: parsed.title,
          original_price: calcOriginalPrice(parsed.price || 0),
          promo_price: parsed.price || 0,
          affiliate_link: link,
          platform: detectPlatform(link),
          category_id: chosenCat.id,
          active: true,
          featured: false,
        })
        .select()
        .single();

      if (error) throw error;

      // Limpa OCR da sessão, entra em modo aguardando foto do produto
      session.awaitingCategory = false;
      session.pendingOcr = null;
      session.awaitingProductPhoto = true;
      session.pendingProduct = { id: product.id, imageCount: 0 };

      const escapeHtml = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      await ctx.reply(
        `✅ <b>Produto salvo!</b>\n\n` +
        `📦 ${escapeHtml(parsed.title)}\n` +
        `💰 ${parsed.price > 0 ? `R$ ${parsed.price.toFixed(2)}` : 'Consultar'}\n` +
        `📂 ${chosenCat.icon} ${chosenCat.name}\n` +
        `🆔 ID: ${product.id}\n\n` +
        `📸 <b>Agora envie a(s) foto(s) do produto.</b>\nQuando terminar, digite /fim`,
        { parse_mode: 'HTML' }
      );
    } catch (err) {
      clearSession(userId);
      ctx.reply('❌ Erro ao salvar: ' + err.message);
    }
    return;
  }
});

// ========== DETECTA MENSAGENS DE TEXTO (MODO AUTOMÁTICO) ==========
bot.on('text', async (ctx) => {
  console.log('\n--- MENSAGEM RECEBIDA ---');
  
  // Verifica se a mensagem existe
  if (!ctx.message || !ctx.message.text) {
    console.log('❌ Mensagem sem texto');
    return;
  }
  
  const text = ctx.message.text;
  console.log('Texto recebido:', text);
  console.log('ID do usuário:', ctx.from?.id);
  
  // Ignora comandos
  if (text.startsWith('/')) {
    console.log('⚠️ Comando detectado, ignorando');
    return;
  }
  
  // Regex para detectar QUALQUER link da Shopee
  const shopeeRegex = /https?:\/\/(?:www\.|s\.)?(?:shopee\.com\.br|shp\.ee)\/[^\s]+/gi;
  const matches = text.match(shopeeRegex);
  
  if (!matches || matches.length === 0) {
    console.log('❌ Nenhum link da Shopee encontrado');
    return;
  }
  
  let url = matches[0].trim();
  console.log('✅ Link detectado:', url);
  
  await ctx.reply('⏳ Processando link da Shopee...');
  
  // ========== SEGUIR REDIRECIONAMENTO SE FOR LINK ENCURTADO ==========
  if (url.includes('s.shopee.com.br') || url.includes('shp.ee')) {
    console.log('🔗 Link encurtado detectado');
    try {
      url = await followRedirect(url);
      console.log('✅ URL final:', url);
    } catch (err) {
      console.error('❌ Erro ao seguir redirecionamento:', err.message);
      return ctx.reply('❌ Não consegui acessar o link encurtado. Tente usar o link completo do produto.');
    }
  }
  
  // ========== EXTRAIR DADOS DA SHOPEE ==========
  let productData = null;
  try {
    console.log('📥 [1/3] Extraindo dados da Shopee...');
    productData = await extractShopeeData(url);
    console.log('✅ Dados extraídos:', productData);
    
    if (!productData || !productData.title) {
      console.log('❌ Falha: dados incompletos');
      return ctx.reply('❌ Não consegui extrair os dados do produto. Verifique se o link está correto.');
    }
  } catch (err) {
    console.error('💥 ERRO NA EXTRAÇÃO:', err.message);
    return ctx.reply('❌ Erro ao extrair dados: ' + err.message);
  }
  
  // ========== UPLOAD DA IMAGEM ==========
  let imageUrl = null;
  try {
    if (productData.imageUrl) {
      console.log('🖼️ [2/3] Fazendo upload da imagem...');
      imageUrl = await uploadImageToSupabase(productData.imageUrl);
      console.log('✅ Imagem enviada:', imageUrl);
    } else {
      console.log('⚠️ Nenhuma imagem para fazer upload');
    }
  } catch (err) {
    console.error('💥 ERRO NO UPLOAD DA IMAGEM:', err.message);
    // Continua mesmo sem imagem
  }
  
  // ========== SALVAR NO BANCO ==========
  try {
    console.log('💾 [3/3] Salvando produto no banco...');
    console.log('🔑 Usando SUPABASE_SERVICE_KEY para bypass de RLS');
    
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        title: productData.title,
        description: productData.title,
        original_price: calcOriginalPrice(productData.price || 0),
        promo_price: productData.price || 0,
        affiliate_link: url,
        platform: 'shopee',
        active: true,
        featured: false,
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ ERRO AO SALVAR PRODUTO:', error);
      return ctx.reply('❌ Erro ao salvar no banco: ' + error.message);
    }
    
    console.log('✅ Produto salvo! ID:', product.id);
    
    // Salva a imagem na tabela product_images
    if (imageUrl && product) {
      console.log('💾 Salvando imagem na tabela product_images...');
      const { error: imgError } = await supabase
        .from('product_images')
        .insert({
          product_id: product.id,
          url: imageUrl,
          order: 0,
        });
      
      if (imgError) {
        console.error('⚠️ Erro ao salvar imagem:', imgError.message);
      } else {
        console.log('✅ Imagem vinculada ao produto');
      }
    }
    
    // Resposta de sucesso
    console.log('🎉 PROCESSO CONCLUÍDO COM SUCESSO!');
    
    // Escapa caracteres especiais do HTML
    const escapeHtml = (text) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    };
    
    const safeTitle = escapeHtml(productData.title);
    const safeUrl = escapeHtml(url);
    
    // Verifica se conseguiu extrair dados completos
    if (!productData.dataFound || productData.title === 'Produto Shopee') {
      // Aviso de dados incompletos
      await ctx.reply(
        `⚠️ <b>Link salvo, mas não consegui ler os detalhes!</b>\n\n` +
        `O produto foi salvo no banco, mas a Shopee bloqueou a leitura dos dados.\n\n` +
        `📦 <b>Título:</b> ${safeTitle}\n` +
        `🆔 <b>ID:</b> ${product.id}\n\n` +
        `🔗 <a href="${safeUrl}">Ver na Shopee</a>\n\n` +
        `💡 <b>Próximo passo:</b> Ajuste o título, preço e imagem no Painel Admin.`,
        { parse_mode: 'HTML' }
      );
    } else {
      // Sucesso completo
      await ctx.reply(
        `✅ <b>Produto salvo com sucesso!</b>\n\n` +
        `📦 <b>Título:</b> ${safeTitle}\n` +
        `💰 <b>Preço:</b> R$ ${productData.price ? productData.price.toFixed(2) : 'N/A'}\n` +
        `🆔 <b>ID:</b> ${product.id}\n\n` +
        `🔗 <a href="${safeUrl}">Ver na Shopee</a>`,
        { parse_mode: 'HTML' }
      );
    }
    
    if (imageUrl) {
      try {
        await ctx.replyWithPhoto(imageUrl);
      } catch (err) {
        console.error('⚠️ Erro ao enviar foto:', err.message);
      }
    }
    
  } catch (err) {
    console.error('💥 ERRO AO SALVAR NO BANCO:', err);
    ctx.reply('❌ Erro ao salvar: ' + err.message);
  }
});

// ========== FUNÇÃO: SEGUIR REDIRECIONAMENTO ==========
async function followRedirect(shortUrl) {
  console.log('🔄 Seguindo redirecionamento...');
  console.log('URL curta:', shortUrl);
  
  try {
    // Faz uma requisição HEAD primeiro (mais rápido)
    const response = await axios.head(shortUrl, {
      maxRedirects: 10,
      timeout: 15000,
      validateStatus: () => true, // Aceita qualquer status
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });
    
    // Pega a URL final do redirecionamento
    const finalUrl = response.request?.res?.responseUrl || response.config?.url || shortUrl;
    
    console.log('✅ URL após redirecionamento:', finalUrl);
    
    // Valida se é uma URL da Shopee válida
    if (!finalUrl.includes('shopee.com.br')) {
      throw new Error('URL final não é da Shopee');
    }
    
    return finalUrl;
    
  } catch (err) {
    console.error('❌ Erro no redirecionamento:', err.message);
    
    // Tenta com GET se HEAD falhar
    try {
      console.log('🔄 Tentando com GET...');
      const response = await axios.get(shortUrl, {
        maxRedirects: 10,
        timeout: 15000,
        validateStatus: () => true,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      
      const finalUrl = response.request?.res?.responseUrl || response.config?.url || shortUrl;
      console.log('✅ URL final (GET):', finalUrl);
      return finalUrl;
      
    } catch (err2) {
      console.error('❌ Erro no GET:', err2.message);
      throw new Error('Não foi possível seguir o redirecionamento');
    }
  }
}

// Continua...

// ========== FUNÇÃO: EXTRAIR DADOS DA SHOPEE ==========
async function extractShopeeData(url) {
  console.log('🌐 Fazendo requisição para:', url);
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://www.google.com/',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      },
      timeout: 20000,
      maxRedirects: 10,
      validateStatus: (status) => status < 500,
    });
    
    console.log('✅ Resposta recebida');
    console.log('📊 Status HTTP:', response.status);
    console.log('📊 Tamanho do HTML:', response.data.length, 'caracteres');
    
    if (response.status === 403) {
      console.error('❌ ERRO 403: Acesso negado pela Shopee');
      throw new Error('Shopee bloqueou o acesso');
    }
    
    if (response.status === 404) {
      console.error('❌ ERRO 404: Produto não encontrado');
      throw new Error('Produto não encontrado');
    }
    
    const html = response.data;
    const $ = cheerio.load(html);
    
    let title = null;
    let imageUrl = null;
    let price = null;
    let dataFound = false;
    
    // ========== PRIORIDADE 1: METATAGS (MAIS CONFIÁVEL) ==========
    console.log('\n🔍 [MÉTODO 1] Buscando nas metatags...');
    
    // Título
    title = $('meta[property="og:title"]').attr('content');
    if (title) {
      console.log('✅ Título encontrado em og:title');
      dataFound = true;
    } else {
      title = $('meta[name="twitter:title"]').attr('content');
      if (title) console.log('✅ Título encontrado em twitter:title');
    }
    
    // Imagem
    imageUrl = $('meta[property="og:image"]').attr('content');
    if (imageUrl) {
      console.log('✅ Imagem encontrada em og:image');
      dataFound = true;
    } else {
      imageUrl = $('meta[property="og:image:secure_url"]').attr('content');
      if (imageUrl) console.log('✅ Imagem encontrada em og:image:secure_url');
    }
    
    // Preço (metatag)
    let priceText = $('meta[property="product:price:amount"]').attr('content');
    if (priceText) {
      const cleanPrice = priceText.replace(/[^\d,\.]/g, '').replace(',', '.');
      price = parseFloat(cleanPrice);
      if (price && price > 0) {
        console.log('✅ Preço encontrado em product:price:amount:', price);
        dataFound = true;
      }
    }
    
    // ========== PRIORIDADE 2: JSON-LD (BACKUP) ==========
    if (!price || !imageUrl) {
      console.log('\n🔍 [MÉTODO 2] Buscando no JSON-LD...');
      const scripts = $('script[type="application/ld+json"]');
      
      scripts.each((i, script) => {
        try {
          const scriptContent = $(script).html();
          if (!scriptContent) return;
          
          const jsonData = JSON.parse(scriptContent);
          
          // Busca preço
          if (!price && jsonData.offers) {
            const offers = Array.isArray(jsonData.offers) ? jsonData.offers[0] : jsonData.offers;
            if (offers.price) {
              price = parseFloat(offers.price);
              if (price && price > 0) {
                console.log('✅ Preço encontrado no JSON-LD:', price);
                dataFound = true;
              }
            }
          }
          
          // Busca imagem
          if (!imageUrl && jsonData.image) {
            imageUrl = Array.isArray(jsonData.image) ? jsonData.image[0] : jsonData.image;
            if (imageUrl) {
              console.log('✅ Imagem encontrada no JSON-LD');
              dataFound = true;
            }
          }
          
          // Busca título
          if (!title && jsonData.name) {
            title = jsonData.name;
            console.log('✅ Título encontrado no JSON-LD');
            dataFound = true;
          }
          
        } catch (e) {
          // Ignora erros de parse
        }
      });
    }
    
    // ========== LIMPEZA E VALIDAÇÃO ==========
    if (title) {
      title = title.replace(/\s*\|\s*Shopee.*$/i, '').trim();
      title = title.replace(/\s+/g, ' ').trim();
    }
    
    if (!title || title.length < 3) {
      title = 'Produto Shopee';
      console.log('⚠️ Título não encontrado, usando padrão');
    }
    
    if (!price || isNaN(price) || price === 0) {
      price = 0;
      console.log('⚠️ Preço não encontrado');
    }
    
    if (!imageUrl) {
      console.log('⚠️ Imagem não encontrada');
    }
    
    // ========== RESUMO ==========
    console.log('\n📊 RESUMO DOS DADOS EXTRAÍDOS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 Título:', title);
    console.log('💰 Preço: R$', price ? price.toFixed(2) : '0.00');
    console.log('🖼️ Imagem:', imageUrl || '❌ Não encontrada');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    return { 
      title, 
      imageUrl, 
      price,
      dataFound // Flag para saber se conseguiu extrair dados
    };
    
  } catch (err) {
    console.error('\n💥 ERRO AO EXTRAIR DADOS:');
    console.error('Mensagem:', err.message);
    console.error('Status:', err.response?.status);
    
    // Retorna dados mínimos para não quebrar o fluxo
    return {
      title: 'Produto Shopee',
      imageUrl: null,
      price: 0,
      dataFound: false,
      error: err.message
    };
  }
}

// ========== FUNÇÃO: UPLOAD PARA SUPABASE ==========
async function uploadImageToSupabase(imageUrl) {
  console.log('📥 Baixando imagem de:', imageUrl);
  
  try {
    const { data: imageBuffer } = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    console.log('✅ Imagem baixada:', imageBuffer.byteLength, 'bytes');
    
    const fileName = `${uuidv4()}.jpg`;
    console.log('📝 Nome do arquivo:', fileName);
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });
    
    if (error) {
      console.error('❌ Erro no upload:', error);
      throw error;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);
    
    console.log('🔗 URL pública:', publicUrl);
    return publicUrl;
    
  } catch (err) {
    console.error('💥 Erro ao processar imagem:', err.message);
    throw err;
  }
}

// ========== INICIAR BOT ==========
function startBot() {
  console.log('🔍 Verificando configurações do bot...');
  console.log('Token:', BOT_TOKEN ? 'Configurado ✅' : 'Não encontrado ❌');
  console.log('Admin ID:', ADMIN_CHAT_ID || 'Não encontrado ❌');
  
  if (!BOT_TOKEN) {
    console.warn('⚠️ Bot desabilitado: TELEGRAM_BOT_TOKEN não configurado');
    return;
  }
  
  console.log('🚀 Iniciando bot do Telegram...');
  
  bot.launch()
    .then(() => {
      console.log('🤖 Bot do Telegram conectado!');
      console.log('👂 Bot aguardando mensagens...');
    })
    .catch(err => {
      console.error('❌ Erro ao iniciar bot:', err.message);
      console.error('Detalhes:', err);
    });
  
  // Graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

module.exports = { startBot };
