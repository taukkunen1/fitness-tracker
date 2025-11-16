# Changelog - Fitness Tracker Pro

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [2.1.0] - 2025-11-16

### 🎉 Backend Database Infrastructure

Esta versão adiciona suporte completo a banco de dados backend, transformando o Pilgrim em uma aplicação full-stack profissional.

### ✨ Adicionado

#### Backend Infrastructure
- **Node.js/Express Server**: API RESTful completa e production-ready
  - Express 4.18 com middleware de segurança (Helmet, CORS)
  - Rate limiting adaptativo para proteção contra brute force
  - Tratamento robusto de erros com mensagens amigáveis
  - Health check endpoint para monitoramento
- **MongoDB Database**: Banco de dados NoSQL escalável
  - Mongoose 8.0 como ODM
  - 5 coleções principais: users, workouts, meals, metrics, progressphotos
  - Índices otimizados para queries frequentes
  - Validação de dados no nível do schema
- **JWT Authentication**: Sistema de autenticação stateless
  - Tokens JWT com expiração configurável (24h padrão)
  - bcryptjs para hash seguro de senhas
  - Refresh token support
  - Account locking após tentativas falhadas

#### API Endpoints
- **Authentication** (`/api/auth`)
  - `POST /register` - Registrar novo usuário
  - `POST /login` - Login com JWT
  - `GET /me` - Informações do usuário autenticado
  - `PUT /updateprofile` - Atualizar perfil
  - `PUT /updatepassword` - Alterar senha
- **Workouts** (`/api/workouts`)
  - CRUD completo com filtros por data e tipo
  - Suporte a exercícios compostos
  - Tracking de calorias e duração
- **Meals** (`/api/meals`)
  - CRUD completo com cálculo automático de macros
  - Filtros por tipo de refeição e data
  - Validação de valores nutricionais
- **Metrics** (`/api/metrics`)
  - Registro de medidas corporais ao longo do tempo
  - Suporte a peso, gordura corporal, massa muscular, IMC
- **Progress Photos** (`/api/photos`)
  - Upload de fotos com multer
  - Validação de tipo e tamanho (5MB máximo)
  - Armazenamento seguro em filesystem

#### Database Models
- **User Model**: Perfil completo com segurança
  - Profile fields: age, weight, height, gender, goals
  - Role-based access (user/admin)
  - Failed login tracking
  - Account locking mechanism
- **Workout Model**: Treinos detalhados
  - Array de exercícios com sets, reps, weight
  - Categorização por tipo
  - Duração e calorias queimadas
- **Meal Model**: Refeições com nutrição
  - Array de alimentos com macros
  - Cálculo automático de totais
  - Timestamps automáticos
- **Metrics Model**: Evolução corporal
  - Medidas ao longo do tempo
  - Suporte a notas e observações
- **ProgressPhoto Model**: Fotos de progresso
  - Referência ao arquivo no filesystem
  - Metadata adicional (peso, gordura, medidas)

#### Docker Support
- **Production Setup** (`docker-compose.yml`)
  - MongoDB, API, Frontend, Certbot
  - Volumes persistentes para dados
  - Health checks automáticos
  - Network isolation
- **Development Setup** (`docker-compose.dev.yml`)
  - Hot-reload para desenvolvimento
  - Mongo Express UI (localhost:8081)
  - Debug-friendly configuration
  - Rápido setup com um comando

#### Documentation
- **BACKEND_SETUP.md**: Guia completo de setup (8KB)
  - Instalação local e Docker
  - Configuração de ambiente
  - Schema do banco de dados
  - Troubleshooting
- **API_TESTING.md**: Guia de testes (9KB)
  - Exemplos curl para todos endpoints
  - Script de teste automatizado
  - Postman collection guide
- **BACKEND_README.md**: Quick reference
  - Comandos rápidos
  - Credenciais padrão
  - Troubleshooting comum

#### Scripts & Tools
- **start-backend.sh/bat**: Scripts de início multiplataforma
  - Verificação de dependências
  - Setup automático de .env
  - Detecção de MongoDB
- **test-api.sh**: Suite de testes automatizada
  - 10 testes cobrindo todos endpoints
  - Output colorido e detalhado
  - Relatório de sucesso/falha
- **server/seed.js**: Dados iniciais
  - Contas admin e demo
  - Workouts e meals de exemplo
  - Metrics e photos de teste
