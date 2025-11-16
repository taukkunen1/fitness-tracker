/**
 * @fileoverview Dashboard Module - Main dashboard rendering and metrics display
 * @module modules/dashboard
 * 
 * Implements research-based usability design principles (2023-2025)
 * Evidence Base:
 * - Usability Evaluation of Dashboards: Systematic Literature Review (2023)
 * - Recommendations for Effective Dashboards (2025) - EPIS Framework
 * - Behavioral Indicators of Usability in Visual Analytics (2025)
 * 
 * @requires utils/helpers - parseNumber helper function
 * @requires data/initial-users - buildReferenceNotesForNutrition
 */

/**
 * Toggle visibility of dashboard help panel
 * Implements Progressive Disclosure principle
 */
function toggleDashboardHelp() {
  const panel = document.getElementById('dashboardHelpPanel');
  if (panel) {
    panel.classList.toggle('hidden');
  }
}

/**
 * Toggle visibility of period comparison panel
 * Allows users to compare performance across different time periods
 */
function togglePeriodComparison() {
  const panel = document.getElementById('periodComparisonPanel');
  if (panel) {
    panel.classList.toggle('hidden');
  }
}

/**
 * Render the main dashboard with user metrics and recommendations
 * 
 * Implements:
 * 1. Information Hierarchy - Primary metrics emphasized (SUS >80 target)
 * 2. Cognitive Load Reduction - VIF <5, grouped logically
 * 3. Task-Appropriate Design - Quick actions aligned with user goals
 * 4. Situational Awareness - Dynamic data with clear visuals
 * 5. Progressive Disclosure - Complex info accessible via drill-down
 * 
 * Target Metrics: <10min learning time, <5% error rate, >68 SUS score
 * 
 * @param {Object} user - User object with bodyMetrics, workoutHistory, goals
 * @param {Object} latest - Latest body metrics measurement
 * @returns {string} HTML string for dashboard rendering
 */
