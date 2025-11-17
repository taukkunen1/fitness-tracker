/**
 * @fileoverview UI Components Module
 * @module components/ui
 * 
 * Rendering functions for various UI pages and components
 */

/* UI rendering functions */
function renderEvolucao(bodyMetrics, user) {
  const workoutLogs = user.workoutLogs || [];
  
  return `
    <!-- Sub-navigation tabs for Evolution page -->
    <div class="bg-slate-800 p-4 rounded mb-4">
      <div class="flex gap-2 border-b border-slate-700 pb-2">
        <button onclick="switchEvolucaoTab('body-metrics')" id="evolucaoTabBodyMetrics" class="px-4 py-2 rounded-t font-semibold bg-purple-600 text-white">
          📊 Medidas Corporais
        </button>
        <button onclick="switchEvolucaoTab('workouts')" id="evolucaoTabWorkouts" class="px-4 py-2 rounded-t font-semibold bg-slate-700 text-slate-300 hover:bg-slate-600">
          🏃 Treinos
        </button>
      </div>
    </div>

    <!-- Body Metrics Section -->
    <div id="evolucaoContentBodyMetrics">
      <div class="bg-slate-800 p-4 rounded mb-6">
        <h3 class="font-bold text-xl mb-4">📊 Adicionar Medidas de Bioimpedância Completa</h3>
        <p class="text-slate-300 text-sm mb-4">Preencha todos os campos disponíveis do seu equipamento de bioimpedância. Os campos obrigatórios são marcados com *. Os demais são opcionais mas recomendados para análise completa.</p>
      
      <form id="metricsForm" class="space-y-4">
        <!-- Informações Básicas -->
        <div class="bg-slate-700 p-4 rounded">
          <h4 class="font-semibold mb-3 text-purple-300">📅 Informações Básicas</h4>
          <div class="grid md:grid-cols-4 gap-3">
            <input type="date" name="date" value="${new Date().toISOString().split('T')[0]}" required class="px-3 py-2 rounded bg-slate-600 text-white" title="Data da medição"/>
            <input type="number" name="weight" step="0.01" required placeholder="Peso (kg)*" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="bodyFat" step="0.1" required placeholder="Gordura Corporal (%)*" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="muscleMass" step="0.1" required placeholder="Massa Muscular (kg)*" class="px-3 py-2 rounded bg-slate-600 text-white"/>
          </div>
        </div>

        <!-- Composição Corporal Avançada -->
        <div class="bg-slate-700 p-4 rounded">
          <h4 class="font-semibold mb-3 text-green-300">🧬 Composição Corporal Avançada</h4>
          <div class="grid md:grid-cols-4 gap-3">
            <input type="number" name="visceralFat" step="0.1" placeholder="Gordura Visceral" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="waterPercent" step="0.1" placeholder="Água Corporal (%)" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="boneMass" step="0.1" placeholder="Massa Óssea (kg)" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="proteinMass" step="0.1" placeholder="Proteína (kg)" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="mineralMass" step="0.1" placeholder="Minerais (kg)" class="px-3 py-2 rounded bg-slate-600 text-white"/>
          </div>
        </div>

        <!-- Massa Muscular Segmentada -->
        <div class="bg-slate-700 p-4 rounded">
          <h4 class="font-semibold mb-3 text-blue-300">💪 Massa Muscular Segmentada (kg)</h4>
          <div class="grid md:grid-cols-5 gap-3">
            <input type="number" name="muscleMassRightArm" step="0.1" placeholder="Braço Direito" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="muscleMassLeftArm" step="0.1" placeholder="Braço Esquerdo" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="muscleMassRightLeg" step="0.1" placeholder="Perna Direita" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="muscleMassLeftLeg" step="0.1" placeholder="Perna Esquerda" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="muscleMassTrunk" step="0.1" placeholder="Tronco" class="px-3 py-2 rounded bg-slate-600 text-white"/>
          </div>
        </div>

        <!-- Gordura Corporal Segmentada -->
        <div class="bg-slate-700 p-4 rounded">
          <h4 class="font-semibold mb-3 text-red-300">🔥 Gordura Corporal Segmentada (%)</h4>
          <div class="grid md:grid-cols-5 gap-3">
            <input type="number" name="bodyFatRightArm" step="0.1" placeholder="Braço Direito" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="bodyFatLeftArm" step="0.1" placeholder="Braço Esquerdo" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="bodyFatRightLeg" step="0.1" placeholder="Perna Direita" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="bodyFatLeftLeg" step="0.1" placeholder="Perna Esquerda" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="bodyFatTrunk" step="0.1" placeholder="Tronco" class="px-3 py-2 rounded bg-slate-600 text-white"/>
          </div>
        </div>

        <!-- Taxas Metabólicas -->
        <div class="bg-slate-700 p-4 rounded">
          <h4 class="font-semibold mb-3 text-orange-300">⚡ Taxas Metabólicas (kcal/dia)</h4>
          <div class="grid md:grid-cols-3 gap-3">
            <input type="number" name="bmr" placeholder="TMB - Taxa Metabólica Basal" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="rmr" placeholder="TMR - Taxa Metabólica Repouso" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="tdee" placeholder="TDEE - Gasto Energético Total" class="px-3 py-2 rounded bg-slate-600 text-white"/>
          </div>
        </div>

        <!-- Impedância Bioelétrica (Bioelectrical Impedance Analysis - BIA) -->
        <div class="bg-slate-700 p-4 rounded">
          <h4 class="font-semibold mb-3 text-cyan-300">⚡ Análise de Impedância Bioelétrica (BIA)</h4>
          <div class="grid md:grid-cols-4 gap-3">
            <input type="number" name="impedance" step="0.1" placeholder="Impedância (Ω)" class="px-3 py-2 rounded bg-slate-600 text-white" title="Impedância corporal total a 50kHz"/>
            <input type="number" name="resistance" step="0.1" placeholder="Resistência (Ω)" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="reactance" step="0.1" placeholder="Reatância (Ω)" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="phaseAngle" step="0.1" placeholder="Ângulo de Fase (°)" class="px-3 py-2 rounded bg-slate-600 text-white" title="Indicador de saúde celular (normal: 5-7°)"/>
          </div>
          <p class="text-xs text-slate-400 mt-2">💡 Ângulo de Fase: indicador de saúde celular. Normal: 5-7°. Maior = melhor integridade celular.</p>
        </div>

        <!-- Idades e Índices -->
        <div class="bg-slate-700 p-4 rounded">
          <h4 class="font-semibold mb-3 text-yellow-300">🎂 Idades Metabólica e Corporal</h4>
          <div class="grid md:grid-cols-3 gap-3">
            <input type="number" name="metabolicAge" placeholder="Idade Metabólica (anos)" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="bodyAge" placeholder="Idade Corporal (anos)" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="muscleSize" step="0.1" placeholder="Tamanho Muscular (cm)" class="px-3 py-2 rounded bg-slate-600 text-white"/>
          </div>
        </div>

        <!-- Circunferências Corporais -->
        <div class="bg-slate-700 p-4 rounded">
          <h4 class="font-semibold mb-3 text-pink-300">📏 Circunferências Corporais (cm)</h4>
          <div class="grid md:grid-cols-4 gap-3">
            <input type="number" name="chest" step="0.1" placeholder="Peito" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="waist" step="0.1" placeholder="Cintura" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="abdomen" step="0.1" placeholder="Abdômen" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="hips" step="0.1" placeholder="Quadril" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="shoulders" step="0.1" placeholder="Ombros" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="neck" step="0.1" placeholder="Pescoço" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="rightArm" step="0.1" placeholder="Bíceps Direito" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="leftArm" step="0.1" placeholder="Bíceps Esquerdo" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="rightForearm" step="0.1" placeholder="Antebraço Direito" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="leftForearm" step="0.1" placeholder="Antebraço Esquerdo" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="rightThigh" step="0.1" placeholder="Coxa Direita" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="leftThigh" step="0.1" placeholder="Coxa Esquerda" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="rightCalf" step="0.1" placeholder="Panturrilha Direita" class="px-3 py-2 rounded bg-slate-600 text-white"/>
            <input type="number" name="leftCalf" step="0.1" placeholder="Panturrilha Esquerda" class="px-3 py-2 rounded bg-slate-600 text-white"/>
          </div>
        </div>

        <div class="flex gap-3">
          <button type="submit" class="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded font-semibold text-lg">➕ Adicionar Medição Completa</button>
          <button type="button" onclick="document.getElementById('metricsForm').reset()" class="bg-slate-600 hover:bg-slate-500 px-4 py-3 rounded">🔄 Limpar</button>
        </div>
      </form>
    </div>

    <div class="bg-slate-800 p-4 rounded mb-6">
      <h3 class="font-bold text-xl mb-4">📈 Gráfico de Evolução</h3>
      
      <!-- Profile Selection for Comparison -->
      <div class="bg-slate-700 p-4 rounded mb-4">
        <h4 class="font-semibold mb-3 text-purple-300">👥 Selecionar Perfis para Comparação</h4>
        <div class="space-y-2">
          ${Object.values(state.users).map(u => `
            <label class="flex items-center gap-2 cursor-pointer hover:bg-slate-600 p-2 rounded">
              <input type="checkbox" 
                     id="profileSelect_${u.id}" 
                     onchange="toggleProfileInChart('${u.id}')" 
                     ${u.id === user.id ? 'checked' : ''}
                     class="w-4 h-4 rounded" />
              <span class="text-white">${u.name}</span>
            </label>
          `).join('')}
        </div>
      </div>

      <!-- Metric Filters -->
      <div class="bg-slate-700 p-4 rounded mb-4">
        <h4 class="font-semibold mb-3 text-green-300">📊 Selecionar Métricas para Exibir</h4>
        <div class="grid md:grid-cols-3 gap-3">
          <label class="flex items-center gap-2 cursor-pointer hover:bg-slate-600 p-2 rounded">
            <input type="checkbox" id="metricWeight" onchange="updateEvolutionChart()" checked class="w-4 h-4 rounded" />
            <span class="text-white">Peso (kg)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer hover:bg-slate-600 p-2 rounded">
            <input type="checkbox" id="metricBodyFat" onchange="updateEvolutionChart()" checked class="w-4 h-4 rounded" />
            <span class="text-white">Gordura Corporal (%)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer hover:bg-slate-600 p-2 rounded">
            <input type="checkbox" id="metricMuscleMass" onchange="updateEvolutionChart()" checked class="w-4 h-4 rounded" />
            <span class="text-white">Massa Muscular (kg)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer hover:bg-slate-600 p-2 rounded">
            <input type="checkbox" id="metricBMI" onchange="updateEvolutionChart()" class="w-4 h-4 rounded" />
            <span class="text-white">IMC</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer hover:bg-slate-600 p-2 rounded">
            <input type="checkbox" id="metricWater" onchange="updateEvolutionChart()" class="w-4 h-4 rounded" />
            <span class="text-white">Água Corporal (kg)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer hover:bg-slate-600 p-2 rounded">
            <input type="checkbox" id="metricBMR" onchange="updateEvolutionChart()" class="w-4 h-4 rounded" />
            <span class="text-white">TMB (kcal/dia)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer hover:bg-slate-600 p-2 rounded">
            <input type="checkbox" id="metricPhaseAngle" onchange="updateEvolutionChart()" class="w-4 h-4 rounded" />
            <span class="text-white">Ângulo de Fase (°)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer hover:bg-slate-600 p-2 rounded">
            <input type="checkbox" id="metricMetabolicAge" onchange="updateEvolutionChart()" class="w-4 h-4 rounded" />
            <span class="text-white">Idade Metabólica (anos)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer hover:bg-slate-600 p-2 rounded">
            <input type="checkbox" id="metricMuscleSize" onchange="updateEvolutionChart()" class="w-4 h-4 rounded" />
            <span class="text-white">Tamanho Muscular (cm)</span>
          </label>
        </div>
        <div class="mt-3 flex gap-2">
          <button onclick="selectAllMetrics()" class="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm">✅ Selecionar Todas</button>
          <button onclick="deselectAllMetrics()" class="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded text-sm">❌ Desmarcar Todas</button>
        </div>
      </div>

      <div class="flex gap-3 items-start">
        <div style="flex:1;">
          <canvas id="muscleChart" height="160"></canvas>
        </div>
        <div style="width: 180px;" class="flex flex-col gap-2">
          <button onclick="exportMuscleEvolutionCSV('${user.id}')" class="bg-blue-600 px-3 py-2 rounded">📊 Exportar CSV</button>
          <button onclick="alert('Backup (full DB export) em breve')" class="bg-amber-600 px-3 py-2 rounded">💾 Backup DB</button>
          <div class="text-slate-300 text-sm mt-2">Gráfico de evolução comparativa com múltiplos perfis e métricas.</div>
        </div>
      </div>

      <div class="overflow-x-auto mt-4">
        <table class="w-full text-sm">
          <thead><tr class="border-b border-slate-600">
            <th class="py-2 px-2">Data</th>
            <th>Peso</th>
            <th>Gordura</th>
            <th>Massa Musc.</th>
            <th>IMC</th>
            <th>Água</th>
            <th>BMR</th>
            <th>Ângulo Fase</th>
            <th>Idade Met.</th>
            <th>Ações</th>
          </tr></thead>
          <tbody>
            ${bodyMetrics.slice().reverse().map(m => `
              <tr class="border-b border-slate-700 hover:bg-slate-700">
                <td class="py-2 px-2">${m.date}</td>
                <td class="py-2 px-2">${m.weight}kg</td>
                <td class="py-2 px-2">${m.bodyFat}%</td>
                <td class="py-2 px-2">${m.muscleMass}kg</td>
                <td class="py-2 px-2">${m.bmi || '-'}</td>
                <td class="py-2 px-2">${m.waterWeight || 0}kg</td>
                <td class="py-2 px-2">${m.bmr || '-'}</td>
                <td class="py-2 px-2">${m.phaseAngle ? m.phaseAngle + '°' : '-'}</td>
                <td class="py-2 px-2">${m.metabolicAge ? m.metabolicAge + 'a' : '-'}</td>
                <td class="py-2 px-2">
                  <button onclick="handleDeleteMetric('${m.id}')" class="text-red-400 hover:text-red-300" title="Excluir e mover para archive">🗑️</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      ${bodyMetrics.length > 0 ? `
        <div class="mt-6 bg-slate-700 p-4 rounded">
          <h4 class="font-semibold mb-3">📈 Métricas Detalhadas da Última Medição</h4>
          ${(() => {
            const latest = bodyMetrics[bodyMetrics.length - 1];
            return `
              <div class="grid md:grid-cols-3 gap-4 text-sm">
                ${latest.muscleMassRightArm ? `
                  <div class="bg-slate-800 p-3 rounded">
                    <p class="text-slate-400 text-xs mb-2">💪 Massa Muscular Segmentada</p>
                    <p>Braço D: ${latest.muscleMassRightArm}kg | E: ${latest.muscleMassLeftArm}kg</p>
                    <p>Perna D: ${latest.muscleMassRightLeg}kg | E: ${latest.muscleMassLeftLeg}kg</p>
                    <p>Tronco: ${latest.muscleMassTrunk}kg</p>
                  </div>
                ` : ''}
                ${latest.bodyFatRightArm ? `
                  <div class="bg-slate-800 p-3 rounded">
                    <p class="text-slate-400 text-xs mb-2">🔥 Gordura Segmentada</p>
                    <p>Braço D: ${latest.bodyFatRightArm}% | E: ${latest.bodyFatLeftArm}%</p>
                    <p>Perna D: ${latest.bodyFatRightLeg}% | E: ${latest.bodyFatLeftLeg}%</p>
                    <p>Tronco: ${latest.bodyFatTrunk}%</p>
                  </div>
                ` : ''}
                ${latest.boneMass ? `
                  <div class="bg-slate-800 p-3 rounded">
                    <p class="text-slate-400 text-xs mb-2">🧬 Composição Avançada</p>
                    <p>Massa Óssea: ${latest.boneMass}kg</p>
                    <p>Proteína: ${latest.proteinMass}kg</p>
                    <p>Minerais: ${latest.mineralMass}kg</p>
                  </div>
                ` : ''}
                ${latest.phaseAngle ? `
                  <div class="bg-slate-800 p-3 rounded">
                    <p class="text-slate-400 text-xs mb-2">⚡ BIA - Impedância</p>
                    <p>Ângulo de Fase: ${latest.phaseAngle}°</p>
                    <p>Impedância: ${latest.impedance}Ω</p>
                    <p>Resistência: ${latest.resistance}Ω</p>
                  </div>
                ` : ''}
                ${latest.chest ? `
                  <div class="bg-slate-800 p-3 rounded">
                    <p class="text-slate-400 text-xs mb-2">📏 Circunferências (cm)</p>
                    <p>Peito: ${latest.chest} | Cintura: ${latest.waist}</p>
                    ${latest.abdomen ? `<p>Abdômen: ${latest.abdomen} | Quadril: ${latest.hips}</p>` : `<p>Quadril: ${latest.hips}</p>`}
                    <p>Ombro: ${latest.shoulders} | Pescoço: ${latest.neck}</p>
                    <p>Bíceps D: ${latest.rightArm} | E: ${latest.leftArm}</p>
                    ${latest.rightForearm ? `<p>Antebraço D: ${latest.rightForearm} | E: ${latest.leftForearm}</p>` : ''}
                    <p>Coxa D: ${latest.rightThigh} | E: ${latest.leftThigh}</p>
                    <p>Panturrilha D: ${latest.rightCalf} | E: ${latest.leftCalf}</p>
                  </div>
                ` : ''}
                ${latest.tdee ? `
                  <div class="bg-slate-800 p-3 rounded">
                    <p class="text-slate-400 text-xs mb-2">⚡ Taxas Metabólicas</p>
                    <p>TMB: ${latest.bmr} kcal/dia</p>
                    <p>TMR: ${latest.rmr} kcal/dia</p>
                    <p>TDEE: ${latest.tdee} kcal/dia</p>
                  </div>
                ` : ''}
              </div>
            `;
          })()}
        </div>
      ` : ''}
    </div>
    </div>

    <!-- Workouts Section -->
    <div id="evolucaoContentWorkouts" class="hidden">
      <!-- Manual Workout Entry Form -->
      <div class="bg-slate-800 p-4 rounded mb-6">
        <h3 class="font-bold text-xl mb-4">🏃 Registrar Treino Manual</h3>
        <p class="text-slate-300 text-sm mb-4">Adicione um treino manualmente ou aguarde sincronização futura via smartwatch.</p>
        
        <form id="workoutForm" onsubmit="handleWorkoutFormSubmit(event); return false;" class="space-y-4">
          <!-- Basic Info -->
          <div class="bg-slate-700 p-4 rounded">
            <h4 class="font-semibold mb-3 text-purple-300">📅 Informações Básicas</h4>
            <div class="grid md:grid-cols-2 gap-3">
              <div>
                <label class="block text-sm text-slate-300 mb-1">Nome do Treino *</label>
                <input type="text" name="workoutName" required placeholder="Ex: Corrida Matinal" class="w-full px-3 py-2 rounded bg-slate-600 text-white"/>
              </div>
              <div>
                <label class="block text-sm text-slate-300 mb-1">Tipo de Treino *</label>
                <select name="workoutType" required class="w-full px-3 py-2 rounded bg-slate-600 text-white">
                  <option value="">Selecione...</option>
                  <option value="corrida">🏃 Corrida</option>
                  <option value="caminhada">🚶 Caminhada</option>
                  <option value="ciclismo">🚴 Ciclismo</option>
                  <option value="natacao">🏊 Natação</option>
                  <option value="musculacao">💪 Musculação</option>
                  <option value="crossfit">🏋️ CrossFit</option>
                  <option value="yoga">🧘 Yoga</option>
                  <option value="pilates">🤸 Pilates</option>
                  <option value="funcional">⚡ Treino Funcional</option>
                  <option value="lutas">🥋 Lutas/Artes Marciais</option>
                  <option value="danca">💃 Dança</option>
                  <option value="outro">📋 Outro</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Date and Time -->
          <div class="bg-slate-700 p-4 rounded">
            <h4 class="font-semibold mb-3 text-green-300">⏰ Data e Horário</h4>
            <div class="grid md:grid-cols-4 gap-3">
              <div>
                <label class="block text-sm text-slate-300 mb-1">Data *</label>
                <input type="date" name="workoutDate" value="${new Date().toISOString().split('T')[0]}" required class="w-full px-3 py-2 rounded bg-slate-600 text-white"/>
              </div>
              <div>
                <label class="block text-sm text-slate-300 mb-1">Hora de Início *</label>
                <input type="time" name="startTime" required class="w-full px-3 py-2 rounded bg-slate-600 text-white"/>
              </div>
              <div>
                <label class="block text-sm text-slate-300 mb-1">Hora de Término *</label>
                <input type="time" name="endTime" required class="w-full px-3 py-2 rounded bg-slate-600 text-white"/>
              </div>
              <div>
                <label class="block text-sm text-slate-300 mb-1">Duração (minutos)</label>
                <input type="number" name="duration" placeholder="Auto-calculado" readonly class="w-full px-3 py-2 rounded bg-slate-500 text-slate-300"/>
              </div>
            </div>
          </div>

          <!-- Workout Metrics -->
          <div class="bg-slate-700 p-4 rounded">
            <h4 class="font-semibold mb-3 text-red-300">📈 Métricas do Treino</h4>
            <div class="grid md:grid-cols-3 gap-3">
              <div>
                <label class="block text-sm text-slate-300 mb-1">Calorias Gastas (kcal) *</label>
                <input type="number" name="calories" step="0.1" required placeholder="Ex: 350" class="w-full px-3 py-2 rounded bg-slate-600 text-white"/>
              </div>
              <div>
                <label class="block text-sm text-slate-300 mb-1">BPM Médio</label>
                <input type="number" name="avgHeartRate" placeholder="Ex: 140" class="w-full px-3 py-2 rounded bg-slate-600 text-white"/>
              </div>
              <div>
                <label class="block text-sm text-slate-300 mb-1">BPM Máximo</label>
                <input type="number" name="maxHeartRate" placeholder="Ex: 175" class="w-full px-3 py-2 rounded bg-slate-600 text-white"/>
              </div>
              <div>
                <label class="block text-sm text-slate-300 mb-1">Distância (km)</label>
                <input type="number" name="distance" step="0.01" placeholder="Ex: 5.2" class="w-full px-3 py-2 rounded bg-slate-600 text-white"/>
              </div>
              <div>
                <label class="block text-sm text-slate-300 mb-1">Velocidade Média (km/h)</label>
                <input type="number" name="avgSpeed" step="0.1" placeholder="Ex: 10.5" class="w-full px-3 py-2 rounded bg-slate-600 text-white"/>
              </div>
              <div>
                <label class="block text-sm text-slate-300 mb-1">Intensidade</label>
                <select name="intensity" class="w-full px-3 py-2 rounded bg-slate-600 text-white">
                  <option value="">Não informado</option>
                  <option value="baixa">🟢 Baixa</option>
                  <option value="moderada">🟡 Moderada</option>
                  <option value="alta">🟠 Alta</option>
                  <option value="maxima">🔴 Máxima</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Additional Notes -->
          <div class="bg-slate-700 p-4 rounded">
            <h4 class="font-semibold mb-3 text-blue-300">📝 Observações</h4>
            <textarea name="notes" rows="3" placeholder="Adicione notas sobre o treino, como você se sentiu, pontos de atenção, etc." class="w-full px-3 py-2 rounded bg-slate-600 text-white"></textarea>
          </div>

          <div class="flex gap-3">
            <button type="submit" class="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded font-semibold text-lg">➕ Registrar Treino</button>
            <button type="button" onclick="document.getElementById('workoutForm').reset()" class="bg-slate-600 hover:bg-slate-500 px-4 py-3 rounded">🔄 Limpar</button>
          </div>
        </form>
      </div>

      <!-- Hevy Import Section -->
      <div class="bg-gradient-to-r from-green-900 to-teal-900 p-4 rounded mb-6 border border-green-500">
        <h4 class="font-bold text-lg mb-2">📥 Importar Treinos do Hevy</h4>
        <p class="text-sm text-green-200 mb-3">
          Importe seus treinos exportados do aplicativo Hevy Training. O sistema irá processar automaticamente os exercícios, séries, repetições e cargas.
        </p>
        <div class="flex gap-3 items-center">
          <input type="file" id="hevyCsvInput" accept=".csv" class="hidden" onchange="handleHevyCsvImport(event)" />
          <button onclick="document.getElementById('hevyCsvInput').click()" class="bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-semibold">
            📂 Selecionar Arquivo CSV
          </button>
          <span id="hevyImportStatus" class="text-sm text-green-300"></span>
        </div>
        <p class="text-xs text-green-300 mt-3">
          💡 Formato esperado: CSV exportado do Hevy com colunas title, start_time, end_time, exercise_title, set_index, weight_kg, reps, etc.
        </p>
      </div>

      <!-- Smartwatch Sync Notice -->
      <div class="bg-gradient-to-r from-blue-900 to-purple-900 p-4 rounded mb-6 border border-blue-500">
        <h4 class="font-bold text-lg mb-2">⌚ Sincronização via Smartwatch</h4>
        <p class="text-sm text-blue-200 mb-3">
          Sincronização automática de treinos via smartwatch (Apple Watch, Garmin, Fitbit, etc.) estará disponível em breve!
          Por enquanto, você pode adicionar treinos manualmente usando o formulário acima.
        </p>
        <p class="text-xs text-blue-300">
          💡 Recursos futuros: sincronização automática de BPM ao longo do treino, calorias em tempo real, GPS tracking, e muito mais!
        </p>
      </div>

      <!-- Workout Charts -->
      ${workoutLogs.length > 0 ? `
        <div class="bg-slate-800 p-4 rounded mb-6">
          <h3 class="font-bold text-xl mb-4">📊 Gráficos de Treino</h3>
          
          <div class="grid md:grid-cols-2 gap-4 mb-4">
            <!-- Calories Over Time Chart -->
            <div class="bg-slate-700 p-4 rounded">
              <h4 class="font-semibold mb-3 text-center">🔥 Calorias por Treino</h4>
              <canvas id="workoutCaloriesChart" height="200"></canvas>
            </div>
            
            <!-- Duration Over Time Chart -->
            <div class="bg-slate-700 p-4 rounded">
              <h4 class="font-semibold mb-3 text-center">⏱️ Duração dos Treinos</h4>
              <canvas id="workoutDurationChart" height="200"></canvas>
            </div>
          </div>

          <!-- Heart Rate Chart (if data available) -->
          ${workoutLogs.some(w => w.avgHeartRate) ? `
            <div class="bg-slate-700 p-4 rounded mb-4">
              <h4 class="font-semibold mb-3 text-center">❤️ Frequência Cardíaca Média</h4>
              <canvas id="workoutHeartRateChart" height="200"></canvas>
            </div>
          ` : ''}

          <div class="flex gap-3">
            <button onclick="exportWorkoutLogsCSV('${user.id}')" class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded">📊 Exportar CSV</button>
          </div>
        </div>
      ` : ''}

      <!-- Workout Logs Table -->
      <div class="bg-slate-800 p-4 rounded mb-6">
        <h3 class="font-bold text-xl mb-4">📋 Histórico de Treinos</h3>
        
        ${workoutLogs.length === 0 ? `
          <p class="text-slate-400 text-center py-8">Nenhum treino registrado ainda. Use o formulário acima para adicionar seu primeiro treino!</p>
        ` : `
          <!-- Summary Stats -->
          <div class="grid md:grid-cols-4 gap-4 mb-6">
            <div class="bg-gradient-to-br from-purple-900 to-purple-800 p-4 rounded">
              <p class="text-sm text-purple-300">Total de Treinos</p>
              <p class="text-3xl font-bold">${workoutLogs.length}</p>
            </div>
            <div class="bg-gradient-to-br from-red-900 to-red-800 p-4 rounded">
              <p class="text-sm text-red-300">Calorias Totais</p>
              <p class="text-3xl font-bold">${workoutLogs.reduce((sum, w) => sum + (w.calories || 0), 0).toFixed(0)}</p>
              <p class="text-xs text-red-200">kcal</p>
            </div>
            <div class="bg-gradient-to-br from-blue-900 to-blue-800 p-4 rounded">
              <p class="text-sm text-blue-300">Tempo Total</p>
              <p class="text-3xl font-bold">${(workoutLogs.reduce((sum, w) => sum + (w.duration || 0), 0) / 60).toFixed(1)}</p>
              <p class="text-xs text-blue-200">horas</p>
            </div>
            <div class="bg-gradient-to-br from-green-900 to-green-800 p-4 rounded">
              <p class="text-sm text-green-300">Média Semanal</p>
              <p class="text-3xl font-bold">${(workoutLogs.length / Math.max(1, Math.ceil((Date.now() - new Date(workoutLogs[0]?.date).getTime()) / (7 * 24 * 60 * 60 * 1000)))).toFixed(1)}</p>
              <p class="text-xs text-green-200">treinos/semana</p>
            </div>
          </div>

          <!-- Workouts Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-slate-600">
                  <th class="py-2 px-2 text-left">Data</th>
                  <th class="py-2 px-2 text-left">Nome</th>
                  <th class="py-2 px-2 text-left">Tipo</th>
                  <th class="py-2 px-2 text-center">Duração</th>
                  <th class="py-2 px-2 text-center">Calorias</th>
                  <th class="py-2 px-2 text-center">BPM Médio</th>
                  <th class="py-2 px-2 text-center">Intensidade</th>
                  <th class="py-2 px-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                ${workoutLogs.slice().reverse().map(workout => {
                  const intensityEmoji = {
                    'baixa': '🟢',
                    'moderada': '🟡',
                    'alta': '🟠',
                    'maxima': '🔴'
                  }[workout.intensity] || '⚪';
                  
                  const typeEmoji = {
                    'corrida': '🏃',
                    'caminhada': '🚶',
                    'ciclismo': '🚴',
                    'natacao': '🏊',
                    'musculacao': '💪',
                    'crossfit': '🏋️',
                    'yoga': '🧘',
                    'pilates': '🤸',
                    'funcional': '⚡',
                    'lutas': '🥋',
                    'danca': '💃',
                    'outro': '📋'
                  }[workout.type] || '📋';

                  return `
                    <tr class="border-b border-slate-700 hover:bg-slate-700 cursor-pointer" onclick="showWorkoutDetails('${workout.id}')">
                      <td class="py-2 px-2">${workout.date}</td>
                      <td class="py-2 px-2 font-semibold">
                        ${escapeHtml(workout.name)}
                        ${workout.exercises && workout.exercises.length > 0 ? '<span class="text-xs text-green-400 ml-1" title="Inclui detalhes de exercícios">💪</span>' : ''}
                      </td>
                      <td class="py-2 px-2">${typeEmoji} ${workout.type}</td>
                      <td class="py-2 px-2 text-center">${workout.duration} min</td>
                      <td class="py-2 px-2 text-center">${workout.calories} kcal</td>
                      <td class="py-2 px-2 text-center">${workout.avgHeartRate ? workout.avgHeartRate + ' bpm' : '-'}</td>
                      <td class="py-2 px-2 text-center">${intensityEmoji}</td>
                      <td class="py-2 px-2 text-center">
                        <button onclick="event.stopPropagation(); handleDeleteWorkoutLog('${workout.id}')" class="text-red-400 hover:text-red-300" title="Excluir treino">🗑️</button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    </div>
  `;
}

/* ============================= WORKOUT TRACKING FUNCTIONS ============================= */

// Switch between body metrics and workouts tabs
function switchEvolucaoTab(tab) {
  const bodyMetricsTab = document.getElementById('evolucaoTabBodyMetrics');
  const workoutsTab = document.getElementById('evolucaoTabWorkouts');
  const bodyMetricsContent = document.getElementById('evolucaoContentBodyMetrics');
  const workoutsContent = document.getElementById('evolucaoContentWorkouts');

  if (tab === 'body-metrics') {
    bodyMetricsTab.classList.remove('bg-slate-700', 'text-slate-300');
    bodyMetricsTab.classList.add('bg-purple-600', 'text-white');
    workoutsTab.classList.remove('bg-purple-600', 'text-white');
    workoutsTab.classList.add('bg-slate-700', 'text-slate-300');
    bodyMetricsContent.classList.remove('hidden');
    workoutsContent.classList.add('hidden');
  } else if (tab === 'workouts') {
    workoutsTab.classList.remove('bg-slate-700', 'text-slate-300');
    workoutsTab.classList.add('bg-purple-600', 'text-white');
    bodyMetricsTab.classList.remove('bg-purple-600', 'text-white');
    bodyMetricsTab.classList.add('bg-slate-700', 'text-slate-300');
    workoutsContent.classList.remove('hidden');
    bodyMetricsContent.classList.add('hidden');
    
    // Setup form listeners after showing the form
    setTimeout(() => {
      setupWorkoutFormListeners();
      renderWorkoutCharts();
    }, 150);
  }
}

// Chart instances for workouts
let workoutCaloriesChart = null;
let workoutDurationChart = null;
let workoutHeartRateChart = null;

// Render workout charts
function renderWorkoutCharts() {
  // Check if Chart.js is available
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded, skipping workout chart rendering');
    return;
  }
  
  const user = state.users[state.activeUser];
  if (!user || !user.workoutLogs || user.workoutLogs.length === 0) return;

  const workoutLogs = user.workoutLogs.slice().sort((a, b) => new Date(a.date + 'T' + a.startTime) - new Date(b.date + 'T' + b.startTime));

  // Calories Chart
  const caloriesCanvas = document.getElementById('workoutCaloriesChart');
  if (caloriesCanvas) {
    const labels = workoutLogs.map(w => w.date + ' ' + w.name.substring(0, 10));
    const caloriesData = workoutLogs.map(w => w.calories || 0);

    if (workoutCaloriesChart) {
      workoutCaloriesChart.destroy();
      workoutCaloriesChart = null;
    }

    workoutCaloriesChart = new Chart(caloriesCanvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Calorias (kcal)',
          data: caloriesData,
          backgroundColor: '#EF4444',
          borderColor: '#DC2626',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'kcal' }
          }
        }
      }
    });
  }

  // Duration Chart
  const durationCanvas = document.getElementById('workoutDurationChart');
  if (durationCanvas) {
    const labels = workoutLogs.map(w => w.date + ' ' + w.name.substring(0, 10));
    const durationData = workoutLogs.map(w => w.duration || 0);

    if (workoutDurationChart) {
      workoutDurationChart.destroy();
      workoutDurationChart = null;
    }

    workoutDurationChart = new Chart(durationCanvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Duração (minutos)',
          data: durationData,
          backgroundColor: '#3B82F6',
          borderColor: '#2563EB',
          borderWidth: 2,
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'minutos' }
          }
        }
      }
    });
  }

  // Heart Rate Chart (if data available)
  const heartRateCanvas = document.getElementById('workoutHeartRateChart');
  if (heartRateCanvas && workoutLogs.some(w => w.avgHeartRate)) {
    const labels = workoutLogs.filter(w => w.avgHeartRate).map(w => w.date + ' ' + w.name.substring(0, 10));
    const heartRateData = workoutLogs.filter(w => w.avgHeartRate).map(w => w.avgHeartRate);

    if (workoutHeartRateChart) {
      workoutHeartRateChart.destroy();
      workoutHeartRateChart = null;
    }

    workoutHeartRateChart = new Chart(heartRateCanvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'BPM Médio',
          data: heartRateData,
          backgroundColor: '#F59E0B',
          borderColor: '#D97706',
          borderWidth: 2,
          fill: false,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            title: { display: true, text: 'BPM' }
          }
        }
      }
    });
  }
}

// Handle workout form submission
async function handleWorkoutFormSubmit(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const user = state.users[state.activeUser];
  
  if (!user) {
    alert('Erro: usuário não encontrado');
    return;
  }

  // Calculate duration from start and end time
  const startTime = formData.get('startTime');
  const endTime = formData.get('endTime');
  let duration = 0;
  
  if (startTime && endTime) {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    
    if (duration < 0) duration += 24 * 60; // Handle overnight workouts
  }

  // Create workout log
  const workout = {
    id: 'workout_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11),
    date: formData.get('workoutDate'),
    name: sanitizeInput(formData.get('workoutName')),
    type: formData.get('workoutType'),
    startTime: startTime,
    endTime: endTime,
    duration: duration,
    calories: parseFloat(formData.get('calories')) || 0,
    avgHeartRate: formData.get('avgHeartRate') ? parseInt(formData.get('avgHeartRate')) : null,
    maxHeartRate: formData.get('maxHeartRate') ? parseInt(formData.get('maxHeartRate')) : null,
    distance: formData.get('distance') ? parseFloat(formData.get('distance')) : null,
    avgSpeed: formData.get('avgSpeed') ? parseFloat(formData.get('avgSpeed')) : null,
    intensity: formData.get('intensity') || null,
    notes: sanitizeInput(formData.get('notes') || ''),
    createdAt: new Date().toISOString(),
    source: 'manual' // vs 'smartwatch' in the future
  };

  // Add to user's workout logs
  if (!user.workoutLogs) user.workoutLogs = [];
  user.workoutLogs.push(workout);

  // Save to database
  await saveAllToDB();
  
  // Reset form and re-render
  event.target.reset();
  render();
  
  // Switch to workouts tab to show the new workout
  setTimeout(() => switchEvolucaoTab('workouts'), 100);
  
  showNotification('✅ Treino registrado com sucesso!', 'success');
}

// Calculate duration when times change
function setupWorkoutFormListeners() {
  const form = document.getElementById('workoutForm');
  if (!form) return;
  
  const startTimeInput = form.querySelector('[name="startTime"]');
  const endTimeInput = form.querySelector('[name="endTime"]');
  const durationInput = form.querySelector('[name="duration"]');
  
  if (!startTimeInput || !endTimeInput || !durationInput) return;
  
  function updateDuration() {
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    
    if (startTime && endTime) {
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      let duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
      
      if (duration < 0) duration += 24 * 60; // Handle overnight workouts
      
      durationInput.value = duration;
    }
  }
  
  startTimeInput.addEventListener('change', updateDuration);
  endTimeInput.addEventListener('change', updateDuration);
}

// Delete workout log (detailed workout with duration, calories, etc.)
async function handleDeleteWorkoutLog(workoutId) {
  if (!confirm('Deseja realmente excluir este treino?')) return;
  
  const user = state.users[state.activeUser];
  if (!user || !user.workoutLogs) return;
  
  // Find and archive the workout
  const workout = user.workoutLogs.find(w => w.id === workoutId);
  if (workout) {
    await archiveItem('workout', workoutId, 'workout_log', workout);
  }
  
  // Remove from user's workout logs
  user.workoutLogs = user.workoutLogs.filter(w => w.id !== workoutId);
  
  await saveAllToDB();
  render();
  
  showNotification('✅ Treino excluído!', 'success');
}

// Handle Hevy CSV import
async function handleHevyCsvImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const statusEl = document.getElementById('hevyImportStatus');
  statusEl.textContent = '⏳ Processando...';
  
  try {
    const text = await file.text();
    const workouts = parseHevyCsv(text);
    
    if (workouts.length === 0) {
      throw new Error('Nenhum treino encontrado no arquivo CSV');
    }
    
    const user = state.users[state.activeUser];
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    if (!user.workoutLogs) user.workoutLogs = [];
    
    // Add all workouts
    let addedCount = 0;
    workouts.forEach(workout => {
      // Check if workout already exists (by date, startTime and name)
      const exists = user.workoutLogs.some(w => 
        w.date === workout.date && 
        w.startTime === workout.startTime && 
        w.name === workout.name
      );
      
      if (!exists) {
        user.workoutLogs.push(workout);
        addedCount++;
      }
    });
    
    await saveAllToDB();
    render();
    
    statusEl.textContent = `✅ ${addedCount} treino(s) importado(s) com sucesso!`;
    showNotification(`✅ ${addedCount} treino(s) do Hevy importado(s)!`, 'success');
    
    // Clear the file input
    event.target.value = '';
    
    // Switch to workouts view
    setTimeout(() => {
      switchEvolucaoTab('workouts');
      statusEl.textContent = '';
    }, 3000);
    
  } catch (error) {
    console.error('Erro ao importar CSV do Hevy:', error);
    statusEl.textContent = '❌ Erro na importação';
    showNotification('❌ Erro ao importar: ' + error.message, 'error');
    event.target.value = '';
  }
}

// Parse Hevy CSV format
function parseHevyCsv(csvText) {
  const lines = csvText.split('\n');
  if (lines.length < 2) {
    throw new Error('Arquivo CSV vazio ou inválido');
  }
  
  // Parse header
  const header = parseCSVLine(lines[0]);
  const requiredColumns = ['title', 'start_time', 'end_time', 'exercise_title'];
  const hasRequiredColumns = requiredColumns.every(col => header.includes(col));
  
  if (!hasRequiredColumns) {
    throw new Error('Formato CSV inválido. Certifique-se de que é um arquivo exportado do Hevy.');
  }
  
  // Get column indices
  const titleIdx = header.indexOf('title');
  const startTimeIdx = header.indexOf('start_time');
  const endTimeIdx = header.indexOf('end_time');
  const descriptionIdx = header.indexOf('description');
  const exerciseTitleIdx = header.indexOf('exercise_title');
  const setIndexIdx = header.indexOf('set_index');
  const setTypeIdx = header.indexOf('set_type');
  const weightKgIdx = header.indexOf('weight_kg');
  const repsIdx = header.indexOf('reps');
  const distanceKmIdx = header.indexOf('distance_km');
  const durationSecondsIdx = header.indexOf('duration_seconds');
  const rpeIdx = header.indexOf('rpe');
  const exerciseNotesIdx = header.indexOf('exercise_notes');
  
  // Group rows by workout (title + start_time)
  const workoutGroups = new Map();
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const cols = parseCSVLine(line);
    if (cols.length < header.length) continue;
    
    const title = cols[titleIdx] || '';
    const startTime = cols[startTimeIdx] || '';
    const endTime = cols[endTimeIdx] || '';
    
    if (!title || !startTime) continue;
    
    const workoutKey = `${title}|${startTime}`;
    
    if (!workoutGroups.has(workoutKey)) {
      workoutGroups.set(workoutKey, {
        title,
        startTime,
        endTime,
        description: descriptionIdx >= 0 ? cols[descriptionIdx] : '',
        exercises: []
      });
    }
    
    const workout = workoutGroups.get(workoutKey);
    const exerciseTitle = cols[exerciseTitleIdx] || '';
    
    if (exerciseTitle) {
      workout.exercises.push({
        name: exerciseTitle,
        setIndex: setIndexIdx >= 0 ? parseInt(cols[setIndexIdx]) : 0,
        setType: setTypeIdx >= 0 ? cols[setTypeIdx] : 'normal',
        weightKg: weightKgIdx >= 0 ? parseFloat(cols[weightKgIdx]) : null,
        reps: repsIdx >= 0 ? parseInt(cols[repsIdx]) : null,
        distanceKm: distanceKmIdx >= 0 ? parseFloat(cols[distanceKmIdx]) : null,
        durationSeconds: durationSecondsIdx >= 0 ? parseInt(cols[durationSecondsIdx]) : null,
        rpe: rpeIdx >= 0 ? parseInt(cols[rpeIdx]) : null,
        notes: exerciseNotesIdx >= 0 ? cols[exerciseNotesIdx] : ''
      });
    }
  }
  
  // Convert to workout format
  const workouts = [];
  
  workoutGroups.forEach(workoutData => {
    // Parse date and time from Hevy format: "13 Nov 2025, 20:22"
    const { date, time: startTime } = parseHevyDateTime(workoutData.startTime);
    const { time: endTime } = parseHevyDateTime(workoutData.endTime);
    
    // Calculate duration
    let duration = 0;
    if (startTime && endTime) {
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
      if (duration < 0) duration += 24 * 60;
    }
    
    // Group exercises by name
    const exerciseGroups = new Map();
    workoutData.exercises.forEach(ex => {
      if (!exerciseGroups.has(ex.name)) {
        exerciseGroups.set(ex.name, []);
      }
      exerciseGroups.get(ex.name).push(ex);
    });
    
    // Create exercise summary
    const exercises = Array.from(exerciseGroups.entries()).map(([name, sets]) => ({
      name,
      sets: sets.map(s => ({
        setIndex: s.setIndex,
        setType: s.setType,
        weightKg: s.weightKg,
        reps: s.reps,
        distanceKm: s.distanceKm,
        durationSeconds: s.durationSeconds,
        rpe: s.rpe,
        notes: s.notes
      }))
    }));
    
    // Estimate calories (rough estimate based on duration and weight training)
    const estimatedCalories = Math.round(duration * 5); // ~5 kcal per minute for weight training
    
    const workout = {
      id: 'workout_hevy_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11),
      date,
      name: sanitizeInput(workoutData.title),
      type: 'musculacao', // Hevy is primarily for weight training
      startTime,
      endTime,
      duration,
      calories: estimatedCalories,
      avgHeartRate: null,
      maxHeartRate: null,
      distance: null,
      avgSpeed: null,
      intensity: 'moderada',
      notes: sanitizeInput(workoutData.description || ''),
      createdAt: new Date().toISOString(),
      source: 'hevy',
      exercises // Store detailed exercise data
    };
    
    workouts.push(workout);
  });
  
  return workouts;
}

// Parse Hevy date/time format: "13 Nov 2025, 20:22"
function parseHevyDateTime(hevyDateTime) {
  if (!hevyDateTime) return { date: '', time: '' };
  
  try {
    const [datePart, timePart] = hevyDateTime.split(',').map(s => s.trim());
    
    // Parse date: "13 Nov 2025"
    const [day, month, year] = datePart.split(' ');
    const monthNames = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    
    const monthNum = monthNames[month] || '01';
    const dayNum = day.padStart(2, '0');
    const date = `${year}-${monthNum}-${dayNum}`;
    
    return { date, time: timePart };
  } catch (e) {
    console.error('Error parsing Hevy date/time:', hevyDateTime, e);
    return { date: new Date().toISOString().split('T')[0], time: '00:00' };
  }
}

// Parse CSV line handling quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

// Show workout details
function showWorkoutDetails(workoutId) {
  const user = state.users[state.activeUser];
  if (!user || !user.workoutLogs) return;
  
  const workout = user.workoutLogs.find(w => w.id === workoutId);
  if (!workout) return;
  
  const typeEmoji = {
    'corrida': '🏃',
    'caminhada': '🚶',
    'ciclismo': '🚴',
    'natacao': '🏊',
    'musculacao': '💪',
    'crossfit': '🏋️',
    'yoga': '🧘',
    'pilates': '🤸',
    'funcional': '⚡',
    'lutas': '🥋',
    'danca': '💃',
    'outro': '📋'
  }[workout.type] || '📋';
  
  const intensityText = {
    'baixa': '🟢 Baixa',
    'moderada': '🟡 Moderada',
    'alta': '🟠 Alta',
    'maxima': '🔴 Máxima'
  }[workout.intensity] || '⚪ Não informado';
  
  let details = `
📋 Detalhes do Treino

${typeEmoji} ${workout.name}
Tipo: ${workout.type}
Data: ${workout.date}
Horário: ${workout.startTime} - ${workout.endTime}
Duração: ${workout.duration} minutos

📊 Métricas:
• Calorias: ${workout.calories} kcal
${workout.avgHeartRate ? '• BPM Médio: ' + workout.avgHeartRate : ''}
${workout.maxHeartRate ? '• BPM Máximo: ' + workout.maxHeartRate : ''}
${workout.distance ? '• Distância: ' + workout.distance + ' km' : ''}
${workout.avgSpeed ? '• Velocidade Média: ' + workout.avgSpeed + ' km/h' : ''}
• Intensidade: ${intensityText}

${workout.notes ? '📝 Observações:\n' + workout.notes + '\n\n' : ''}`;

  // Add exercise details if available (from Hevy import)
  if (workout.exercises && workout.exercises.length > 0) {
    details += `💪 Exercícios (${workout.exercises.length}):\n\n`;
    workout.exercises.forEach(exercise => {
      details += `${exercise.name}\n`;
      exercise.sets.forEach(set => {
        const setInfo = [];
        if (set.weightKg) setInfo.push(`${set.weightKg} kg`);
        if (set.reps) setInfo.push(`${set.reps} reps`);
        if (set.distanceKm) setInfo.push(`${set.distanceKm} km`);
        if (set.durationSeconds) setInfo.push(`${Math.round(set.durationSeconds / 60)} min`);
        if (set.rpe) setInfo.push(`RPE ${set.rpe}`);
        
        const setType = set.setType !== 'normal' ? ` (${set.setType})` : '';
        details += `  Série ${set.setIndex + 1}${setType}: ${setInfo.join(', ')}\n`;
      });
      details += '\n';
    });
  }

  details += `Fonte: ${workout.source === 'manual' ? 'Registro Manual' : workout.source === 'hevy' ? 'Importado do Hevy' : 'Smartwatch'}`;
  
  alert(details.trim());
}

// Export workout logs to CSV
function exportWorkoutLogsCSV(userId) {
  const user = state.users[userId];
  if (!user || !user.workoutLogs || user.workoutLogs.length === 0) {
    alert('Nenhum treino para exportar');
    return;
  }
  
  const workoutLogs = user.workoutLogs.slice().sort((a, b) => new Date(a.date + 'T' + a.startTime) - new Date(b.date + 'T' + b.startTime));
  
  let csv = 'Data,Nome,Tipo,Hora Início,Hora Término,Duração (min),Calorias (kcal),BPM Médio,BPM Máximo,Distância (km),Velocidade Média (km/h),Intensidade,Observações,Fonte\n';
  
  workoutLogs.forEach(w => {
    csv += `${w.date},"${w.name}",${w.type},${w.startTime},${w.endTime},${w.duration},${w.calories},${w.avgHeartRate || ''},${w.maxHeartRate || ''},${w.distance || ''},${w.avgSpeed || ''},${w.intensity || ''},"${(w.notes || '').replace(/"/g, '""')}",${w.source}\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `treinos_${user.name}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
  
  showNotification('✅ CSV exportado!', 'success');
}

