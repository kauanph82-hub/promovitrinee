# 🆘 COMANDOS GIT DE EMERGÊNCIA

## 📌 Quando usar estes comandos?

Use estes comandos se você fizer alguma alteração no código e precisar enviar para o GitHub (e consequentemente para o Render/Vercel).

---

## ✅ COMANDOS BÁSICOS (USE SEMPRE NESTA ORDEM)

### 1. Ver o que mudou
```bash
git status
```

### 2. Adicionar todas as mudanças
```bash
git add .
```

### 3. Fazer o commit (salvar as mudanças)
```bash
git commit -m "Correção de configuração do deploy"
```

### 4. Enviar para o GitHub
```bash
git push origin main
```

---

## 🔄 COMANDOS ÚTEIS

### Ver o histórico de commits
```bash
git log --oneline -5
```

### Ver diferenças antes de commitar
```bash
git diff
```

### Desfazer mudanças em um arquivo (CUIDADO!)
```bash
git checkout -- nome-do-arquivo.js
```

### Ver qual branch você está
```bash
git branch
```

---

## 🚨 SE DER ERRO "CONFLICT"

Se aparecer erro de conflito ao fazer `git push`:

```bash
# 1. Puxar as mudanças do GitHub
git pull origin main

# 2. Se pedir para resolver conflitos, abra os arquivos e corrija

# 3. Depois de corrigir:
git add .
git commit -m "Resolvendo conflitos"
git push origin main
```

---

## 📦 COMANDOS PARA TESTAR LOCALMENTE

### Backend (na pasta backend/)
```bash
cd backend
npm install
npm start
```

Deve aparecer: `🚀 Servidor rodando na porta 3001`

### Frontend (na pasta frontend/)
```bash
cd frontend
npm install
npm run dev
```

Deve aparecer: `Local: http://localhost:5173`

---

## 🔍 VERIFICAR SE O CÓDIGO ESTÁ ATUALIZADO

```bash
# Ver se tem algo para commitar
git status

# Ver se está sincronizado com o GitHub
git fetch
git status
```

Se aparecer "Your branch is up to date with 'origin/main'" = Está tudo sincronizado! ✅

---

## 💡 DICA

Sempre que fizer mudanças no código:
1. Teste localmente primeiro
2. Se funcionar, faça commit e push
3. O Render e a Vercel vão fazer deploy automaticamente
