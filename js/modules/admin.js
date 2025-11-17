/**
 * @fileoverview Admin Module
 * @module modules/admin
 * 
 * Administrative functions for task management, suggestions, security monitoring
 */

/* Admin render functions */
function renderAdminTasks() {
  return `
    <div class="space-y-6">
      <!-- Admin Header -->
      <div class="bg-gradient-to-r from-red-900 to-orange-900 p-6 rounded-xl border border-red-500">
        <h2 class="text-3xl font-bold mb-2">👑 Painel do Administrador - Tarefas</h2>
        <p class="text-red-200">Gerencie as tarefas do roadmap e acompanhe o progresso do projeto</p>
      </div>

      <!-- Task Stats -->
      <div class="grid md:grid-cols-4 gap-4" id="taskStats">
        <div class="bg-slate-800 p-4 rounded-lg">
          <p class="text-slate-400 text-sm">Total de Tarefas</p>
          <p class="text-3xl font-bold text-white" id="totalTasks">-</p>
        </div>
        <div class="bg-green-900/30 p-4 rounded-lg border border-green-500/30">
          <p class="text-green-400 text-sm">Concluídas</p>
          <p class="text-3xl font-bold text-green-300" id="doneTasks">-</p>
        </div>
        <div class="bg-yellow-900/30 p-4 rounded-lg border border-yellow-500/30">
          <p class="text-yellow-400 text-sm">Em Progresso</p>
          <p class="text-3xl font-bold text-yellow-300" id="inProgressTasks">-</p>
        </div>
        <div class="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
          <p class="text-blue-400 text-sm">A Fazer</p>
          <p class="text-3xl font-bold text-blue-300" id="todoTasks">-</p>
        </div>
      </div>

      <!-- Create Task Button -->
      <div class="flex justify-between items-center">
        <h3 class="text-xl font-bold">📋 Tarefas do Roadmap</h3>
        <button onclick="showCreateTaskModal()" class="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-semibold">
          ➕ Nova Tarefa
        </button>
      </div>

      <!-- Task Categories -->
      <div class="space-y-6" id="tasksList">
        <p class="text-slate-400">Carregando tarefas...</p>
      </div>

      <!-- Export Button -->
      <div class="flex gap-3">
        <button onclick="exportTasksToMarkdown()" class="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold">
          📄 Exportar Tarefas (Markdown)
        </button>
        <button onclick="exportTasksToJSON()" class="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-semibold">
          💾 Exportar JSON
        </button>
      </div>
    </div>
  `;
}

function renderAdminSuggestions() {
  return `
    <div class="space-y-6">
      <!-- Admin Header -->
      <div class="bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-xl border border-purple-500">
        <h2 class="text-3xl font-bold mb-2">💡 Painel do Administrador - Sugestões</h2>
        <p class="text-purple-200">Gerencie sugestões e feedback dos usuários</p>
      </div>

      <!-- Suggestion Stats -->
      <div class="grid md:grid-cols-4 gap-4" id="suggestionStats">
        <div class="bg-slate-800 p-4 rounded-lg">
          <p class="text-slate-400 text-sm">Total</p>
          <p class="text-3xl font-bold text-white" id="totalSuggestions">-</p>
        </div>
        <div class="bg-yellow-900/30 p-4 rounded-lg border border-yellow-500/30">
          <p class="text-yellow-400 text-sm">Pendentes</p>
          <p class="text-3xl font-bold text-yellow-300" id="pendingSuggestions">-</p>
        </div>
        <div class="bg-green-900/30 p-4 rounded-lg border border-green-500/30">
          <p class="text-green-400 text-sm">Aprovadas</p>
          <p class="text-3xl font-bold text-green-300" id="approvedSuggestions">-</p>
        </div>
        <div class="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
          <p class="text-blue-400 text-sm">Implementadas</p>
          <p class="text-3xl font-bold text-blue-300" id="implementedSuggestions">-</p>
        </div>
      </div>

      <!-- Export to GitHub -->
      <div class="bg-slate-800 p-4 rounded-lg border border-green-500/30">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-bold mb-1">🔄 Sincronizar com GitHub</h3>
            <p class="text-slate-400 text-sm">Exporte todas as sugestões para um arquivo Markdown compatível com GitHub Issues</p>
          </div>
          <button onclick="exportSuggestionsToGitHubFormat()" class="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-semibold whitespace-nowrap">
            📤 Exportar para GitHub
          </button>
        </div>
      </div>

      <!-- Suggestions List -->
      <div class="space-y-4" id="suggestionsList">
        <p class="text-slate-400">Carregando sugestões...</p>
      </div>
    </div>
  `;
}