function renderComparacao() {
  const comps = state.comparisons || [];
  return `
    <div class="bg-slate-800 p-4 rounded">
      <h3 class="font-bold">Comparações</h3>
      ${comps.length === 0 ? '<p class="text-slate-400">Nenhuma comparação criada.</p>' : comps.map(c => `
        <div class="bg-slate-700 p-3 rounded mb-2">
          <p class="font-bold">${c.title}</p>
          <p class="text-slate-300 text-xs">Criado ${new Date(c.createdAt).toLocaleString()}</p>
          <div class="mt-2 flex gap-2"><button onclick="handleDeleteComparison('${c.id}')" class="bg-red-500 px-3 py-1 rounded">Remover</button></div>
        </div>
      `).join('')}
    </div>
  `;
}

function handleDeleteComparison(comparisonId) {
  if (!confirm('Deseja excluir esta comparação?')) return;
  
  // Remove from state.comparisons
  state.comparisons = state.comparisons.filter(c => c.id !== comparisonId);
  
  // Save to database
  dbPut(STORE_COMPARISONS, state.comparisons).then(() => {
    showNotification('✅ Comparação excluída!', 'success');
    render();
  }).catch(err => {
    console.error('Error deleting comparison:', err);
    showNotification('❌ Erro ao excluir comparação', 'error');
  });
}