function renderDashboard(user, latest) {
  /* ============================================================================
     ENHANCED DASHBOARD - Research-Based Usability Design (2023-2025)
     
     Evidence Base:
     - Usability Evaluation of Dashboards: Systematic Literature Review (2023)
     - Recommendations for Effective Dashboards (2025) - EPIS Framework
     - Behavioral Indicators of Usability in Visual Analytics (2025)
     
     Key Principles Applied:
     1. Information Hierarchy - Primary metrics emphasized (SUS >80 target)
     2. Cognitive Load Reduction - VIF <5, grouped logically
     3. Task-Appropriate Design - Quick actions aligned with user goals
     4. Situational Awareness - Dynamic data with clear visuals
     5. Progressive Disclosure - Complex info accessible via drill-down
     
     Target Metrics: <10min learning time, <5% error rate, >68 SUS score
     ============================================================================ */
  
  const notes = buildReferenceNotesForNutrition();
  const bodyMetrics = user.bodyMetrics || [];
  
  // Calculate trends (last 2 measurements for comparison)
  const previous = bodyMetrics.length >= 2 ? bodyMetrics[bodyMetrics.length - 2] : null;
  const getTrend = (current, prev, inverse = false) => {
    if (!prev || !current) return { icon: '➖', color: 'text-slate-400', text: 'Sem dados', description: 'Dados insuficientes para calcular tendência' };
    const diff = current - prev;
    if (Math.abs(diff) < 0.1) return { icon: '➖', color: 'text-slate-400', text: 'Estável', description: 'Variação mínima desde última medição' };
    const isPositive = inverse ? diff < 0 : diff > 0;
    return {
      icon: isPositive ? '📈' : '📉',
      color: isPositive ? 'text-green-400' : 'text-red-400',
      text: `${isPositive ? '+' : ''}${diff.toFixed(1)}`,
      description: `${Math.abs(diff).toFixed(1)} ${isPositive ? 'aumento' : 'redução'} desde última medição`
    };
  };
  
  const weightTrend = getTrend(latest.weight, previous?.weight);
  const bodyFatTrend = getTrend(latest.bodyFat, previous?.bodyFat, true); // Lower is better
  const muscleTrend = getTrend(latest.muscleMass, previous?.muscleMass);
  
  // Enhanced progress calculation with better goal tracking
  const weightProgress = user.goals?.weight ? Math.min(100, Math.abs((latest.weight / user.goals.weight) * 100)) : 0;
  const muscleProgress = user.goals?.muscleMass ? Math.min(100, Math.abs((latest.muscleMass / user.goals.muscleMass) * 100)) : 0;
  
  // Recent workout stats (7-day, 30-day for comparison)
  const now = new Date();
  const recentWorkouts = (user.workoutHistory || []).filter(w => {
    const workoutDate = new Date(w.date);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return workoutDate >= sevenDaysAgo;
  });
  
  const thirtyDayWorkouts = (user.workoutHistory || []).filter(w => {
    const workoutDate = new Date(w.date);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return workoutDate >= thirtyDaysAgo;
  });
  
  const weeklyVolume = recentWorkouts.reduce((sum, w) => {
    if (w.totalVolume) return sum + w.totalVolume;
    const weight = parseNumber(w.weight);
    const reps = parseNumber(w.reps);
    const sets = parseNumber(w.sets);
    return sum + (weight * reps * sets);
  }, 0);
  
  // Calculate average weekly frequency
  const weeklyFrequency = recentWorkouts.length;
  const monthlyAverage = (thirtyDayWorkouts.length / 30 * 7).toFixed(1);
  
  // Days since last measurement
  const daysSinceLastMeasurement = bodyMetrics.length > 0 
    ? Math.floor((now - new Date(latest.date)) / (1000 * 60 * 60 * 24))
    : 0;
  
  return `
    <div class="space-y-6">
      <!-- Research-Based Guided Navigation Header (Principle: Reduce "Circling" Confusion) -->
      <div class="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 rounded-xl p-4">
        <div class="flex items-center gap-3">
          <span class="text-2xl">🎯</span>
          <div class="flex-1">
            <h2 class="font-bold text-lg text-purple-200">Visão Geral do seu Progresso</h2>
            <p class="text-sm text-slate-300">Métricas principais organizadas por importância - Role para ver ações rápidas e insights detalhados</p>
          </div>
          <button onclick="toggleDashboardHelp()" class="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm font-semibold transition-colors" title="Atalhos: D=Dashboard, T=Treino, N=Nutrição">
            ❓ Ajuda
          </button>
        </div>
      </div>

      <!-- Collapsible Help Panel (Progressive Disclosure Principle) -->
      <div id="dashboardHelpPanel" class="hidden bg-slate-800/90 border-2 border-yellow-500/50 rounded-xl p-5">
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">💡</span>
            <h3 class="font-bold text-lg text-yellow-300">Como usar este painel?</h3>
          </div>
          <button onclick="toggleDashboardHelp()" class="text-slate-400 hover:text-white text-xl">✕</button>
        </div>
        <div class="grid md:grid-cols-2 gap-4 text-sm">
          <div class="space-y-2">
            <p class="font-semibold text-slate-200">📊 Métricas Principais:</p>
            <ul class="text-slate-300 space-y-1 ml-4">
              <li>• <strong>Peso</strong>: Métrica primária no topo-esquerda</li>
              <li>• <strong>Tendências</strong>: Ícones 📈📉 mostram mudanças</li>
              <li>• Passe o mouse sobre valores para mais detalhes</li>
            </ul>
          </div>
          <div class="space-y-2">
            <p class="font-semibold text-slate-200">⚡ Atalhos de Teclado:</p>
            <ul class="text-slate-300 space-y-1 ml-4">
              <li>• <kbd class="px-2 py-1 bg-slate-700 rounded text-xs">D</kbd> = Dashboard</li>
              <li>• <kbd class="px-2 py-1 bg-slate-700 rounded text-xs">T</kbd> = Treino</li>
              <li>• <kbd class="px-2 py-1 bg-slate-700 rounded text-xs">N</kbd> = Nutrição</li>
            </ul>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-400 italic">
          📚 Design baseado em: "Usability Evaluation of Dashboards" (2023) - SUS Target: >80/100
        </div>
      </div>

      <!-- Primary Metrics (Top-Left Position for Maximum Visibility - Nielsen's Heuristics) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- PRIMARY METRIC: Weight (Largest, Top-Left) -->
        <div class="md:col-span-1 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-shadow" 
             title="${weightTrend.description}">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="text-blue-200 text-xs uppercase tracking-wide">Peso Atual</p>
              <p class="text-blue-300 text-xs mt-1">Métrica Principal</p>
            </div>
            <span class="${weightTrend.color} text-2xl" title="${weightTrend.description}">${weightTrend.icon}</span>
          </div>
          <p class="text-6xl font-bold mb-2">${latest.weight}</p>
          <p class="text-blue-200 text-sm mb-4">quilogramas</p>
          <div class="mt-4 pt-4 border-t border-blue-400/30">
            <div class="flex justify-between text-xs text-blue-200 mb-2">
              <span>Meta: ${user.goals?.weight || 'Não definida'} kg</span>
              <span class="font-bold">${weightProgress.toFixed(0)}%</span>
            </div>
            <div class="w-full bg-blue-900/50 rounded-full h-2.5 mb-2">
              <div class="bg-blue-300 h-2.5 rounded-full transition-all duration-500 ease-out" style="width: ${weightProgress}%"></div>
            </div>
            <div class="flex items-center justify-between">
              <p class="text-xs text-blue-300 font-semibold">${weightTrend.text}</p>
              <button onclick="state.activeTab='evolucao'; render();" class="text-xs bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded transition-colors">
                Ver Histórico
              </button>
            </div>
          </div>
        </div>
        
        <!-- SECONDARY METRICS: Body Composition (Hierarchical Grouping) -->
        <div class="grid grid-cols-2 gap-4 md:col-span-2">
          <!-- Body Fat with Contextual Info -->
          <div class="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-5 hover:shadow-lg transition-shadow" 
               title="${bodyFatTrend.description}">
            <div class="flex justify-between items-start mb-2">
              <div>
                <p class="text-red-200 text-xs uppercase tracking-wide">Gordura</p>
                <p class="text-red-300 text-xs">↓ Menor é melhor</p>
              </div>
              <span class="${bodyFatTrend.color} text-xl">${bodyFatTrend.icon}</span>
            </div>
            <p class="text-5xl font-bold">${latest.bodyFat}%</p>
            <p class="text-xs text-red-300 mt-2 font-semibold">${bodyFatTrend.text}</p>
          </div>
          
          <!-- Muscle Mass with Goal Progress -->
          <div class="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-5 hover:shadow-lg transition-shadow" 
               title="${muscleTrend.description}">
            <div class="flex justify-between items-start mb-2">
              <div>
                <p class="text-green-200 text-xs uppercase tracking-wide">Massa Muscular</p>
                <p class="text-green-300 text-xs">↑ Maior é melhor</p>
              </div>
              <span class="${muscleTrend.color} text-xl">${muscleTrend.icon}</span>
            </div>
            <p class="text-5xl font-bold">${latest.muscleMass}</p>
            <p class="text-xs text-green-200 mb-1">kg</p>
            <p class="text-xs text-green-300 font-semibold">${muscleTrend.text}</p>
          </div>
          
          <!-- Metabolism (BMR) -->
          <div class="bg-gradient-to-br from-yellow-600 to-amber-700 rounded-2xl p-5 hover:shadow-lg transition-shadow" 
               title="Taxa Metabólica Basal - Calorias queimadas em repouso">
            <div class="flex justify-between items-start mb-2">
              <p class="text-yellow-200 text-xs uppercase tracking-wide">Metabolismo</p>
              <span class="text-xl">🔥</span>
            </div>
            <p class="text-4xl font-bold">${latest.bmr || '-'}</p>
            <p class="text-xs text-yellow-200 mb-1">kcal/dia</p>
            <p class="text-xs text-yellow-300">Taxa basal</p>
          </div>
          
          <!-- Hydration Status -->
          <div class="bg-gradient-to-br from-cyan-600 to-sky-700 rounded-2xl p-5 hover:shadow-lg transition-shadow" 
               title="Percentual de água corporal - Importante para performance">
            <div class="flex justify-between items-start mb-2">
              <p class="text-cyan-200 text-xs uppercase tracking-wide">Hidratação</p>
              <span class="text-xl">💧</span>
            </div>
            <p class="text-4xl font-bold">${latest.waterWeight || 0}</p>
            <p class="text-xs text-cyan-200 mb-1">kg (${latest.waterPercent || 0}%)</p>
            <p class="text-xs text-cyan-300">Água corporal</p>
          </div>
        </div>
      </div>
      
      <!-- Situational Awareness: Weekly Performance (Dynamic Data Visualization) -->
      <div class="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 p-6 rounded-2xl border-2 border-purple-500/40 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <span class="text-3xl">💡</span>
            <div>
              <h3 class="text-2xl font-bold text-purple-200">Performance esta Semana</h3>
              <p class="text-sm text-purple-300">Seus números comparados com as últimas 4 semanas</p>
            </div>
          </div>
          <button onclick="togglePeriodComparison()" class="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm font-semibold transition-colors" title="Ver comparação de períodos">
            📊 Comparar
          </button>
        </div>
        <div class="grid md:grid-cols-3 gap-4">
          <!-- Training Frequency Card -->
          <div class="bg-black/30 backdrop-blur-sm p-5 rounded-xl border border-purple-400/20">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm text-purple-200 font-semibold">Treinos (7 dias)</p>
              <span class="text-xl">🏋️</span>
            </div>
            <p class="text-4xl font-bold mb-2">${weeklyFrequency}</p>
            <div class="flex items-center justify-between text-xs">
              <p class="text-purple-300">${weeklyFrequency >= 3 ? '✅ Ótimo ritmo!' : weeklyFrequency >= 2 ? '⚠️ Bom, mas pode melhorar' : '❌ Abaixo da meta'}</p>
              <p class="text-purple-400">Meta: 3-5/sem</p>
            </div>
            <div class="mt-3 pt-3 border-t border-purple-400/20">
              <p class="text-xs text-purple-300">Média 30 dias: <span class="font-bold">${monthlyAverage}</span>/sem</p>
            </div>
          </div>
          
          <!-- Volume Card -->
          <div class="bg-black/30 backdrop-blur-sm p-5 rounded-xl border border-purple-400/20">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm text-purple-200 font-semibold">Volume Total</p>
              <span class="text-xl">💪</span>
            </div>
            <p class="text-4xl font-bold mb-2">${Math.round(weeklyVolume)}</p>
            <div class="flex items-center justify-between text-xs">
              <p class="text-purple-300">kg levantados</p>
              <p class="text-purple-400">Esta semana</p>
            </div>
            <div class="mt-3 pt-3 border-t border-purple-400/20">
              <p class="text-xs text-purple-300">Consistência é fundamental para hipertrofia</p>
            </div>
          </div>
          
          <!-- Next Measurement Reminder -->
          <div class="bg-black/30 backdrop-blur-sm p-5 rounded-xl border border-purple-400/20">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm text-purple-200 font-semibold">Próxima Medição</p>
              <span class="text-xl">📏</span>
            </div>
            <p class="text-4xl font-bold mb-2">${bodyMetrics.length > 0 ? Math.max(0, 7 - daysSinceLastMeasurement) : '-'}</p>
            <div class="flex items-center justify-between text-xs">
              <p class="text-purple-300">${bodyMetrics.length > 0 && daysSinceLastMeasurement >= 7 ? '⏰ Fazer hoje!' : 'dias restantes'}</p>
              <p class="text-purple-400">Recomendado: 7d</p>
            </div>
            <div class="mt-3 pt-3 border-t border-purple-400/20">
              <button onclick="state.activeTab='evolucao'; render();" class="w-full bg-purple-600 hover:bg-purple-500 px-3 py-2 rounded text-xs font-semibold transition-colors">
                Adicionar Medida Agora
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Evidence-Based Recommendations (Contextual Help) -->
      <div class="bg-slate-800/70 backdrop-blur-sm p-6 rounded-2xl border-2 border-slate-600">
        <div class="flex items-start gap-4">
          <span class="text-5xl">📚</span>
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-slate-200 mb-3">Recomendações Personalizadas</h3>
            <p class="text-slate-300 text-sm mb-4">${notes || 'Recomendações baseadas nos seus dados e metas de composição corporal.'}</p>
            
            <!-- Personalized Recommendations Grid -->
            <div class="grid md:grid-cols-2 gap-4">
              <!-- Protein Intake Recommendation -->
              <div class="bg-slate-700/60 p-4 rounded-xl border border-slate-600">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-2xl">💪</span>
                  <p class="text-xs text-slate-400 font-semibold uppercase tracking-wide">Proteína Diária</p>
                </div>
                <p class="text-2xl font-bold text-green-400 mb-1">${Math.round(latest.weight * 1.8)} - ${Math.round(latest.weight * 2.2)}g</p>
                <p class="text-xs text-slate-400 mb-3">1.8-2.2g/kg de peso corporal</p>
                <span class="text-green-400 text-xs">✓ Hipertrofia otimizada</span>
              </div>
              
              <!-- Caloric Adjustment Recommendation -->
              <div class="bg-slate-700/60 p-4 rounded-xl border border-slate-600">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-2xl">🔥</span>
                  <p class="text-xs text-slate-400 font-semibold uppercase tracking-wide">Ajuste Calórico</p>
                </div>
                <p class="text-2xl font-bold text-orange-400 mb-1">${user.goals?.weight > latest.weight ? '+300 a +500' : '-300 a -500'} kcal</p>
                <p class="text-xs text-slate-400 mb-3">Déficit/Superávit recomendado</p>
                <span class="text-orange-400 text-xs">✓ ${user.goals?.weight > latest.weight ? 'Ganho' : 'Perda'} saudável</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Quick Actions with Keyboard Shortcuts (Task Facilitation) -->
      <div class="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl border-2 border-slate-700 shadow-lg">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-2xl font-bold flex items-center gap-2">
            <span>⚡</span>
            Ações Rápidas
          </h3>
          <p class="text-xs text-slate-400">Use os atalhos de teclado para navegação rápida</p>
        </div>
        <div class="grid md:grid-cols-4 gap-4">
          <!-- Training Action -->
          <button onclick="state.activeTab='treino'; render();" 
                  class="group bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 p-5 rounded-xl text-left transition-all transform hover:scale-105 shadow-md hover:shadow-xl">
            <div class="flex items-center justify-between mb-3">
              <p class="text-3xl">🏋️</p>
              <kbd class="bg-purple-800 text-purple-200 px-2 py-1 rounded text-xs font-mono">T</kbd>
            </div>
            <p class="font-bold text-lg mb-1">Registrar Treino</p>
            <p class="text-xs text-purple-200 opacity-90">Adicione exercícios e series</p>
            <div class="mt-3 pt-3 border-t border-purple-400/30 text-xs text-purple-200">
              <span class="opacity-75">Último: ${recentWorkouts.length > 0 ? 'há ' + Math.floor((now - new Date(recentWorkouts[recentWorkouts.length - 1].date)) / (1000 * 60 * 60 * 24)) + 'd' : 'Nunca'}</span>
            </div>
          </button>
          
          <!-- Nutrition Action -->
          <button onclick="state.activeTab='alimentacao'; render();" 
                  class="group bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 p-5 rounded-xl text-left transition-all transform hover:scale-105 shadow-md hover:shadow-xl">
            <div class="flex items-center justify-between mb-3">
              <p class="text-3xl">🍽️</p>
              <kbd class="bg-green-800 text-green-200 px-2 py-1 rounded text-xs font-mono">N</kbd>
            </div>
            <p class="font-bold text-lg mb-1">Registrar Refeição</p>
            <p class="text-xs text-green-200 opacity-90">Log de nutrição diária</p>
            <div class="mt-3 pt-3 border-t border-green-400/30 text-xs text-green-200">
              <span class="opacity-75">Meta: ${Math.round(latest.weight * 2)}g proteína</span>
            </div>
          </button>
          
          <!-- Measurements Action -->
          <button onclick="state.activeTab='evolucao'; render();" 
                  class="group bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 p-5 rounded-xl text-left transition-all transform hover:scale-105 shadow-md hover:shadow-xl">
            <div class="flex items-center justify-between mb-3">
              <p class="text-3xl">📊</p>
              <kbd class="bg-blue-800 text-blue-200 px-2 py-1 rounded text-xs font-mono">E</kbd>
            </div>
            <p class="font-bold text-lg mb-1">Adicionar Medidas</p>
            <p class="text-xs text-blue-200 opacity-90">Bioimpedância completa</p>
            <div class="mt-3 pt-3 border-t border-blue-400/30 text-xs text-blue-200">
              <span class="opacity-75">${daysSinceLastMeasurement < 7 ? 'Próxima: ' + (7 - daysSinceLastMeasurement) + 'd' : 'Atrasada!'}</span>
            </div>
          </button>
          
          <!-- Progress Photos Action -->
          <button onclick="state.activeTab='fotos'; render();" 
                  class="group bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 p-5 rounded-xl text-left transition-all transform hover:scale-105 shadow-md hover:shadow-xl">
            <div class="flex items-center justify-between mb-3">
              <p class="text-3xl">📸</p>
              <kbd class="bg-orange-800 text-orange-200 px-2 py-1 rounded text-xs font-mono">F</kbd>
            </div>
            <p class="font-bold text-lg mb-1">Foto Progresso</p>
            <p class="text-xs text-orange-200 opacity-90">Acompanhamento visual</p>
            <div class="mt-3 pt-3 border-t border-orange-400/30 text-xs text-orange-200">
              <span class="opacity-75">Consistência é chave</span>
            </div>
          </button>
        </div>
      </div>
      
      <!-- Dashboard Usability Footer (Research Attribution) -->
      <div class="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-center">
        <p class="text-xs text-slate-400">
          🎓 <strong>Dashboard Design Research-Based</strong> | 
          Baseado em: Usability Evaluation (2023), Effective Dashboards (2025), Behavioral Indicators (2025) | 
          Target: SUS >80, Task Time <10min, Error Rate <5%
        </p>
      </div>
    </div>
  `;
}