function renderAdminSecurity() {
  return `
    <div class="space-y-6">
      <!-- Admin Header -->
      <div class="bg-gradient-to-r from-red-900 to-pink-900 p-6 rounded-xl border border-red-500">
        <h2 class="text-3xl font-bold mb-2">🔐 Painel do Administrador - Segurança & Monitoramento</h2>
        <p class="text-red-200">Monitore acessos ao site, contas registradas e eventos de segurança</p>
        <p class="text-red-300 text-sm mt-2">⏱️ <span id="lastUpdateTime">Atualização automática a cada 5 minutos</span></p>
      </div>

      <!-- Access Monitoring Stats -->
      <div class="bg-gradient-to-r from-purple-900 to-indigo-900 p-4 rounded-xl border border-purple-500">
        <h3 class="text-xl font-bold mb-4">📊 Monitoramento de Acessos ao Site</h3>
        <div class="grid md:grid-cols-5 gap-4">
          <div class="bg-slate-800 p-4 rounded-lg">
            <p class="text-slate-400 text-sm">Total de Acessos</p>
            <p class="text-3xl font-bold text-white" id="totalAccesses">-</p>
          </div>
          <div class="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
            <p class="text-blue-400 text-sm">Últimas 24h</p>
            <p class="text-3xl font-bold text-blue-300" id="accesses24h">-</p>
          </div>
          <div class="bg-cyan-900/30 p-4 rounded-lg border border-cyan-500/30">
            <p class="text-cyan-400 text-sm">Últimos 7 dias</p>
            <p class="text-3xl font-bold text-cyan-300" id="accesses7d">-</p>
          </div>
          <div class="bg-teal-900/30 p-4 rounded-lg border border-teal-500/30">
            <p class="text-teal-400 text-sm">Visitantes Únicos (24h)</p>
            <p class="text-3xl font-bold text-teal-300" id="uniqueVisitors24h">-</p>
          </div>
          <div class="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
            <p class="text-purple-400 text-sm">Contas Registradas</p>
            <p class="text-3xl font-bold text-purple-300" id="totalRegisteredAccounts">-</p>
          </div>
        </div>
      </div>

      <!-- Access Logs -->
      <div class="bg-slate-800 p-4 rounded-lg">
        <h3 class="text-xl font-bold mb-4">🕒 Acessos Recentes</h3>
        <div id="accessLogsList">
          <p class="text-slate-400">Carregando acessos...</p>
        </div>
      </div>

      <!-- Hourly Access Chart -->
      <div class="bg-slate-800 p-4 rounded-lg">
        <h3 class="text-xl font-bold mb-4">📈 Acessos por Hora (Últimas 24h)</h3>
        <div id="hourlyAccessChart">
          <p class="text-slate-400">Carregando gráfico...</p>
        </div>
      </div>

      <!-- Security Stats -->
      <div class="bg-gradient-to-r from-red-900 to-orange-900 p-4 rounded-xl border border-red-500 mt-6">
        <h3 class="text-xl font-bold mb-4">🔒 Estatísticas de Segurança</h3>
        <div class="grid md:grid-cols-4 gap-4" id="securityStats">
          <div class="bg-slate-800 p-4 rounded-lg">
            <p class="text-slate-400 text-sm">Total de Eventos</p>
            <p class="text-3xl font-bold text-white" id="totalSecurityEvents">-</p>
          </div>
          <div class="bg-green-900/30 p-4 rounded-lg border border-green-500/30">
            <p class="text-green-400 text-sm">Logins Sucesso</p>
            <p class="text-3xl font-bold text-green-300" id="successfulLogins">-</p>
          </div>
          <div class="bg-red-900/30 p-4 rounded-lg border border-red-500/30">
            <p class="text-red-400 text-sm">Logins Falhados</p>
            <p class="text-3xl font-bold text-red-300" id="failedLogins">-</p>
          </div>
          <div class="bg-yellow-900/30 p-4 rounded-lg border border-yellow-500/30">
            <p class="text-yellow-400 text-sm">Contas Bloqueadas</p>
            <p class="text-3xl font-bold text-yellow-300" id="blockedAccounts">-</p>
          </div>
        </div>
      </div>

      <!-- 🆕 Advanced Security Dashboard (2025 Research-Based) -->
      <div class="bg-gradient-to-r from-blue-900 to-cyan-900 p-6 rounded-xl border border-blue-500 mt-6">
        <h3 class="text-2xl font-bold mb-2">🛡️ Advanced Security Posture (Research-Based 2025)</h3>
        <p class="text-blue-200 text-sm mb-4">Baseado em pesquisas científicas de ponta em cibersegurança</p>
        
        <!-- DCCI Security Posture -->
        <div class="grid md:grid-cols-4 gap-4 mb-6" id="dcciPosture">
          <div class="bg-gradient-to-br from-purple-600 to-blue-600 p-6 rounded-lg text-center">
            <div class="text-6xl font-bold mb-2" id="securityGrade">-</div>
            <div class="text-xl font-bold mb-1" id="securityScore">-</div>
            <div class="text-sm opacity-75">Overall Security Score</div>
            <div class="text-xs mt-2 opacity-60">DCCI Framework</div>
          </div>
          
          <div class="bg-slate-800 p-4 rounded-lg">
            <p class="text-slate-400 text-sm">Technological</p>
            <p class="text-2xl font-bold text-blue-300" id="techCapability">-</p>
            <div class="w-full bg-slate-700 rounded-full h-2 mt-2">
              <div class="bg-blue-500 h-2 rounded-full" id="techCapabilityBar" style="width: 0%"></div>
            </div>
          </div>
          
          <div class="bg-slate-800 p-4 rounded-lg">
            <p class="text-slate-400 text-sm">Organizational</p>
            <p class="text-2xl font-bold text-cyan-300" id="orgCapability">-</p>
            <div class="w-full bg-slate-700 rounded-full h-2 mt-2">
              <div class="bg-cyan-500 h-2 rounded-full" id="orgCapabilityBar" style="width: 0%"></div>
            </div>
          </div>
          
          <div class="bg-slate-800 p-4 rounded-lg">
            <p class="text-slate-400 text-sm">Managerial</p>
            <p class="text-2xl font-bold text-teal-300" id="mgrCapability">-</p>
            <div class="w-full bg-slate-700 rounded-full h-2 mt-2">
              <div class="bg-teal-500 h-2 rounded-full" id="mgrCapabilityBar" style="width: 0%"></div>
            </div>
          </div>
        </div>
        
        <!-- Adaptive Rate Limiter Stats -->
        <div class="grid md:grid-cols-4 gap-4 mb-6">
          <div class="bg-slate-800 p-4 rounded-lg">
            <p class="text-slate-400 text-sm">Threat Level</p>
            <p class="text-2xl font-bold" id="threatLevel">-</p>
            <p class="text-xs text-slate-500 mt-1">Adaptive Firewall</p>
          </div>
          
          <div class="bg-slate-800 p-4 rounded-lg">
            <p class="text-slate-400 text-sm">Current Rate Limit</p>
            <p class="text-2xl font-bold text-white" id="currentRateLimit">-</p>
            <p class="text-xs text-slate-500 mt-1">Requests per minute</p>
          </div>
          
          <div class="bg-slate-800 p-4 rounded-lg">
            <p class="text-slate-400 text-sm">Attack Patterns</p>
            <p class="text-2xl font-bold text-red-400" id="attackPatterns">-</p>
            <p class="text-xs text-slate-500 mt-1">Detected in last hour</p>
          </div>
          
          <div class="bg-slate-800 p-4 rounded-lg">
            <p class="text-slate-400 text-sm">Active Sessions</p>
            <p class="text-2xl font-bold text-green-400" id="activeSessions">-</p>
            <p class="text-xs text-slate-500 mt-1">Zero Trust validated</p>
          </div>
        </div>
        
        <!-- Recommendations -->
        <div class="bg-slate-800 p-4 rounded-lg" id="securityRecommendations">
          <h4 class="font-bold text-lg mb-3">📋 Security Recommendations</h4>
          <div id="recommendationsList">
            <p class="text-slate-400 text-sm">Carregando recomendações...</p>
          </div>
        </div>
        
        <!-- Research Attribution -->
        <div class="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
          <p class="text-xs text-slate-400">
            <strong>Research-Based Features:</strong> AI-Powered Security Agent (LLMs) • 
            Adaptive Rate Limiting (ML Firewalls) • Zero Trust Framework • 
            Privacy-Preserving Analytics (Federated Learning) • DCCI Security Intelligence
          </p>
          <p class="text-xs text-slate-500 mt-1">
            Baseado em pesquisas de Li et al., Ahmadi, Rahmati, Ahmed et al., e Pigola (2024-2025)
          </p>
        </div>
      </div>

      <!-- 🆕 Login Attempts Chart -->
      <div class="bg-slate-800 p-4 rounded-lg">
        <h3 class="text-xl font-bold mb-4">📊 Tentativas de Login (Últimos 7 dias)</h3>
        <div class="mb-4">
          <canvas id="loginAttemptsChart" height="80"></canvas>
        </div>
        <div class="grid md:grid-cols-3 gap-4 mt-4">
          <div class="bg-green-900/30 p-3 rounded-lg border border-green-500/30 text-center">
            <p class="text-2xl font-bold text-green-300" id="loginSuccessCount">-</p>
            <p class="text-sm text-green-400">Logins com Sucesso</p>
          </div>
          <div class="bg-red-900/30 p-3 rounded-lg border border-red-500/30 text-center">
            <p class="text-2xl font-bold text-red-300" id="loginFailedCount">-</p>
            <p class="text-sm text-red-400">Logins Falhados</p>
          </div>
          <div class="bg-yellow-900/30 p-3 rounded-lg border border-yellow-500/30 text-center">
            <p class="text-2xl font-bold text-yellow-300" id="loginSuccessRate">-</p>
            <p class="text-sm text-yellow-400">Taxa de Sucesso</p>
          </div>
        </div>
      </div>

      <!-- 🆕 Suspicious Activity Alerts -->
      <div class="bg-gradient-to-r from-orange-900 to-red-900 p-4 rounded-xl border border-orange-500">
        <h3 class="text-xl font-bold mb-4">⚠️ Alertas de Atividade Suspeita</h3>
        <div id="suspiciousActivityAlerts">
          <p class="text-slate-400">Carregando alertas...</p>
        </div>
      </div>

      <!-- Security Events List -->
      <div class="bg-slate-800 p-4 rounded-lg">
        <h3 class="text-xl font-bold mb-4">📊 Eventos de Segurança Recentes</h3>
        <div id="securityEventsList">
          <p class="text-slate-400">Carregando eventos...</p>
        </div>
      </div>

      <!-- Account Management -->
      <div class="bg-slate-800 p-4 rounded-lg">
        <h3 class="text-xl font-bold mb-4">👥 Gerenciamento de Contas</h3>
        <div id="accountsList">
          <p class="text-slate-400">Carregando contas...</p>
        </div>
      </div>

      <!-- Export Buttons -->
      <div class="flex flex-wrap gap-3">
        <button onclick="generateWeeklySecurityReport()" class="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold">
          📋 Gerar Relatório Semanal
        </button>
        <button onclick="exportSecurityLogs()" class="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-lg font-semibold">
          📄 Exportar Logs de Segurança
        </button>
        <button onclick="exportAccessLogs()" class="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-semibold">
          📊 Exportar Logs de Acesso
        </button>
        <button onclick="clearOldSecurityLogs()" class="bg-orange-600 hover:bg-orange-500 px-6 py-3 rounded-lg font-semibold">
          🗑️ Limpar Logs Antigos (>30 dias)
        </button>
        <button onclick="clearOldAccessLogsManual()" class="bg-yellow-600 hover:bg-yellow-500 px-6 py-3 rounded-lg font-semibold">
          🗑️ Limpar Acessos Antigos (>90 dias)
        </button>
      </div>
    </div>
  `;
}

