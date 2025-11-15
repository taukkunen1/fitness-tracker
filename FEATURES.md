# 📑 Índice de Features - Fitness Tracker Pro v2.0.0

Índice completo e organizado de todas as funcionalidades do sistema com nomes específicos e descrições detalhadas.

**Última atualização:** 15 de Novembro de 2025

---

## 📚 Índice Geral

1. [Sistema de Autenticação e Segurança](#1-sistema-de-autenticação-e-segurança)
2. [Painel Administrativo](#2-painel-administrativo)
3. [Sistema de Monitoramento](#3-sistema-de-monitoramento)
4. [Sugestões e Feedback](#4-sugestões-e-feedback)
5. [Gestão de Refeições](#5-gestão-de-refeições)
6. [Fotos de Progresso](#6-fotos-de-progresso)
7. [Templates de Treino](#7-templates-de-treino)
8. [Métricas Corporais](#8-métricas-corporais)
9. [Sistema de Comparação](#9-sistema-de-comparação)
10. [Importação e Exportação](#10-importação-e-exportação)

---

## 1. Sistema de Autenticação e Segurança

### 1.1 Login e Registro

#### 1.1.1 Página de Login
- **Nome**: Página de Autenticação Moderna
- **Descrição**: Interface responsiva com tabs para login/registro
- **Localização**: Função `renderLoginPage()`
- **Componentes**:
  - Formulário de login
  - Formulário de registro
  - Troca entre tabs
  - Logo e branding
  - Badge de segurança

#### 1.1.2 Validação de Senha
- **Nome**: Validador de Senha em Tempo Real
- **Descrição**: Validação interativa de requisitos de senha
- **Localização**: Função `validatePassword()`, `updatePasswordStrength()`
- **Requisitos**:
  - Mínimo 8 caracteres
  - Letra maiúscula
  - Letra minúscula
  - Número
  - Caractere especial
- **Feedback Visual**: Indicadores coloridos (verde = válido, cinza = inválido)

#### 1.1.3 Registro de Conta
- **Nome**: Sistema de Registro Seguro
- **Descrição**: Criação de conta com validações robustas
- **Localização**: Função `registerAccount()`
- **Validações**:
  - Username: 3-20 caracteres alfanuméricos
  - Email: Formato válido
  - Senha: Requisitos de força
  - Confirmação de senha
- **Auto-promoção**: Primeira conta = Admin automático

#### 1.1.4 Login de Usuário
- **Nome**: Sistema de Login Seguro
- **Descrição**: Autenticação com proteções múltiplas
- **Localização**: Função `loginAccount()`
- **Proteções**:
  - Verificação de hash PBKDF2
  - Rate limiting
  - Brute force protection
  - Account locking

### 1.2 Criptografia e Hash

#### 1.2.1 Hash de Senha PBKDF2
- **Nome**: Criptografia de Senha PBKDF2
- **Descrição**: Hash seguro usando Web Crypto API
- **Localização**: Função `hashPassword()`
- **Especificações**:
  - Algoritmo: PBKDF2
  - Iterações: 100.000
  - Hash: SHA-256
  - Salt: 16 bytes aleatórios
  - Output: 256 bits em hexadecimal

#### 1.2.2 Geração de Salt
- **Nome**: Gerador de Salt Criptográfico
- **Descrição**: Salt único por usuário
- **Localização**: Função `generateSalt()`
- **Especificações**:
  - 16 bytes aleatórios
  - Web Crypto API
  - Formato hexadecimal

#### 1.2.3 Geração de Tokens
- **Nome**: Gerador de Tokens Seguros
- **Descrição**: Tokens para sessão e CSRF
- **Localização**: Função `generateToken()`
- **Especificações**:
  - 32 bytes aleatórios
  - Criptograficamente seguros
  - Formato hexadecimal

### 1.3 Proteções de Segurança

#### 1.3.1 Brute Force Protection
- **Nome**: Proteção contra Ataques de Força Bruta
- **Descrição**: Bloqueio temporário após múltiplas tentativas
- **Localização**: Funções `checkLoginAttempts()`, `recordFailedLogin()`
- **Configurações**:
  - Máximo de tentativas: 5
  - Duração do bloqueio: 15 minutos
  - Reset após sucesso
- **Logging**: Evento de security audit

#### 1.3.2 Rate Limiting
- **Nome**: Limitador de Taxa de Requisições
- **Descrição**: Previne spam e ataques DDoS
- **Localização**: Função `checkRateLimit()`
- **Configurações**:
  - Janela de tempo: 60 segundos
  - Máximo de requisições: 10
  - Reset automático
- **Aplicado em**: Login, registro, sugestões

#### 1.3.3 XSS Protection
- **Nome**: Sanitizador de Inputs XSS
- **Descrição**: Previne injeção de scripts maliciosos
- **Localização**: Funções `sanitizeInput()`, `escapeHtml()`
- **Sanitização**:
  - HTML entities escapados
  - Scripts bloqueados
  - Limite de tamanho (255 chars)
  - Remoção de caracteres perigosos

#### 1.3.4 CSRF Protection
- **Nome**: Proteção contra CSRF
- **Descrição**: Token único por sessão
- **Localização**: Variável `authState.csrfToken`
- **Implementação**:
  - Token gerado no login
  - Validação em operações sensíveis
  - Renovação em cada sessão

### 1.4 Gestão de Sessão

#### 1.4.1 Criação de Sessão
- **Nome**: Gerenciador de Sessão Segura
- **Descrição**: Cria sessão autenticada com tokens
- **Localização**: Função `createSession()`
- **Componentes**:
  - Session token único
  - CSRF token
  - Timestamp de criação
  - Timestamp de expiração
  - Armazenamento em localStorage

#### 1.4.2 Validação de Sessão
- **Nome**: Validador de Sessão
- **Descrição**: Verifica validade da sessão atual
- **Localização**: Função `validateSession()`
- **Verificações**:
  - Existência de sessão
  - Expiração (24h padrão)
  - Conta válida no banco
  - Carregamento de dados do usuário

#### 1.4.3 Destruição de Sessão
- **Nome**: Logout Seguro
- **Descrição**: Limpeza completa de dados de sessão
- **Localização**: Função `destroySession()`
- **Ações**:
  - Limpa tokens
  - Limpa dados de usuário
  - Remove de localStorage
  - Log de security audit

### 1.5 Auditoria de Segurança

#### 1.5.1 Logging de Eventos
- **Nome**: Sistema de Auditoria de Segurança
- **Descrição**: Registro completo de eventos de segurança
- **Localização**: Função `logSecurityEvent()`
- **Eventos Registrados**:
  - `login_success` - Login bem-sucedido
  - `login_failed` - Tentativa falha de login
  - `login_blocked` - Login bloqueado
  - `account_locked` - Conta bloqueada
  - `register_success` - Conta criada
  - `register_failed` - Registro falhou
  - `logout` - Logout de usuário
  - `profile_linked` - Perfil vinculado
  - `profile_unlinked` - Perfil desvinculado
  - `admin_promotion` - Promoção a admin
  - `task_created` - Tarefa criada
  - `task_updated` - Tarefa atualizada
  - `task_deleted` - Tarefa deletada
  - `suggestion_submitted` - Sugestão enviada
  - `suggestion_reviewed` - Sugestão revisada

#### 1.5.2 Exportação de Logs
- **Nome**: Exportador de Logs de Segurança
- **Descrição**: Export de eventos para análise
- **Localização**: Função `exportSecurityLogs()`
- **Formato**: JSON estruturado
- **Campos**: ID, tipo, username, timestamp, detalhes, IP, user agent

#### 1.5.3 Limpeza de Logs Antigos
- **Nome**: Limpador de Logs de Segurança
- **Descrição**: Remove logs com mais de 30 dias
- **Localização**: Função `clearOldSecurityLogs()`
- **Configuração**: Cutoff de 30 dias
- **Ação**: Soft delete para arquivo

---

## 2. Painel Administrativo

### 2.1 Dashboard Admin

#### 2.1.1 Visão Geral de Tarefas
- **Nome**: Dashboard de Gestão de Tarefas
- **Descrição**: Painel com estatísticas e resumo
- **Localização**: Função `renderAdminTasksTab()`
- **Métricas**:
  - Total de tarefas
  - Tarefas concluídas
  - Em progresso
  - A fazer
- **Visualização**: Cards coloridos com badges

#### 2.1.2 Lista de Tarefas Organizada
- **Nome**: Visualizador de Roadmap
- **Descrição**: Lista organizada por categoria e prioridade
- **Localização**: Função `loadAndDisplayTasks()`
- **Organização**:
  - Por categoria (curto, médio, longo prazo)
  - Por prioridade dentro de categoria
  - Com progresso visual
  - Com checklists expandidos

### 2.2 Gestão de Tarefas

#### 2.2.1 Sistema de Tarefas
- **Nome**: Task Management System
- **Descrição**: Sistema completo de gestão de tarefas
- **Estrutura de Dados**:
  ```javascript
  {
    id: string,
    title: string,
    description: string,
    category: 'short_term' | 'medium_term' | 'long_term',
    priority: 'critical' | 'high' | 'medium' | 'low',
    status: 'todo' | 'in_progress' | 'done' | 'blocked',
    checklist: Array<{id, text, done}>,
    createdAt: ISO8601,
    dueDate: ISO8601 | null,
    assignedTo: string | null,
    tags: Array<string>,
    createdBy: string,
    updatedBy: string
  }
  ```

#### 2.2.2 Categorias de Tarefas
- **Nome**: Sistema de Categorização Temporal
- **Descrição**: Organização por horizonte de tempo
- **Categorias**:
  - `short_term`: Curto prazo (1-2 semanas)
  - `medium_term`: Médio prazo (1-3 meses)
  - `long_term`: Longo prazo (3-6 meses)

#### 2.2.3 Prioridades
- **Nome**: Sistema de Priorização
- **Descrição**: Níveis de prioridade para tarefas
- **Níveis**:
  - `critical`: Crítico (vermelho)
  - `high`: Alto (laranja)
  - `medium`: Médio (amarelo)
  - `low`: Baixo (azul)

#### 2.2.4 Estados de Tarefa
- **Nome**: Workflow de Estados
- **Descrição**: Ciclo de vida da tarefa
- **Estados**:
  - `todo`: A fazer
  - `in_progress`: Em progresso
  - `done`: Concluído
  - `blocked`: Bloqueado

#### 2.2.5 Checklist de Tarefas
- **Nome**: Sistema de Checklist Interativo
- **Descrição**: Sub-tarefas com progresso
- **Localização**: Função `toggleChecklistItem()`
- **Features**:
  - Toggle individual de items
  - Cálculo de progresso (%)
  - Auto-complete de tarefa
  - Barra de progresso visual

#### 2.2.6 Criação de Tarefa
- **Nome**: Criador de Tarefas Admin
- **Descrição**: Interface para criar novas tarefas
- **Localização**: Função `createTask()`
- **Restrição**: Apenas admins
- **Campos**: Título, descrição, categoria, prioridade, tags, checklist

#### 2.2.7 Atualização de Tarefa
- **Nome**: Editor de Tarefas
- **Descrição**: Modificar tarefas existentes
- **Localização**: Função `updateTask()`
- **Restrição**: Apenas admins
- **Campos Editáveis**: Todos exceto ID

#### 2.2.8 Arquivamento de Tarefa
- **Nome**: Arquivador de Tarefas
- **Descrição**: Soft delete de tarefas
- **Localização**: Função `deleteTask()`
- **Restrição**: Apenas admins
- **Ação**: Move para STORE_ARCHIVE

### 2.3 Roadmap Pré-Configurado

#### 2.3.1 Tarefas de Curto Prazo
- **Nome**: Roadmap Imediato (1-2 semanas)
- **Tarefas Incluídas**:
  1. ✅ **CRÍTICO**: Corrigir headers CSP inválidos
     - Remover frame-ancestors de meta tag
     - Remover X-Frame-Options de meta tag
     - Documentar necessidade de headers HTTP
  2. ✅ **CRÍTICO**: Remover código de bloqueio DevTools
     - Remover detecção de DevTools
     - Remover bloqueio de atalhos
     - Remover bloqueio de clique direito
     - Remover bloqueio de seleção
  3. 📋 **CRÍTICO**: Deploy em produção com HTTPS
     - Obter certificado SSL
     - Configurar servidor HTTPS
     - Testar conexão
     - Redirecionar HTTP para HTTPS
     - Verificar SSL Labs
  4. 📋 **CRÍTICO**: Monitorar logs de segurança
     - Dashboard de eventos
     - Alertas de atividade suspeita
     - Gráficos de tentativas de login
     - Export de logs
     - Relatório semanal
  5. 📋 **ALTO**: Testar em múltiplos navegadores
     - Chrome (desktop e mobile)
     - Firefox
     - Safari (macOS e iOS)
     - Edge
     - Documentar bugs
     - Corrigir incompatibilidades
  6. 📋 **ALTO**: Coletar feedback de usuários
     - Formulário de feedback
     - Sistema de sugestões
     - Votação em sugestões
     - Página de visualização
     - Export para GitHub Issues

### 2.4 Export e Relatórios

#### 2.4.1 Export para Markdown
- **Nome**: Exportador de Roadmap Markdown
- **Descrição**: Gera arquivo markdown do roadmap
- **Localização**: Função `exportTasksToMarkdown()`
- **Estrutura**:
  - Header com data
  - Seções por categoria
  - Tarefas com status e prioridade
  - Checklist completo
  - Download automático

#### 2.4.2 Export para JSON
- **Nome**: Exportador de Tarefas JSON
- **Descrição**: Backup completo em JSON
- **Localização**: Função `exportTasksToJSON()`
- **Conteúdo**: Array de todas as tarefas
- **Formato**: JSON prettified (indent 2)

### 2.5 Gestão de Contas

#### 2.5.1 Listagem de Contas
- **Nome**: Visualizador de Contas Registradas
- **Descrição**: Tabela com todas as contas
- **Localização**: Função `loadAndDisplaySecurityEvents()`
- **Colunas**:
  - Username
  - Email
  - Role (admin/user)
  - Data de criação
  - Último login
  - Ações

#### 2.5.2 Promoção de Usuário
- **Nome**: Promotor de Admin
- **Descrição**: Promover usuário comum a admin
- **Localização**: Função `promoteToAdmin()`
- **Restrição**: Apenas admins podem promover
- **Ação**: Atualiza role para 'admin'
- **Logging**: Evento de security audit

---

## 3. Sistema de Monitoramento

### 3.1 Tracking de Acessos

#### 3.1.1 Registro Automático
- **Nome**: Auto-Logger de Acessos
- **Descrição**: Registra cada acesso à página
- **Localização**: Função `logPageAccess()`
- **Momento**: Executado no login e refresh
- **Dados Coletados**:
  - Timestamp (ISO8601)
  - Username (ou 'anonymous')
  - Role (admin/user/anonymous)
  - Page (pathname)
  - User Agent
  - Screen resolution
  - Language (navegador)

#### 3.1.2 Estrutura de Log
- **Nome**: Access Log Entry
- **Formato**:
  ```javascript
  {
    id: 'access_TIMESTAMP_RANDOM',
    timestamp: ISO8601,
    username: string,
    role: 'admin' | 'user' | 'anonymous',
    page: string,
    userAgent: string,
    screenResolution: 'WIDTHxHEIGHT',
    language: string
  }
  ```

### 3.2 Estatísticas de Acesso

#### 3.2.1 Calculador de Estatísticas
- **Nome**: Access Analytics Engine
- **Descrição**: Calcula métricas de acesso
- **Localização**: Função `getAccessStatistics()`
- **Métricas Calculadas**:
  - Total de acessos (all time)
  - Acessos últimas 24h
  - Acessos últimos 7 dias
  - Acessos últimos 30 dias
  - Visitantes únicos (24h, 7d, 30d)
  - Breakdown por hora (24h)
  - Breakdown por dia (7d)
  - Logs recentes (50 mais recentes)

#### 3.2.2 Visualização de Estatísticas
- **Nome**: Dashboard de Monitoramento
- **Descrição**: Painel visual de acessos
- **Localização**: Tab "Segurança" no Admin
- **Componentes**:
  - Cards com métricas principais
  - Gráfico de barras (acessos por hora)
  - Lista de acessos recentes
  - Filtros por role
  - Auto-refresh (5 minutos)

### 3.3 Gráficos e Visualizações

#### 3.3.1 Gráfico Horário
- **Nome**: Hourly Access Chart
- **Descrição**: Breakdown de acessos por hora (24h)
- **Tipo**: Gráfico de barras vertical
- **Eixo X**: Hora do dia (0-23)
- **Eixo Y**: Número de acessos
- **Cores**: Gradiente roxo
- **Interatividade**: Hover para detalhes

#### 3.3.2 Breakdown Diário
- **Nome**: Daily Access Breakdown
- **Descrição**: Acessos por dia (últimos 7 dias)
- **Formato**: Objeto com datas como chaves
- **Dados**: Contagem por dia
- **Visualização**: Tabela ou gráfico

### 3.4 Limpeza de Dados

#### 3.4.1 Limpeza Automática
- **Nome**: Access Logs Cleaner
- **Descrição**: Remove logs antigos automaticamente
- **Localização**: Função `cleanOldAccessLogs()`
- **Configuração**: Remove logs > 90 dias
- **Execução**: Manual ou agendada
- **Retorno**: Número de logs removidos

#### 3.4.2 Export de Logs
- **Nome**: Exportador de Logs de Acesso
- **Descrição**: Download de logs para análise
- **Localização**: Função `exportAccessLogs()`
- **Formato**: JSON completo
- **Filename**: `access_logs_YYYY-MM-DD.json`

### 3.5 Auto-Refresh

#### 3.5.1 Sistema de Atualização
- **Nome**: Admin Panel Auto-Refresher
- **Descrição**: Atualiza painel automaticamente
- **Localização**: Funções `startAdminSecurityAutoRefresh()`, `stopAdminSecurityAutoRefresh()`
- **Intervalo**: 5 minutos (300.000ms)
- **Condição**: Apenas se tab admin_security estiver ativa
- **Controle**: Start/stop automático

---

## 4. Sugestões e Feedback

### 4.1 Submissão de Sugestões

#### 4.1.1 Formulário de Sugestão
- **Nome**: Submission Form
- **Descrição**: Interface para enviar sugestões
- **Localização**: Tab "Sugestões" para usuários
- **Campos**:
  - Título (obrigatório)
  - Descrição (obrigatório)
  - Categoria (select)
  - Prioridade (select)
- **Validação**: Sanitização de inputs

#### 4.1.2 Estrutura de Sugestão
- **Nome**: Suggestion Object
- **Formato**:
  ```javascript
  {
    id: 'suggestion_TIMESTAMP_RANDOM',
    title: string,
    description: string,
    category: string,
    priority: 'low' | 'medium' | 'high',
    status: 'pending' | 'approved' | 'rejected' | 'implemented',
    submittedBy: string,
    submittedAt: ISO8601,
    votes: number,
    votedBy: Array<string>,
    comments: Array,
    reviewedBy: string,
    reviewedAt: ISO8601,
    adminNote: string
  }
  ```

#### 4.1.3 Criação de Sugestão
- **Nome**: Suggestion Creator
- **Descrição**: Cria nova sugestão
- **Localização**: Função `submitSuggestion()`
- **Restrição**: Apenas usuários autenticados
- **Ação**: Salva em STORE_SUGGESTIONS
- **Logging**: Security event

### 4.2 Sistema de Votação

#### 4.2.1 Votação em Sugestões
- **Nome**: Suggestion Voting System
- **Descrição**: Upvotes em sugestões
- **Localização**: Função `voteSuggestion()`
- **Mecânica**: Toggle (votar/desvotar)
- **Tracking**: Array de usernames que votaram
- **Visualização**: Contador de votos visível

#### 4.2.2 Indicador de Voto
- **Nome**: Vote Status Indicator
- **Descrição**: Mostra se usuário votou
- **Visual**: Botão verde (votado) ou cinza (não votado)
- **Label**: "👍 Votado (N)" ou "👍 Votar (N)"

### 4.3 Gestão Administrativa

#### 4.3.1 Painel de Sugestões Admin
- **Nome**: Admin Suggestions Dashboard
- **Descrição**: Visualização e gestão para admins
- **Localização**: Função `loadAndDisplayAdminSuggestions()`
- **Estatísticas**:
  - Total de sugestões
  - Pendentes
  - Aprovadas
  - Implementadas
- **Lista**: Ordenada por votos (decrescente)

#### 4.3.2 Atualização de Status
- **Nome**: Suggestion Status Updater
- **Descrição**: Muda status da sugestão
- **Localização**: Função `updateSuggestionStatus()`
- **Restrição**: Apenas admins
- **Estados Possíveis**:
  - `pending` → `approved`
  - `pending` → `rejected`
  - `approved` → `implemented`
- **Nota Admin**: Campo opcional para feedback

#### 4.3.3 Visualização para Admin
- **Nome**: Admin Suggestion Card
- **Descrição**: Card detalhado para revisão
- **Elementos**:
  - Título e descrição
  - Badges (categoria, status, votos)
  - Informações do submitter
  - Nota do admin (se existir)
  - Botões de ação (aprovar, rejeitar, implementar)

### 4.4 Export para GitHub

#### 4.4.1 Exportador GitHub Issues
- **Nome**: GitHub Issues Exporter
- **Descrição**: Converte sugestões para formato GitHub
- **Localização**: Função `exportSuggestionsToGitHub()`
- **Formato de Saída**: Markdown estruturado
- **Seções**:
  - Header com data
  - Agrupamento por status
  - Metadados completos
  - Formatação compatível

#### 4.4.2 Estrutura do Export
- **Nome**: GitHub Issue Template
- **Campos Exportados**:
  - Título
  - Body (descrição + metadados)
  - Labels (categoria, prioridade, status)
  - Data de submissão
  - Submitter
  - Votos
  - Nota do admin

---

## 5. Gestão de Refeições

### 5.1 Registro de Refeições

#### 5.1.1 Formulário de Refeição
- **Nome**: Meal Entry Form
- **Descrição**: Registro de refeição diária
- **Localização**: Tab "Refeições"
- **Campos**:
  - Nome da refeição
  - Hora (HH:MM)
  - Proteína (g)
  - Carboidrato (g)
  - Gordura (g)
  - Calorias (kcal)
- **Validação**: Numéricos obrigatórios

#### 5.1.2 Estrutura de Refeição
- **Nome**: Meal Entry Object
- **Formato**:
  ```javascript
  {
    id: 'meal_USERID_TIMESTAMP',
    date: 'YYYY-MM-DD',
    time: 'HH:MM',
    name: string,
    protein: number,
    carbs: number,
    fat: number,
    calories: number
  }
  ```

### 5.2 Navegação Temporal

#### 5.2.1 Navegação Dia-a-Dia
- **Nome**: Day-by-Day Navigator
- **Descrição**: Botões para navegar entre dias
- **Localização**: Botões "← Dia Anterior" e "Dia Seguinte →"
- **Estado**: Variável `state.currentDay`
- **Função**: Função `addMeal()` usa currentDay
- **Sincronização**: Separado de currentWorkoutDay

#### 5.2.2 Indicador de Data
- **Nome**: Current Day Indicator
- **Descrição**: Mostra data atual selecionada
- **Formato**: "DD/MM/YYYY" em português
- **Localização**: Acima do formulário
- **Atualização**: Dinâmica ao navegar

### 5.3 Histórico de Refeições

#### 5.3.1 Lista de Refeições
- **Nome**: Meal History List
- **Descrição**: Visualização cronológica de refeições
- **Ordenação**: Por data e hora (mais recente primeiro)
- **Formato**: Cards com cores alternadas
- **Informações**:
  - Data e hora
  - Nome da refeição
  - Macros (P/C/F)
  - Calorias totais

#### 5.3.2 Totalizadores Diários
- **Nome**: Daily Macro Totals
- **Descrição**: Soma de macros por dia
- **Cálculo**: Automático ao renderizar
- **Visualização**: Cards com badges coloridos
- **Comparação**: Com metas diárias (se configuradas)

### 5.4 Refeições Compostas

#### 5.4.1 Construtor de Refeição
- **Nome**: Meal Composition Builder
- **Descrição**: Criar refeição de múltiplos alimentos
- **Estado**: `state.currentMealComposition`
- **Componentes**:
  - Nome da composição
  - Lista de alimentos
  - Peso por alimento
  - Macros por alimento

#### 5.4.2 Cálculo Automático
- **Nome**: Macro Calculator
- **Descrição**: Soma automática de macros
- **Cálculo**:
  - Total proteína
  - Total carboidrato
  - Total gordura
  - Total calorias
  - Peso total
- **Atualização**: Em tempo real ao adicionar/remover

#### 5.4.3 Salvamento de Composição
- **Nome**: Composition Saver
- **Descrição**: Salvar composição para reutilizar
- **Armazenamento**: Array `state.customMeals`
- **Reutilização**: Carregar em futuros registros

### 5.5 Base de Alimentos

#### 5.5.1 Lista de Marmitas
- **Nome**: Pre-configured Meals Database
- **Descrição**: 20 marmitas pré-configuradas
- **Localização**: Constante `MARMITAS_LIST`
- **Informações por Marmita**:
  - ID
  - Nome
  - Tipo (completa, leve, vegana, etc)
  - Macros (P/C/F/Kcal)
  - Ingredientes
  - Descrição

---

## 6. Fotos de Progresso

### 6.1 Upload de Fotos

#### 6.1.1 Interface de Upload
- **Nome**: Photo Upload Interface
- **Descrição**: Input de arquivo com preview
- **Localização**: Tab "Fotos"
- **Suporte**: JPG, PNG, GIF
- **Validação**: Tipo e tamanho
- **Preview**: Miniatura antes de salvar

#### 6.1.2 Estrutura de Foto
- **Nome**: Progress Photo Object
- **Formato**:
  ```javascript
  {
    id: 'photo_TIMESTAMP_RANDOM',
    userId: string,
    date: 'YYYY-MM-DD',
    imageData: 'data:image/...;base64,...',
    notes: string,
    timestamp: number
  }
  ```

#### 6.1.3 Armazenamento
- **Nome**: Photo Storage System
- **Descrição**: IndexedDB para imagens
- **Store**: Parte do objeto user
- **Array**: `user.progressPhotos`
- **Tamanho**: Sem limite hard (depende do browser)

### 6.2 Galeria de Fotos

#### 6.2.1 Visualização Grid
- **Nome**: Photo Gallery Grid
- **Descrição**: Grade responsiva de fotos
- **Layout**: Cards com imagem + data + notas
- **Ordenação**: Por data (mais recente primeiro)
- **Interatividade**: Click para ampliar (futuro)

#### 6.2.2 Detalhes da Foto
- **Nome**: Photo Details Card
- **Informações**:
  - Miniatura da foto
  - Data do registro
  - Notas (se existirem)
  - Botão de deletar

### 6.3 Comparação de Fotos

#### 6.3.1 Seletor de Fotos
- **Nome**: Photo Comparison Selector
- **Descrição**: Dropdowns para selecionar 2 fotos
- **Localização**: Seção "Comparar Fotos"
- **Opções**: Todas as fotos do usuário
- **Label**: Data da foto

#### 6.3.2 Visualização Lado a Lado
- **Nome**: Side-by-Side Photo Viewer
- **Descrição**: Comparação visual
- **Layout**: 2 colunas iguais
- **Informações**:
  - Foto 1 à esquerda
  - Foto 2 à direita
  - Datas visíveis
  - Notas abaixo de cada foto

#### 6.3.3 Função de Comparação
- **Nome**: Photo Comparator
- **Descrição**: Lógica de comparação
- **Localização**: Função `compareProgressPhotos()`
- **Validações**:
  - Duas fotos selecionadas
  - Fotos diferentes
  - Fotos existem
- **Resultado**: Grid 2x1 com detalhes

---

## 7. Templates de Treino

### 7.1 Programas Pré-Definidos

#### 7.1.1 Full-Body (3x/semana)
- **Nome**: Programa Full-Body Científico
- **Descrição**: Treino de corpo inteiro 3x por semana
- **Localização**: Constante `fullBodyProgram`
- **Estrutura**:
  - Dia A
  - Dia B  
  - Dia C
- **Exercícios por Dia**: 6-8 exercícios
- **Detalhes**: Séries, reps, descanso, notas

#### 7.1.2 Push/Pull/Legs (6x/semana)
- **Nome**: Programa PPL Avançado
- **Descrição**: Split de empurrar/puxar/pernas
- **Localização**: Constante `pplProgram`
- **Estrutura**:
  - Push (peito, ombros, tríceps)
  - Pull (costas, bíceps)
  - Legs (pernas, posterior)
  - Repetir 2x na semana
- **Exercícios por Dia**: 6-7 exercícios

#### 7.1.3 Upper/Lower/Full (3x/semana)
- **Nome**: Programa Híbrido ULF
- **Descrição**: Mix de treinos
- **Localização**: Constante `ulfProgram`
- **Estrutura**:
  - Upper (parte superior)
  - Lower (parte inferior)
  - Full (corpo todo)
- **Variedade**: Máxima para evitar platô

### 7.2 Detalhamento de Exercícios

#### 7.2.1 Estrutura de Exercício
- **Nome**: Exercise Entry
- **Formato**:
  ```javascript
  {
    exercise: string,        // Nome do exercício
    sets: string,            // "3-4" ou "4"
    reps: string,            // "8-12" ou "12"
    rest: string,            // "60s" ou "90s"
    notes: string            // Observações de execução
  }
  ```

#### 7.2.2 Notas de Execução
- **Nome**: Exercise Execution Notes
- **Conteúdo**:
  - Forma correta
  - Dicas de segurança
  - Variações possíveis
  - Progressões

### 7.3 Logs de Treino

#### 7.3.1 Registro de Treino
- **Nome**: Workout Log Entry
- **Descrição**: Registro de sessão de treino
- **Estrutura**:
  ```javascript
  {
    id: 'workout_TIMESTAMP',
    date: 'YYYY-MM-DD',
    programType: string,
    dayOfProgram: string,
    exercises: Array<{
      name: string,
      sets: Array<{
        weight: number,
        reps: number,
        notes: string
      }>
    }>,
    duration: number,
    notes: string
  }
  ```

#### 7.3.2 Histórico de Treinos
- **Nome**: Workout History
- **Descrição**: Lista de todos os treinos
- **Ordenação**: Por data (mais recente primeiro)
- **Visualização**: Cards com resumo
- **Detalhes**: Click para expandir

### 7.4 Progressão

#### 7.4.1 Tracking de Carga
- **Nome**: Load Progression Tracker
- **Descrição**: Acompanhamento de carga ao longo do tempo
- **Cálculo**: Máximo/médio por exercício
- **Visualização**: Gráfico de linha (futuro)

#### 7.4.2 Volume Total
- **Nome**: Total Volume Calculator
- **Descrição**: Carga x reps x séries
- **Fórmula**: `Σ(peso × reps × sets)`
- **Uso**: Análise de periodização

---

## 8. Métricas Corporais

### 8.1 Registro de Métricas

#### 8.1.1 Formulário de Métricas
- **Nome**: Body Metrics Form
- **Descrição**: Registro de composição corporal
- **Localização**: Tab "Dashboard"
- **Campos**:
  - Data
  - Peso (kg)
  - Gordura corporal (%)
  - Massa muscular (kg)
  - Tamanho muscular (cm)

#### 8.1.2 Estrutura de Métrica
- **Nome**: Body Metric Entry
- **Formato**:
  ```javascript
  {
    id: 'metric_USERID_TIMESTAMP',
    date: 'YYYY-MM-DD',
    weight: number,
    bodyFat: number,
    muscleMass: number,
    muscleSize: number
  }
  ```

### 8.2 Visualizações

#### 8.2.1 Cards de Métricas
- **Nome**: Metric Display Cards
- **Descrição**: Cards coloridos com valores atuais
- **Layout**: Grade 2x2 ou 4x1
- **Cores**:
  - Peso: Azul
  - Gordura: Laranja
  - Massa: Verde
  - Tamanho: Roxo

#### 8.2.2 Gráfico de Evolução
- **Nome**: Body Composition Chart
- **Descrição**: Gráfico de linha com todas as métricas
- **Localização**: Função `renderMuscleEvolutionChart()`
- **Biblioteca**: Chart.js
- **Tipo**: Multi-line chart
- **Eixos**:
  - X: Datas
  - Y (esquerdo): Massa (kg)
  - Y (direito): Tamanho (cm)

### 8.3 Análise de Dados

#### 8.3.1 Tendências
- **Nome**: Trend Analyzer
- **Descrição**: Análise de tendência ao longo do tempo
- **Cálculo**: Regressão linear
- **Indicadores**: Setas (↑↓→)
- **Cores**: Verde (positivo), vermelho (negativo)

#### 8.3.2 Estatísticas
- **Nome**: Body Metrics Statistics
- **Métricas**:
  - Média (all time)
  - Mínimo e máximo
  - Desvio padrão
  - Tendência (slope)
  - Última entrada

### 8.4 Export de Dados

#### 8.4.1 Export CSV
- **Nome**: Metrics CSV Exporter
- **Descrição**: Download de métricas em CSV
- **Colunas**: Data, Peso, Gordura, Massa, Tamanho
- **Separador**: Vírgula ou ponto-e-vírgula
- **Encoding**: UTF-8

---

## 9. Sistema de Comparação

### 9.1 Comparação de Usuários

#### 9.1.1 Seletor de Usuários
- **Nome**: User Comparison Selector
- **Descrição**: Dropdowns para selecionar 2 usuários
- **Localização**: Tab "Comparar"
- **Opções**: Todos os usuários cadastrados
- **Validação**: Usuários diferentes

#### 9.1.2 Visualização Lado a Lado
- **Nome**: Side-by-Side User Comparison
- **Descrição**: Comparação visual de 2 perfis
- **Layout**: 2 colunas iguais
- **Dados Comparados**:
  - Informações básicas (nome, idade, altura)
  - Métricas atuais (peso, gordura, massa)
  - Gráficos de evolução
  - Estatísticas

#### 9.1.3 Estrutura de Comparação
- **Nome**: Comparison Object
- **Formato**:
  ```javascript
  {
    id: 'comparison_TIMESTAMP',
    user1Id: string,
    user2Id: string,
    createdAt: ISO8601,
    notes: string
  }
  ```

### 9.2 Análise Comparativa

#### 9.2.1 Diferenças Absolutas
- **Nome**: Absolute Difference Calculator
- **Descrição**: Calcula diferenças diretas
- **Fórmula**: `user2.metric - user1.metric`
- **Visualização**: Valores numéricos com sinais (+/-)

#### 9.2.2 Diferenças Percentuais
- **Nome**: Percentage Difference Calculator
- **Descrição**: Calcula diferenças relativas
- **Fórmula**: `((user2.metric - user1.metric) / user1.metric) * 100`
- **Visualização**: Valores percentuais com cores

#### 9.2.3 Gráficos Sincronizados
- **Nome**: Synchronized Comparison Charts
- **Descrição**: Gráficos alinhados para comparação
- **Sincronização**: Mesmo eixo X (datas)
- **Cores**: Diferentes por usuário
- **Legendas**: Claras e distintas

### 9.3 Salvamento de Comparações

#### 9.3.1 Salvar Comparação
- **Nome**: Comparison Saver
- **Descrição**: Salva comparação para referência futura
- **Store**: STORE_COMPARISONS
- **Dados**: IDs dos usuários, data, notas

#### 9.3.2 Carregar Comparação
- **Nome**: Comparison Loader
- **Descrição**: Restaura comparação salva
- **Função**: Seleciona automaticamente os usuários
- **Visualização**: Mesmo layout da comparação original

---

## 10. Importação e Exportação

### 10.1 Export de Dados

#### 10.1.1 Export Completo
- **Nome**: Full Data Exporter
- **Descrição**: Export de todos os dados do sistema
- **Formato**: JSON
- **Conteúdo**:
  - Todos os usuários
  - Todas as refeições
  - Todos os treinos
  - Todas as métricas
  - Todas as fotos
  - Configurações
- **Filename**: `fitness-tracker-backup_YYYY-MM-DD.json`

#### 10.1.2 Export Seletivo
- **Nome**: Selective Data Exporter
- **Descrição**: Export de dados específicos
- **Opções**:
  - Por usuário
  - Por tipo de dado (refeições, treinos, métricas)
  - Por período (data range)
- **Formato**: JSON ou CSV

### 10.2 Import de Dados

#### 10.2.1 Import de Backup
- **Nome**: Backup Importer
- **Descrição**: Restaura backup completo
- **Validação**: Estrutura do JSON
- **Merge**: Opção de merge ou replace
- **Confirmação**: Diálogo de confirmação

#### 10.2.2 Import Seletivo
- **Nome**: Selective Data Importer
- **Descrição**: Import de dados específicos
- **Opções**: Por tipo de dado
- **Validação**: Schema de cada tipo
- **Conflitos**: Resolução por ID ou timestamp

### 10.3 Migração de Dados

#### 10.3.1 Migração LocalStorage → IndexedDB
- **Nome**: Storage Migrator
- **Descrição**: Migração automática de dados legados
- **Localização**: Funções `migrateFromLegacyLocalStorage()`, `loadAllFromDB()`
- **Processo**:
  1. Detecta dados em localStorage
  2. Valida estrutura
  3. Converte para formato atual
  4. Salva em IndexedDB
  5. Mantém backup em localStorage

#### 10.3.2 Migração de Versões
- **Nome**: Database Version Migrator
- **Descrição**: Atualiza schema do banco
- **Localização**: Callback `onupgradeneeded` do IndexedDB
- **Versionamento**: DB_VERSION (v3 → v6)
- **Ações**:
  - Cria novos stores
  - Cria novos índices
  - Migra dados existentes
  - Mantém compatibilidade

---

## 📊 Resumo de Features por Módulo

| Módulo | Features | Status | Prioridade |
|--------|----------|--------|------------|
| Autenticação | 15 | ✅ Completo | Crítica |
| Admin | 12 | ✅ Completo | Alta |
| Monitoramento | 8 | ✅ Completo | Alta |
| Sugestões | 7 | ✅ Completo | Média |
| Refeições | 10 | ✅ Completo | Alta |
| Fotos | 6 | ✅ Completo | Média |
| Treinos | 9 | ✅ Completo | Alta |
| Métricas | 7 | ✅ Completo | Alta |
| Comparação | 6 | ✅ Completo | Média |
| Import/Export | 6 | ✅ Completo | Alta |

**Total de Features Documentadas: 86**

---

## 🔍 Busca Rápida de Funções

| Função | Localização (linha aprox.) | Descrição |
|--------|----------------------------|-----------|
| `openDB()` | ~103 | Abre conexão IndexedDB |
| `hashPassword()` | ~245 | Hash PBKDF2 de senhas |
| `loginAccount()` | ~697 | Realiza login de usuário |
| `registerAccount()` | ~639 | Registra nova conta |
| `logSecurityEvent()` | ~435 | Log de evento de segurança |
| `logPageAccess()` | ~460 | Registra acesso à página |
| `createTask()` | ~971 | Cria nova tarefa admin |
| `submitSuggestion()` | ~1074 | Submete sugestão de usuário |
| `addMeal()` | Não encontrado diretamente | Adiciona refeição |
| `compareProgressPhotos()` | ~5599 | Compara duas fotos |
| `renderMuscleEvolutionChart()` | ~5567 | Renderiza gráfico de evolução |

---

**Última atualização:** 15 de Novembro de 2025  
**Versão do sistema:** 2.0.0  
**Total de features:** 86+ funcionalidades documentadas

---

## 📞 Contato e Contribuições

Para sugestões de melhorias neste índice ou reportar features não documentadas:
- **Issues**: [GitHub Issues](https://github.com/taukkunen1/fitness-tracker/issues)
- **Label**: `documentation`
