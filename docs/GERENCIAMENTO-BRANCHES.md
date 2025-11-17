# 🌿 Guia de Gerenciamento de Branches

**Última atualização:** 05 de Novembro de 2025  
**Status:** Guia Prático para Organização de Branches

---

## 📋 Índice

1. [Visão Geral do Problema](#visão-geral-do-problema)
2. [Comandos Rápidos para Limpeza](#comandos-rápidos-para-limpeza)
3. [Estratégias de Limpeza](#estratégias-de-limpeza)
4. [Melhores Práticas](#melhores-práticas)
5. [Automação de Limpeza](#automação-de-limpeza)
6. [Perguntas Frequentes](#perguntas-frequentes)

---

## 🎯 Visão Geral do Problema

### Situação Atual

Você tem múltiplas branches do Copilot que foram criadas para diferentes funcionalidades:

```
copilot/fix-meal-register-button-approach          (#18)
copilot/add-meal-editing-feature                   (#17)
copilot/add-admin-access-monitoring-console        (#15)
copilot/improve-layout-design                      (#16)
copilot/fix-readme-content                         (#14)
copilot/improve-app-performance                    (#12)
copilot/unify-branches                             (#13)
copilot/update-competitive-analysis-docs           (#11)
copilot/implement-admin-login-page                 (#10)
copilot/protect-site-against-attacks               (#9)
copilot/fix-progress-photos-history                (#8)
copilot/review-project-and-suggestions             (#7)
copilot/fix-website-error-and-analysis             (#6)
copilot/add-nutrition-base-foods                   (#5)
copilot/fix-meal-registration-and-navigation       (#1)
integrate-templates-references                      (#?)
```

**Total:** 16+ branches ativas

### Por Que Isso Acontece?

1. **GitHub Copilot cria uma nova branch para cada tarefa**
2. **Branches não são deletadas automaticamente após merge**
3. **Acúmulo natural durante desenvolvimento ativo**

### Impactos

- ⚠️ **Confusão:** Difícil saber qual branch está ativa
- ⚠️ **Desordem:** Lista de branches muito grande
- ⚠️ **Performance:** Operações git mais lentas
- ⚠️ **Manutenção:** Difícil gerenciar e organizar

---

## 🚀 Comandos Rápidos para Limpeza

### 1️⃣ Listar Branches Merged (Seguro para Deletar)

```bash
# Ver branches locais já merged na main
git branch --merged main

# Ver branches remotas já merged
git branch -r --merged origin/main
```

### 2️⃣ Deletar Branches Locais Merged

```bash
# Deletar TODAS as branches locais já merged (exceto main e branch atual)
git branch --merged main | grep -v "main" | grep -v "\*" | xargs -r git branch -d

# Ou deletar uma por vez
git branch -d nome-da-branch
```

### 3️⃣ Deletar Branches Remotas Merged

```bash
# Deletar uma branch remota específica
git push origin --delete copilot/fix-meal-register-button-approach

# Ou usar formato curto
git push origin :copilot/fix-meal-register-button-approach
```

### 4️⃣ Limpar Referências Remotas Obsoletas

```bash
# Atualizar lista de branches remotas (remove referências de branches deletadas)
git fetch --prune origin

# Ou de forma mais completa
git remote prune origin
```

### 5️⃣ Ver Todas as Branches (Local e Remota)

```bash
# Listar todas
git branch -a

# Com informações de último commit
git branch -a -v

# Com informações de tracking
git branch -vv
```

---

## 🎯 Estratégias de Limpeza

### Estratégia 1: Limpeza Conservadora (Recomendada)

**Objetivo:** Deletar apenas branches com PR merged

```bash
# 1. Ir para branch main
git checkout main

# 2. Atualizar main
git pull origin main

# 3. Listar branches merged
git branch --merged main

# 4. Deletar branches locais merged (uma por uma para segurança)
git branch -d copilot/fix-meal-register-button-approach
git branch -d copilot/add-meal-editing-feature
# ... e assim por diante

# 5. Deletar branches remotas (se PR foi merged e branch não é mais necessária)
git push origin --delete copilot/fix-meal-register-button-approach
git push origin --delete copilot/add-meal-editing-feature
# ... e assim por diante
```

**Quando usar:** 
- ✅ Quando você tem certeza que o código foi merged
- ✅ Quando o PR foi fechado/merged
- ✅ Quando não precisa mais da branch para referência

### Estratégia 2: Limpeza Agressiva

**Objetivo:** Deletar todas as branches remotas de PRs fechados

```bash
# 1. Via GitHub UI
# Vá em: Settings > Branches > Automatically delete head branches
# Ative: ✅ "Automatically delete head branches"

# 2. Ou via comando (deletar várias de uma vez)
git push origin --delete \
  copilot/fix-meal-register-button-approach \
  copilot/add-meal-editing-feature \
  copilot/add-admin-access-monitoring-console
  
# 3. Limpar referências locais
git fetch --prune origin
```

**Quando usar:**
- ✅ Quando quer limpar rapidamente
- ✅ Quando tem backup (PRs merged)
- ⚠️ Use com cuidado!

### Estratégia 3: Limpeza por Data

**Objetivo:** Deletar branches antigas não usadas

```bash
# Ver branches com data do último commit
git for-each-ref --sort=-committerdate refs/heads/ --format='%(refname:short) %(committerdate:relative)'

# Ver branches remotas com data
git for-each-ref --sort=-committerdate refs/remotes/origin/ --format='%(refname:short) %(committerdate:relative)'

# Deletar branches locais mais antigas que 30 dias
git for-each-ref --sort=-committerdate --format="%(refname:short)" refs/heads/ | \
  while read branch; do
    if [ "$(git log -1 --since='30 days ago' -s $branch)" == "" ]; then
      echo "Deletando: $branch"
      git branch -D $branch
    fi
  done
```

**Quando usar:**
- ✅ Limpeza periódica de branches antigas
- ✅ Quando tem muitas branches abandonadas

---

## 📋 Processo Passo a Passo Recomendado

### Para o Seu Caso Específico:

#### Passo 1: Avaliar Situação Atual

```bash
# 1. Ver todas as branches
git branch -a

# 2. Ver status de cada branch vs main
git branch -a --contains HEAD

# 3. Ver quais PRs estão merged
# Vá no GitHub: https://github.com/taukkunen1/fitness-tracker/pulls?q=is%3Apr+is%3Aclosed
```

#### Passo 2: Identificar Branches para Deletar

**Critérios:**
- ✅ PR foi merged → Pode deletar
- ✅ PR foi fechado sem merge e não precisa mais → Pode deletar
- ⚠️ PR ainda aberto → Manter
- ⚠️ Branch tem trabalho não commitado → Manter

**Exemplo de avaliação:**

| Branch | Status PR | Ação |
|--------|-----------|------|
| #18 fix-meal-register-button-approach | Merged | ✅ Deletar |
| #17 add-meal-editing-feature | Merged | ✅ Deletar |
| #15 add-admin-access-monitoring-console | Merged | ✅ Deletar |
| #16 improve-layout-design | Merged | ✅ Deletar |
| #14 fix-readme-content | Merged | ✅ Deletar |
| #12 improve-app-performance | Merged | ✅ Deletar |
| #13 unify-branches | Merged | ✅ Deletar |
| #11 update-competitive-analysis-docs | Merged | ✅ Deletar |
| #10 implement-admin-login-page | Merged | ✅ Deletar |
| #9 protect-site-against-attacks | Merged | ✅ Deletar |
| #8 fix-progress-photos-history | Merged | ✅ Deletar |
| #7 review-project-and-suggestions | Merged | ✅ Deletar |
| #6 fix-website-error-and-analysis | Merged | ✅ Deletar |
| #5 add-nutrition-base-foods | Merged | ✅ Deletar |
| #1 fix-meal-registration-and-navigation | Merged | ✅ Deletar |
| integrate-templates-references | Em uso? | ⚠️ Avaliar |

#### Passo 3: Executar Limpeza

```bash
# Ir para main
git checkout main
git pull origin main

# Deletar branches locais (se existirem)
git branch -d copilot/fix-meal-register-button-approach
git branch -d copilot/add-meal-editing-feature
git branch -d copilot/add-admin-access-monitoring-console
git branch -d copilot/improve-layout-design
git branch -d copilot/fix-readme-content
git branch -d copilot/improve-app-performance
git branch -d copilot/unify-branches
git branch -d copilot/update-competitive-analysis-docs
git branch -d copilot/implement-admin-login-page
git branch -d copilot/protect-site-against-attacks
git branch -d copilot/fix-progress-photos-history
git branch -d copilot/review-project-and-suggestions
git branch -d copilot/fix-website-error-and-analysis
git branch -d copilot/add-nutrition-base-foods
git branch -d copilot/fix-meal-registration-and-navigation

# Deletar branches remotas (via GitHub UI é mais fácil)
# Ou via comando:
git push origin --delete copilot/fix-meal-register-button-approach
# ... repetir para cada branch
```

#### Passo 4: Verificar Resultado

```bash
# Ver branches restantes
git branch -a

# Limpar referências obsoletas
git fetch --prune origin

# Verificar novamente
git branch -a
```

---

## ✨ Melhores Práticas para Futuro

### 1. Configurar Auto-Delete no GitHub

**Ative a deleção automática de branches após merge:**

1. Vá em: `Settings` → `General` → `Pull Requests`
2. Marque: ✅ **"Automatically delete head branches"**
3. Salve

**Resultado:** Branches são deletadas automaticamente quando PR é merged! 🎉

### 2. Política de Branches

**Estabeleça regras claras:**

```
✅ Criar branch para cada feature/fix
✅ Nome descritivo (copilot/fix-login-bug)
✅ Fazer merge via PR
✅ Deletar branch após merge
✅ Nunca fazer commit direto na main
```

### 3. Limpeza Periódica

**Crie rotina mensal:**

```bash
# Todo mês:
# 1. Listar branches antigas
git for-each-ref --sort=-committerdate refs/heads/ --format='%(refname:short) %(committerdate:relative)'

# 2. Deletar branches merged
git branch --merged main | grep -v "main" | xargs -r git branch -d

# 3. Limpar referências remotas
git fetch --prune origin
```

### 4. Convenção de Nomenclatura

**Use prefixos consistentes:**

```
feature/nome-da-feature    → Nova funcionalidade
fix/nome-do-bug           → Correção de bug
docs/nome-do-doc          → Documentação
refactor/nome-refactor    → Refatoração
test/nome-test            → Testes
copilot/tarefa            → Tarefas do Copilot
```

### 5. Limite de Branches Ativas

**Mantenha no máximo 5-10 branches ativas:**

- 1-2 branches de feature em desenvolvimento
- 1-2 branches de bugfix
- 1 branch de documentação
- 1 branch de testes/experimentos

**Se passar de 10:** Hora de limpar! 🧹

---

## 🤖 Automação de Limpeza

### Script Bash para Limpeza Automática

Crie arquivo `scripts/cleanup-branches.sh`:

```bash
#!/bin/bash

echo "🧹 Limpando branches merged..."

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
```

**Uso:**

```bash
chmod +x scripts/cleanup-branches.sh
./scripts/cleanup-branches.sh
```

### GitHub Actions para Auto-Cleanup

Crie arquivo `.github/workflows/cleanup-branches.yml`:

```yaml
name: Cleanup Merged Branches

on:
  pull_request:
    types: [closed]
  schedule:
    # Rodar todo domingo às 00:00
    - cron: '0 0 * * 0'
  workflow_dispatch: # Permitir execução manual

jobs:
  cleanup:
    runs-on: ubuntu-latest
    if: github.event.pull_request.merged == true || github.event_name == 'schedule' || github.event_name == 'workflow_dispatch'
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Delete merged branches
        uses: jessfraz/branch-cleanup-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Resultado:** 
- ✅ Branches deletadas automaticamente após PR merge
- ✅ Limpeza semanal automática
- ✅ Opção de executar manualmente

---

## ❓ Perguntas Frequentes

### 1. Posso recuperar uma branch deletada?

**Sim!** Se você tem o SHA do último commit:

```bash
# Ver commits "perdidos"
git reflog

# Recuperar branch
git checkout -b nome-da-branch SHA_DO_COMMIT
```

**Mas:** No GitHub, branches remotas deletadas são permanentes (a menos que o PR ainda exista).

### 2. E se eu deletar uma branch por engano?

**Localmente:** Use `git reflog` (ver acima)

**Remotamente:** Se o PR ainda existe, você pode recriar a branch do PR.

**Prevenção:** Use `git branch -d` (minúsculo) ao invés de `-D` (maiúsculo). O `-d` só deleta se já foi merged.

### 3. Como sei se uma branch foi merged?

```bash
# Verificar se branch foi merged na main
git branch --merged main | grep nome-da-branch

# Verificar no GitHub
# Vá no PR e veja se tem "Merged" em roxo
```

### 4. Devo deletar branches do Copilot?

**Sim, depois que o PR for merged:**

```bash
# Branches do Copilot são temporárias
# Depois do merge, pode deletar com segurança
git push origin --delete copilot/nome-da-tarefa
```

### 5. Quantas branches devo manter?

**Recomendação:**
- **Ativas (em desenvolvimento):** 3-5 branches
- **Total (incluindo experimentais):** Máximo 10 branches
- **Remotas merged:** 0 branches (deletar após merge)

### 6. Como deletar TODAS as branches de uma vez?

```bash
# ⚠️ CUIDADO: Isso deleta TODAS exceto main e a atual
git branch | grep -v "main" | grep -v "\*" | xargs git branch -D

# Para remotas (ainda mais cuidado!)
git branch -r | grep -v "main" | sed 's/origin\///' | xargs -I {} git push origin --delete {}
```

**Use apenas se tiver certeza!**

### 7. A branch foi deletada mas ainda aparece?

```bash
# Limpar referências obsoletas
git fetch --prune origin

# Ou
git remote prune origin
```

### 8. Como ver o histórico de branches deletadas?

```bash
# Ver todos os eventos recentes
git reflog

# Ver branches deletadas especificamente
git reflog | grep "deleted"
```

---

## 🎯 Checklist de Limpeza Rápida

Use esta checklist mensalmente:

```
□ Listar todas as branches (git branch -a)
□ Identificar branches com PR merged
□ Deletar branches locais merged (git branch -d)
□ Deletar branches remotas merged (git push origin --delete)
□ Limpar referências obsoletas (git fetch --prune)
□ Verificar resultado (git branch -a)
□ Confirmar auto-delete está ativo no GitHub
□ Documentar branches importantes que devem ser mantidas
```

---

## 📊 Situação Ideal

**Antes da Limpeza:**
```
Branches Locais: 15+
Branches Remotas: 20+
PRs Fechados: 15+
Status: 🔴 Desorganizado
```

**Depois da Limpeza:**
```
Branches Locais: 1-2 (main + branch atual)
Branches Remotas: 3-5 (main + branches ativas)
PRs Fechados: Limpos
Status: 🟢 Organizado
```

---

## 🚀 Ação Imediata Recomendada

Para resolver seu problema AGORA:

```bash
# 1. Ativar auto-delete no GitHub (mais importante!)
# Ir em Settings > General > Pull Requests > 
# ✅ Automatically delete head branches

# 2. No seu terminal:
git checkout main
git pull origin main

# 3. Ver branches merged
git branch --merged main

# 4. Deletar localmente (uma por uma para segurança)
git branch -d copilot/fix-meal-register-button-approach
# ... continuar para outras merged

# 5. Verificar branches remotas no GitHub UI
# Ir em: https://github.com/taukkunen1/fitness-tracker/branches
# Clicar em 🗑️ para cada branch merged

# 6. Limpar referências
git fetch --prune origin

# 7. Verificar resultado
git branch -a
```

**Tempo estimado:** 10-15 minutos  
**Resultado:** Organização completa! 🎉

---

## 📚 Recursos Adicionais

### Comandos Git Úteis

```bash
# Ver branches ordenadas por data
git for-each-ref --sort=-committerdate refs/heads/ --format='%(refname:short) - %(committerdate:relative)'

# Ver tamanho de cada branch
git for-each-ref --sort=-objectsize refs/heads/ --format='%(refname:short) - %(objectsize:human)'

# Ver branches que contem commit específico
git branch --contains COMMIT_SHA

# Ver diferença entre duas branches
git diff branch1..branch2

# Ver log de uma branch específica
git log --oneline branch-name

# Ver quem criou a branch
git for-each-ref --format='%(refname:short) - %(authorname)' refs/heads/
```

### Links Úteis

- [Git Branch Documentation](https://git-scm.com/docs/git-branch)
- [GitHub Branch Management](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository)
- [Pro Git Book](https://git-scm.com/book/en/v2)

---

## 🎉 Conclusão

Você agora tem **todas as ferramentas** para:

✅ Limpar branches existentes de forma segura  
✅ Prevenir acúmulo futuro de branches  
✅ Manter repositório organizado e eficiente  
✅ Automatizar limpeza periódica  
✅ Seguir melhores práticas de Git  

**Seu repositório vai ficar muito mais limpo e fácil de gerenciar! 🚀**

---

**Documentação criada em:** 05 de Novembro de 2025  
**Versão:** 1.0.0  
**Autor:** taukkunen1

---

**💡 Dica Final:** Configure o auto-delete no GitHub HOJE e nunca mais se preocupe com branches acumuladas! 🎯