function renderUserSuggestions() {
  return `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-gradient-to-r from-green-900 to-teal-900 p-6 rounded-xl border border-green-500">
        <h2 class="text-3xl font-bold mb-2">💡 Sugestões e Feedback</h2>
        <p class="text-green-200">Compartilhe suas ideias para melhorar o Pilgrim</p>
      </div>

      <!-- Submit Suggestion Form -->
      <div class="bg-slate-800 p-6 rounded-lg">
        <h3 class="text-xl font-bold mb-4">📝 Enviar Nova Sugestão</h3>
        <form id="suggestionForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Título da Sugestão *</label>
            <input type="text" name="title" required maxlength="100" 
                   class="w-full px-4 py-2 rounded-lg bg-slate-700 text-white focus:ring-2 focus:ring-green-500"
                   placeholder="Ex: Adicionar timer de descanso entre séries" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Descrição Detalhada *</label>
            <textarea name="description" required maxlength="500" rows="4"
                      class="w-full px-4 py-2 rounded-lg bg-slate-700 text-white focus:ring-2 focus:ring-green-500"
                      placeholder="Descreva sua sugestão em detalhes..."></textarea>
            <p class="text-xs text-slate-400 mt-1">Máximo 500 caracteres</p>
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Categoria</label>
              <select name="category" class="w-full px-4 py-2 rounded-lg bg-slate-700 text-white">
                <option value="feature">Nova Funcionalidade</option>
                <option value="improvement">Melhoria</option>
                <option value="bugfix">Correção de Bug</option>
                <option value="ui">Interface/Design</option>
                <option value="performance">Performance</option>
                <option value="other">Outro</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Prioridade</label>
              <select name="priority" class="w-full px-4 py-2 rounded-lg bg-slate-700 text-white">
                <option value="low">Baixa</option>
                <option value="medium" selected>Média</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </div>
          </div>

          <button type="submit" class="w-full bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-semibold text-lg">
            ✨ Enviar Sugestão
          </button>
        </form>
      </div>

      <!-- Existing Suggestions -->
      <div class="bg-slate-800 p-6 rounded-lg">
        <h3 class="text-xl font-bold mb-4">📋 Sugestões da Comunidade</h3>
        <p class="text-slate-400 text-sm mb-4">Vote nas sugestões que você mais gostaria de ver implementadas</p>
        <div id="userSuggestionsList">
          <p class="text-slate-400">Carregando sugestões...</p>
        </div>
      </div>
    </div>
  `;
}

