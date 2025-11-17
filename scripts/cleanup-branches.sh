#!/bin/bash
set -euo pipefail

echo "🧹 Limpando branches merged..."

# Verificar se a branch main existe
if ! git rev-parse --verify main >/dev/null 2>&1; then
  echo "❌ Erro: Branch 'main' não encontrada"
  exit 1
fi

# Ir para main
git checkout main
git pull origin main

# Deletar branches locais merged
echo "Deletando branches locais merged..."
git branch --merged main | grep -v "main" | grep -v "\*" | xargs -r git branch -d

# Limpar referências remotas
echo "Limpando referências remotas obsoletas..."
git fetch --prune origin

# Mostrar resultado
echo "✅ Limpeza concluída!"
echo ""
echo "Branches restantes:"
git branch -a

echo ""
echo "Total de branches locais:" $(git branch | wc -l)
echo "Total de branches remotas:" $(git branch -r | wc -l)
