/**
 * @fileoverview Training (Treino) Module
 * @module modules/treino
 */

/* Workout navigation and helpers */
function goToPreviousWorkoutDay() {
  const current = new Date(state.currentWorkoutDay);
  current.setDate(current.getDate() - 1);
  state.currentWorkoutDay = current.toISOString().split('T')[0];
  render();
}

function goToNextWorkoutDay() {
  const current = new Date(state.currentWorkoutDay);
  current.setDate(current.getDate() + 1);
  state.currentWorkoutDay = current.toISOString().split('T')[0];
  render();
}

function goToTodayWorkout() {
  state.currentWorkoutDay = new Date().toISOString().split('T')[0];
  render();
}

// Show workout exercises form for registration
function showWorkoutExercises(templateId) {
  const template = templates[templateId];
  if (!template) return;
  
  const session = template.sessions.A;
  const formDiv = document.getElementById('workoutExercisesForm');
  const exercisesList = document.getElementById('exercisesList');
  
  // Escape templateId once at the beginning
  const escapedTemplateId = escapeJsString(templateId);
  
  let html = `
    <div class="bg-gradient-to-r from-purple-900 to-slate-800 p-4 rounded-lg mb-4">
      <h4 class="font-bold text-xl text-purple-300 mb-2">${template.name}</h4>
      <p class="text-slate-300">${template.description}</p>
    </div>
    <div class="space-y-4">
  `;
  
  session.exercises.forEach((exercise, index) => {
    const isMobility = exercise.name.toLowerCase().includes('mobilidade');
    const escapedExerciseName = escapeJsString(exercise.name);
    html += `
      <div class="bg-slate-700 p-4 rounded-lg">
        <h5 class="font-semibold text-lg mb-3">${exercise.name}</h5>
        ${exercise.notes ? `<p class="text-slate-400 text-sm mb-3">💡 ${exercise.notes}</p>` : ''}
        
        <form onsubmit="handleQuickExerciseLog(event, '${escapedExerciseName}', '${escapedTemplateId}')" class="space-y-3">
          <div class="text-sm text-purple-300 font-semibold mb-2">Registre as 3 séries:</div>
          
          <!-- Série 1 -->
          <div class="grid grid-cols-3 gap-2 bg-slate-600/50 p-2 rounded">
            <div>
              <label class="block text-xs text-slate-400 mb-1">Série 1 - Reps</label>
              <input 
                type="number" 
                name="reps1" 
                min="1" 
                max="50"
                placeholder="Ex: 12" 
                class="w-full px-2 py-2 rounded bg-slate-600 text-white text-sm"
                ${isMobility ? '' : 'required'}
              />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">Carga (kg)</label>
              <input 
                type="number" 
                name="weight1" 
                min="0" 
                max="500" 
                step="0.5"
                placeholder="Ex: 50" 
                class="w-full px-2 py-2 rounded bg-slate-600 text-white text-sm"
                ${isMobility ? '' : 'required'}
              />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">Volume</label>
              <input 
                type="text" 
                name="volume1" 
                readonly
                placeholder="Auto" 
                class="w-full px-2 py-2 rounded bg-slate-700 text-slate-300 text-sm"
              />
            </div>
          </div>
          
          <!-- Série 2 -->
          <div class="grid grid-cols-3 gap-2 bg-slate-600/50 p-2 rounded">
            <div>
              <label class="block text-xs text-slate-400 mb-1">Série 2 - Reps</label>
              <input 
                type="number" 
                name="reps2" 
                min="1" 
                max="50"
                placeholder="Ex: 10" 
                class="w-full px-2 py-2 rounded bg-slate-600 text-white text-sm"
                ${isMobility ? '' : 'required'}
              />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">Carga (kg)</label>
              <input 
                type="number" 
                name="weight2" 
                min="0" 
                max="500" 
                step="0.5"
                placeholder="Ex: 52.5" 
                class="w-full px-2 py-2 rounded bg-slate-600 text-white text-sm"
                ${isMobility ? '' : 'required'}
              />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">Volume</label>
              <input 
                type="text" 
                name="volume2" 
                readonly
                placeholder="Auto" 
                class="w-full px-2 py-2 rounded bg-slate-700 text-slate-300 text-sm"
              />
            </div>
          </div>
          
          <!-- Série 3 -->
          <div class="grid grid-cols-3 gap-2 bg-slate-600/50 p-2 rounded">
            <div>
              <label class="block text-xs text-slate-400 mb-1">Série 3 - Reps</label>
              <input 
                type="number" 
                name="reps3" 
                min="1" 
                max="50"
                placeholder="Ex: 8" 
                class="w-full px-2 py-2 rounded bg-slate-600 text-white text-sm"
                ${isMobility ? '' : 'required'}
              />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">Carga (kg)</label>
              <input 
                type="number" 
                name="weight3" 
                min="0" 
                max="500" 
                step="0.5"
                placeholder="Ex: 55" 
                class="w-full px-2 py-2 rounded bg-slate-600 text-white text-sm"
                ${isMobility ? '' : 'required'}
              />
            </div>
            <div>
              <label class="block text-xs text-slate-400 mb-1">Volume</label>
              <input 
                type="text" 
                name="volume3" 
                readonly
                placeholder="Auto" 
                class="w-full px-2 py-2 rounded bg-slate-700 text-slate-300 text-sm"
              />
            </div>
          </div>
          
          <!-- Volume Total -->
          <div class="bg-purple-900/30 p-3 rounded border border-purple-500/50">
            <div class="flex justify-between items-center">
              <span class="text-purple-300 font-semibold">Volume Total:</span>
              <span id="totalVolume_${index}" class="text-2xl font-bold text-purple-200">0 kg</span>
            </div>
          </div>
          
          <button type="submit" class="w-full bg-green-600 hover:bg-green-500 px-4 py-3 rounded font-semibold">
            ✓ Registrar Exercício
          </button>
        </form>
        
        <script>
          // Auto-calculate volumes for exercise ${index}
          (function() {
            const form = document.currentScript.previousElementSibling;
            const inputs = {
              reps1: form.querySelector('[name="reps1"]'),
              weight1: form.querySelector('[name="weight1"]'),
              volume1: form.querySelector('[name="volume1"]'),
              reps2: form.querySelector('[name="reps2"]'),
              weight2: form.querySelector('[name="weight2"]'),
              volume2: form.querySelector('[name="volume2"]'),
              reps3: form.querySelector('[name="reps3"]'),
              weight3: form.querySelector('[name="weight3"]'),
              volume3: form.querySelector('[name="volume3"]')
            };
            
            function updateVolumes() {
              let total = 0;
              for (let i = 1; i <= 3; i++) {
                const reps = parseFloat(inputs['reps' + i].value) || 0;
                const weight = parseFloat(inputs['weight' + i].value) || 0;
                const volume = reps * weight;
                inputs['volume' + i].value = volume > 0 ? volume.toFixed(1) + ' kg' : '';
                total += volume;
              }
             const totalElem = document.getElementById('totalVolume_' + ${index});
              if (totalElem) {
                totalElem.textContent = total > 0 ? total.toFixed(1) + ' kg' : '0 kg';
              }
            }
            
            // Add listeners
            ['reps1', 'weight1', 'reps2', 'weight2', 'reps3', 'weight3'].forEach(name => {
              inputs[name].addEventListener('input', updateVolumes);
            });
          })();
        <\/script>
      </div>
    `;
  });
  
  html += `
    <div class="mt-6 p-4 bg-gradient-to-r from-green-700 to-emerald-800 rounded-lg">
      <button onclick="handleRegisterAllExercises('${escapedTemplateId}')" class="w-full bg-white text-green-800 hover:bg-green-100 px-6 py-3 rounded-lg font-bold text-lg">
        ✅ Registrar Todos os Exercícios
      </button>
      <p class="text-sm text-green-100 mt-2 text-center">Registra todos os exercícios acima de uma vez com os valores informados</p>
    </div>
  </div>`;
  exercisesList.innerHTML = html;
  formDiv.classList.remove('hidden');
  
  // Scroll to form
  formDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Hide workout exercises form
function hideWorkoutExercises() {
  const formDiv = document.getElementById('workoutExercisesForm');
  formDiv.classList.add('hidden');
}

// Handle quick exercise log from the form
function handleQuickExerciseLog(event, exerciseName, templateId) {
  event.preventDefault();
  
  const form = event.target;
  
  // Collect data for 3 individual sets
  const setsData = [];
  for (let i = 1; i <= 3; i++) {
    const reps = form['reps' + i].value;
    const weight = form['weight' + i].value;
    
    if (reps && weight) {
      setsData.push({
        setNumber: i,
        reps: parseFloat(reps),
        weight: parseFloat(weight),


/* Main treino render function */
function renderTreino(user) {
  if (!user.workoutHistory) user.workoutHistory = [];
  
  // Filter workouts for the selected day
  const selectedDayWorkouts = user.workoutHistory.filter(w => w.date === state.currentWorkoutDay);
  
  // Format date for display
  const displayDate = new Date(state.currentWorkoutDay + 'T00:00:00');
  const isToday = state.currentWorkoutDay === new Date().toISOString().split('T')[0];
  const dateLabel = isToday ? 'Hoje' : displayDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' });
  
  return `
    <!-- Day Navigation -->
    <div class="bg-slate-800 p-4 rounded mb-6">
      <div class="flex justify-between items-center">
        <button onclick="goToPreviousWorkoutDay()" class="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded">← Dia Anterior</button>
        <div class="text-center">
          <p class="text-lg font-bold">${dateLabel}</p>
          <p class="text-sm text-slate-300">${state.currentWorkoutDay}</p>
        </div>
        <button onclick="goToNextWorkoutDay()" class="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded">Próximo Dia →</button>
      </div>
      ${!isToday ? `<div class="mt-2 text-center"><button onclick="goToTodayWorkout()" class="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm">Ir para Hoje</button></div>` : ''}
    </div>

    <!-- Workout Templates -->
    <div class="bg-slate-800 p-4 rounded mb-6">
      <h3 class="font-bold text-xl mb-3">🏋️ Selecione seu Treino</h3>
      <div class="grid md:grid-cols-2 gap-4">
        ${Object.values(templates).map(t => `
          <div class="bg-gradient-to-br from-slate-700 to-slate-800 p-4 rounded-lg border border-purple-500/30">
            <h4 class="font-bold text-xl mb-2 text-purple-300">${t.name}</h4>
            <p class="text-slate-300 text-sm mb-3">${t.description}</p>
            ${t.sessions.A.primaryMuscles ? `
              <div class="mb-3 flex flex-wrap gap-1">
                ${t.sessions.A.primaryMuscles.map(m => `<span class="text-xs px-2 py-1 bg-purple-900/50 text-purple-200 rounded">${m}</span>`).join('')}
              </div>
            ` : ''}
            <button onclick="showWorkoutExercises('${t.id}')" class="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-sm w-full font-semibold">
              📋 Ver e Registrar Exercícios
            </button>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Workout Exercise Form (Hidden by default, shown when template selected) -->
    <div id="workoutExercisesForm" class="hidden bg-slate-800 p-4 rounded mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-xl">💪 Registrar Exercícios</h3>
        <button onclick="hideWorkoutExercises()" class="text-red-400 hover:text-red-300">✕ Fechar</button>
      </div>
      <div id="exercisesList"></div>
    </div>

    <!-- Workout History for Selected Day -->
    <div class="bg-slate-800 p-4 rounded">
      <h3 class="font-bold text-xl mb-3">📋 Histórico de ${dateLabel}</h3>
      ${selectedDayWorkouts.length === 0 ? 
        `<p class="text-slate-400">Nenhum treino registrado neste dia. Selecione um treino acima e registre seus exercícios.</p>` :
        `<div class="space-y-3">
          ${selectedDayWorkouts.map(log => {
            // Check if this workout has individual sets data
            const hasIndividualSets = log.individualSets && log.individualSets.length > 0;
            
            return `
            <div class="bg-slate-700 p-4 rounded-lg border-l-4 border-purple-500">
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1">
                  <p class="font-bold text-lg text-purple-300">${log.exercise || log.workout}</p>
                  <p class="text-slate-400 text-xs">${log.category ? `${log.category} • ` : ''}${log.time}</p>
                </div>
                <div class="flex gap-2">
                  <button onclick="handleEditWorkout(${log.id})" class="text-blue-400 hover:text-blue-300" title="Editar">✏️</button>
                  <button data-workout-id="${log.id}" class="workout-delete-btn text-red-400 hover:text-red-300" title="Excluir">🗑️</button>
                </div>
              </div>
              
              ${hasIndividualSets ? `
                <!-- New: Individual Sets Display -->
                <div class="mt-3 bg-slate-600/50 p-3 rounded">
                  <h5 class="text-sm font-semibold text-purple-200 mb-2">Séries Realizadas:</h5>
                  <div class="space-y-2">
                    ${log.individualSets.map(set => `
                      <div class="flex items-center justify-between bg-slate-700/50 p-2 rounded">
                        <span class="text-sm font-semibold text-purple-300">Série ${set.setNumber}</span>
                        <div class="flex gap-4 text-sm">
                          <span class="text-slate-300">${set.reps} reps</span>
                          <span class="text-blue-300 font-semibold">${set.weight} kg</span>
                          <span class="text-green-300 font-semibold">Vol: ${set.volume.toFixed(1)} kg</span>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                  <div class="mt-3 pt-3 border-t border-slate-500 flex justify-between items-center">
                    <span class="text-sm font-semibold text-purple-200">Volume Total:</span>
                    <span class="text-xl font-bold text-green-400">${log.totalVolume.toFixed(1)} kg</span>
                  </div>
                </div>
              ` : `
                <!-- Legacy: Old Display Format -->
                <p class="text-slate-300 text-sm mt-2">
                  ${log.sets && log.sets !== '-' ? `${log.sets} séries × ${log.reps} reps` : ''}
                  ${log.weight && log.weight !== '-' ? ` • ${log.weight} kg` : ''}
                </p>
              `}
            </div>
            `;
          }).join('')}
        </div>`
      }
    </div>

    <!-- Photos Section (Optional) -->
    <div class="mt-6 bg-gradient-to-r from-blue-900 to-purple-900 p-6 rounded-xl border border-blue-500">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-2xl">📸 Fotos de Progresso (Opcional)</h3>
        <button onclick="togglePhotoSection()" id="togglePhotoBtn" class="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded font-semibold">
          <span id="togglePhotoIcon">▼</span> <span id="togglePhotoText">Mostrar Fotos</span>
        </button>
      </div>
      <p class="text-blue-200 text-sm mb-4">Adicione fotos do seu progresso para acompanhar sua evolução visual ao longo do tempo.</p>
      
      <div id="photoSection" class="hidden">
        ${renderFotosProgresso(user)}
      </div>
    </div>
  `;
}
