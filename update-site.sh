#!/bin/bash

# ============================================
# SCRIPT DE ATUALIZAÇÃO AUTOMÁTICA
# Fitness Tracker - GitHub Pages
# ============================================

echo "🚀 Script de Atualização - Fitness Tracker"
echo "=========================================="
echo ""

# Verificar se git está instalado
if ! command -v git &> /dev/null; then
    echo "❌ Git não está instalado!"
    echo "Instale em: https://git-scm.com/downloads"
    exit 1
fi

# Solicitar informações (primeira vez)
read -p "📝 Digite seu usuário do GitHub: " GITHUB_USER
read -p "📝 Digite o nome do repositório: " REPO_NAME

# Validar entrada para prevenir command injection
if [[ ! "$GITHUB_USER" =~ ^[a-zA-Z0-9_-]+$ ]]; then
    echo "❌ Nome de usuário inválido! Use apenas letras, números, _ e -"
    exit 1
fi

if [[ ! "$REPO_NAME" =~ ^[a-zA-Z0-9_-]+$ ]]; then
    echo "❌ Nome de repositório inválido! Use apenas letras, números, _ e -"
    exit 1
fi

# Clonar repositório (se não existir)
if [ ! -d "$REPO_NAME" ]; then
    echo "📦 Clonando repositório..."
    git clone "https://github.com/$GITHUB_USER/$REPO_NAME.git"
    cd "$REPO_NAME"
else
    echo "✅ Repositório já existe localmente"
    cd "$REPO_NAME"
    git pull origin main
fi

# Verificar se há um novo arquivo index.html para atualizar
echo ""
echo "📄 Copie o novo arquivo index.html para este diretório"
read -p "Pressione ENTER quando o arquivo estiver pronto..."

# Verificar se o arquivo existe
if [ ! -f "index.html" ]; then
    echo "❌ Arquivo index.html não encontrado!"
    exit 1
fi

# Commit e Push
echo ""
echo "📤 Enviando atualizações..."
git add index.html
git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main

echo ""
echo "✅ Atualização concluída com sucesso!"
echo "🌐 Seu site será atualizado em 1-2 minutos"
echo "🔗 Acesse: https://$GITHUB_USER.github.io/$REPO_NAME/"
echo ""