- **migrate.html**: Ferramenta de migração
  - Interface web para exportar IndexedDB
  - Login no backend
  - Migração assistida de dados

#### API Client
- **js/api-client.js**: Cliente JavaScript completo
  - Classe `FitnessTrackerAPI` para integração
  - Métodos para todos endpoints
  - Gerenciamento automático de tokens
  - Error handling consistente

#### Security Features
- **Password Security**
  - bcrypt com 10 salt rounds
  - Validação de força de senha
  - Histórico de senhas (futuro)
- **API Security**
  - Rate limiting: 100 req/15min
  - Account locking: 5 tentativas/15min
  - CORS configurável
  - Helmet security headers
- **Data Validation**
  - Mongoose schema validation
  - Input sanitization
  - File upload restrictions
  - Size and type validation

### 🔄 Mudado
- **README.md**: Adicionado seção de backend e modos de operação
- **package.json**: Adicionado scripts e dependências do backend
- **.gitignore**: Atualizado para node_modules, uploads, .env

### 📊 Dual-Mode Support

O Pilgrim agora suporta **dois modos de operação**:

1. **Frontend-Only Mode** (Original)
   - 100% local, tudo no navegador
   - IndexedDB para armazenamento
   - Zero configuração necessária
   - Perfeito para uso pessoal

2. **Full-Stack Mode** (Novo)
   - Backend Node.js + MongoDB
   - API REST profissional
   - Multi-usuário e multi-dispositivo
   - Escalável e production-ready

### 🎯 Próximos Passos

- [ ] Integrar frontend com API client
- [ ] Sincronização automática de dados
- [ ] Modo offline com sync quando online
- [ ] WebSocket para updates real-time
- [ ] Apps mobile nativos (React Native)

---

## [2.0.0] - 2025-11-15

### 🎉 Principais Mudanças desta Versão

Esta é uma versão majorfocada em **segurança**, **administração** e **experiência do usuário**.

### ✨ Adicionado

#### Sistema de Autenticação e Segurança (2025)
- **Login e Registro Seguros**: Sistema completo de autenticação com criptografia de senhas
  - Hash de senha com PBKDF2 (Web Crypto API, 100.000 iterações)
  - Validação robusta de senhas (mínimo 8 caracteres, maiúsculas, minúsculas, números, especiais)
  - Validação de email e username com sanitização contra XSS
  - Primeira conta criada é automaticamente promovida a administrador
- **Proteção contra Ataques**:
  - Proteção contra brute force com bloqueio de conta (15 minutos após 5 tentativas)
  - Rate limiting (máximo 10 requisições por minuto)
  - CSRF token protection em todas as operações
  - Sanitização de inputs contra XSS
  - Auditoria completa de eventos de segurança
- **Gerenciamento de Sessão**:
  - Sessões seguras com tokens criptografados
  - Timeout de sessão configurável (24 horas padrão)
  - Logout seguro com limpeza de dados
- **Conta Admin Padrão**:
  - Username: `Pedro`
  - Email: `pedro@fitness-tracker.com`
  - Auto-login ativado para desenvolvimento

#### Sistema de Administração e Gerenciamento de Tarefas
- **Painel Administrativo Completo**:
  - Dashboard com visão geral de tarefas e status
  - Gerenciamento de roadmap (curto, médio e longo prazo)
  - Sistema de tarefas com checklist e progresso
  - Controle de prioridades (crítico, alto, médio, baixo)
  - Estados de tarefas (todo, in_progress, done, blocked)
- **Tarefas do Roadmap**:
  - ✅ Correção de headers CSP inválidos
  - ✅ Remoção de código de bloqueio de DevTools
  - 📋 Deploy em produção com HTTPS
  - 📋 Monitoramento de logs de segurança
  - 📋 Testes em múltiplos navegadores
  - 📋 Sistema de coleta de feedback
- **Exportação e Backup**:
  - Export de tarefas para Markdown
  - Export de tarefas para JSON
  - Arquivamento de tarefas completadas

#### Sistema de Monitoramento de Acesso
- **Tracking de Acessos**:
  - Registro automático de todos os acessos à página
  - Informações coletadas: timestamp, usuário, role, resolução, idioma
  - Estatísticas de acesso (últimas 24h, 7 dias, 30 dias)
  - Visitantes únicos por período