function renderReferencias() {
  const filtered = (state.references || []).filter(r => r.year >= 2020 && r.year <= 2025);
  
  return `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="bg-gradient-to-r from-slate-800 to-purple-900 p-8 rounded-2xl border-2 border-purple-500/30">
        <h2 class="text-4xl font-bold mb-3 flex items-center gap-3">
          <span>📚</span>
          <span>Referências Científicas</span>
        </h2>
        <p class="text-slate-300 text-lg">
          Acervo de estudos científicos utilizados como base para as recomendações e informações do Pilgrim
        </p>
      </div>

      <!-- Import Section -->
      <div class="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 class="text-xl font-bold mb-4">Gerenciar Acervo</h3>
        <div class="flex gap-3">
          <button onclick="importScientificStudiesSeed()" class="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-semibold transition-colors">
            ⤓ Importar Estudos
          </button>
          <button onclick="exportReferencesJSON()" class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-semibold transition-colors">
            ⬇️ Exportar JSON
          </button>
        </div>
      </div>

      <!-- References List -->
      <div class="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 class="text-2xl font-bold mb-6">Estudos Científicos (2020 — 2025)</h3>
        
        ${filtered.length === 0 ? `
          <div class="bg-slate-700/50 p-8 rounded-lg text-center">
            <p class="text-slate-400 text-lg mb-4">Nenhuma referência importada ainda.</p>
            <p class="text-slate-500 text-sm">Use o botão "Importar Estudos" acima para carregar o acervo científico.</p>
          </div>
        ` : `
          <div class="space-y-4">
            ${filtered.map(ref => `
              <div class="bg-slate-700/50 p-5 rounded-lg border-l-4 border-purple-500 hover:bg-slate-700 transition-colors">
                <h4 class="font-bold text-lg text-white mb-2">${ref.title}</h4>
                <p class="text-slate-300 text-sm mb-3">
                  <span class="font-semibold">${ref.authors}</span> (${ref.year})
                </p>
                <p class="text-slate-400 text-sm mb-3">
                  <span class="italic">${ref.journal}</span>
                </p>
                ${ref.summary ? `
                  <p class="text-slate-400 text-sm mb-3 pl-4 border-l-2 border-slate-600">
                    ${ref.summary}
                  </p>
                ` : ''}
                ${ref.link ? `
                  <a href="${ref.link}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 text-sm underline inline-block">
                    🔗 Acessar publicação
                  </a>
                ` : ''}
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- Info Footer -->
      <div class="bg-blue-900/20 border border-blue-700/50 p-4 rounded-lg">
        <p class="text-sm text-slate-300">
          <strong>ℹ️ Sobre este acervo:</strong> Esta coleção contém estudos científicos revisados por pares 
          de 2020 a 2025, utilizados como base para as recomendações de nutrição, treinamento e composição corporal 
          apresentadas no Pilgrim.
        </p>
      </div>
    </div>
  `;
}

// Keep renderCiencia for backward compatibility (deprecated)
function renderCiencia() {
  return renderReferencias();
}

function renderDeveloper(user) {
  // Initialize external integration fields if they don't exist
  if (!user.hevyApiKey) user.hevyApiKey = '';
  if (!user.okokIntegration) user.okokIntegration = { enabled: false, lastSync: null };
  
  return `
    <div class="space-y-6">
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-6 rounded-2xl border border-purple-500/30">
        <h3 class="text-3xl font-bold mb-3">🔗 Importar Dados Externos</h3>
        <p class="text-slate-300 text-lg mb-2">Conecte suas contas de aplicativos externos para importar automaticamente seus dados de treinos e métricas corporais.</p>
        <div class="bg-blue-900/30 border border-blue-700 p-4 rounded-lg mt-4">
          <p class="text-sm text-slate-300">
            <strong>ℹ️ Importante:</strong> Esta página permite que você importe dados DE outros aplicativos para o seu perfil. 
            Seus dados ficam armazenados localmente no seu navegador e as chaves de API são salvas de forma segura.
          </p>
        </div>
      </div>
      
      <!-- Hevy Integration Section -->
      <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-4xl">🏋️</span>
          <div>
            <h3 class="text-2xl font-bold">Hevy Training</h3>
            <p class="text-slate-400 text-sm">Importe seus treinos do Hevy</p>
          </div>
        </div>
        
        <p class="text-slate-300 mb-4">
          Conecte sua conta do Hevy Training para importar automaticamente seus treinos para o seu perfil.
        </p>
        <p class="text-slate-300 mb-4">
          Para obter sua chave de API, visite <a href="https://hevy.com/settings?developer" target="_blank" class="text-blue-400 underline hover:text-blue-300">Configurações de Desenvolvedor do Hevy</a> e gere uma chave de API.
        </p>
        
        <div class="bg-slate-700 p-4 rounded-lg mb-4">
          <label class="block text-sm font-semibold mb-2">Chave de API do Hevy:</label>
          <div class="flex gap-2 mb-4">
            <input type="password" id="hevyApiKeyInput" value="${user.hevyApiKey || ''}" placeholder="Cole sua chave de API do Hevy aqui" class="flex-1 px-4 py-2 rounded bg-slate-600 text-white font-mono" />
            <button type="button" onclick="toggleHevyApiKeyVisibility()" class="bg-slate-600 hover:bg-slate-500 px-4 py-2 rounded">👁️</button>
          </div>
          <button onclick="saveHevyApiKey('${user.id}')" class="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-semibold w-full mb-2">
            💾 Salvar Chave de API
          </button>
        </div>
        
        ${user.hevyApiKey ? `
          <div class="bg-slate-700 p-4 rounded-lg mb-4">
            <h4 class="font-bold text-lg mb-2">Sincronizar Treinos</h4>
            <p class="text-slate-300 text-sm mb-4">Clique no botão abaixo para importar seus treinos do Hevy. Isso buscará todos os seus treinos e os adicionará ao seu perfil.</p>
            <button id="syncHevyButton" onclick="syncHevyWorkouts('${user.id}')" class="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-semibold w-full">
              🔄 Sincronizar Treinos do Hevy
            </button>
            <div id="hevyStatus" class="mt-4"></div>
          </div>
        ` : ''}
        
        <div class="bg-blue-900/30 border border-blue-700 p-4 rounded-lg">
          <h4 class="font-bold text-lg mb-2">ℹ️ Como funciona</h4>
          <ul class="text-slate-300 text-sm space-y-2">
            <li>• Sua chave de API do Hevy é armazenada de forma segura no seu navegador</li>
            <li>• Os treinos são buscados diretamente da API do Hevy</li>
            <li>• Apenas treinos novos são importados (duplicatas são ignoradas)</li>
            <li>• Seus dados do Hevy permanecem na sua conta do Hevy</li>
            <li>• Você pode sincronizar novamente a qualquer momento para obter novos treinos</li>
          </ul>
        </div>
      </div>
      
      <!-- OKOK Scale Integration Section -->
      <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-4xl">⚖️</span>
          <div>
            <h3 class="text-2xl font-bold">OKOK Balança Inteligente</h3>
            <p class="text-slate-400 text-sm">Importe suas métricas corporais</p>
          </div>
        </div>
        
        <p class="text-slate-300 mb-4">
          Conecte sua balança OKOK para importar automaticamente suas medições de peso, gordura corporal, massa muscular e outras métricas para o seu perfil.
        </p>
        
        <div class="bg-orange-900/30 border border-orange-700 p-4 rounded-lg mb-4">
          <h4 class="font-bold text-lg mb-2">⚠️ Em Desenvolvimento</h4>
          <p class="text-slate-300 text-sm">
            A integração com o aplicativo OKOK está em desenvolvimento. A API oficial do OKOK não é públicamente documentada, 
            mas estamos trabalhando em uma solução para importar seus dados.
          </p>
        </div>
        
        <div class="bg-slate-700 p-4 rounded-lg mb-4">
          <h4 class="font-bold text-lg mb-2">💡 Alternativa Manual</h4>
          <p class="text-slate-300 text-sm mb-4">
            Enquanto a integração automática não está disponível, você pode registrar manualmente suas medições na aba 
            <strong>Evolução</strong> do sistema. Os dados serão salvos localmente e você poderá acompanhar seu progresso através dos gráficos.
          </p>
          <button onclick="state.activeTab='evolucao'; updateHash(); render();" class="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold w-full">
            📊 Ir para Evolução
          </button>
        </div>
        
        <div class="bg-slate-700 p-4 rounded-lg">
          <h4 class="font-bold text-lg mb-2">🔮 Recursos Futuros</h4>
          <ul class="text-slate-300 text-sm space-y-2">
            <li>• <strong>Sincronização automática:</strong> Importar dados automaticamente do app OKOK</li>
            <li>• <strong>Histórico completo:</strong> Buscar todo o histórico de medições</li>
            <li>• <strong>Alertas:</strong> Notificações quando novas medições forem detectadas</li>
            <li>• <strong>Múltiplas balanças:</strong> Suporte para mais de uma balança inteligente</li>
          </ul>
        </div>
        
        <div class="bg-blue-900/30 border border-blue-700 p-4 rounded-lg mt-4">
          <h4 class="font-bold text-lg mb-2">📝 Como você pode ajudar</h4>
          <p class="text-slate-300 text-sm mb-3">
            Se você tiver informações sobre a API do OKOK ou outras balanças inteligentes, entre em contato conosco através do 
            sistema de <strong>Sugestões</strong> (disponível no menu lateral).
          </p>
          <p class="text-slate-300 text-sm">
            Estamos especialmente interessados em:
          </p>
          <ul class="text-slate-300 text-sm space-y-1 ml-4 mt-2">
            <li>• Documentação da API do OKOK</li>
            <li>• Métodos de export de dados do aplicativo</li>
            <li>• Outras integrações de balanças inteligentes que você gostaria de ver</li>
          </ul>
        </div>
      </div>
      
      <!-- Additional Integrations Placeholder -->
      <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <h3 class="text-2xl font-bold mb-4">🌟 Outras Integrações</h3>
        <p class="text-slate-300 mb-4">
          Planejamos adicionar suporte para mais aplicativos e dispositivos no futuro. Se você tiver sugestões, 
          use o sistema de feedback do aplicativo!
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-slate-700 p-4 rounded-lg opacity-50">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">🍏</span>
              <h4 class="font-bold">Apple Health</h4>
              <span class="ml-auto text-xs bg-slate-600 px-2 py-1 rounded">Em breve</span>
            </div>
            <p class="text-slate-400 text-sm">Importe treinos e métricas do Apple Health</p>
          </div>
          
          <div class="bg-slate-700 p-4 rounded-lg opacity-50">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">📱</span>
              <h4 class="font-bold">Google Fit</h4>
              <span class="ml-auto text-xs bg-slate-600 px-2 py-1 rounded">Em breve</span>
            </div>
            <p class="text-slate-400 text-sm">Sincronize dados do Google Fit</p>
          </div>
          
          <div class="bg-slate-700 p-4 rounded-lg opacity-50">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">⌚</span>
              <h4 class="font-bold">Smartwatches</h4>
              <span class="ml-auto text-xs bg-slate-600 px-2 py-1 rounded">Planejado</span>
            </div>
            <p class="text-slate-400 text-sm">Suporte para Garmin, Fitbit, etc.</p>
          </div>
          
          <div class="bg-slate-700 p-4 rounded-lg opacity-50">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">💪</span>
              <h4 class="font-bold">MyFitnessPal</h4>
              <span class="ml-auto text-xs bg-slate-600 px-2 py-1 rounded">Planejado</span>
            </div>
            <p class="text-slate-400 text-sm">Importe dados de nutrição</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ----------------------------- Settings / Configurações ----------------------------- */
function renderConfiguracoes() {
  const currentThemeLabel = themeState.currentTheme === 'dark' ? 'Escuro 🌙' : 
                            themeState.currentTheme === 'light' ? 'Claro ☀️' : 
                            'Automático 🌗';
  
  const systemThemeLabel = themeState.systemPreference === 'dark' ? 'Escuro 🌙' : 'Claro ☀️';
  
  return `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="bg-gradient-to-r from-slate-800 to-purple-900 p-8 rounded-2xl border-2 border-purple-500/30">
        <h2 class="text-4xl font-bold mb-3 flex items-center gap-3">
          <span>⚙️</span>
          <span>Configurações</span>
        </h2>
        <p class="text-slate-300 text-lg">
          Personalize a aparência e as preferências do sistema
        </p>
      </div>

      <!-- Theme Settings Section -->
      <div class="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>🎨</span>
          <span>Aparência</span>
        </h3>
        
        <div class="bg-slate-700/50 p-6 rounded-lg mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h4 class="text-lg font-semibold mb-1">Tema Atual</h4>
              <p class="text-slate-400 text-sm">Selecione o tema de sua preferência</p>
            </div>
            <div class="text-3xl">${themeState.currentTheme === 'dark' ? '🌙' : themeState.currentTheme === 'light' ? '☀️' : '🌗'}</div>
          </div>
          
          <div class="flex items-center gap-2 mb-4 p-4 bg-purple-900/30 border border-purple-500/50 rounded-lg">
            <span class="text-xl">✨</span>
            <p class="text-sm text-slate-300">
              <strong>Tema Ativo:</strong> ${currentThemeLabel}
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <!-- Dark Theme Option -->
            <button 
              onclick="setTheme('dark')" 
              class="p-4 rounded-lg border-2 transition-all ${themeState.currentTheme === 'dark' ? 'border-purple-500 bg-purple-900/30' : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'}"
            >
              <div class="flex flex-col items-center gap-3">
                <div class="text-4xl">🌙</div>
                <div class="font-semibold">Escuro</div>
                <div class="text-xs text-slate-400 text-center">Tema escuro para ambientes com pouca luz</div>
                ${themeState.currentTheme === 'dark' ? '<div class="text-green-400 text-sm font-semibold">✓ Ativo</div>' : ''}
              </div>
            </button>
            
            <!-- Light Theme Option -->
            <button 
              onclick="setTheme('light')" 
              class="p-4 rounded-lg border-2 transition-all ${themeState.currentTheme === 'light' ? 'border-purple-500 bg-purple-900/30' : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'}"
            >
              <div class="flex flex-col items-center gap-3">
                <div class="text-4xl">☀️</div>
                <div class="font-semibold">Claro</div>
                <div class="text-xs text-slate-400 text-center">Tema claro para maior visibilidade</div>
                ${themeState.currentTheme === 'light' ? '<div class="text-green-400 text-sm font-semibold">✓ Ativo</div>' : ''}
              </div>
            </button>
            
            <!-- Auto Theme Option -->
            <button 
              onclick="setTheme('auto')" 
              class="p-4 rounded-lg border-2 transition-all ${themeState.currentTheme === 'auto' ? 'border-purple-500 bg-purple-900/30' : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'}"
            >
              <div class="flex flex-col items-center gap-3">
                <div class="text-4xl">🌗</div>
                <div class="font-semibold">Automático</div>
                <div class="text-xs text-slate-400 text-center">Segue a preferência do sistema</div>
                ${themeState.currentTheme === 'auto' ? '<div class="text-green-400 text-sm font-semibold">✓ Ativo</div>' : ''}
              </div>
            </button>
          </div>
          
          ${themeState.currentTheme === 'auto' ? `
            <div class="bg-blue-900/30 border border-blue-500/50 p-4 rounded-lg">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xl">ℹ️</span>
                <span class="font-semibold">Modo Automático Ativo</span>
              </div>
              <p class="text-sm text-slate-300">
                O tema está sendo detectado automaticamente com base na preferência do seu sistema operacional.
                <br><br>
                <strong>Preferência do Sistema:</strong> ${systemThemeLabel}
                <br>
                O tema mudará automaticamente quando você alterar a configuração de aparência do seu dispositivo.
              </p>
            </div>
          ` : ''}
        </div>

        <!-- Theme Info -->
        <div class="bg-slate-700/30 border border-slate-600 p-4 rounded-lg">
          <h4 class="font-semibold mb-2 flex items-center gap-2">
            <span>💡</span>
            <span>Sobre os Temas</span>
          </h4>
          <ul class="text-sm text-slate-300 space-y-2">
            <li class="flex items-start gap-2">
              <span class="text-purple-400">•</span>
              <span><strong>Tema Escuro:</strong> Ideal para uso noturno e ambientes com pouca luz. Reduz o cansaço visual e economiza bateria em telas OLED.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-purple-400">•</span>
              <span><strong>Tema Claro:</strong> Perfeito para ambientes bem iluminados. Oferece maior contraste e facilita a leitura durante o dia.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-purple-400">•</span>
              <span><strong>Modo Automático:</strong> O sistema detecta a preferência de tema do seu dispositivo e ajusta automaticamente. Muda quando você altera as configurações do sistema operacional.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-purple-400">•</span>
              <span><strong>Preferência Salva:</strong> Sua escolha de tema é salva no seu perfil e será aplicada automaticamente quando você fizer login.</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- User Account Section -->
      <div class="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>👤</span>
          <span>Informações da Conta</span>
        </h3>
        
        <div class="bg-slate-700/50 p-4 rounded-lg space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-slate-600">
            <span class="text-slate-400">Nome de Usuário:</span>
            <span class="font-semibold">${authState.currentAccount.username}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-slate-600">
            <span class="text-slate-400">Email:</span>
            <span class="font-semibold">${authState.currentAccount.email}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-slate-600">
            <span class="text-slate-400">Função:</span>
            <span class="px-3 py-1 rounded ${authState.currentAccount.role === 'admin' ? 'bg-red-900 text-red-300' : 'bg-blue-900 text-blue-300'} font-semibold text-sm">
              ${authState.currentAccount.role === 'admin' ? '👑 Admin' : '👤 Usuário'}
            </span>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-slate-400">Perfis Vinculados:</span>
            <span class="font-semibold">${(authState.currentAccount.linkedProfiles || []).length}</span>
          </div>
        </div>
      </div>

      <!-- Accessibility Section -->
      <div class="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>♿</span>
          <span>Acessibilidade</span>
        </h3>
        
        <div class="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xl">✅</span>
            <span class="font-semibold text-green-300">Contraste Adequado</span>
          </div>
          <p class="text-sm text-slate-300">
            Os temas foram testados para garantir contraste adequado de acordo com as diretrizes WCAG 2.1 AA.
            Todos os textos principais possuem contraste mínimo de 4.5:1, garantindo boa legibilidade.
          </p>
        </div>
      </div>
    </div>
  `;
}

/* ----------------------------- Profile Management ----------------------------- */
function renderPerfis() {
  const accountUsername = authState.currentAccount.username;
  const linkedProfiles = authState.currentAccount.linkedProfiles || [];
  
  // Filter to show only profiles linked to this account
  const allProfiles = Object.values(state.users);
  const profiles = allProfiles.filter(profile => linkedProfiles.includes(profile.id));
  
  return `
    <div class="space-y-6">
      <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <h3 class="text-2xl font-bold mb-4">👥 Gerenciamento de Perfis</h3>
        <p class="text-slate-300 mb-4">Gerencie todos os perfis vinculados à sua conta. Cada perfil possui um ID único e dados independentes.</p>
        
        <div class="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 mb-6">
          <h4 class="font-bold mb-2">ℹ️ Informações da Conta</h4>
          <div class="text-sm text-slate-300 space-y-1">
            <p><strong>Usuário:</strong> ${accountUsername}</p>
            <p><strong>Email:</strong> ${authState.currentAccount.email}</p>
            <p><strong>Role:</strong> ${authState.currentAccount.role}</p>
            <p><strong>Perfis Vinculados:</strong> ${linkedProfiles.length}</p>
          </div>
        </div>
        
        <div class="mb-6">
          <button onclick="handleAddProfile()" class="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-semibold">
            ➕ Criar Novo Perfil
          </button>
        </div>
        
        <div class="space-y-4">
          ${profiles.map(profile => {
            const isLinked = linkedProfiles.includes(profile.id);
            const metrics = profile.bodyMetrics && profile.bodyMetrics.length > 0 ? profile.bodyMetrics[profile.bodyMetrics.length - 1] : null;
            
            return `
              <div class="bg-slate-700 p-6 rounded-xl border ${isLinked ? 'border-green-500/50' : 'border-slate-600'}">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h4 class="text-xl font-bold flex items-center gap-2">
                      ${profile.gender === 'female' ? '👩' : '👨'} ${profile.name}
                      ${isLinked ? '<span class="text-green-400 text-sm">✓ Vinculado</span>' : ''}
                    </h4>
                    <p class="text-slate-400 text-sm mt-1">ID: ${profile.id}</p>
                  </div>
                  <div class="flex gap-2">
                    <button onclick="handleUnlinkProfile('${profile.id}')" class="bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded text-sm">
                      🔓 Desvincular
                    </button>
                  </div>
                </div>
                
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div class="bg-slate-800 p-3 rounded">
                    <p class="text-slate-400 text-xs">Idade</p>
                    <p class="text-white font-bold">${profile.age} anos</p>
                  </div>
                  <div class="bg-slate-800 p-3 rounded">
                    <p class="text-slate-400 text-xs">Altura</p>
                    <p class="text-white font-bold">${profile.height} cm</p>
                  </div>
                  <div class="bg-slate-800 p-3 rounded">
                    <p class="text-slate-400 text-xs">Peso Atual</p>
                    <p class="text-white font-bold">${metrics ? metrics.weight : 0} kg</p>
                  </div>
                  <div class="bg-slate-800 p-3 rounded">
                    <p class="text-slate-400 text-xs">Gordura</p>
                    <p class="text-white font-bold">${metrics ? metrics.bodyFat : 0}%</p>
                  </div>
                </div>
                
                <div class="flex gap-2 text-sm">
                  <button onclick="state.activeUser='${profile.id}'; state.activeTab='dashboard'; render();" class="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded">
                    📊 Ver Dashboard
                  </button>
                  <button onclick="state.activeUser='${profile.id}'; state.activeTab='evolucao'; render();" class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded">
                    📈 Ver Evolução
                  </button>
                  <button onclick="handleDeleteProfile('${profile.id}')" class="bg-red-600 hover:bg-red-500 px-4 py-2 rounded">
                    🗄️ Arquivar
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

/* ----------------------------- Profile Comparison ----------------------------- */
function renderComparar() {
  // Get linked profiles for this account
  const linkedProfiles = authState.currentAccount.linkedProfiles || [];
  const allProfiles = Object.values(state.users);
  const profiles = allProfiles.filter(profile => linkedProfiles.includes(profile.id));
  
  if (profiles.length < 2) {
    return `
      <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <h3 class="text-2xl font-bold mb-4">⚖️ Comparar Perfis</h3>
        <div class="bg-orange-900/30 border border-orange-500/50 rounded-lg p-4">
          <p class="text-orange-200">
            <strong>⚠️ Atenção:</strong> Você precisa de pelo menos 2 perfis para fazer comparações.
            Vá para a aba "👥 Perfis" e crie um novo perfil.
          </p>
        </div>
      </div>
    `;
  }
  
  const profile1Id = state.compareProfile1 || profiles[0].id;
  const profile2Id = state.compareProfile2 || (profiles.length > 1 ? profiles[1].id : profiles[0].id);
  
  const profile1 = state.users[profile1Id];
  const profile2 = state.users[profile2Id];
  
  const metrics1 = profile1.bodyMetrics && profile1.bodyMetrics.length > 0 ? profile1.bodyMetrics[profile1.bodyMetrics.length - 1] : null;
  const metrics2 = profile2.bodyMetrics && profile2.bodyMetrics.length > 0 ? profile2.bodyMetrics[profile2.bodyMetrics.length - 1] : null;
  
  const workouts1 = profile1.workoutLogs || [];
  const workouts2 = profile2.workoutLogs || [];
  
  return `
    <div class="space-y-6">
      <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <h3 class="text-2xl font-bold mb-4">⚖️ Comparar Perfis</h3>
        <p class="text-slate-300 mb-6">Compare métricas, progresso e treinos entre diferentes perfis.</p>
        
        <div class="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-semibold mb-2">Perfil 1:</label>
            <select onchange="state.compareProfile1 = this.value; render();" class="w-full px-4 py-2 rounded bg-slate-700 text-white">
              ${profiles.map(p => `
                <option value="${p.id}" ${p.id === profile1Id ? 'selected' : ''}>
                  ${p.gender === 'female' ? '👩' : '👨'} ${p.name}
                </option>
              `).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2">Perfil 2:</label>
            <select onchange="state.compareProfile2 = this.value; render();" class="w-full px-4 py-2 rounded bg-slate-700 text-white">
              ${profiles.map(p => `
                <option value="${p.id}" ${p.id === profile2Id ? 'selected' : ''}>
                  ${p.gender === 'female' ? '👩' : '👨'} ${p.name}
                </option>
              `).join('')}
            </select>
          </div>
        </div>
      </div>
      
      <!-- Comparison of Body Metrics -->
      <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <h4 class="text-xl font-bold mb-4">📊 Comparação de Métricas Corporais</h4>
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Profile 1 Metrics -->
          <div class="bg-slate-700 p-4 rounded-lg">
            <h5 class="font-bold text-lg mb-3 flex items-center gap-2">
              ${profile1.gender === 'female' ? '👩' : '👨'} ${profile1.name}
            </h5>
            ${metrics1 ? `
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-slate-300">Peso:</span>
                  <span class="font-bold text-xl">${metrics1.weight} kg</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-300">Gordura Corporal:</span>
                  <span class="font-bold text-xl">${metrics1.bodyFat}%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-300">Massa Muscular:</span>
                  <span class="font-bold text-xl">${metrics1.muscleMass} kg</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-300">IMC:</span>
                  <span class="font-bold text-xl">${metrics1.bmi}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-300">TMB:</span>
                  <span class="font-bold text-xl">${metrics1.bmr} kcal</span>
                </div>
              </div>
            ` : '<p class="text-slate-400">Sem dados de métricas</p>'}
          </div>
          
          <!-- Profile 2 Metrics -->
          <div class="bg-slate-700 p-4 rounded-lg">
            <h5 class="font-bold text-lg mb-3 flex items-center gap-2">
              ${profile2.gender === 'female' ? '👩' : '👨'} ${profile2.name}
            </h5>
            ${metrics2 ? `
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-slate-300">Peso:</span>
                  <span class="font-bold text-xl">${metrics2.weight} kg</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-300">Gordura Corporal:</span>
                  <span class="font-bold text-xl">${metrics2.bodyFat}%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-300">Massa Muscular:</span>
                  <span class="font-bold text-xl">${metrics2.muscleMass} kg</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-300">IMC:</span>
                  <span class="font-bold text-xl">${metrics2.bmi}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-300">TMB:</span>
                  <span class="font-bold text-xl">${metrics2.bmr} kcal</span>
                </div>
              </div>
            ` : '<p class="text-slate-400">Sem dados de métricas</p>'}
          </div>
        </div>
        
        <!-- Differences -->
        ${metrics1 && metrics2 ? `
          <div class="mt-6 bg-slate-700 p-4 rounded-lg">
            <h5 class="font-bold mb-3">📊 Diferenças</h5>
            <div class="grid md:grid-cols-3 gap-4 text-sm">
              <div class="text-center">
                <p class="text-slate-400 mb-1">Diferença de Peso</p>
                <p class="font-bold text-lg ${Math.abs(metrics1.weight - metrics2.weight) > 5 ? 'text-orange-400' : 'text-green-400'}">
                  ${(metrics1.weight - metrics2.weight).toFixed(1)} kg
                </p>
              </div>
              <div class="text-center">
                <p class="text-slate-400 mb-1">Diferença de Gordura</p>
                <p class="font-bold text-lg ${Math.abs(metrics1.bodyFat - metrics2.bodyFat) > 3 ? 'text-orange-400' : 'text-green-400'}">
                  ${(metrics1.bodyFat - metrics2.bodyFat).toFixed(1)}%
                </p>
              </div>
              <div class="text-center">
                <p class="text-slate-400 mb-1">Diferença de Massa Muscular</p>
                <p class="font-bold text-lg ${Math.abs(metrics1.muscleMass - metrics2.muscleMass) > 3 ? 'text-orange-400' : 'text-green-400'}">
                  ${(metrics1.muscleMass - metrics2.muscleMass).toFixed(1)} kg
                </p>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
      
      <!-- Workout Comparison -->
      <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <h4 class="text-xl font-bold mb-4">🏋️ Comparação de Treinos</h4>
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Profile 1 Workouts -->
          <div class="bg-slate-700 p-4 rounded-lg">
            <h5 class="font-bold text-lg mb-3 flex items-center gap-2">
              ${profile1.gender === 'female' ? '👩' : '👨'} ${profile1.name}
            </h5>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-slate-300">Total de Treinos:</span>
                <span class="font-bold text-xl">${workouts1.length}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-300">Último Treino:</span>
                <span class="font-bold">${workouts1.length > 0 ? new Date(workouts1[workouts1.length - 1].date).toLocaleDateString('pt-BR') : 'Nenhum'}</span>
              </div>
            </div>
            ${workouts1.length > 0 ? `
              <div class="mt-4">
                <p class="text-sm text-slate-400 mb-2">Últimos 3 treinos:</p>
                <div class="space-y-2">
                  ${workouts1.slice(-3).reverse().map(w => `
                    <div class="bg-slate-800 p-2 rounded text-sm">
                      <p class="font-semibold">${w.workoutName || 'Treino'}</p>
                      <p class="text-xs text-slate-400">${new Date(w.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : '<p class="text-slate-400 mt-4 text-sm">Nenhum treino registrado</p>'}
          </div>
          
          <!-- Profile 2 Workouts -->
          <div class="bg-slate-700 p-4 rounded-lg">
            <h5 class="font-bold text-lg mb-3 flex items-center gap-2">
              ${profile2.gender === 'female' ? '👩' : '👨'} ${profile2.name}
            </h5>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-slate-300">Total de Treinos:</span>
                <span class="font-bold text-xl">${workouts2.length}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-300">Último Treino:</span>
                <span class="font-bold">${workouts2.length > 0 ? new Date(workouts2[workouts2.length - 1].date).toLocaleDateString('pt-BR') : 'Nenhum'}</span>
              </div>
            </div>
            ${workouts2.length > 0 ? `
              <div class="mt-4">
                <p class="text-sm text-slate-400 mb-2">Últimos 3 treinos:</p>
                <div class="space-y-2">
                  ${workouts2.slice(-3).reverse().map(w => `
                    <div class="bg-slate-800 p-2 rounded text-sm">
                      <p class="font-semibold">${w.workoutName || 'Treino'}</p>
                      <p class="text-xs text-slate-400">${new Date(w.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : '<p class="text-slate-400 mt-4 text-sm">Nenhum treino registrado</p>'}
          </div>
        </div>
        
        <!-- Workout Stats Comparison -->
        <div class="mt-6 bg-slate-700 p-4 rounded-lg">
          <h5 class="font-bold mb-3">📈 Estatísticas de Treino</h5>
          <div class="grid md:grid-cols-2 gap-4 text-sm">
            <div class="text-center">
              <p class="text-slate-400 mb-1">${profile1.name}</p>
              <p class="font-bold text-2xl text-purple-400">${workouts1.length}</p>
              <p class="text-xs text-slate-400">treinos registrados</p>
            </div>
            <div class="text-center">
              <p class="text-slate-400 mb-1">${profile2.name}</p>
              <p class="font-bold text-2xl text-pink-400">${workouts2.length}</p>
              <p class="text-xs text-slate-400">treinos registrados</p>
            </div>
          </div>
          <div class="mt-4 text-center">
            <p class="text-slate-400 text-sm">
              ${workouts1.length > workouts2.length ? 
                `${profile1.name} tem ${workouts1.length - workouts2.length} treinos a mais` : 
                workouts2.length > workouts1.length ?
                `${profile2.name} tem ${workouts2.length - workouts1.length} treinos a mais` :
                'Ambos têm o mesmo número de treinos'
              }
            </p>
          </div>
        </div>
      </div>
      
      <!-- Evolution Comparison Chart Placeholder -->
      <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700">
        <h4 class="text-xl font-bold mb-4">📈 Comparação de Evolução</h4>
        <p class="text-slate-300 mb-4">Visualize a evolução de peso, gordura corporal e massa muscular dos dois perfis ao longo do tempo.</p>
        <div id="comparisonChart" class="bg-slate-700 p-4 rounded-lg" style="min-height: 300px;">
          <canvas id="comparisonChartCanvas"></canvas>
        </div>
      </div>
    </div>
  `;
}

function renderExercicios(user) {
  const exercises = getAllUniqueExercises(user);
  const selectedExercise = state.selectedExercise || (exercises.length > 0 ? 'MOSTRAR_TODOS' : null);
  
  if (!selectedExercise && exercises.length === 0) {
    return `
      <div class="bg-slate-800 p-6 rounded">
        <h3 class="font-bold text-xl mb-4">💪 Histórico por Exercício</h3>
        <p class="text-slate-400">Nenhum exercício registrado ainda. Vá para a aba Treinos e registre alguns exercícios primeiro.</p>
      </div>
    `;
  }
  
  // Handle "Mostrar Todos" special case
  if (selectedExercise === 'MOSTRAR_TODOS') {
    // Initialize currentWorkoutDay if not set
    if (!state.currentWorkoutDay) {
      state.currentWorkoutDay = new Date().toISOString().split('T')[0];
    }
    
    const workoutsOnDate = getWorkoutsByDate(user, state.currentWorkoutDay);
    const dateLabel = new Date(state.currentWorkoutDay + 'T12:00:00').toLocaleDateString('pt-BR');
    
    return `
      <div class="space-y-6">
        <!-- Exercise Selector -->
        <div class="bg-slate-800 p-4 rounded">
          <h3 class="font-bold text-xl mb-4">💪 Histórico por Exercício</h3>
          <div class="mb-4">
            <label class="block text-sm text-slate-300 mb-2">Selecione um exercício:</label>
            <select onchange="state.selectedExercise=this.value; render();" class="w-full md:w-1/2 px-4 py-2 rounded bg-slate-700 text-white">
              <option value="MOSTRAR_TODOS" selected>📅 Mostrar Todos (por data)</option>
              ${exercises.map(ex => `<option value="${ex}">${ex}</option>`).join('')}
            </select>
          </div>
        </div>
        
        <!-- Date Selector for "Mostrar Todos" -->
        <div class="bg-gradient-to-r from-blue-700 to-cyan-800 p-6 rounded-xl">
          <h4 class="font-bold text-xl mb-4">📅 Selecione a Data</h4>
          <div class="flex items-center gap-4">
            <button onclick="state.currentWorkoutDay = new Date(new Date(state.currentWorkoutDay + 'T12:00:00').getTime() - 86400000).toISOString().split('T')[0]; render();" 
                    class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded font-semibold">
              ◀ Anterior
            </button>
            <input type="date" value="${state.currentWorkoutDay}" 
                   onchange="state.currentWorkoutDay=this.value; render();" 
                   class="px-4 py-2 rounded bg-slate-700 text-white flex-1 max-w-xs" />
            <button onclick="state.currentWorkoutDay = new Date(new Date(state.currentWorkoutDay + 'T12:00:00').getTime() + 86400000).toISOString().split('T')[0]; render();" 
                    class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded font-semibold">
              Próximo ▶
            </button>
            <button onclick="state.currentWorkoutDay = new Date().toISOString().split('T')[0]; render();" 
                    class="bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-semibold">
              Hoje
            </button>
          </div>
        </div>
        
        <!-- Workouts on Selected Date -->
        <div class="bg-slate-800 p-4 rounded">
          <h4 class="font-bold text-lg mb-4">🏋️ Todos os Treinos de ${dateLabel}</h4>
          ${workoutsOnDate.length === 0 ? 
            '<p class="text-slate-400">Nenhum treino registrado nesta data.</p>' :
            `<div class="space-y-3">
              ${workoutsOnDate.map(log => {
                const hasIndividualSets = log.individualSets && log.individualSets.length > 0;
                
                return `
                  <div class="bg-slate-700 p-4 rounded-lg border-l-4 border-blue-500">
                    <div class="flex justify-between items-start mb-2">
                      <div class="flex-1">
                        <p class="font-bold text-lg text-blue-300">${log.exercise}</p>
                        <p class="text-slate-400 text-xs">${log.time}</p>
                      </div>
                      <div class="flex gap-2">
                        <button onclick="handleEditWorkout(${log.id})" class="text-blue-400 hover:text-blue-300 mr-2" title="Editar">✏️</button>
                        <button data-workout-id="${log.id}" class="workout-delete-btn text-red-400 hover:text-red-300" title="Excluir">🗑️</button>
                      </div>
                    </div>
                    
                    ${hasIndividualSets ? `
                      <!-- Individual Sets Display -->
                      <div class="mt-3 bg-slate-600/50 p-3 rounded">
                        <div class="grid grid-cols-3 gap-2 mb-3">
                          ${log.individualSets.map(set => `
                            <div class="bg-slate-700 p-3 rounded text-center">
                              <div class="text-xs text-slate-400 mb-1">Série ${set.setNumber}</div>
                              <div class="text-sm font-semibold text-white mb-1">${set.reps} reps × ${set.weight} kg</div>
                              <div class="text-xs text-green-400 font-bold">Vol: ${set.volume.toFixed(1)} kg</div>
                            </div>
                          `).join('')}
                        </div>
                        <div class="pt-3 border-t border-slate-500 flex justify-between items-center">
                          <span class="text-sm font-semibold text-blue-200">Volume Total:</span>
                          <span class="text-xl font-bold text-green-400">${log.totalVolume.toFixed(1)} kg</span>
                        </div>
                      </div>
                    ` : `
                      <!-- Legacy Format -->
                      <div class="mt-2 text-sm text-slate-300">
                        ${log.sets} séries × ${log.reps} reps${log.weight && log.weight !== '-' ? ` • ${log.weight} kg` : ''}
                        ${(() => {
                          const weight = parseNumber(log.weight);
                          const reps = parseNumber(log.reps);
                          const sets = parseNumber(log.sets);
                          const volume = weight * reps * sets;
                          return volume > 0 ? ` • Volume: ${Math.round(volume)} kg` : '';
                        })()}
                      </div>
                    `}
                  </div>
                `;
              }).join('')}
              
              <!-- Summary Stats -->
              <div class="mt-4 p-4 bg-gradient-to-r from-purple-700 to-indigo-800 rounded-lg">
                <h5 class="font-bold mb-2">📊 Resumo do Treino</h5>
                <div class="grid md:grid-cols-3 gap-4 text-center">
                  <div class="bg-white/10 backdrop-blur p-3 rounded">
                    <p class="text-sm text-purple-200 mb-1">Total de Exercícios</p>
                    <p class="text-2xl font-bold">${workoutsOnDate.length}</p>
                  </div>
                  <div class="bg-white/10 backdrop-blur p-3 rounded">
                    <p class="text-sm text-purple-200 mb-1">Volume Total</p>
                    <p class="text-2xl font-bold">${Math.round(workoutsOnDate.reduce((sum, log) => {
                      // Use new totalVolume if available, otherwise calculate from legacy fields
                      if (log.totalVolume) {
                        return sum + log.totalVolume;
                      }
                      const weight = parseNumber(log.weight);
                      const reps = parseNumber(log.reps);
                      const sets = parseNumber(log.sets);
                      return sum + (weight * reps * sets);
                    }, 0))} kg</p>
                  </div>
                  <div class="bg-white/10 backdrop-blur p-3 rounded">
                    <p class="text-sm text-purple-200 mb-1">Exercícios Únicos</p>
                    <p class="text-2xl font-bold">${new Set(workoutsOnDate.map(w => w.exercise)).size}</p>
                  </div>
                </div>
              </div>
            </div>`
          }
        </div>
      </div>
    `;
  }
  
  // Regular exercise view
  const history = selectedExercise ? getExerciseHistory(user, selectedExercise) : [];
  const stats = selectedExercise ? getExerciseStats(user, selectedExercise) : {};
  
  return `
    <div class="space-y-6">
      <!-- Exercise Selector -->
      <div class="bg-slate-800 p-4 rounded">
        <h3 class="font-bold text-xl mb-4">💪 Histórico por Exercício</h3>
        <div class="mb-4">
          <label class="block text-sm text-slate-300 mb-2">Selecione um exercício:</label>
          <select onchange="state.selectedExercise=this.value; render();" class="w-full md:w-1/2 px-4 py-2 rounded bg-slate-700 text-white">
            <option value="MOSTRAR_TODOS">📅 Mostrar Todos (por data)</option>
            ${exercises.map(ex => `<option value="${ex}" ${ex === selectedExercise ? 'selected' : ''}>${ex}</option>`).join('')}
          </select>
        </div>
      </div>
      
      <!-- Exercise Stats -->
      <div class="bg-gradient-to-r from-purple-700 to-indigo-800 p-6 rounded-xl">
        <h4 class="font-bold text-xl mb-4">📊 Estatísticas de ${selectedExercise}</h4>
        <div class="grid md:grid-cols-4 gap-4">
          <div class="bg-white/10 backdrop-blur p-4 rounded-lg">
            <p class="text-sm text-purple-200 mb-1">Total de Treinos</p>
            <p class="text-3xl font-bold">${stats.totalWorkouts}</p>
          </div>
          <div class="bg-white/10 backdrop-blur p-4 rounded-lg">
            <p class="text-sm text-purple-200 mb-1">Carga Máxima</p>
            <p class="text-3xl font-bold">${stats.maxWeight}</p>
            <p class="text-xs text-purple-300">kg</p>
          </div>
          <div class="bg-white/10 backdrop-blur p-4 rounded-lg">
            <p class="text-sm text-purple-200 mb-1">Reps Máximo</p>
            <p class="text-3xl font-bold">${stats.maxReps}</p>
          </div>
          <div class="bg-white/10 backdrop-blur p-4 rounded-lg">
            <p class="text-sm text-purple-200 mb-1">Volume Máximo</p>
            <p class="text-3xl font-bold">${Math.round(stats.maxVolume)}</p>
            <p class="text-xs text-purple-300">kg total</p>
          </div>
        </div>
        ${stats.firstWorkout ? `
          <div class="mt-4 text-sm text-purple-200">
            <p>Primeiro treino: ${new Date(stats.firstWorkout).toLocaleDateString('pt-BR')}</p>
            <p>Último treino: ${new Date(stats.lastWorkout).toLocaleDateString('pt-BR')}</p>
          </div>
        ` : ''}
      </div>
      
      <!-- History Table -->
      <div class="bg-slate-800 p-4 rounded">
        <h4 class="font-bold text-lg mb-4">📋 Histórico Completo</h4>
        ${history.length === 0 ? 
          '<p class="text-slate-400">Nenhum registro encontrado para este exercício.</p>' :
          `<div class="space-y-3">
            ${history.slice().reverse().map(log => {
              const hasIndividualSets = log.individualSets && log.individualSets.length > 0;
              
              return `
                <div class="bg-slate-700 p-4 rounded-lg border-l-4 border-purple-500">
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                      <p class="font-bold text-lg text-purple-300">${new Date(log.date).toLocaleDateString('pt-BR')}</p>
                      <p class="text-slate-400 text-xs">${log.time}</p>
                    </div>
                    <div class="flex gap-2">
                      <button onclick="handleEditWorkout(${log.id})" class="text-blue-400 hover:text-blue-300 mr-2" title="Editar">✏️</button>
                      <button data-workout-id="${log.id}" class="workout-delete-btn text-red-400 hover:text-red-300" title="Excluir">🗑️</button>
                    </div>
                  </div>
                  
                  ${hasIndividualSets ? `
                    <!-- Individual Sets Display -->
                    <div class="mt-3 bg-slate-600/50 p-3 rounded">
                      <div class="grid grid-cols-3 gap-2 mb-3">
                        ${log.individualSets.map(set => `
                          <div class="bg-slate-700 p-3 rounded text-center">
                            <div class="text-xs text-slate-400 mb-1">Série ${set.setNumber}</div>
                            <div class="text-sm font-semibold text-white mb-1">${set.reps} reps × ${set.weight} kg</div>
                            <div class="text-xs text-green-400 font-bold">Vol: ${set.volume.toFixed(1)} kg</div>
                          </div>
                        `).join('')}
                      </div>
                      <div class="pt-3 border-t border-slate-500 flex justify-between items-center">
                        <span class="text-sm font-semibold text-purple-200">Volume Total:</span>
                        <span class="text-xl font-bold text-green-400">${log.totalVolume.toFixed(1)} kg</span>
                      </div>
                    </div>
                  ` : `
                    <!-- Legacy Format -->
                    <div class="mt-2 text-sm text-slate-300">
                      ${log.sets} séries × ${log.reps} reps${log.weight && log.weight !== '-' ? ` • ${log.weight} kg` : ''}
                      ${(() => {
                        const weight = parseNumber(log.weight);
                        const reps = parseNumber(log.reps);
                        const sets = parseNumber(log.sets);
                        const volume = weight * reps * sets;
                        return volume > 0 ? ` • Volume: ${Math.round(volume)} kg` : '';
                      })()}
                    </div>
                  `}
                </div>
              `;
            }).join('')}
          </div>`
        }
      </div>
      
      <!-- Progression Chart -->
      ${history.length >= 2 ? `
        <div class="bg-slate-800 p-4 rounded">
          <h4 class="font-bold text-lg mb-4">📈 Progressão de Carga</h4>
          <canvas id="exerciseProgressionChart" height="100"></canvas>
        </div>
      ` : ''}
    </div>
  `;
}

function renderFotosProgresso(user) {
  if (!user.progressPhotos) user.progressPhotos = [];
  
  const photos = user.progressPhotos.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return `
    <div class="space-y-6">
      <!-- Upload Form -->
      <div class="bg-slate-800 p-6 rounded">
        <h3 class="font-bold text-xl mb-4">📸 Adicionar Foto de Progresso</h3>
        <form id="progressPhotoForm" class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-slate-300 mb-2">Data da foto:</label>
              <input type="date" name="photoDate" value="${new Date().toISOString().split('T')[0]}" required class="w-full px-4 py-2 rounded bg-slate-700 text-white" />
            </div>
            <div>
              <label class="block text-sm text-slate-300 mb-2">Notas (opcional):</label>
              <input type="text" name="photoNotes" placeholder="Ex: Após 3 meses de treino" class="w-full px-4 py-2 rounded bg-slate-700 text-white" />
            </div>
          </div>
          <div>
            <label class="block text-sm text-slate-300 mb-2">Selecione a foto:</label>
            <input type="file" name="photoFile" accept="image/*" required class="w-full px-4 py-2 rounded bg-slate-700 text-white" />
            <p class="text-xs text-slate-400 mt-1">Tamanho máximo: 5MB. Formatos: JPG, PNG, WEBP</p>
          </div>
          <button type="submit" class="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded font-semibold">📸 Adicionar Foto</button>
        </form>
      </div>
      
      <!-- Photos Grid -->
      <div class="bg-slate-800 p-6 rounded">
        <h3 class="font-bold text-xl mb-4">🖼️ Galeria de Progresso</h3>
        ${photos.length === 0 ? 
          '<p class="text-slate-400">Nenhuma foto adicionada ainda. Use o formulário acima para adicionar sua primeira foto de progresso!</p>' :
          `<div class="grid md:grid-cols-3 gap-4">
            ${photos.map(photo => `
              <div class="bg-slate-700 p-3 rounded">
                <img src="${photo.imageData}" alt="Foto de ${escapeHtml(photo.date)}" class="w-full h-64 object-cover rounded mb-3" />
                <div class="space-y-1">
                  <p class="font-bold text-lg">${new Date(photo.date).toLocaleDateString('pt-BR')}</p>
                  ${photo.notes ? `<p class="text-sm text-slate-300">${escapeHtml(photo.notes)}</p>` : ''}
                  <p class="text-xs text-slate-400">Adicionada em ${new Date(photo.uploadedAt).toLocaleDateString('pt-BR')}</p>
                  <button onclick="handleDeleteProgressPhoto('${photo.id}')" class="mt-2 bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm w-full">🗑️ Excluir</button>
                </div>
              </div>
            `).join('')}
          </div>`
        }
      </div>
      
      <!-- Comparison Tool -->
      ${photos.length >= 2 ? `
        <div class="bg-slate-800 p-6 rounded">
          <h3 class="font-bold text-xl mb-4">⚖️ Comparar Fotos</h3>
          <p class="text-slate-300 text-sm mb-4">Selecione duas fotos para compará-las lado a lado:</p>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-slate-300 mb-2">Foto 1 (Antes):</label>
              <select id="comparePhoto1" class="w-full px-4 py-2 rounded bg-slate-700 text-white">
                <option value="">Selecione...</option>
                ${photos.map(p => `<option value="${p.id}">${new Date(p.date).toLocaleDateString('pt-BR')} ${p.notes ? '- ' + escapeHtml(p.notes) : ''}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-sm text-slate-300 mb-2">Foto 2 (Depois):</label>
              <select id="comparePhoto2" class="w-full px-4 py-2 rounded bg-slate-700 text-white">
                <option value="">Selecione...</option>
                ${photos.map(p => `<option value="${p.id}">${new Date(p.date).toLocaleDateString('pt-BR')} ${p.notes ? '- ' + escapeHtml(p.notes) : ''}</option>`).join('')}
              </select>
            </div>
          </div>
          <button onclick="compareProgressPhotos()" class="mt-4 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded font-semibold">👁️ Comparar</button>
          
          <div id="comparisonResult" class="mt-6 hidden">
            <div class="grid md:grid-cols-2 gap-4">
              <div id="compareImg1Container"></div>
              <div id="compareImg2Container"></div>
            </div>
          </div>
        </div>
      ` : ''}
      
      <!-- Tips -->
      <div class="bg-gradient-to-r from-cyan-900 to-blue-900 p-6 rounded">
        <h4 class="font-bold text-lg mb-3">💡 Dicas para Fotos de Progresso</h4>
        <ul class="space-y-2 text-sm text-slate-200">
          <li class="flex items-start gap-2">
            <span class="text-green-400 flex-shrink-0">✓</span>
            <span><strong>Mesma iluminação:</strong> Tire fotos sempre no mesmo local e horário para comparação justa.</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-green-400 flex-shrink-0">✓</span>
            <span><strong>Mesma pose:</strong> Use poses consistentes (frente, lado, costas) em todas as fotos.</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-green-400 flex-shrink-0">✓</span>
            <span><strong>Frequência:</strong> Tire fotos a cada 2-4 semanas para ver progresso real.</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-green-400 flex-shrink-0">✓</span>
            <span><strong>Privacidade:</strong> Suas fotos ficam armazenadas localmente no seu navegador.</span>
          </li>
        </ul>
      </div>
    </div>
  `;
}