/* ----------------------------- Parse CHANGELOG.md ----------------------------- */
// Global variable to store parsed changelog
let parsedChangelogData = null;
let isLoadingChangelog = false;

// Function to fetch and parse CHANGELOG.md
async function fetchAndParseChangelog() {
  try {
    const response = await fetch('CHANGELOG.md');
    if (!response.ok) {
      throw new Error('Failed to fetch CHANGELOG.md');
    }
    const text = await response.text();
    return parseChangelogMarkdown(text);
  } catch (error) {
    console.error('Error fetching changelog:', error);
    return getFallbackChangelogData();
  }
}

// Function to parse markdown changelog into structured data
function parseChangelogMarkdown(markdown) {
  const versions = [];
  const lines = markdown.split('\n');
  let currentVersion = null;
  let currentSection = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Match version header: ## [2.0.0] - 2025-11-15
    const versionMatch = line.match(/^##\s+\[(\d+\.\d+\.\d+)\]\s+-\s+(\d{4}-\d{2}-\d{2})/);
    if (versionMatch) {
      if (currentVersion) {
        versions.push(currentVersion);
      }
      
      const [, version, date] = versionMatch;
      const versionParts = version.split('.').map(Number);
      let type = 'patch';
      if (versionParts[0] > 0 && versionParts[1] === 0 && versionParts[2] === 0) {
        type = 'major';
      } else if (versionParts[1] > 0 && versionParts[2] === 0) {
        type = 'minor';
      }
      
      currentVersion = {
        version,
        date,
        type,
        title: '',
        changes: []
      };
      currentSection = null;
      continue;
    }
    
    // Skip if no current version
    if (!currentVersion) continue;
    
    // Capture title (first heading after version that's not a section)
    if (!currentVersion.title && line.startsWith('###') && !line.includes('✨') && !line.includes('🔧') && !line.includes('❌') && !line.includes('🐛') && !line.includes('🔒') && !line.includes('📚') && !line.includes('🎯')) {
      currentVersion.title = line.replace(/^###\s+🎉?\s*/, '').replace(/^Principais Mudanças desta Versão/, '').trim();
      if (!currentVersion.title) currentVersion.title = `Versão ${currentVersion.version}`;
      continue;
    }
    
    // Match section headers: ### ✨ Adicionado
    if (line.startsWith('###')) {
      if (line.includes('✨') || line.includes('Adicionado')) currentSection = 'added';
      else if (line.includes('🔧') || line.includes('Alterado')) currentSection = 'changed';
      else if (line.includes('❌') || line.includes('Removido')) currentSection = 'removed';
      else if (line.includes('🐛') || line.includes('Corrigido')) currentSection = 'fixed';
      else if (line.includes('🔒') || line.includes('Segurança')) currentSection = 'security';
      continue;
    }
    
    // Match bullet points (changes)
    if (currentSection && line.startsWith('-')) {
      let text = line.substring(1).trim();
      
      // Remove markdown bold formatting
      text = text.replace(/\*\*(.*?)\*\*/g, '$1');
      
      // Extract just the main point (first sentence or before colon)
      if (text.includes(':')) {
        text = text.split(':')[0];
      }
      
      // Skip sub-bullets (indented with spaces)
      if (!line.match(/^-\s{2,}/)) {
        currentVersion.changes.push({
          type: currentSection,
          text: text.trim()
        });
      }
    }
  }
  
  // Add last version
  if (currentVersion) {
    versions.push(currentVersion);
  }
  
  return versions;
}

// Fallback data if CHANGELOG.md cannot be loaded
function getFallbackChangelogData() {
  return [
    {
      version: '2.0.0',
      date: '2025-11-15',
      type: 'major',
      title: 'Sistema de Autenticação e Administração',
      changes: [
        { type: 'added', text: 'Sistema completo de autenticação com PBKDF2' },
        { type: 'added', text: 'Painel administrativo com gestão de tarefas' },
        { type: 'added', text: 'Sistema de monitoramento de acessos' }
      ]
    }
  ];
}

// Load changelog data asynchronously and re-render when ready
async function loadChangelogData() {
  if (!parsedChangelogData && !isLoadingChangelog) {
    isLoadingChangelog = true;
    parsedChangelogData = await fetchAndParseChangelog();
    isLoadingChangelog = false;
    // Re-render if we're on the changelog tab
    if (state.activeTab === 'admin_changelog') {
      render();
    }
  }
}

/* ----------------------------- Admin Changelog Page ----------------------------- */
function renderAdminChangelog() {
  // Trigger async load if needed
  if (!parsedChangelogData && !isLoadingChangelog) {
    loadChangelogData();
  }
  
  // Use fallback data while loading or if already loaded
  const changelogData = parsedChangelogData || getFallbackChangelogData();

  // Get change type badge styling
  const getChangeTypeBadge = (type) => {
    const badges = {
      added: '<span class="px-2 py-1 rounded text-xs bg-green-900 text-green-300 border border-green-500">✨ Adicionado</span>',
      changed: '<span class="px-2 py-1 rounded text-xs bg-blue-900 text-blue-300 border border-blue-500">🔧 Alterado</span>',
      fixed: '<span class="px-2 py-1 rounded text-xs bg-purple-900 text-purple-300 border border-purple-500">🐛 Corrigido</span>',
      removed: '<span class="px-2 py-1 rounded text-xs bg-red-900 text-red-300 border border-red-500">❌ Removido</span>',
      security: '<span class="px-2 py-1 rounded text-xs bg-orange-900 text-orange-300 border border-orange-500">🔒 Segurança</span>'
    };
    return badges[type] || badges.changed;
  };

  // Get version type badge
  const getVersionTypeBadge = (type) => {
    const badges = {
      major: '<span class="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">MAJOR</span>',
      minor: '<span class="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">MINOR</span>',
      patch: '<span class="px-3 py-1 rounded-full text-xs font-bold bg-green-600 text-white">PATCH</span>'
    };
    return badges[type] || badges.patch;
  };

  return `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-900 to-pink-900 p-6 rounded-lg border border-purple-500">
        <h2 class="text-3xl font-bold mb-2">📝 Changelog do Sistema</h2>
        <p class="text-slate-300">Histórico completo de mudanças e versões do Pilgrim Fitness Tracker</p>
        <p class="text-slate-400 text-sm mt-2">
          <strong>Versionamento:</strong> MAJOR.MINOR.PATCH - 
          Mudanças importantes (1.0 → 2.0), Novas funcionalidades (1.0 → 1.1), Correções (1.0.0 → 1.0.1)
        </p>
        ${isLoadingChangelog ? '<p class="text-yellow-300 text-sm mt-2 animate-pulse">🔄 Carregando changelog do CHANGELOG.md...</p>' : ''}
        ${!isLoadingChangelog && parsedChangelogData ? '<p class="text-green-300 text-sm mt-2">✅ Dados carregados automaticamente do CHANGELOG.md</p>' : ''}
      </div>

      <!-- Info Box -->
      <div class="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
        <h3 class="font-bold text-blue-300 mb-2">ℹ️ Sobre este Changelog</h3>
        <p class="text-sm text-blue-200">
          Todas as mudanças significativas no painel de administrador e no sistema são documentadas aqui a partir da versão 1.0.
          Este changelog segue o <a href="https://semver.org/lang/pt-BR/" target="_blank" class="underline">Versionamento Semântico</a> 
          e o formato <a href="https://keepachangelog.com/pt-BR/1.0.0/" target="_blank" class="underline">Keep a Changelog</a>.
          <br><br>
          <strong class="text-blue-300">📄 Fonte:</strong> Os dados são carregados automaticamente do arquivo 
          <a href="CHANGELOG.md" target="_blank" class="underline font-semibold">CHANGELOG.md</a> na raiz do projeto.
          Qualquer atualização nesse arquivo será refletida aqui automaticamente ao recarregar a página.
        </p>
      </div>

      <!-- Version Statistics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-slate-800 p-4 rounded-lg text-center">
          <p class="text-3xl font-bold text-purple-400">${changelogData.length}</p>
          <p class="text-slate-400 text-sm">Versões Totais</p>
        </div>
        <div class="bg-slate-800 p-4 rounded-lg text-center">
          <p class="text-3xl font-bold text-red-400">${changelogData.filter(v => v.type === 'major').length}</p>
          <p class="text-slate-400 text-sm">Versões Major</p>
        </div>
        <div class="bg-slate-800 p-4 rounded-lg text-center">
          <p class="text-3xl font-bold text-blue-400">${changelogData.filter(v => v.type === 'minor').length}</p>
          <p class="text-slate-400 text-sm">Versões Minor</p>
        </div>
        <div class="bg-slate-800 p-4 rounded-lg text-center">
          <p class="text-3xl font-bold text-green-400">${changelogData.filter(v => v.type === 'patch').length}</p>
          <p class="text-slate-400 text-sm">Patches</p>
        </div>
      </div>

      <!-- Changelog Timeline -->
      <div class="space-y-6">
        <h3 class="text-2xl font-bold flex items-center gap-2">
          <span>📅</span>
          <span>Histórico de Versões</span>
        </h3>

        ${changelogData.map((version, index) => {
          const dateOptions = { day: '2-digit', month: 'long', year: 'numeric' };
          const formattedDate = new Date(version.date).toLocaleDateString('pt-BR', dateOptions);
          return `
          <div class="bg-slate-800 rounded-lg border-l-4 ${
            version.type === 'major' ? 'border-red-500' : 
            version.type === 'minor' ? 'border-blue-500' : 
            'border-green-500'
          }">
            <!-- Version Header -->
            <div class="p-6 border-b border-slate-700">
              <div class="flex flex-wrap items-center justify-between gap-4 mb-2">
                <div class="flex items-center gap-3">
                  <h4 class="text-2xl font-bold text-white">v${version.version}</h4>
                  ${getVersionTypeBadge(version.type)}
                  ${index === 0 ? '<span class="px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white animate-pulse">ATUAL</span>' : ''}
                </div>
                <span class="text-slate-400 text-sm">${formattedDate}</span>
              </div>
              <h5 class="text-lg font-semibold text-purple-300">${version.title}</h5>
            </div>

            <!-- Changes List -->
            <div class="p-6">
              <div class="space-y-3">
                ${version.changes.map(change => `
                  <div class="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                    <div class="flex-shrink-0 mt-0.5">
                      ${getChangeTypeBadge(change.type)}
                    </div>
                    <p class="text-slate-200 flex-1">${change.text}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
        }).join('')}
      </div>

      <!-- Future Versions -->
      <div class="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 rounded-lg border border-indigo-500">
        <h3 class="text-xl font-bold mb-4 flex items-center gap-2">
          <span>🚀</span>
          <span>Próximas Versões Planejadas</span>
        </h3>
        
        <div class="space-y-4">
          <div class="bg-black/30 p-4 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <h4 class="text-lg font-bold text-indigo-300">v2.1.0</h4>
              <span class="px-2 py-1 rounded text-xs bg-blue-600 text-white">MINOR</span>
              <span class="text-slate-400 text-sm">Planejado para Dezembro 2025</span>
            </div>
            <ul class="text-sm text-slate-300 space-y-1 ml-4">
              <li>• Sistema de notificações push</li>
              <li>• Export/Import em múltiplos formatos</li>
              <li>• Temas personalizáveis (dark/light)</li>
              <li>• PWA com suporte offline</li>
            </ul>
          </div>

          <div class="bg-black/30 p-4 rounded-lg">
            <div class="flex items-center gap-2 mb-2">
              <h4 class="text-lg font-bold text-indigo-300">v3.0.0</h4>
              <span class="px-2 py-1 rounded text-xs bg-red-600 text-white">MAJOR</span>
              <span class="text-slate-400 text-sm">Planejado para Março 2026</span>
            </div>
            <ul class="text-sm text-slate-300 space-y-1 ml-4">
              <li>• Backend com Node.js + PostgreSQL</li>
              <li>• API REST completa</li>
              <li>• Sincronização em nuvem</li>
              <li>• Apps mobile (React Native)</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Export Options -->
      <div class="bg-slate-800 p-6 rounded-lg">
        <h3 class="text-xl font-bold mb-4">📥 Exportar Changelog</h3>
        <div class="flex gap-3">
          <button onclick="exportChangelogToMarkdown()" 
                  class="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold">
            📄 Exportar Markdown
          </button>
          <button onclick="exportChangelogToJSON()" 
                  class="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold">
            📊 Exportar JSON
          </button>
        </div>
      </div>

      <!-- Documentation Links -->
      <div class="bg-slate-800 p-6 rounded-lg">
        <h3 class="text-xl font-bold mb-4">📚 Documentação Relacionada</h3>
        <div class="grid md:grid-cols-2 gap-3">
          <a href="https://github.com/taukkunen1/fitness-tracker/blob/main/CHANGELOG.md" 
             target="_blank"
             class="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-3 transition-colors">
            <span class="text-2xl">📝</span>
            <div>
              <p class="font-semibold">CHANGELOG.md</p>
              <p class="text-xs text-slate-400">Changelog completo no GitHub</p>
            </div>
          </a>
          <a href="https://github.com/taukkunen1/fitness-tracker/blob/main/docs/releases/VERSION.md" 
             target="_blank"
             class="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center gap-3 transition-colors">
            <span class="text-2xl">🔢</span>
            <div>
              <p class="font-semibold">VERSION.md</p>
              <p class="text-xs text-slate-400">Controle de versão detalhado</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  `;
}

/* ----------------------------- Changelog Export Functions ----------------------------- */

// Export changelog to Markdown
function exportChangelogToMarkdown() {
  const data = parsedChangelogData || getFallbackChangelogData();
  
  let markdown = '# Changelog - Pilgrim Fitness Tracker\n\n';
  markdown += `**Gerado em:** ${new Date().toLocaleString('pt-BR')}\n\n`;
  markdown += 'Todas as mudanças notáveis neste projeto são documentadas neste arquivo.\n\n';
  markdown += 'O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),\n';
  markdown += 'e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).\n\n';
  markdown += '---\n\n';
  
  data.forEach(version => {
    markdown += `## [${version.version}] - ${version.date}\n\n`;
    markdown += `### ${version.title}\n\n`;
    
    const grouped = {};
    version.changes.forEach(change => {
      if (!grouped[change.type]) grouped[change.type] = [];
      grouped[change.type].push(change.text);
    });
    
    if (grouped.added) {
      markdown += '### ✨ Adicionado\n\n';
      grouped.added.forEach(text => markdown += `- ${text}\n`);
      markdown += '\n';
    }
    if (grouped.changed) {
      markdown += '### 🔧 Alterado\n\n';
      grouped.changed.forEach(text => markdown += `- ${text}\n`);
      markdown += '\n';
    }
    if (grouped.fixed) {
      markdown += '### 🐛 Corrigido\n\n';
      grouped.fixed.forEach(text => markdown += `- ${text}\n`);
      markdown += '\n';
    }
    if (grouped.removed) {
      markdown += '### ❌ Removido\n\n';
      grouped.removed.forEach(text => markdown += `- ${text}\n`);
      markdown += '\n';
    }
    if (grouped.security) {
      markdown += '### 🔒 Segurança\n\n';
      grouped.security.forEach(text => markdown += `- ${text}\n`);
      markdown += '\n';
    }
    
    markdown += '---\n\n';
  });
  
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `changelog_export_${new Date().toISOString().split('T')[0]}.md`;
  a.click();
  URL.revokeObjectURL(url);
  
  showNotification('✅ Changelog exportado para Markdown!', 'success');
}

// Export changelog to JSON
function exportChangelogToJSON() {
  const data = parsedChangelogData || getFallbackChangelogData();
  
  const changelogData = {
    generated: new Date().toISOString(),
    currentVersion: data[0]?.version || '2.0.0',
    totalVersions: data.length,
    versions: data
  };
  
  const json = JSON.stringify(changelogData, null, 2);
  
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `changelog_export_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  showNotification('✅ Changelog exportado para JSON!', 'success');
}

/* ----------------------------- Chart rendering ----------------------------- */

// State for selected profiles (initialize with current user)
if (!window.selectedProfilesForChart) {
  window.selectedProfilesForChart = new Set([state.activeUser]);
}

/* ----------------------------- Admin UI Helper Functions ----------------------------- */

function showCreateTaskModal() {
  const modal = prompt('Digite o título da nova tarefa:');
  if (!modal) return;
  
  const description = prompt('Digite a descrição da tarefa:');
  if (!description) return;
  
  const category = prompt('Categoria (short_term/medium_term/long_term):', 'short_term');
  const priority = prompt('Prioridade (low/medium/high/critical):', 'medium');
  
  createTask({
    title: modal,
    description: description,
    category: category || 'short_term',
    priority: priority || 'medium'
  }).then(() => {
    showNotification('✅ Tarefa criada!', 'success');
    loadAndDisplayTasks();
  }).catch(err => {
    showNotification('❌ ' + err.message, 'error');
  });
}

// Change task status
async function changeTaskStatus(taskId) {
  const newStatus = prompt('Novo status (todo/in_progress/done/blocked):', 'in_progress');
  if (!newStatus) return;
  
  try {
    await updateTask(taskId, { status: newStatus });
    await loadAndDisplayTasks();
    showNotification('✅ Status atualizado!', 'success');
  } catch (err) {
    showNotification('❌ ' + err.message, 'error');
  }
}

// Delete task with confirmation
async function deleteTaskConfirm(taskId) {
  if (!confirm('Deseja arquivar esta tarefa? Ela será movida para o arquivo.')) return;
  
  try {
    await deleteTask(taskId);
    await loadAndDisplayTasks();
    showNotification('✅ Tarefa arquivada!', 'success');
  } catch (err) {
    showNotification('❌ ' + err.message, 'error');
  }
}

// Export tasks to markdown
async function exportTasksToMarkdown() {
  const tasks = await getAllTasks();
  
  let markdown = '# Roadmap - Pilgrim\n\n';
  markdown += `**Data:** ${new Date().toLocaleString('pt-BR')}\n\n`;
  markdown += '---\n\n';
  
  const categories = {
    [TASK_CATEGORIES.SHORT_TERM]: 'Curto Prazo (1-2 semanas)',
    [TASK_CATEGORIES.MEDIUM_TERM]: 'Médio Prazo (1-3 meses)',
    [TASK_CATEGORIES.LONG_TERM]: 'Longo Prazo (3-6 meses)'
  };
  
  for (const [category, categoryName] of Object.entries(categories)) {
    const categoryTasks = tasks.filter(t => t.category === category);
    if (categoryTasks.length === 0) continue;
    
    markdown += `## ${categoryName}\n\n`;
    
    categoryTasks.forEach(task => {
      markdown += `### ${task.title}\n`;
      markdown += `- **Status:** ${task.status}\n`;
      markdown += `- **Prioridade:** ${task.priority}\n`;
      markdown += `- **Descrição:** ${task.description}\n`;
      
      if (task.checklist.length > 0) {
        markdown += `- **Checklist:**\n`;
        task.checklist.forEach(item => {
          markdown += `  - [${item.done ? 'x' : ' '}] ${item.text}\n`;
        });
      }
      
      markdown += '\n---\n\n';
    });
  }
  
  // Download as file
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `roadmap_${new Date().toISOString().split('T')[0]}.md`;
  a.click();
  URL.revokeObjectURL(url);
  
  showNotification('✅ Roadmap exportado!', 'success');
}

// Export tasks to JSON
async function exportTasksToJSON() {
  const tasks = await getAllTasks();
  const json = JSON.stringify(tasks, null, 2);
  
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tasks_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  showNotification('✅ Tasks exportadas!', 'success');
}