- **Visualizações Administrativas**:
  - Gráfico de acesso por hora (últimas 24h)
  - Breakdown diário (últimos 7 dias)
  - Lista de acessos recentes (últimos 50)
  - Filtros por role (admin, user, anonymous)
- **Limpeza Automática**:
  - Remoção automática de logs com mais de 90 dias
  - Prevenção de crescimento excessivo do banco de dados

#### Sistema de Sugestões e Feedback
- **Submissão de Sugestões**:
  - Usuários autenticados podem enviar sugestões
  - Campos: título, descrição, categoria, prioridade
  - Sistema de votação (upvotes)
  - Tracking de quem votou em cada sugestão
- **Gestão Administrativa**:
  - Revisão de sugestões pelos administradores
  - Estados: pending, approved, rejected, implemented
  - Notas administrativas para cada sugestão
  - Exportação para formato GitHub Issues
- **Visualização Pública**:
  - Lista ordenada por votos
  - Indicador de sugestões implementadas
  - Feedback do admin visível para usuários

#### Melhorias no Sistema de Refeições
- **Registro de Refeições Diário**:
  - Navegação dia-a-dia com botões Anterior/Próximo
  - Múltiplas refeições por dia
  - Cálculo automático de macros (proteína, carboidrato, gordura, calorias)
  - Validação de campos numéricos
- **Histórico de Refeições**:
  - Visualização completa do histórico
  - Filtro por data
  - Totalizadores de macros por dia
  - Comparação com metas diárias
- **Composição de Refeições**:
  - Criar refeições compostas de múltiplos alimentos
  - Cálculo automático de valores nutricionais totais
  - Salvar composições personalizadas
  - Reutilizar composições salvas

#### Sistema de Fotos de Progresso
- **Upload de Fotos**:
  - Upload de fotos com preview
  - Associação com data e notas
  - Validação de tipo e tamanho de arquivo
  - Armazenamento em IndexedDB
- **Comparação de Fotos**:
  - Seleção de duas fotos para comparação lado a lado
  - Visualização de datas e notas
  - Análise visual de progresso

#### Templates de Treino Científicos
- **Programas Pré-Definidos**:
  - Full-body (3x por semana)
  - Push/Pull/Legs (6x por semana)
  - Upper/Lower/Full (3x por semana)
- **Detalhes dos Exercícios**:
  - Nome, séries, repetições
  - Tempo de descanso entre séries
  - Notas de execução e forma
  - Baseado em evidências científicas

#### Gráfico de Evolução Muscular
- **Visualização de Métricas**:
  - Massa muscular (kg) - eixo Y esquerdo
  - Tamanho muscular (cm) - eixo Y direito
  - Timeline com todos os registros
  - Gráfico interativo com Chart.js
- **Export de Dados**:
  - Export para CSV
  - Todos os dados históricos incluídos

#### Sistema de Comparação de Usuários
- **Comparação Lado a Lado**:
  - Visualização de métricas de 2 usuários
  - Comparação de peso, gordura, massa muscular
  - Gráficos sincronizados
  - Análise de diferenças

### 🔧 Alterado

#### Melhorias de Interface
- **Design Moderno**:
  - Gradiente roxo/rosa no header
  - Cards com glassmorphism
  - Animações suaves (fade in/out)
  - Responsividade melhorada
- **Navegação Aprimorada**:
  - Tabs com ícones intuitivos
  - Indicador de tab ativo
  - Menu administrativo condicional (apenas para admins)
  - Logout visível e acessível

#### Segurança e Headers
- **Correção de Headers HTTP**:
  - Removidos headers CSP inválidos de meta tags (X-Frame-Options, frame-ancestors)
  - Documentação sobre necessidade de configuração no servidor
  - Meta tags de segurança otimizadas (X-Content-Type-Options, Referrer-Policy)
- **Política de Robots**:
  - noindex, nofollow, noarchive, nosnippet
  - Copyright notice atualizado para 2025

#### Banco de Dados
- **IndexedDB Versão 6**:
  - Novos stores: accounts, tasks, suggestions, access_logs
  - Índices otimizados para queries rápidas
  - Migração automática de versões anteriores
- **Fallback para localStorage**:
  - Backup automático em localStorage
  - Migração de dados legados
  - Sincronização bidirecional

### ❌ Removido

