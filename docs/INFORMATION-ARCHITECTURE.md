# Information Architecture Guide

**Última atualização:** 2025-11-16  
**Versão:** 1.0.0

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura de Pastas](#estrutura-de-pastas)
3. [Convenções de Nomenclatura](#convenções-de-nomenclatura)
4. [URLs e Navegação](#urls-e-navegação)
5. [Hierarquia de Informação](#hierarquia-de-informação)
6. [Regras de Organização](#regras-de-organização)
7. [Guia de Contribuição](#guia-de-contribuição)

---

## 🎯 Visão Geral

Este documento define a arquitetura de informação do projeto Fitness Tracker Pro, estabelecendo padrões e convenções para organização de arquivos, documentação e navegação.

### Princípios Fundamentais

1. **Hierarquia Rasa**: Máximo de 3 níveis de profundidade para conteúdo principal
2. **URLs Legíveis**: Sem acentos ou caracteres especiais, usar kebab-case
3. **Nomenclatura Consistente**: Seguir padrões estabelecidos para tipos de documento
4. **Separação de Contextos**: Distinguir claramente entre código, docs, e assets

---

## 📁 Estrutura de Pastas

```
fitness-tracker/
├── index.html                    # Aplicação principal (SPA)
├── README.md                     # Documentação principal do projeto
├── CHANGELOG.md                  # Histórico de mudanças (Keep a Changelog)
├── SECURITY.md                   # Política de segurança
├── LICENSE                       # Licença do projeto
├── DEPLOYMENT-CHECKLIST.md       # Checklist de deploy (requerido por CI/CD)
│
├── docs/                         # 📚 Toda a documentação
│   ├── README.md                 # Índice da documentação
│   ├── INDICE.md                 # Índice em português
│   │
│   ├── admin/                    # Documentação administrativa
│   │   ├── README.md
│   │   ├── admin-guide.md
│   │   ├── monitoring-guide.md
│   │   └── update-action-guide.md
│   │
│   ├── user/                     # Guias para usuários finais
│   │   ├── README.md
│   │   ├── authentication-guide.md
│   │   └── getting-started.md
│   │
│   ├── developer/                # Guias para desenvolvedores
│   │   ├── README.md
│   │   ├── setup.md
│   │   ├── architecture.md
│   │   └── contributing.md
│   │
│   ├── deployment/               # Guias de deploy
│   │   ├── README.md
│   │   ├── github-pages.md
│   │   ├── render.md
│   │   └── https-setup.md
│   │
│   ├── security/                 # Documentação de segurança
│   │   ├── README.md
│   │   ├── implementation.md
│   │   ├── best-practices.md
│   │   └── research-2025.md
│   │
│   ├── performance/              # Otimizações de performance
│   │   ├── README.md
│   │   ├── optimization-guide.md
│   │   └── benchmarks.md
│   │
│   ├── design/                   # Design e UX
│   │   ├── README.md
│   │   ├── ui-components.md
│   │   └── layout-guide.md
│   │
│   └── releases/                 # Notas de release e versões
│       ├── README.md
│       ├── VERSION.md
│       └── release-notes/
│           ├── v2.0.0.md
│           └── v1.0.0.md
│
├── scripts/                      # Scripts de automação
│   ├── README.md
│   ├── deploy.sh
│   └── backup.sh
│
└── .github/                      # Configurações do GitHub
    ├── workflows/
    └── ISSUE_TEMPLATE/
```

### 📝 Nota sobre Arquivos na Raiz

Alguns arquivos devem permanecer na raiz por razões técnicas:

- **DEPLOYMENT-CHECKLIST.md**: Requerido pelo workflow de CI/CD (`.github/workflows/https-validation.yml`)
- **Dockerfile, docker-compose.yml, nginx.conf**: Esperados por ferramentas de deploy
- **render.yaml**: Configuração da plataforma Render

Estes arquivos não devem ser movidos para `docs/` mesmo que sejam documentação, pois são dependências de automação.

---

## 🏷️ Convenções de Nomenclatura

### Arquivos de Documentação

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Guias principais | `README.md` | `README.md` |
| Guias específicos | `kebab-case.md` | `setup-guide.md` |
| Documentos de decisão | `ADR-####-titulo.md` | `ADR-0001-auth-system.md` |
| Notas de release | `v#.#.#.md` | `v2.0.0.md` |

### Pastas

- **Sempre em inglês** para consistência internacional
- **Plural para coleções**: `docs/`, `scripts/`, `releases/`
- **Singular para contextos**: `admin/`, `user/`, `deployment/`
- **Sem acentos ou caracteres especiais**

### Arquivos de Código

- `index.html` - aplicação principal
- `style.css` - estilos (se separado)
- `app.js` - lógica principal (se separado)

---

## 🔗 URLs e Navegação

### Estrutura de URLs do GitHub

```
# Documentação principal
https://github.com/taukkunen1/fitness-tracker/blob/main/README.md

# Documentação por categoria
https://github.com/taukkunen1/fitness-tracker/blob/main/docs/admin/admin-guide.md
https://github.com/taukkunen1/fitness-tracker/blob/main/docs/user/authentication-guide.md

# Changelog e versões
https://github.com/taukkunen1/fitness-tracker/blob/main/CHANGELOG.md
https://github.com/taukkunen1/fitness-tracker/blob/main/docs/releases/v2.0.0.md
```

### URLs da Aplicação (GitHub Pages) - Hash-Based Routing ✨

O sistema agora utiliza **hash-based routing** para criar uma estrutura de URLs organizada e bookmarkable:

```
# Aplicação principal (Dashboard)
https://taukkunen1.github.io/fitness-tracker/
https://taukkunen1.github.io/fitness-tracker/#dashboard

# Módulo de Treinos (inclui Fotos de Progresso)
https://taukkunen1.github.io/fitness-tracker/#treino

# Módulo de Exercícios
https://taukkunen1.github.io/fitness-tracker/#exercicios

# Módulo de Nutrição
https://taukkunen1.github.io/fitness-tracker/#nutricao
https://taukkunen1.github.io/fitness-tracker/#nutricao/alimentacao

# Evolução e Métricas
https://taukkunen1.github.io/fitness-tracker/#evolucao

# Referências Científicas
https://taukkunen1.github.io/fitness-tracker/#referencias

# Painel Administrativo (acesso restrito)
https://taukkunen1.github.io/fitness-tracker/#admin
https://taukkunen1.github.io/fitness-tracker/#admin/tarefas
https://taukkunen1.github.io/fitness-tracker/#admin/sugestoes
https://taukkunen1.github.io/fitness-tracker/#admin/seguranca
https://taukkunen1.github.io/fitness-tracker/#admin/changelog

# Sistema de Sugestões (usuários)
https://taukkunen1.github.io/fitness-tracker/#sugestoes

# Developer Tools
https://taukkunen1.github.io/fitness-tracker/#developer
```

#### Benefícios do Hash-Based Routing:

1. **📑 Bookmarkable**: Usuários podem salvar URLs específicas
2. **↩️ Navegação Browser**: Botões voltar/avançar funcionam corretamente
3. **🔒 Proteção de Rotas**: Rotas admin verificam permissões automaticamente
4. **🏗️ Estrutura Lógica**: "Árvore genealógica" clara do site
5. **⚡ Performance**: SPA mantém velocidade, sem recarregamento de página

#### Aliases e Atalhos:

- `/#paineladmin` → redireciona para `/#admin/tarefas`
- `/#alimentacao` → equivalente a `/#nutricao/alimentacao`

#### Proteção de Acesso:

Rotas que começam com `/#admin` exigem autenticação como administrador. Usuários sem permissão são automaticamente redirecionados para o dashboard com uma notificação de erro.

---

## 📊 Hierarquia de Informação

### Nível 1: Raiz do Projeto
- Arquivos essenciais: README, CHANGELOG, LICENSE, SECURITY
- Aplicação principal: index.html
- Pastas organizacionais: docs/, scripts/, .github/

### Nível 2: Categorias
- Dentro de `docs/`: categorias por público-alvo ou tema
- Dentro de `scripts/`: scripts por função
- Dentro de `.github/`: configurações do GitHub

### Nível 3: Documentos Específicos
- Guias, tutoriais, referências
- Máximo de profundidade recomendado

---

## 📋 Regras de Organização

### 1. Documentação por Público-Alvo

| Público | Pasta | Conteúdo |
|---------|-------|----------|
| Usuários finais | `docs/user/` | Guias de uso, tutoriais |
| Administradores | `docs/admin/` | Configuração, monitoramento |
| Desenvolvedores | `docs/developer/` | Setup, arquitetura, contribuição |
| DevOps | `docs/deployment/` | Deploy, CI/CD, infraestrutura |

### 2. Documentação por Tema

| Tema | Pasta | Conteúdo |
|------|-------|----------|
| Segurança | `docs/security/` | Políticas, implementações, pesquisas |
| Performance | `docs/performance/` | Otimizações, benchmarks |
| Design | `docs/design/` | UI/UX, componentes, layouts |
| Releases | `docs/releases/` | Versões, notas de release |

### 3. Taxonomia e Tags

Para documentos que pertencem a múltiplas categorias:

```markdown
---
tags: [admin, security, deployment]
category: admin
audience: administrators
version: 2.0.0
---
```

### 4. Links Internos

Sempre usar caminhos relativos:

```markdown
<!-- ✅ Correto -->
[Guia de Segurança](../security/implementation.md)
[README](../../README.md)

<!-- ❌ Errado -->
[Guia de Segurança](/docs/security/implementation.md)
[README](https://github.com/.../README.md)
```

---

## 📚 Guia de Contribuição

### Adicionando Nova Documentação

1. **Identifique o público-alvo**: usuário, admin, desenvolvedor, devops
2. **Escolha a pasta apropriada**: `docs/[categoria]/`
3. **Use nomenclatura consistente**: `kebab-case.md`
4. **Adicione frontmatter** (se relevante):

```markdown
---
title: "Nome do Documento"
category: admin
tags: [tag1, tag2]
version: 2.0.0
date: 2025-11-16
---
```

5. **Atualize o README** da pasta
6. **Adicione links** no `docs/INDICE.md`

### Movendo Documentação Existente

1. Crie a nova estrutura de pastas (se necessário)
2. Mova o arquivo mantendo o histórico do git:
   ```bash
   git mv old/path/file.md new/path/file.md
   ```
3. Atualize todos os links internos
4. Atualize os índices (README.md, INDICE.md)
5. Crie redirects se necessário (no README antigo)

### Removendo Documentação Obsoleta

1. **Nunca delete sem revisar**: pode haver dependências
2. **Archive primeiro**: mova para `docs/archive/`
3. **Documente a remoção**: adicione nota no CHANGELOG.md
4. **Atualize links**: remova ou redirecione links quebrados

---

## 🔍 Pesquisa e Descoberta

### Testando a Estrutura

Use **Tree Testing** para validar se usuários conseguem encontrar informação:

1. Liste tarefas comuns:
   - "Como fazer deploy?"
   - "Como configurar autenticação?"
   - "Onde está o changelog?"

2. Peça para usuários navegarem sem busca

3. Meça:
   - Taxa de sucesso
   - Tempo para encontrar
   - Caminhos tomados

### Card Sorting

Para reorganizações maiores, use card sorting:

1. Liste todos os documentos
2. Peça para usuários agruparem por categoria
3. Use os grupos para definir a estrutura

---

## ✅ Checklist de Validação

Antes de fazer commit de mudanças estruturais:

- [ ] Todos os arquivos seguem convenções de nomenclatura
- [ ] Profundidade máxima não excede 3 níveis
- [ ] Cada pasta tem um README.md explicativo
- [ ] Links internos foram atualizados
- [ ] INDICE.md foi atualizado
- [ ] Não há arquivos órfãos ou duplicados
- [ ] Estrutura foi testada com usuários (se possível)

---

## 📖 Referências

Este guia é baseado em:

- [Nielsen Norman Group - Information Architecture](https://www.nngroup.com/articles/ia-study-guide/)
- [Interaction Design Foundation - IA Best Practices](https://www.interaction-design.org/literature/topics/information-architecture)
- [Google SEO Guidelines](https://developers.google.com/search/docs)
- [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)
- [Semantic Versioning](https://semver.org/lang/pt-BR/)

---

**Mantido por:** @taukkunen1  
**Última revisão:** 2025-11-16
