# 🏗️ Arquitetura do Sistema - Pilgrim Fitness Tracker

**Versão:** 2.0.0  
**Última atualização:** 16 de Novembro de 2025  
**Autor:** taukkunen1

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura da Aplicação](#arquitetura-da-aplicação)
3. [Camada de Backend (Lógica)](#camada-de-backend-lógica)
4. [Camada de Frontend (Interface)](#camada-de-frontend-interface)
5. [Estrutura de Arquivos](#estrutura-de-arquivos)
6. [Fluxo de Dados](#fluxo-de-dados)
7. [Características Principais](#características-principais)
8. [Tecnologias Utilizadas](#tecnologias-utilizadas)
9. [Segurança](#segurança)
10. [Escalabilidade e Performance](#escalabilidade-e-performance)

---

## 🎯 Visão Geral

O **Pilgrim Fitness Tracker** é uma **Single Page Application (SPA)** moderna que funciona 100% no navegador, sem necessidade de servidor backend tradicional. A aplicação utiliza APIs nativas do navegador para implementar toda a lógica de negócio, armazenamento de dados e segurança.

### Paradigma Arquitetural

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVEGADOR (Cliente)                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              FRONTEND (Apresentação)                  │  │
│  │  - Interface do Usuário (HTML/CSS/Tailwind)          │  │
│  │  - Componentes Visuais (JavaScript)                  │  │
│  │  - Roteamento (Hash-based Router)                    │  │
│  │  - Gráficos e Visualizações (Chart.js)               │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↕                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │          "BACKEND" LÓGICO (Camada de Dados)           │  │
│  │  - Gerenciamento de Estado (State Management)        │  │
│  │  - Lógica de Negócio (Business Logic)                │  │
│  │  - Autenticação e Segurança (Web Crypto API)         │  │
│  │  - Armazenamento de Dados (IndexedDB)                │  │
│  │  - Cache e Fallback (localStorage)                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Características Fundamentais

- ✅ **100% Client-Side**: Toda a lógica roda no navegador
- ✅ **Zero Dependências de Servidor**: Não requer backend tradicional
- ✅ **Privacidade Total**: Dados nunca saem do dispositivo do usuário
- ✅ **Offline-First**: Funciona sem conexão à internet após primeiro carregamento
- ✅ **Segurança Enterprise**: Criptografia PBKDF2, rate limiting, CSRF protection
- ✅ **Progressive Web App Ready**: Preparado para PWA (v2.1)

---

## 🏗️ Arquitetura da Aplicação

### Padrão Arquitetural: MV* (Model-View-Whatever)

A aplicação segue um padrão **MV*** simplificado adaptado para SPA:

```
┌──────────────────────────────────────────────────────────────┐
│                         VIEW LAYER                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ Dashboard  │  │  Treinos   │  │  Nutrição  │  ...       │
│  │ Component  │  │ Component  │  │ Component  │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└──────────────────────────────────────────────────────────────┘
                            ↕
┌──────────────────────────────────────────────────────────────┐
│                     CONTROLLER LAYER                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Router (Hash-based Routing)               │  │
│  │  - Navegação entre páginas                            │  │
│  │  - Proteção de rotas (Admin)                          │  │
│  │  - Histórico do navegador                             │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              State Management (Global)                 │  │
│  │  - Estado da aplicação                                │  │
│  │  - Estado de autenticação                             │  │
│  │  - Gerenciamento de sessões                           │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                            ↕
┌──────────────────────────────────────────────────────────────┐
│                       MODEL LAYER                            │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Database Layer (IndexedDB)                │  │
│  │  - Armazenamento persistente                          │  │
│  │  - Queries e transações                               │  │
│  │  - Migração de schemas                                │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │            Business Logic (Core Functions)             │  │
│  │  - Cálculos de macros                                 │  │
│  │  - Validações                                         │  │
│  │  - Processamento de dados                             │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔧 Camada de Backend (Lógica)

Embora não exista um servidor backend tradicional, a aplicação implementa toda a lógica de backend usando APIs do navegador:

### 1. 💾 Camada de Armazenamento (Data Layer)

#### IndexedDB (Banco de Dados Principal)

**Localização:** Implementado via `js/core/db.js`

**Stores (Tabelas):**

```javascript
// Schema do Banco de Dados (v6)
{
  users: {
    keyPath: 'id',
    // Armazena: treinos, métricas, fotos de progresso
  },
  accounts: {
    keyPath: 'username',
    // Armazena: credenciais, roles, hash de senhas
  },
  tasks: {
    keyPath: 'id',
    autoIncrement: true,
    // Armazena: tarefas administrativas, roadmap
  },
  suggestions: {
    keyPath: 'id',
    autoIncrement: true,
    // Armazena: sugestões de usuários, votos
  },
  access_logs: {
    keyPath: 'id',
    autoIncrement: true,
    // Armazena: logs de acesso, analytics
  },
  settings: {
    keyPath: 'key',
    // Armazena: configurações do sistema
  },
  security_events: {
    keyPath: 'id',
    autoIncrement: true,
    // Armazena: eventos de segurança, auditoria
  },
  sessions: {
    keyPath: 'sessionId',
    // Armazena: sessões ativas, tokens
  }
}
```

**Funcionalidades:**
- Transações ACID
- Índices para queries eficientes
- Versionamento e migrações automáticas
- Capacidade: ~250MB+ (depende do navegador)

#### localStorage (Fallback e Cache)

**Localização:** Usado como fallback quando IndexedDB não está disponível

**Dados Armazenados:**
- Session tokens
- Configurações temporárias
- Cache de última visita
- Dados de auto-login (desenvolvimento)

**Capacidade:** ~5-10MB (limite do navegador)

### 2. 🔐 Camada de Segurança (Security Layer)

#### Autenticação e Autorização

**Localização:** `js/auth/authentication.js`

**Funcionalidades:**
```javascript
// Sistema de Autenticação
- Hash de senhas: PBKDF2 (100.000 iterações)
- Salt único por usuário
- Session tokens seguros (UUID v4)
- Timeout de sessão configurável (24h padrão)
- Auto-refresh de sessões
- Logout automático por inatividade
```

**Sistema de Roles:**
```javascript
roles = {
  admin: {
    permissions: ['all'],
    canAccess: ['admin', 'dashboard', 'treino', 'nutricao', ...]
  },
  user: {
    permissions: ['read', 'write_own'],
    canAccess: ['dashboard', 'treino', 'nutricao', ...]
  }
}
```

#### Segurança Avançada

**Localização:** `js/auth/advanced-security.js`, `js/auth/security.js`

**Implementações:**

1. **Brute Force Protection**
   ```javascript
   - Máximo 5 tentativas de login
   - Bloqueio de 15 minutos após limite
   - Contador progressivo de falhas
   - Logs de tentativas suspeitas
   ```

2. **Rate Limiting**
   ```javascript
   - Limite: 10 requisições/minuto por ação
   - Algoritmo: Token Bucket
   - Adaptativo: Aumenta limite em operações normais
   - Logs de rate limit hits
   ```

3. **XSS Protection**
   ```javascript
   - Sanitização de todos os inputs
   - Escape de HTML em outputs
   - Content Security Policy (CSP) via headers
   - DOMPurify pattern para strings
   ```

4. **CSRF Protection**
   ```javascript
   - Tokens CSRF únicos por sessão
   - Validação em todas as operações sensíveis
   - Rotação de tokens periódica
   - Binding com session ID
   ```

5. **AI-Powered Security (v2.0)**
   ```javascript
   - Detecção de padrões anômalos
   - Machine learning para identificar ameaças
   - Adaptive rate limiting baseado em comportamento
   - Zero Trust Architecture (validação contínua)
   - Privacy-preserving analytics (100% local)
   ```

### 3. 📊 Camada de Lógica de Negócio (Business Logic)

#### Módulos Core

**Localização:** Distribuído em `index.html` (monolítico) e `js/` (modular)

**Principais Módulos:**

1. **Gestão de Usuários**
   ```javascript
   - Registro de novos usuários
   - Validação de dados
   - Promoção de roles
   - Export/Import de dados
   - Gerenciamento de perfis
   ```

2. **Gestão de Treinos**
   ```javascript
   - Templates científicos (Full-body, PPL, Upper/Lower)
   - Logs de treino
   - Cálculo de volume e progressão
   - Integração com fotos de progresso
   - Histórico completo
   ```

3. **Gestão de Nutrição**
   ```javascript
   - Cálculo automático de macros
   - Registro de refeições diárias
   - Base de dados de alimentos comuns
   - Refeições compostas
   - Histórico e análises
   ```

4. **Métricas e Analytics**
   ```javascript
   - Cálculo de IMC, gordura corporal
   - Tendências e projeções
   - Comparação entre usuários
   - Gráficos de evolução (Chart.js)
   - Export de dados (CSV, JSON)
   ```

5. **Sistema Administrativo**
   ```javascript
   - Gestão de tarefas (roadmap)
   - Sistema de sugestões
   - Monitoramento de acessos
   - Auditoria de segurança
   - Gestão de contas
   ```

### 4. 🔄 Camada de Estado (State Management)

**Localização:** Global state objects em `index.html`

**Objetos de Estado:**

```javascript
// Estado Principal da Aplicação
state = {
  currentUser: 'username',
  currentView: 'dashboard',
  users: {
    'username': {
      treinos: [...],
      metricas: [...],
      fotos: [...],
      alimentacao: {...}
    }
  },
  selectedDate: '2025-11-16',
  comparing: false,
  // ... outros estados
}

// Estado de Autenticação
authState = {
  isAuthenticated: false,
  currentUser: null,
  currentAccount: null,
  sessionToken: null,
  sessionExpiry: null,
  isAdmin: false,
  loginAttempts: {},
  rateLimits: {},
  securityEvents: []
}
```

**Padrões de Atualização:**
```javascript
// Atualização de estado sempre seguida de re-render
function updateState(newState) {
  Object.assign(state, newState);
  render(); // Re-renderiza a UI
  saveToIndexedDB(state); // Persiste mudanças
}
```

---

## 🎨 Camada de Frontend (Interface)

### 1. 🖼️ Camada de Apresentação (Presentation Layer)

#### Estrutura de Componentes

**Localização:** Funções `render*()` em `index.html`

**Componentes Principais:**

```
App (Root)
├── Navigation Bar
│   ├── Logo
│   ├── Menu Items
│   └── User Menu
│       ├── Username Display
│       ├── Role Badge
│       └── Logout Button
│
├── Main Content Area
│   ├── Dashboard View
│   │   ├── Welcome Card
│   │   ├── Quick Actions
│   │   ├── Recent Activities
│   │   └── Metrics Summary
│   │
│   ├── Treino View
│   │   ├── Templates Section
│   │   ├── Log Treino Form
│   │   ├── Progress Photos Section (Collapsible)
│   │   │   ├── Upload Form
│   │   │   ├── Photo Gallery
│   │   │   └── Comparison Tool
│   │   └── Training History
│   │
│   ├── Nutrição View
│   │   ├── Date Selector
│   │   ├── Meal Entry Form
│   │   ├── Daily Macro Summary
│   │   └── Meal History
│   │
│   ├── Evolução View
│   │   ├── Metrics Entry Form
│   │   ├── Charts (Weight, Body Fat, Muscle)
│   │   ├── Statistics
│   │   └── Export Options
│   │
│   ├── Admin View (Role-Protected)
│   │   ├── Admin Dashboard
│   │   ├── Task Management
│   │   │   ├── Roadmap (Short/Mid/Long term)
│   │   │   └── Task CRUD
│   │   ├── Suggestions Management
│   │   │   ├── List with Votes
│   │   │   └── Approval/Rejection
│   │   ├── Security Monitoring
│   │   │   ├── Security Events Log
│   │   │   ├── Security Posture Score
│   │   │   └── Active Sessions
│   │   └── User Management
│   │       ├── User List
│   │       └── Role Management
│   │
│   └── Suggestions View (User-Facing)
│       ├── Submit Suggestion Form
│       ├── Community Suggestions
│       └── Voting System
│
└── Auth Views
    ├── Login Form
    └── Register Form
```

#### Sistema de Roteamento

**Localização:** `js/core/router.js` (modular) ou inline em `index.html`

**Hash-based Routing:**

```javascript
// Estrutura de Rotas
routes = {
  '': 'dashboard',              // Default route
  'dashboard': renderDashboard,
  'treino': renderTreino,
  'exercicios': renderExercicios,
  'nutricao': renderNutricao,
  'nutricao/alimentacao': renderAlimentacao,
  'evolucao': renderEvolucao,
  'referencias': renderReferencias,
  'sugestoes': renderSugestoes,
  'admin': renderAdmin,          // Protected
  'admin/tarefas': renderAdminTasks,
  'admin/sugestoes': renderAdminSuggestions,
  'admin/seguranca': renderAdminSecurity,
  'developer': renderDeveloper
}

// Navegação
function navigate(route) {
  window.location.hash = route;
  // Triggers hashchange event → router handles render
}

// Proteção de Rotas
function isProtectedRoute(route) {
  return route.startsWith('admin') && !authState.isAdmin;
}
```

**Benefícios:**
- ✅ URLs bookmarkable
- ✅ Botões voltar/avançar funcionam
- ✅ Proteção automática de rotas admin
- ✅ SPA performance mantida

### 2. 🎨 Camada de Estilização (Styling Layer)

**Framework CSS:** Tailwind CSS (via CDN)

**Abordagem:**
```html
<!-- Utility-First CSS -->
<div class="max-w-7xl mx-auto p-4">
  <div class="bg-white shadow-lg rounded-lg p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">
      Título
    </h2>
  </div>
</div>
```

**Sistema de Design:**
```javascript
// Cores Principais
colors = {
  primary: '#3B82F6',    // Blue-500
  success: '#10B981',    // Green-500
  warning: '#F59E0B',    // Amber-500
  danger: '#EF4444',     // Red-500
  gray: '#6B7280'        // Gray-500
}

// Espaçamento
spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem'      // 32px
}

// Breakpoints (Responsive)
breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
}
```

**Responsividade:**
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly (botões grandes, espaçamento adequado)

### 3. 📊 Camada de Visualização (Data Visualization)

**Biblioteca:** Chart.js 4.4.0

**Tipos de Gráficos:**

```javascript
// Gráfico de Linha - Evolução de Peso
{
  type: 'line',
  data: {
    labels: ['Jan', 'Fev', 'Mar', ...],
    datasets: [{
      label: 'Peso (kg)',
      data: [80, 79, 78, ...],
      borderColor: '#3B82F6',
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index' }
    }
  }
}

// Gráfico de Barras - Distribuição de Macros
{
  type: 'bar',
  data: {
    labels: ['Proteína', 'Carboidratos', 'Gorduras'],
    datasets: [{
      data: [150, 250, 70],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444']
    }]
  }
}

// Gráfico de Pizza - Calorias por Refeição
{
  type: 'doughnut',
  data: {
    labels: ['Café', 'Almoço', 'Jantar', 'Lanches'],
    datasets: [{
      data: [450, 800, 700, 300]
    }]
  }
}
```

**Analytics e Estatísticas:**
- Gráficos de acesso por hora/dia/semana/mês
- Visitantes únicos
- Taxa de engagement
- Tempo médio de sessão
- Breakdown por feature

---

## 📁 Estrutura de Arquivos

### Organização do Projeto

```
fitness-tracker/
│
├── index.html                      # ⭐ APLICAÇÃO PRINCIPAL (SPA Monolítica)
│   ├── HTML Structure              # Estrutura da página
│   ├── Embedded CSS                # Estilos inline (mínimos)
│   └── JavaScript (~10k linhas)    # Toda a lógica da aplicação
│       ├── State Management
│       ├── Authentication
│       ├── Database Layer
│       ├── Business Logic
│       ├── UI Components
│       └── Event Handlers
│
├── index-modular.html              # Versão modularizada (experimental)
│
├── js/                             # 📦 Módulos JavaScript (arquitetura modular)
│   ├── auth/                       # Módulos de autenticação
│   │   ├── authentication.js       # Sistema de login/registro
│   │   ├── security.js             # Segurança básica (CSRF, XSS)
│   │   └── advanced-security.js    # Segurança avançada (AI, rate limit)
│   │
│   ├── core/                       # Módulos centrais
│   │   ├── db.js                   # Abstração de IndexedDB
│   │   └── router.js               # Sistema de roteamento
│   │
│   ├── data/                       # Dados estáticos/iniciais
│   │   ├── templates.js            # Templates de treino
│   │   ├── common-foods.js         # Base de alimentos
│   │   └── initial-users.js        # Usuários de teste
│   │
│   └── utils/                      # Utilitários
│       └── helpers.js              # Funções auxiliares
│
├── docs/                           # 📚 DOCUMENTAÇÃO COMPLETA
│   ├── README.md                   # Índice da documentação
│   ├── INFORMATION-ARCHITECTURE.md # Arquitetura de informação
│   │
│   ├── admin/                      # Guias administrativos
│   │   ├── README.md
│   │   ├── admin-guide.md
│   │   └── monitoring-guide.md
│   │
│   ├── user/                       # Guias do usuário
│   │   ├── README.md
│   │   ├── getting-started.md
│   │   └── authentication-guide.md
│   │
│   ├── developer/                  # Guias para desenvolvedores
│   │   └── README.md               # Setup, arquitetura, contribuição
│   │
│   ├── deployment/                 # Guias de deploy
│   │   ├── README.md
│   │   ├── github-pages.md
│   │   └── render.md
│   │
│   ├── security/                   # Documentação de segurança
│   │   ├── README.md
│   │   └── CYBERSECURITY-RESEARCH-2025.md
│   │
│   ├── performance/                # Otimizações
│   │   ├── README.md
│   │   └── PERFORMANCE-README.md
│   │
│   ├── design/                     # Design e UX
│   │   └── README.md
│   │
│   ├── releases/                   # Notas de versão
│   │   ├── README.md
│   │   └── VERSION.md
│   │
│   └── reports/                    # Relatórios de implementação
│       ├── README.md
│       └── IMPLEMENTATION-README.md
│
├── scripts/                        # 🔧 Scripts de automação
│   ├── README.md
│   └── [scripts de deploy/backup]
│
├── .github/                        # ⚙️ Configurações GitHub
│   └── workflows/                  # CI/CD workflows
│       └── https-validation.yml    # Validação de HTTPS
│
├── README.md                       # 📖 Documentação principal do projeto
├── CHANGELOG.md                    # 📝 Histórico de mudanças
├── SECURITY.md                     # 🔐 Política de segurança
├── LICENSE                         # ⚖️ Licença MIT
│
├── DEPLOYMENT-CHECKLIST.md         # ✅ Checklist de deploy
├── MIGRATION_GUIDE.md              # 🔄 Guia de migração de versões
│
├── Dockerfile                      # 🐳 Containerização com Nginx
├── docker-compose.yml              # Orquestração Docker
├── nginx.conf                      # Configuração Nginx (local)
├── nginx-docker.conf               # Configuração Nginx (Docker)
└── render.yaml                     # Configuração Render.com
```

### Decisão Arquitetural: Monólito vs Modular

**Arquivo Principal (`index.html`):**
- ✅ Monolítico: Todo código em um arquivo
- ✅ Facilita deployment (apenas um arquivo)
- ✅ Sem necessidade de build step
- ✅ Zero configuração
- ⚠️ Grande (~440KB, mas comprime bem)

**Arquitetura Modular (`js/`):**
- ✅ Separação de responsabilidades
- ✅ Melhor manutenibilidade
- ✅ Reutilização de código
- ⚠️ Requer bundler para produção
- 🚧 Experimental (v2.1+)

---

## 🔄 Fluxo de Dados

### 1. Fluxo de Autenticação

```
┌─────────────┐
│   Usuário   │
└──────┬──────┘
       │ 1. Digite credenciais
       ↓
┌─────────────────────────┐
│   Login Form (UI)       │
└──────────┬──────────────┘
           │ 2. Submit form
           ↓
┌─────────────────────────┐
│  validateLogin()        │
│  - Verifica rate limit  │
│  - Verifica brute force │
└──────────┬──────────────┘
           │ 3. Check credentials
           ↓
┌─────────────────────────┐
│  IndexedDB (accounts)   │
│  - Busca usuário        │
│  - Verifica hash PBKDF2 │
└──────────┬──────────────┘
           │ 4. Credenciais válidas
           ↓
┌─────────────────────────┐
│  createSession()        │
│  - Gera session token   │
│  - Define expiry        │
│  - Atualiza authState   │
└──────────┬──────────────┘
           │ 5. Session criada
           ↓
┌─────────────────────────┐
│  navigate('dashboard')  │
│  - Atualiza URL         │
│  - Renderiza dashboard  │
└─────────────────────────┘
```

### 2. Fluxo de Salvamento de Dados

```
┌─────────────┐
│   Usuário   │
└──────┬──────┘
       │ 1. Preenche formulário
       ↓
┌─────────────────────────┐
│   Form Component (UI)   │
└──────────┬──────────────┘
           │ 2. Submit event
           ↓
┌─────────────────────────┐
│  Event Handler          │
│  - Previne default      │
│  - Coleta dados         │
│  - Valida campos        │
└──────────┬──────────────┘
           │ 3. Dados válidos
           ↓
┌─────────────────────────┐
│  updateState()          │
│  - Atualiza state obj   │
│  - Dispara re-render    │
└──────────┬──────────────┘
           │ 4. State atualizado
           ↓
┌─────────────────────────┐
│  saveToIndexedDB()      │
│  - Abre transação       │
│  - Put/Add no store     │
│  - Commit               │
└──────────┬──────────────┘
           │ 5. Dados persistidos
           ↓
┌─────────────────────────┐
│  render()               │
│  - Re-renderiza UI      │
│  - Mostra confirmação   │
└─────────────────────────┘
```

### 3. Fluxo de Navegação (Routing)

```
┌─────────────┐
│   Usuário   │
└──────┬──────┘
       │ 1. Clica em link/botão
       ↓
┌─────────────────────────┐
│  navigate(route)        │
│  - Define location.hash │
└──────────┬──────────────┘
           │ 2. Hash changed
           ↓
┌─────────────────────────┐
│  hashchange Event       │
│  - Captura novo hash    │
└──────────┬──────────────┘
           │ 3. Router process
           ↓
┌─────────────────────────┐
│  Router                 │
│  - Parse route          │
│  - Check protection     │
│  - Find handler         │
└──────────┬──────────────┘
           │ 4. Route allowed
           ↓
┌─────────────────────────┐
│  Route Handler          │
│  - Atualiza state.view  │
│  - Chama render()       │
└──────────┬──────────────┘
           │ 5. Renderização
           ↓
┌─────────────────────────┐
│  render()               │
│  - Limpa main content   │
│  - Renderiza nova view  │
│  - Atualiza navegação   │
└─────────────────────────┘
```

### 4. Fluxo de Carregamento Inicial

```
┌─────────────────────────┐
│  Browser carrega HTML   │
└──────────┬──────────────┘
           │
           ↓
┌─────────────────────────┐
│  DOMContentLoaded       │
│  - Executa init()       │
└──────────┬──────────────┘
           │
           ├─→ initDatabase()
           │   - Abre/cria IndexedDB
           │   - Migrações se necessário
           │
           ├─→ checkSession()
           │   - Verifica token
           │   - Valida expiry
           │   - Auto-login (dev mode)
           │
           ├─→ setupRouter()
           │   - Registra listeners
           │   - Parse initial route
           │
           ├─→ loadData()
           │   - Carrega de IndexedDB
           │   - Popula state
           │
           └─→ render()
               - Renderiza view inicial
               - Aplica estilos
               - Ativa interações
```

---

## 🌟 Características Principais

### 1. Sistema de Autenticação Enterprise (v2.0)

**Componentes:**
- Login/Registro com validação robusta
- Hash PBKDF2 com 100.000 iterações
- Session tokens UUID v4
- Timeout configurável (24h)
- Auto-refresh de sessões
- Logout automático por inatividade

**Segurança:**
- Brute force protection (5 tentativas)
- Rate limiting adaptativo (10 req/min)
- XSS sanitization em todos inputs
- CSRF tokens por sessão
- AI-powered threat detection
- Zero Trust Architecture

**Auditoria:**
- Log de todos eventos de segurança
- Timeline de ações suspeitas
- Security posture score (DCCI framework)
- Alertas de anomalias

### 2. Painel Administrativo Completo

**Dashboard Admin:**
- Visão geral de tarefas e usuários
- Estatísticas do sistema
- Quick actions

**Gestão de Tarefas:**
- Roadmap organizado (curto/médio/longo prazo)
- Estados: pendente, em progresso, concluído
- Prioridades: baixa, média, alta
- Progresso visual
- Export para Markdown/GitHub Issues

**Gestão de Sugestões:**
- Sistema de votação comunitária
- Aprovação/rejeição com notas
- Estados: pendente, aprovada, implementada, rejeitada
- Priorização automática por votos
- Export para GitHub Issues

**Monitoramento de Segurança:**
- Lista de eventos de segurança
- Security posture score
- Sessões ativas
- Tentativas de login falhas
- Rate limit hits

**Gestão de Usuários:**
- Lista de todos os usuários
- Promoção/rebaixamento de roles
- Visualização de atividades
- Estatísticas de uso

### 3. Sistema de Treinos Baseado em Evidências

**Templates Científicos:**
- Full-body (3x/semana)
- Push/Pull/Legs (6x/semana)
- Upper/Lower/Full (3x/semana)

**Cada template inclui:**
- Exercícios específicos
- Séries e repetições
- Tempo de descanso
- Progressão recomendada
- Base científica (referências)

**Log de Treinos:**
- Registro de cada sessão
- Carga, séries, reps
- Notas e observações
- Integração com fotos de progresso

### 4. Sistema de Nutrição Completo

**Registro de Refeições:**
- Múltiplas refeições por dia
- Navegação dia-a-dia
- Cálculo automático de macros
- Validação de campos

**Base de Alimentos:**
- +50 alimentos comuns
- Macros pré-calculados
- Busca e filtros
- Alimentos customizados

**Refeições Compostas:**
- Combine múltiplos alimentos
- Cálculo total de macros
- Salvar como template
- Reutilizar receitas

**Análises:**
- Distribuição de macros
- Histórico completo
- Tendências
- Comparação de períodos

### 5. Métricas e Evolução

**Dados Rastreados:**
- Peso corporal
- % de gordura
- Massa muscular
- Circunferências
- Fotos de progresso

**Visualizações:**
- Gráficos de linha (evolução)
- Gráficos de barras (comparação)
- Estatísticas (médias, min, max)
- Tendências e projeções

**Comparação:**
- Compare 2 usuários lado a lado
- Métricas sincronizadas
- Análise comparativa
- Export de comparações

**Export de Dados:**
- CSV com todos os registros
- JSON para backup completo
- Markdown para documentação
- Compatível com Excel/Google Sheets

### 6. Fotos de Progresso (v2.1)

**Upload:**
- Interface drag-and-drop
- Preview antes de salvar
- Validação de tipo (image/*)
- Validação de tamanho (<5MB)

**Armazenamento:**
- IndexedDB (Base64)
- 100% local, zero cloud
- Privacidade total

**Galeria:**
- Grid responsivo
- Ordenação por data
- Notas por foto
- Metadata (data, peso, medidas)

**Comparação:**
- Lado a lado de 2 fotos
- Zoom sincronizado
- Análise visual
- Export de comparações

### 7. Sistema de Monitoramento de Acessos

**Tracking Automático:**
- Cada page view registrado
- Timestamp preciso
- Usuário (se logado)
- View acessada

**Analytics:**
- Acessos por hora
- Acessos por dia/semana/mês
- Visitantes únicos
- Breakdown por feature
- Tempo médio de sessão

**Visualizações:**
- Gráficos de linha (timeline)
- Gráficos de barras (distribuição)
- Heatmaps (horários de pico)
- Tabelas detalhadas

**Auto-refresh:**
- Atualização a cada 5 min
- Dados sempre atualizados
- Sem reload de página

### 8. Sistema de Sugestões Comunitárias

**Para Usuários:**
- Enviar sugestões
- Votar em sugestões (upvote)
- Ver status de sugestões
- Comentar (futuro)

**Para Admins:**
- Aprovar/rejeitar sugestões
- Marcar como implementado
- Adicionar notas internas
- Priorização automática por votos

**Export:**
- GitHub Issues format
- Markdown completo
- Incluir votos e comentários
- Um clique para issue

### 9. Hash-Based Routing (v2.1)

**URLs Bookmarkable:**
```
/#dashboard          → Dashboard principal
/#treino             → Treinos
/#nutricao           → Nutrição
/#evolucao           → Métricas
/#admin              → Painel admin (protegido)
/#admin/tarefas      → Gestão de tarefas
/#admin/seguranca    → Monitoramento segurança
```

**Benefícios:**
- Navegar via botões do navegador
- Salvar URLs favoritas
- Compartilhar links diretos
- Manter histórico de navegação
- Performance de SPA mantida

**Proteção:**
- Rotas admin verificam role
- Redirect automático se não autorizado
- Toast notification de erro
- Preserva tentativa de acesso para auditoria

### 10. Developer Tools (v2.0)

**Console do Dev:**
- Logs categorizados [AUTH], [DB], [SECURITY]
- Inspeção de estado
- Funções de debug

**Ferramentas Úteis:**
```javascript
// Ver todo o estado
console.log(state);

// Ver autenticação
console.log(authState);

// Inspecionar banco de dados
await inspectDatabase();

// Calcular security posture
console.log(calculateSecurityPosture());

// Limpar dados (cuidado!)
clearAllData();
```

---

## 🛠️ Tecnologias Utilizadas

### Frontend (UI Layer)

| Tecnologia | Versão | Uso | Por que? |
|-----------|---------|-----|----------|
| **HTML5** | - | Estrutura | Semântico, acessível |
| **CSS3** | - | Estilos | Flexbox, Grid, animações |
| **Tailwind CSS** | 2.2+ | Framework CSS | Utility-first, rápido, responsivo |
| **JavaScript** | ES6+ | Lógica | Vanilla JS, sem frameworks |
| **Chart.js** | 4.4.0 | Gráficos | Rico em features, performático |

### Backend Lógico (Data Layer)

| Tecnologia | Versão | Uso | Por que? |
|-----------|---------|-----|----------|
| **IndexedDB** | v3 | Banco de dados | Grande capacidade, transações |
| **localStorage** | - | Cache/Fallback | Rápido, simples, suporte universal |
| **Web Crypto API** | - | Criptografia | Nativo, seguro, PBKDF2 |
| **Service Workers** | - | Cache/Offline | PWA, offline-first (v2.1) |

### Segurança

| Tecnologia | Uso | Implementação |
|-----------|-----|---------------|
| **PBKDF2** | Hash de senhas | 100k iterações, salt único |
| **UUID v4** | Session tokens | Tokens aleatórios seguros |
| **CSP** | Content Security Policy | Headers HTTP via nginx |
| **HTTPS** | Transporte seguro | GitHub Pages / Render |
| **DOMPurify pattern** | XSS protection | Sanitização de inputs |

### DevOps e Deploy

| Tecnologia | Uso | Por que? |
|-----------|-----|----------|
| **GitHub Pages** | Hosting | Grátis, rápido, HTTPS |
| **GitHub Actions** | CI/CD | Automação, testes |
| **Docker** | Containerização | Portabilidade |
| **Nginx** | Web server | Performance, segurança |
| **Render.com** | Deploy alternativo | Fácil, automático |

### Desenvolvimento

| Ferramenta | Uso |
|-----------|-----|
| **Git** | Controle de versão |
| **GitHub** | Repositório, colaboração |
| **VS Code** | Editor recomendado |
| **Chrome DevTools** | Debug, profiling |
| **Lighthouse** | Auditoria de performance |

---

## 🔐 Segurança

### Camadas de Segurança

```
┌─────────────────────────────────────────────────────────┐
│              CAMADA 1: Transporte (HTTPS)               │
│  - TLS 1.3                                              │
│  - Certificado válido                                   │
│  - HSTS headers                                         │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│          CAMADA 2: Headers de Segurança (CSP)           │
│  - Content-Security-Policy                              │
│  - X-Frame-Options: DENY                                │
│  - X-Content-Type-Options: nosniff                      │
│  - Referrer-Policy: no-referrer                         │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│         CAMADA 3: Autenticação (PBKDF2 + Salt)          │
│  - Hash de senha: PBKDF2                                │
│  - Iterações: 100.000                                   │
│  - Salt único por usuário                               │
│  - Session tokens UUID v4                               │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│      CAMADA 4: Autorização (Roles & Permissions)        │
│  - Role-based access control (RBAC)                     │
│  - Proteção de rotas admin                              │
│  - Validação de permissões por ação                     │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│     CAMADA 5: Proteções em Runtime (Rate Limit, etc)    │
│  - Rate limiting adaptativo                             │
│  - Brute force protection                               │
│  - CSRF tokens por sessão                               │
│  - XSS sanitization                                     │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│        CAMADA 6: AI-Powered Security (v2.0)             │
│  - Detecção de anomalias                                │
│  - Adaptive defense                                     │
│  - Zero Trust validation                                │
│  - Privacy-preserving analytics                         │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│           CAMADA 7: Auditoria e Monitoramento           │
│  - Log de todos eventos de segurança                    │
│  - Security posture scoring                             │
│  - Alertas de ameaças                                   │
│  - Compliance tracking                                  │
└─────────────────────────────────────────────────────────┘
```

### Implementações de Segurança

#### 1. Criptografia de Senhas (PBKDF2)

```javascript
// Hash de senha
async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  
  const key = await crypto.subtle.importKey(
    'raw',
    data,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 100000,  // 100k iterações
      hash: 'SHA-256'
    },
    key,
    256
  );
  
  return Array.from(new Uint8Array(derivedBits))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
```

#### 2. Rate Limiting (Token Bucket)

```javascript
// Rate limiter com token bucket
class RateLimiter {
  constructor(maxTokens, refillRate) {
    this.maxTokens = maxTokens;        // 10 tokens
    this.refillRate = refillRate;      // 1 token/6s
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }
  
  tryConsume(tokens = 1) {
    this.refill();
    
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;  // Permitido
    }
    
    return false;  // Bloqueado (rate limit)
  }
  
  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    const tokensToAdd = elapsed / this.refillRate;
    
    this.tokens = Math.min(
      this.maxTokens,
      this.tokens + tokensToAdd
    );
    this.lastRefill = now;
  }
}
```

#### 3. XSS Protection

```javascript
// Sanitização de HTML
function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Uso
element.innerHTML = sanitizeHTML(userInput);
```

#### 4. CSRF Protection

```javascript
// Gerar CSRF token
function generateCSRFToken() {
  return 'csrf_' + crypto.randomUUID();
}

// Validar CSRF token
function validateCSRFToken(token, session) {
  return token === session.csrfToken;
}

// Uso em forms
<form onsubmit="return validateForm(event)">
  <input type="hidden" name="csrf_token" 
         value="${authState.csrfToken}">
  <!-- ... -->
</form>
```

### Checklist de Segurança

- ✅ HTTPS enforced (HSTS)
- ✅ Security headers (CSP, X-Frame-Options)
- ✅ PBKDF2 password hashing (100k iterations)
- ✅ Session tokens (UUID v4)
- ✅ Session timeout (24h configurable)
- ✅ Brute force protection (5 attempts)
- ✅ Rate limiting (10 req/min)
- ✅ XSS sanitization (all inputs)
- ✅ CSRF protection (per-session tokens)
- ✅ Role-based access control (RBAC)
- ✅ Audit logging (all security events)
- ✅ Zero Trust Architecture
- ✅ AI-powered threat detection
- ✅ Privacy-preserving analytics (100% local)

---

## ⚡ Escalabilidade e Performance

### Performance Atual

| Métrica | Valor | Status |
|---------|-------|--------|
| **First Contentful Paint** | <1s | ✅ Excelente |
| **Time to Interactive** | <2s | ✅ Excelente |
| **Largest Contentful Paint** | <2.5s | ✅ Bom |
| **Cumulative Layout Shift** | <0.1 | ✅ Excelente |
| **Total Bundle Size** | ~440KB | ⚠️ Médio |
| **Compressed (gzip)** | ~90KB | ✅ Bom |
| **IndexedDB Operations** | <50ms | ✅ Rápido |

### Otimizações Implementadas

#### 1. Lazy Loading

```javascript
// Carregar dados apenas quando necessário
function renderView(view) {
  if (view === 'evolucao') {
    // Carrega apenas métricas
    loadMetricsData();
  } else if (view === 'treino') {
    // Carrega apenas treinos
    loadWorkoutData();
  }
}
```

#### 2. Debouncing de Inputs

```javascript
// Evitar saves excessivos
const debouncedSave = debounce(saveData, 500);

input.addEventListener('input', () => {
  debouncedSave();
});
```

#### 3. Virtual Scrolling (Planejado v2.2)

```javascript
// Renderizar apenas itens visíveis
function renderVirtualList(items, viewport) {
  const visibleItems = items.slice(
    viewport.start,
    viewport.end
  );
  
  return visibleItems.map(renderItem);
}
```

#### 4. IndexedDB Indexes

```javascript
// Queries rápidas com índices
store.createIndex('username', 'username', { unique: true });
store.createIndex('date', 'date');
store.createIndex('userId', 'userId');

// Query otimizada
const results = await store
  .index('date')
  .getAll(IDBKeyRange.bound(startDate, endDate));
```

#### 5. Chart.js Optimization

```javascript
// Limitar pontos em gráficos
const maxPoints = 100;
const data = fullData.length > maxPoints
  ? downsample(fullData, maxPoints)
  : fullData;

// Animações suaves
options: {
  animation: {
    duration: 750,  // Rápido mas suave
    easing: 'easeInOutQuart'
  },
  responsive: true,
  maintainAspectRatio: false
}
```

### Escalabilidade

#### Limites Atuais

| Recurso | Limite Soft | Limite Hard | Notas |
|---------|-------------|-------------|-------|
| **Usuários** | 100 | 1000 | LocalStorage + IndexedDB |
| **Treinos/usuário** | 1000 | 10000 | Por usuário |
| **Métricas/usuário** | 5000 | 50000 | ~10 anos diários |
| **Fotos/usuário** | 100 | 500 | ~5MB cada = 2.5GB |
| **Sugestões** | 1000 | 10000 | Global |
| **Logs de acesso** | 100000 | 1000000 | Rotação automática |

#### Estratégias de Escalabilidade

**Horizontal (Mais dispositivos):**
- ✅ Cada usuário em seu próprio dispositivo
- ✅ Zero compartilhamento de recursos
- ✅ Performance isolada

**Vertical (Mais dados por usuário):**
- 🔄 Rotação de logs antigos (v2.2)
- 🔄 Compressão de fotos (v2.2)
- 🔄 Arquivamento de dados históricos (v2.2)

**Backend Opcional (v3.0):**
- 🔮 Sincronização em nuvem
- 🔮 Compartilhamento de dados
- 🔮 Backup automático
- 🔮 Multi-dispositivo

### Roadmap de Performance

**v2.1 (Dezembro 2025):**
- [ ] Service Worker para cache
- [ ] Offline-first completo
- [ ] Compressão de imagens
- [ ] Lazy loading de componentes

**v2.2 (Janeiro 2026):**
- [ ] Virtual scrolling em listas longas
- [ ] Web Workers para processamento pesado
- [ ] IndexedDB query optimization
- [ ] Bundle splitting

**v3.0 (Março 2026):**
- [ ] Backend opcional (Node.js)
- [ ] API REST
- [ ] Sincronização em nuvem
- [ ] CDN para assets

---

## 📚 Recursos Adicionais

### Documentação Relacionada

- **[README.md](README.md)** - Documentação principal do projeto
- **[CHANGELOG.md](CHANGELOG.md)** - Histórico de mudanças
- **[SECURITY.md](SECURITY.md)** - Política de segurança
- **[docs/developer/README.md](docs/developer/README.md)** - Guia do desenvolvedor
- **[docs/INFORMATION-ARCHITECTURE.md](docs/INFORMATION-ARCHITECTURE.md)** - Arquitetura de informação

### Diagramas e Visualizações

Este documento contém diagramas ASCII art para facilitar o entendimento. Para diagramas visuais completos, consulte:

- **[MODULARIZATION_DIAGRAM.md](MODULARIZATION_DIAGRAM.md)** - Diagramas de modularização
- **[docs/design/](docs/design/)** - Design e UI/UX

### Guias Práticos

- **[docs/user/getting-started.md](docs/user/getting-started.md)** - Primeiros passos
- **[docs/admin/admin-guide.md](docs/admin/admin-guide.md)** - Guia administrativo
- **[docs/deployment/github-pages.md](docs/deployment/github-pages.md)** - Deploy no GitHub Pages

---

## 🎯 Conclusão

O **Pilgrim Fitness Tracker** é uma aplicação moderna e completa que demonstra que é possível construir aplicações enterprise-grade 100% client-side, sem backend tradicional.

### Principais Conquistas

✅ **Arquitetura Robusta**: SPA moderno com separação clara de responsabilidades  
✅ **Segurança Enterprise**: Criptografia, rate limiting, AI-powered threat detection  
✅ **Performance Excelente**: <2s TTI, operações DB <50ms  
✅ **Privacidade Total**: 100% local, zero transmissão de dados  
✅ **Escalável**: Suporta 1000+ usuários, 10k+ treinos, 50k+ métricas  
✅ **Manutenível**: Código organizado, documentação completa  
✅ **Extensível**: Modular, fácil adicionar features  

### Próximos Passos

O roadmap está focado em:
1. **UX** (v2.1): PWA, dark mode, notificações
2. **Features** (v2.2): IA, wearables, gamificação
3. **Backend** (v3.0): Nuvem opcional, multi-dispositivo

### Filosofia do Projeto

> "Privacidade não é negociável. Performance não é opcional. Segurança não é um recurso."

Este projeto prova que é possível ter todas as três coisas em uma aplicação web moderna.

---

**Desenvolvido com ❤️ por [taukkunen1](https://github.com/taukkunen1)**

**Versão do Documento:** 1.0.0  
**Última Atualização:** 16 de Novembro de 2025

---

## 📝 Histórico de Alterações

| Versão | Data | Alterações |
|--------|------|------------|
| 1.0.0 | 2025-11-16 | Versão inicial da documentação de arquitetura |

---

## 📧 Contato e Suporte

- **Issues**: [GitHub Issues](https://github.com/taukkunen1/fitness-tracker/issues)
- **Discussions**: [GitHub Discussions](https://github.com/taukkunen1/fitness-tracker/discussions)
- **Email**: taukkunen1@github.com

---

*Este documento faz parte da documentação oficial do Pilgrim Fitness Tracker.*