#### Código de Segurança Problemático
- **Bloqueio de DevTools**:
  - Removida detecção de console aberto
  - Removido bloqueio de F12 e Ctrl+Shift+I
  - Removido bloqueio de clique direito
  - Removido bloqueio de seleção de texto
  - **Motivo**: Má experiência do usuário e dificulta debugging legítimo

#### Otimizações
- **Código Não Utilizado**:
  - Funções duplicadas removidas
  - Comentários excessivos limpos (mantidos apenas os essenciais)
  - Console.logs de debug removidos em produção

### 🐛 Corrigido

#### Bugs de Funcionalidade
- **Registro de Refeições**:
  - Corrigido bug onde refeições não eram salvas corretamente
  - Corrigida validação de campos obrigatórios
  - Corrigido cálculo de macros totais
- **Navegação Entre Dias**:
  - Corrigido bug de navegação em datas
  - Melhorada sincronização entre workout e meal days
- **Fotos de Progresso**:
  - Corrigido bug de upload múltiplo
  - Corrigida exibição de preview
  - Corrigido armazenamento em IndexedDB

#### Bugs de Interface
- **Responsividade**:
  - Corrigidos problemas em mobile
  - Corrigida exibição de tabelas em telas pequenas
  - Corrigido overflow de texto em cards
- **Formulários**:
  - Corrigida validação de inputs
  - Corrigido reset de formulários após submit
  - Corrigidos placeholders e labels

### 🔒 Segurança

#### Vulnerabilidades Corrigidas
- **XSS Protection**:
  - Sanitização de todos os inputs de usuário
  - Escape de HTML em outputs
  - Validação rigorosa de emails e usernames
- **Injection Attacks**:
  - Prepared statements em queries IndexedDB
  - Validação de tipos de dados
  - Limitação de tamanho de inputs
- **Brute Force**:
  - Sistema de rate limiting implementado
  - Bloqueio temporário após tentativas falhas
  - Logs de tentativas suspeitas

### 📚 Documentação

#### Novos Documentos
- **CHANGELOG.md**: Este arquivo
- **VERSION.md**: Controle de versão semântico
- **docs/GERENCIAMENTO-BRANCHES.md**: Guia completo de gerenciamento de branches Git

#### Documentação Atualizada
- **README.md**: Atualizado com novas funcionalidades
- **SECURITY.md**: Políticas de segurança 2025
- **docs/admin/**: Guias administrativos atualizados

### 🎯 Performance

#### Otimizações
- **IndexedDB**:
  - Queries otimizadas com índices
  - Batch operations para múltiplas inserções
  - Cache de dados frequentemente acessados
- **Renderização**:
  - Lazy loading de componentes pesados
  - Debounce em inputs de formulário
  - Throttle em scroll events
- **Assets**:
  - CDN para Chart.js e Tailwind
  - Compressão de imagens
  - Minificação de código inline

---

## [1.0.0] - 2025-11-01

### ✨ Versão Inicial

#### Funcionalidades Core
- Sistema básico de tracking de treinos
- Registro de métricas corporais
- Cálculo de macronutrientes
- Templates de treino pré-definidos
- Armazenamento local com IndexedDB
- Interface responsiva com Tailwind CSS

#### Usuários Padrão
- Pedro (masculino, 30 anos, 175cm)
- Valentina (feminino, 28 anos, 165cm)

#### Tecnologias
- JavaScript Vanilla
- Chart.js para gráficos
- Tailwind CSS para estilização
- IndexedDB para armazenamento

---

## Tipos de Mudanças

- `✨ Adicionado` para novas funcionalidades
- `🔧 Alterado` para mudanças em funcionalidades existentes
- `❌ Removido` para funcionalidades removidas
- `🐛 Corrigido` para correção de bugs
- `🔒 Segurança` para vulnerabilidades corrigidas
- `📚 Documentação` para mudanças na documentação
- `🎯 Performance` para melhorias de performance

---

## Links

- [Repositório GitHub](https://github.com/taukkunen1/fitness-tracker)
- [Demo Live](https://taukkunen1.github.io/fitness-tracker/)
- [Issues](https://github.com/taukkunen1/fitness-tracker/issues)
- [Pull Requests](https://github.com/taukkunen1/fitness-tracker/pulls)

---

**Última atualização:** 15 de Novembro de 2025  
**Mantido por:** taukkunen1
