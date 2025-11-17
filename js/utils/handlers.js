/**
 * Application Handlers Module
 * Event handlers for workouts, meals, photos, archive, and UI interactions
 * @module utils/handlers
 */

/* ----------------------------- Progress Photos Management -----------------------------
   Load and save progress photos from/to IndexedDB settings store and localStorage fallback
-------------------------------------------------------------------------------------------- */
async function loadProgressPhotos() {
  const user = state.users[state.activeUser];
  if (!user) return;
  
  if (!user.progressPhotos) {
    user.progressPhotos = [];
  }
  state.progressPhotos = user.progressPhotos;
}

async function saveProgressPhotos() {
  const user = state.users[state.activeUser];
  if (!user) return;
  
  user.progressPhotos = state.progressPhotos;
  addOrUpdateUser(user);
}

function handleAddProgressPhoto(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const date = formData.get('photoDate');
  const notes = formData.get('photoNotes');
  const fileInput = document.querySelector('input[name="photoFile"]');
  const file = fileInput.files[0];
  
  if (!date || !file) {
    alert('Data e foto são obrigatórios');
    return;
  }
  
  // Check file size (limit to 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('A foto é muito grande. Máximo 5MB.');
    return;
  }
  
  // Read the file as base64
  const reader = new FileReader();
  reader.onload = async function(event) {
    const photoData = {
      id: 'photo_' + Date.now(),
      date: date,
      notes: notes || '',
      imageData: event.target.result,
      uploadedAt: new Date().toISOString()
    };
    
    state.progressPhotos.push(photoData);
    await saveProgressPhotos();
    
    showNotification('✅ Foto de progresso adicionada com sucesso!', 'success');
    e.target.reset();
    render();
  };
  reader.readAsDataURL(file);
}

function handleDeleteProgressPhoto(photoId) {
  if (!confirm('Deseja excluir esta foto de progresso?')) return;
  
  state.progressPhotos = state.progressPhotos.filter(p => p.id !== photoId);
  saveProgressPhotos();
  showNotification('✅ Foto excluída', 'success');
  render();
}

/* ----------------------------- Soft-delete / Archive workflow -----------------------------
   Instead of permanently deleting, we move to 'archive' store with metadata:
     { id, originStore, originId, type, payload, deletedAt, deletedBy }
   Only with explicit user action "Excluir permanentemente do arquivo" will we remove it from 'archive'.
---------------------------------------------------------------------------------------------- */
async function archiveItem(originStore, originId, type, payload) {
  const archiveId = `arch_${type}_${originId}_${Date.now()}`;
  const item = {
    id: archiveId,
    originStore,
    originId,
    type,
    payload,
    deletedAt: new Date().toISOString(),
    deletedBy: state.activeUser || 'system'
  };
  await dbPut(STORE_ARCHIVE, item);
  return item;
}

async function softDeleteUser(userId) {
  if (!confirm('Tem certeza que deseja mover este perfil para o arquivo (archive)? Isso preservará os dados no archive.')) return;
  const user = state.users[userId];
  if (!user) { alert('Perfil não encontrado'); return; }
  // move to archive
  await archiveItem(STORE_USERS, userId, 'user', user);
  // delete from users store and state
  delete state.users[userId];
  try { await dbDelete(STORE_USERS, userId); } catch (e) {}
  saveLS('ft_users', state.users);
  updateState({ users: state.users });
  alert('✅ Perfil movido para arquivo (archive). Para excluir permanentemente vá na aba Ciência → Gerenciar arquivo.');
}

/* ----------------------------- State helpers ----------------------------- */
function updateState(newState) {
  state = { ...state, ...newState };
  saveAllToDB();
  render();
}

function addOrUpdateUser(user) {
  state.users[user.id] = user;
  updateState({ users: state.users });
}

function removeUserPermanentlyFromArchive(archiveId) {
  // Will delete entry permanently from archive - only after explicit confirmation
  if (!confirm('Excluir permanentemente este item do arquivo? Esta ação NÃO pode ser desfeita.')) return;
  dbDelete(STORE_ARCHIVE, archiveId).then(() => alert('Item excluído permanentemente do archive')).catch(err => alert('Erro ao excluir: ' + err));
}

/* ----------------------------- Exercise History and Analytics ----------------------------- */
function getExerciseHistory(user, exerciseName) {
  if (!user.workoutHistory) return [];
  
  return user.workoutHistory
    .filter(w => w.exercise === exerciseName)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function getAllUniqueExercises(user) {
  if (!user.workoutHistory) return [];
  
  const exercises = new Set();
  user.workoutHistory.forEach(w => {
    if (w.exercise) exercises.add(w.exercise);
  });
  
  return Array.from(exercises).sort();
}

function getWorkoutsByDate(user, date) {
  if (!user.workoutHistory) return [];
  
  return user.workoutHistory
    .filter(w => w.date === date)
    .sort((a, b) => {
      // Sort by exercise name for consistent ordering
      if (a.exercise < b.exercise) return -1;
      if (a.exercise > b.exercise) return 1;
      return 0;
    });
}

function getExerciseStats(user, exerciseName) {
  const history = getExerciseHistory(user, exerciseName);
  
  if (history.length === 0) {
    return {
      totalWorkouts: 0,
      firstWorkout: null,
      lastWorkout: null,
      maxWeight: 0,
      maxReps: 0,
      maxVolume: 0
    };
  }
  
  let maxWeight = 0;
  let maxReps = 0;
  let maxVolume = 0;
  
  history.forEach(w => {
    const weight = parseNumber(w.weight);
    const reps = parseNumber(w.reps);
    const sets = parseNumber(w.sets);
    const volume = weight * reps * sets;
    
    if (weight > maxWeight) maxWeight = weight;
    if (reps > maxReps) maxReps = reps;
    if (volume > maxVolume) maxVolume = volume;
  });
  
  return {
    totalWorkouts: history.length,
    firstWorkout: history[0].date,
    lastWorkout: history[history.length - 1].date,
    maxWeight: maxWeight,
    maxReps: maxReps,
    maxVolume: maxVolume
  };
}

/* ----------------------------- Handlers (workout / meal / metrics) ----------------------------- */
function handleLogWorkout(exerciseName, sets = '', reps = '', weight = '', category = '') {
  const user = state.users[state.activeUser];
  if (!user) return alert('Nenhum usuário ativo');
  
  const newLog = {
    id: Date.now(),
    date: state.currentWorkoutDay, // Use selected day instead of today
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    exercise: exerciseName,
    category: category || '',
    sets: sets || '-',
    reps: reps || '-',
    weight: weight || '-',
    completed: true
  };
  
  if (!user.workoutHistory) user.workoutHistory = [];
  user.workoutHistory.unshift(newLog);
  addOrUpdateUser(user);
  
  // Show success notification
  const details = sets && reps ? ` (${sets}x${reps}${weight ? ' @ ' + weight + 'kg' : ''})` : '';
  showNotification(`✅ Exercício registrado: ${exerciseName}${details}`, 'success');
  render();
}

// New function to handle workout logging with individual sets
function handleLogWorkoutWithSets(exerciseName, setsData, category = '') {
  const user = state.users[state.activeUser];
  if (!user) return alert('Nenhum usuário ativo');
  
  // Calculate total volume
  const totalVolume = setsData.reduce((sum, set) => sum + set.volume, 0);
  
  const newLog = {
    id: Date.now(),
    date: state.currentWorkoutDay,
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    exercise: exerciseName,
    category: category || '',
    // New structure: store individual sets
    individualSets: setsData, // Array of {setNumber, reps, weight, volume}
    totalSets: setsData.length,
    totalVolume: totalVolume,
    completed: true,
    // Keep legacy fields for backwards compatibility
    sets: setsData.length.toString(),
    reps: setsData.map(s => s.reps).join('/'),
    weight: setsData.map(s => s.weight).join('/')
  };
  
  if (!user.workoutHistory) user.workoutHistory = [];
  user.workoutHistory.unshift(newLog);
  
  // IMPORTANT: Also create/update a workout log entry for the dashboard
  createOrUpdateWorkoutLogFromExercise(user, newLog);
  
  addOrUpdateUser(user);
  
  render();
}

// Helper function to create or update a workoutLog entry when exercises are registered
function createOrUpdateWorkoutLogFromExercise(user, exerciseLog) {
  if (!user.workoutLogs) user.workoutLogs = [];
  
  const workoutDate = exerciseLog.date;
  const workoutCategory = exerciseLog.category || 'Treino';
  
  // Look for an existing workout log for this date and category
  let workoutLog = user.workoutLogs.find(w => 
    w.date === workoutDate && 
    w.name === workoutCategory &&
    w.source === 'template'
  );
  
  if (!workoutLog) {
    // Create a new workout log entry
    workoutLog = {
      id: 'workout_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11),
      date: workoutDate,
      name: workoutCategory,
      type: 'musculacao',
      startTime: exerciseLog.time,
      endTime: exerciseLog.time, // Will be updated as more exercises are added
      duration: 0, // Will be calculated based on exercises
      calories: 0, // Will be estimated from volume
      avgHeartRate: null,
      maxHeartRate: null,
      distance: null,
      avgSpeed: null,
      intensity: null,
      notes: '',
      createdAt: new Date().toISOString(),
      source: 'template', // Mark this as auto-generated from template exercises
      exercises: [] // Store exercise details
    };
    user.workoutLogs.push(workoutLog);
  }
  
  // Add the exercise to the workout log
  const exerciseDetail = {
    name: exerciseLog.exercise,
    sets: exerciseLog.individualSets.map(set => ({
      reps: set.reps,
      weight: set.weight,
      volume: set.volume
    }))
  };
  
  if (!workoutLog.exercises) workoutLog.exercises = [];
  workoutLog.exercises.push(exerciseDetail);
  
  // Update end time to the latest exercise time
  workoutLog.endTime = exerciseLog.time;
  
  // Calculate duration (difference between start and end time)
  if (workoutLog.startTime && workoutLog.endTime) {
    const [startHour, startMin] = workoutLog.startTime.split(':').map(Number);
    const [endHour, endMin] = workoutLog.endTime.split(':').map(Number);
    let duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    if (duration < 0) duration += 24 * 60; // Handle overnight
    workoutLog.duration = duration;
  }
  
  // Estimate calories from total volume (rough estimate: 1 kcal per 10 kg of volume)
  const totalVolume = workoutLog.exercises.reduce((sum, ex) => {
    return sum + ex.sets.reduce((setSum, set) => setSum + (set.volume || 0), 0);
  }, 0);
  workoutLog.calories = Math.round(totalVolume / 10);
}

function handleEditWorkout(id) {
  const user = state.users[state.activeUser];
  if (!user.workoutHistory) user.workoutHistory = [];
  const log = user.workoutHistory.find(l => l.id === id);
  if (!log) return alert('Registro não encontrado');
  
  // Prompt for new values
  const newSets = prompt(`Editar Séries\nExercício: ${log.exercise}\n\nSéries atuais: ${log.sets}`, log.sets === '-' ? '' : log.sets);
  if (newSets === null) return; // User cancelled
  
  const newReps = prompt(`Editar Repetições\nExercício: ${log.exercise}\n\nRepetições atuais: ${log.reps}`, log.reps === '-' ? '' : log.reps);
  if (newReps === null) return; // User cancelled
  
  const newWeight = prompt(`Editar Carga (kg)\nExercício: ${log.exercise}\n\nCarga atual: ${log.weight}`, log.weight === '-' ? '' : log.weight);
  if (newWeight === null) return; // User cancelled
  
  // Update the workout log
  log.sets = newSets || '-';
  log.reps = newReps || '-';
  log.weight = newWeight || '-';
  
  addOrUpdateUser(user);
  
  // Show success notification
  const details = newSets && newReps ? ` (${newSets}x${newReps}${newWeight ? ' @ ' + newWeight + 'kg' : ''})` : '';
  showNotification(`✅ Treino atualizado: ${log.exercise}${details}`, 'success');
  render();
}

function handleDeleteWorkout(id) {
  if (!confirm('Deseja excluir este registro de treino? Ele será movido para o arquivo (archive) e poderá ser restaurado.')) return;
  const user = state.users[state.activeUser];
  if (!user.workoutHistory) user.workoutHistory = [];
  const log = user.workoutHistory.find(l => l.id === id);
  if (!log) return alert('Registro não encontrado');
  archiveItem('workoutHistory', id, 'workout', log).then(() => {
    user.workoutHistory = user.workoutHistory.filter(l => l.id !== id);
    addOrUpdateUser(user);
    showNotification('✅ Registro de treino excluído e movido para archive', 'success');
    render();
  });
}

function handleLogMeal(mealName) {
  const user = state.users[state.activeUser];
  if (!user) return alert('Nenhum usuário ativo');
  // Use currentDay for meal logging, make meal name safe for storage
  const safeMealName = String(mealName); // Ensure it's a string, handles special characters
  const newLog = { 
    id: Date.now(), 
    date: state.currentDay, // Use selected day instead of today
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), 
    meal: safeMealName 
  };
  user.mealHistory.unshift(newLog);
  addOrUpdateUser(user);
  
  // Show success notification
  const nut = getMealNutritionByNameCombined(safeMealName);
  const nutInfo = nut.kcal > 0 ? ` (${nut.kcal} kcal)` : '';
  showNotification(`✅ Refeição registrada: ${safeMealName}${nutInfo}`, 'success');
}

function handleDeleteMeal(id) {
  if (!confirm('Deseja excluir este registro de refeição? Ele será movido para o arquivo (archive) e poderá ser restaurado.')) return;
  const user = state.users[state.activeUser];
  const item = user.mealHistory.find(m => m.id === id);
  if (!item) return alert('Registro não encontrado');
  archiveItem('mealHistory', id, 'meal', item).then(() => {
    user.mealHistory = user.mealHistory.filter(m => m.id !== id);
    addOrUpdateUser(user);
    showNotification('✅ Registro de refeição excluído e movido para archive', 'success');
  });
}

/* ----------------------------- Notification System ----------------------------- */
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transform transition-all duration-300 ${
    type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'
  }`;
  notification.textContent = message;
  notification.style.opacity = '0';
  notification.style.transform = 'translateY(-20px)';
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  // Animate out and remove
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/* ----------------------------- Day navigation for meals ----------------------------- */
function setCurrentDay(dateString) {
  state.currentDay = dateString;
  render();
}

function goToPreviousDay() {
  const current = new Date(state.currentDay);
  current.setDate(current.getDate() - 1);
  state.currentDay = current.toISOString().split('T')[0];
  render();
}

function goToNextDay() {
  const current = new Date(state.currentDay);
  current.setDate(current.getDate() + 1);
  state.currentDay = current.toISOString().split('T')[0];
  render();
}

function goToToday() {
  state.currentDay = new Date().toISOString().split('T')[0];
  render();
}

/* ----------------------------- Workout Day Navigation ----------------------------- */
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
        volume: parseFloat(reps) * parseFloat(weight)
      });
    }
  }
  
  if (setsData.length === 0) {
    showNotification('⚠️ Por favor, preencha pelo menos uma série', 'error');
    return;
  }
  
  // Get template to find category
  const template = templates[templateId];
  const category = template ? template.name : '';
  
  // Log workout with individual sets
  handleLogWorkoutWithSets(exerciseName, setsData, category);
  
  // Show success notification
  const totalVolume = setsData.reduce((sum, set) => sum + set.volume, 0);
  showNotification(`✅ ${exerciseName} registrado! ${setsData.length} séries • ${totalVolume.toFixed(1)} kg volume total`, 'success');
  
  // Reset form
  form.reset();
}

// Handle registering all exercises from a template at once
function handleRegisterAllExercises(templateId) {
  const template = templates[templateId];
  if (!template) {
    showNotification('❌ Treino não encontrado', 'error');
    return;
  }
  
  const session = template.sessions.A;
  if (!session || !session.exercises) {
    showNotification('❌ Nenhum exercício encontrado neste treino', 'error');
    return;
  }
  
  // Collect all forms
  const forms = document.querySelectorAll('#exercisesList form');
  let registeredCount = 0;
  let totalVolume = 0;
  
  forms.forEach((form, index) => {
    const exercise = session.exercises[index];
    if (!exercise) return;
    
    // Collect sets data
    const setsData = [];
    for (let i = 1; i <= 3; i++) {
      const reps = form['reps' + i]?.value;
      const weight = form['weight' + i]?.value;
      
      if (reps && weight) {
        const volume = parseFloat(reps) * parseFloat(weight);
        setsData.push({
          setNumber: i,
          reps: parseFloat(reps),
          weight: parseFloat(weight),
          volume: volume
        });
        totalVolume += volume;
      }
    }
    
    // Only log if at least one set is filled
    if (setsData.length > 0) {
      handleLogWorkoutWithSets(exercise.name, setsData, template.name);
      registeredCount++;
    }
  });
  
  if (registeredCount === 0) {
    showNotification('⚠️ Nenhum exercício foi preenchido', 'error');
    return;
  }
  
  showNotification(`✅ ${registeredCount} exercício(s) registrado(s)! Volume total: ${totalVolume.toFixed(1)} kg`, 'success');
  
  // Hide the form and refresh
  hideWorkoutExercises();
  render();
}

console.log('✅ Handlers module loaded');

/* ----------------------------- Custom meal handlers ----------------------------- */
function handleAddCustomMeal(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const name = formData.get('customMealName');
  const kcal = formData.get('customMealKcal');
  const prot = formData.get('customMealProt');
  const fat = formData.get('customMealFat');
  const saveAsReusable = formData.get('saveAsReusable') === 'on';
  
  if (!name || !kcal) {
    alert('Nome e calorias são obrigatórios');
    return;
  }
  
  // Check if already exists
  const exists = state.customMeals.find(m => m.name === name);
  if (exists && !confirm('Já existe uma refeição com este nome. Deseja substituir?')) {
    return;
  }
  
  const customMeal = {
    id: `custom_meal_${Date.now()}`,
    name: name.trim(),
    kcal: parseFloat(kcal) || 0,
    prot: parseFloat(prot) || 0,
    fat: parseFloat(fat) || 0,
    createdAt: new Date().toISOString(),
    createdBy: state.activeUser
  };
  
  if (saveAsReusable) {
    // Remove existing if updating
    state.customMeals = state.customMeals.filter(m => m.name !== name);
    state.customMeals.push(customMeal);
    saveCustomMeals();
  }
  
  // Always log the meal to current day
  handleLogMeal(name.trim());
  
  // Reset form
  e.target.reset();
  
  if (saveAsReusable) {
    showNotification('✅ Refeição personalizada salva e registrada!', 'success');
  }
}

function handleDeleteCustomMeal(mealId) {
  if (!confirm('Deseja excluir esta refeição personalizada permanentemente?')) return;
  state.customMeals = state.customMeals.filter(m => m.id !== mealId);
  saveCustomMeals();
  showNotification('✅ Refeição personalizada excluída', 'success');
  render();
}

/* ----------------------------- Nutrition Calculator Functions ----------------------------- */
function selectFood(category, index) {
  const food = commonFoods[category][index];
  
  // Fill calculator with food data
  document.getElementById('calcFoodName').value = food.name;
  document.getElementById('calcWeight').value = food.per;
  document.getElementById('calcProtPer100').value = (food.prot * 100 / food.per).toFixed(1);
  document.getElementById('calcCarbPer100').value = (food.carb * 100 / food.per).toFixed(1);
  document.getElementById('calcFatPer100').value = (food.fat * 100 / food.per).toFixed(1);
  
  // Scroll to calculator
  document.getElementById('calcFoodName').scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Show success notification
  showNotification(`✅ Alimento selecionado: ${food.name}`, 'success');
}

function filterFoods() {
  const searchTerm = document.getElementById('foodSearchInput').value.toLowerCase();
  const foodItems = document.querySelectorAll('.food-item');
  const categories = document.querySelectorAll('.food-category');
  
  foodItems.forEach(item => {
    const foodName = item.getAttribute('data-food-name').toLowerCase();
    if (foodName.includes(searchTerm)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
  
  // Hide categories with no visible items
  categories.forEach(category => {
    const visibleItems = Array.from(category.querySelectorAll('.food-item')).filter(item => item.style.display !== 'none');
    if (visibleItems.length === 0 && searchTerm !== '') {
      category.style.display = 'none';
    } else {
      category.style.display = 'block';
    }
  });
}

function calculateMacros() {
  const foodName = document.getElementById('calcFoodName').value;
  const weight = parseFloat(document.getElementById('calcWeight').value);
  const protPer100 = parseFloat(document.getElementById('calcProtPer100').value) || 0;
  const carbPer100 = parseFloat(document.getElementById('calcCarbPer100').value) || 0;
  const fatPer100 = parseFloat(document.getElementById('calcFatPer100').value) || 0;
  
  if (!weight || weight <= 0) {
    alert('Por favor, insira um peso válido em gramas');
    return;
  }
  
  // Calculate multiplier (weight / 100)
  const multiplier = weight / 100;
  
  // Calculate macros for the given weight
  const proteinGrams = (protPer100 * multiplier).toFixed(1);
  const carbGrams = (carbPer100 * multiplier).toFixed(1);
  const fatGrams = (fatPer100 * multiplier).toFixed(1);
  
  // Calculate calories (protein: 4kcal/g, carbs: 4kcal/g, fat: 9kcal/g)
  const proteinKcal = (proteinGrams * 4).toFixed(1);
  const carbKcal = (carbGrams * 4).toFixed(1);
  const fatKcal = (fatGrams * 9).toFixed(1);
  const totalKcal = (parseFloat(proteinKcal) + parseFloat(carbKcal) + parseFloat(fatKcal)).toFixed(1);
  
  // Update results
  document.getElementById('resultProt').textContent = proteinGrams + 'g';
  document.getElementById('resultProtKcal').textContent = proteinKcal + ' kcal';
  document.getElementById('resultCarb').textContent = carbGrams + 'g';
  document.getElementById('resultCarbKcal').textContent = carbKcal + ' kcal';
  document.getElementById('resultFat').textContent = fatGrams + 'g';
  document.getElementById('resultFatKcal').textContent = fatKcal + ' kcal';
  document.getElementById('resultTotal').textContent = totalKcal + ' kcal';
  
  // Show results
  document.getElementById('calcResults').classList.remove('hidden');
  
  // Show success notification
  showNotification(`✅ Calculado: ${weight}g de ${foodName || 'alimento'} = ${totalKcal} kcal`, 'success');
}

function fillCalculatorExample(name, weight, prot, carb, fat) {
  document.getElementById('calcFoodName').value = name;
  document.getElementById('calcWeight').value = weight;
  document.getElementById('calcProtPer100').value = prot;
  document.getElementById('calcCarbPer100').value = carb;
  document.getElementById('calcFatPer100').value = fat;
  
  // Auto-calculate
  calculateMacros();
  
  // Scroll to calculator
  document.getElementById('calcFoodName').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ----------------------------- Meal Composition Functions ----------------------------- */

// Reset meal composition
function resetMealComposition() {
  state.currentMealComposition = {
    name: '',
    components: [],
    totalProt: 0,
    totalCarb: 0,
    totalFat: 0,
    totalKcal: 0,
    totalWeight: 0
  };
  render();
}

// Add component to meal composition
function addComponentToMeal() {
  const foodName = document.getElementById('calcFoodName').value;
  const weight = parseFloat(document.getElementById('calcWeight').value);
  const protPer100 = parseFloat(document.getElementById('calcProtPer100').value) || 0;
  const carbPer100 = parseFloat(document.getElementById('calcCarbPer100').value) || 0;
  const fatPer100 = parseFloat(document.getElementById('calcFatPer100').value) || 0;
  
  if (!foodName || !weight || weight <= 0) {
    alert('Por favor, preencha o nome do alimento e um peso válido');
    return;
  }
  
  // Calculate multiplier (weight / 100)
  const multiplier = weight / 100;
  
  // Calculate macros for the given weight
  const prot = parseFloat((protPer100 * multiplier).toFixed(1));
  const carb = parseFloat((carbPer100 * multiplier).toFixed(1));
  const fat = parseFloat((fatPer100 * multiplier).toFixed(1));
  const kcal = parseFloat((prot * 4 + carb * 4 + fat * 9).toFixed(1));
  
  // Add component
  const component = {
    id: Date.now(),
    foodName: foodName.trim(),
    weight: weight,
    prot: prot,
    carb: carb,
    fat: fat,
    kcal: kcal
  };
  
  state.currentMealComposition.components.push(component);
  
  // Update totals
  updateMealCompositionTotals();
  
  // Clear calculator inputs for next component
  document.getElementById('calcFoodName').value = '';
  document.getElementById('calcWeight').value = '';
  document.getElementById('calcProtPer100').value = '';
  document.getElementById('calcCarbPer100').value = '';
  document.getElementById('calcFatPer100').value = '';
  document.getElementById('calcResults').classList.add('hidden');
  
  showNotification(`✅ Componente adicionado: ${weight}g de ${foodName}`, 'success');
  render();
}

// Remove component from meal composition
function removeComponentFromMeal(componentId) {
  state.currentMealComposition.components = state.currentMealComposition.components.filter(c => c.id !== componentId);
  updateMealCompositionTotals();
  render();
}

// Update meal composition totals
function updateMealCompositionTotals() {
  const totals = state.currentMealComposition.components.reduce((acc, comp) => {
    acc.prot += comp.prot;
    acc.carb += comp.carb;
    acc.fat += comp.fat;
    acc.kcal += comp.kcal;
    acc.weight += comp.weight;
    return acc;
  }, { prot: 0, carb: 0, fat: 0, kcal: 0, weight: 0 });
  
  state.currentMealComposition.totalProt = parseFloat(totals.prot.toFixed(1));
  state.currentMealComposition.totalCarb = parseFloat(totals.carb.toFixed(1));
  state.currentMealComposition.totalFat = parseFloat(totals.fat.toFixed(1));
  state.currentMealComposition.totalKcal = parseFloat(totals.kcal.toFixed(1));
  state.currentMealComposition.totalWeight = parseFloat(totals.weight.toFixed(1));
}

// Save composed meal to history
function saveComposedMeal() {
  if (state.currentMealComposition.components.length === 0) {
    alert('Adicione pelo menos um componente à refeição');
    return;
  }
  
  const mealName = prompt('Digite um nome para esta refeição composta:', state.currentMealComposition.name || 'Refeição Personalizada');
  if (!mealName) return;
  
  state.currentMealComposition.name = mealName.trim();
  
  const user = state.users[state.activeUser];
  const now = new Date();
  const time = now.toTimeString().slice(0, 5);
  
  // Create a meal log entry with composition details
  const composedMealLog = {
    id: Date.now(),
    date: state.currentDay,
    time: time,
    meal: state.currentMealComposition.name,
    isComposed: true,
    components: state.currentMealComposition.components,
    totalProt: state.currentMealComposition.totalProt,
    totalCarb: state.currentMealComposition.totalCarb,
    totalFat: state.currentMealComposition.totalFat,
    totalKcal: state.currentMealComposition.totalKcal,
    totalWeight: state.currentMealComposition.totalWeight
  };
  
  user.mealHistory.unshift(composedMealLog);
  
  saveAllToDB();
  showNotification(`✅ Refeição "${mealName}" salva no histórico!`, 'success');
  
  // Ask if user wants to save as reusable template
  if (confirm('Deseja salvar esta refeição como modelo reutilizável?')) {
    saveComposedMealAsTemplate();
  }
  
  // Reset composition
  resetMealComposition();
}

// Save composed meal as reusable template
function saveComposedMealAsTemplate() {
  const customMeal = {
    id: `custom_meal_${Date.now()}`,
    name: state.currentMealComposition.name,
    kcal: state.currentMealComposition.totalKcal,
    prot: state.currentMealComposition.totalProt,
    carb: state.currentMealComposition.totalCarb,
    fat: state.currentMealComposition.totalFat,
    isComposed: true,
    components: state.currentMealComposition.components,
    createdAt: new Date().toISOString(),
    createdBy: state.activeUser
  };
  
  // Remove existing if updating
  state.customMeals = state.customMeals.filter(m => m.name !== customMeal.name);
  state.customMeals.push(customMeal);
  saveCustomMeals();
  
  showNotification('✅ Refeição salva como modelo reutilizável!', 'success');
}

/* ----------------------------- Custom workout handler ----------------------------- */
function handleAddCustomWorkout(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const exercise = formData.get('customExercise');
  const sets = formData.get('customSets');
  const reps = formData.get('customReps');
  const weight = formData.get('customWeight');
  
  if (!exercise) {
    alert('Nome do exercício é obrigatório');
    return;
  }
  
  handleLogWorkout(exercise, sets, reps, weight);
  e.target.reset();
}

/* ----------------------------- BMR calculation ----------------------------- */
function calculateBMR(weightKg, heightCm, age, gender) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(base + (gender === 'female' ? -161 : 5));
}

/* ----------------------------- Metrics add/delete ----------------------------- */
function handleAddMetrics(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const weight = parseFloat(formData.get('weight'));
  const heightCm = state.users[state.activeUser].height;
  const age = state.users[state.activeUser].age || 30;
  const gender = state.users[state.activeUser].gender || 'male';
  const waterPercent = parseFloat(formData.get('waterPercent')) || 0;
  const muscleSize = parseFloat(formData.get('muscleSize')) || 0;
  const bmr = formData.get('bmr') ? parseFloat(formData.get('bmr')) : calculateBMR(weight, heightCm, age, gender);
  const waterWeight = parseFloat((weight * (waterPercent / 100)).toFixed(2));
  
  const newMetric = {
    id: Date.now().toString(),
    date: formData.get('date'),
    weight: weight,
    bodyFat: parseFloat(formData.get('bodyFat')),
    muscleMass: parseFloat(formData.get('muscleMass')),
    visceralFat: parseFloat(formData.get('visceralFat')) || 0,
    waterPercent: waterPercent,
    waterWeight: waterWeight,
    bmr: bmr,
    muscleSize: muscleSize,
    bmi: parseFloat((weight / Math.pow(heightCm / 100, 2)).toFixed(1)),
    
    // Segmented muscle mass
    muscleMassRightArm: parseFloat(formData.get('muscleMassRightArm')) || 0,
    muscleMassLeftArm: parseFloat(formData.get('muscleMassLeftArm')) || 0,
    muscleMassRightLeg: parseFloat(formData.get('muscleMassRightLeg')) || 0,
    muscleMassLeftLeg: parseFloat(formData.get('muscleMassLeftLeg')) || 0,
    muscleMassTrunk: parseFloat(formData.get('muscleMassTrunk')) || 0,
    
    // Segmented body fat
    bodyFatRightArm: parseFloat(formData.get('bodyFatRightArm')) || 0,
    bodyFatLeftArm: parseFloat(formData.get('bodyFatLeftArm')) || 0,
    bodyFatRightLeg: parseFloat(formData.get('bodyFatRightLeg')) || 0,
    bodyFatLeftLeg: parseFloat(formData.get('bodyFatLeftLeg')) || 0,
    bodyFatTrunk: parseFloat(formData.get('bodyFatTrunk')) || 0,
    
    // Advanced body composition
    boneMass: parseFloat(formData.get('boneMass')) || 0,
    proteinMass: parseFloat(formData.get('proteinMass')) || 0,
    mineralMass: parseFloat(formData.get('mineralMass')) || 0,
    
    // Metabolic rates
    rmr: parseFloat(formData.get('rmr')) || 0,
    tdee: parseFloat(formData.get('tdee')) || 0,
    
    // Bioelectrical impedance
    impedance: parseFloat(formData.get('impedance')) || 0,
    phaseAngle: parseFloat(formData.get('phaseAngle')) || 0,
    reactance: parseFloat(formData.get('reactance')) || 0,
    resistance: parseFloat(formData.get('resistance')) || 0,
    
    // Ages
    metabolicAge: parseInt(formData.get('metabolicAge')) || 0,
    bodyAge: parseInt(formData.get('bodyAge')) || 0,
    
    // Circumferences
    chest: parseFloat(formData.get('chest')) || 0,
    waist: parseFloat(formData.get('waist')) || 0,
    abdomen: parseFloat(formData.get('abdomen')) || 0,
    hips: parseFloat(formData.get('hips')) || 0,
    rightArm: parseFloat(formData.get('rightArm')) || 0,
    leftArm: parseFloat(formData.get('leftArm')) || 0,
    rightForearm: parseFloat(formData.get('rightForearm')) || 0,
    leftForearm: parseFloat(formData.get('leftForearm')) || 0,
    rightThigh: parseFloat(formData.get('rightThigh')) || 0,
    leftThigh: parseFloat(formData.get('leftThigh')) || 0,
    rightCalf: parseFloat(formData.get('rightCalf')) || 0,
    leftCalf: parseFloat(formData.get('leftCalf')) || 0,
    neck: parseFloat(formData.get('neck')) || 0,
    shoulders: parseFloat(formData.get('shoulders')) || 0
  };
  
  const user = state.users[state.activeUser];
  user.bodyMetrics.push(newMetric);
  user.bodyMetrics.sort((a, b) => new Date(a.date) - new Date(b.date));
  addOrUpdateUser(user);
  
  showNotification('✅ Medição completa adicionada com sucesso!', 'success');
  
  // redraw chart if on evolução
  if (state.activeTab === 'evolucao') setTimeout(() => renderMuscleEvolutionChart(user.bodyMetrics, user.id), 150);
  e.target.reset();
}

/* When deleting a metric, move it to archive rather than permanently delete */
function handleDeleteMetric(metricId) {
  if (!confirm('Deseja excluir esta medida? Ela será movida para o arquivo (archive) e poderá ser restaurada.')) return;
  const user = state.users[state.activeUser];
  const metric = user.bodyMetrics.find(m => m.id === metricId);
  if (!metric) return alert('Medida não encontrada');
  archiveItem('bodyMetrics', metricId, 'metric', metric).then(() => {
    user.bodyMetrics = user.bodyMetrics.filter(m => m.id !== metricId);
    addOrUpdateUser(user);
    showNotification('✅ Medida excluída e movida para archive', 'success');
  });
}

function handleWebhookFormSubmit(e) {
  e.preventDefault();
  const webhookUrl = document.getElementById('webhookUrl').value;
  const webhookAuthHeader = document.getElementById('webhookAuthHeader').value;
  
  const user = state.users[state.activeUser];
  if (!user) return alert('Usuário não encontrado');
  
  user.webhookUrl = webhookUrl;
  user.webhookAuthHeader = webhookAuthHeader;
  addOrUpdateUser(user);
  
  alert('✅ Webhook configurado com sucesso!');
  render();
}

/* ----------------------------- Profiles handlers ----------------------------- */
function handleAddProfile() {
  const name = prompt('Nome do novo perfil: (ex: João)');
  if (!name) return;
  const gender = prompt('Gênero (male/female):', 'male') || 'male';
  const age = parseInt(prompt('Idade:', '25')) || 25;
  const height = parseInt(prompt('Altura em cm:', '170')) || 170;
  const idBase = name.trim().toLowerCase().replace(/\s+/g, '_');
  const id = `${idBase}_${Date.now()}`;
  const user = {
    id,
    name,
    gender: gender === 'female' ? 'female' : 'male',
    age,
    height,
    workoutHistory: [],
    mealHistory: [],
    bodyMetrics: [{
      id: 'm_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      weight: 0,
      bodyFat: 0,
      muscleMass: 0,
      visceralFat: 0,
      waterPercent: 0,
      waterWeight: 0,
      bmr: calculateBMR(0, height, age, gender),
      muscleSize: 0,
      bmi: 0
    }],
    goals: { weight: 0, bodyFat: 0, muscleMass: 0 },
    customPrograms: {}
  };
  addOrUpdateUser(user);
  alert('✅ Perfil criado: ' + name);
}

/* Soft-delete profile (moves to archive), never removes without explicit user's permanent deletion action */
function handleDeleteProfile(userId) {
  if (!confirm('Deseja mover este perfil para archive (preservará TODOS os registros)?')) return;
  const user = state.users[userId];
  if (!user) return alert('Perfil não encontrado');
  archiveItem(STORE_USERS, userId, 'user', user).then(() => {
    delete state.users[userId];
    try { dbDelete(STORE_USERS, userId).catch(()=>{}); } catch(e){}
    saveLS('ft_users', state.users);
    updateState({ users: state.users });
    alert('✅ Perfil movido para archive. Para excluir permanentemente vá no archive e remova manualmente.');
  });
}

/* ----------------------------- Profile Linking Handlers ----------------------------- */
async function handleLinkProfile(profileId) {
  try {
    await linkProfileToAccount(authState.currentAccount.username, profileId);
    
    // Update current auth state
    if (!authState.currentAccount.linkedProfiles) {
      authState.currentAccount.linkedProfiles = [];
    }
    if (!authState.currentAccount.linkedProfiles.includes(profileId)) {
      authState.currentAccount.linkedProfiles.push(profileId);
    }
    
    alert(`✅ Perfil vinculado com sucesso!`);
    render();
  } catch (error) {
    alert(`❌ Erro ao vincular perfil: ${error.message}`);
  }
}

async function handleUnlinkProfile(profileId) {
  if (!confirm('Deseja realmente desvincular este perfil da sua conta?')) return;
  
  try {
    await unlinkProfileFromAccount(authState.currentAccount.username, profileId);
    
    // Update current auth state
    if (authState.currentAccount.linkedProfiles) {
      authState.currentAccount.linkedProfiles = authState.currentAccount.linkedProfiles.filter(p => p !== profileId);
    }
    
    alert(`✅ Perfil desvinculado com sucesso!`);
    render();
  } catch (error) {
    alert(`❌ Erro ao desvincular perfil: ${error.message}`);
  }
}

/* ----------------------------- Templates application & custom programs ----------------------------- */
function applyTemplateToUser(templateId, userId) {
  const tmpl = templates[templateId];
  if (!tmpl) return alert('Template não encontrado');
  const user = state.users[userId];
  if (!user) return alert('Usuário não encontrado');
  user.customPrograms = user.customPrograms || {};
  user.customPrograms[tmpl.id] = JSON.parse(JSON.stringify(tmpl)); // deep copy
  addOrUpdateUser(user);
  alert(`✅ Template "${tmpl.name}" aplicado e salvo no perfil ${user.name}.`);
}

function removeUserProgram(userId, programId) {
  const user = state.users[userId];
  if (!user || !user.customPrograms) return;
  if (!confirm('Remover este programa do perfil? (não exclui do archive)')) return;
  delete user.customPrograms[programId];
  addOrUpdateUser(user);
  alert('✅ Programa removido do perfil.');
}

/* ----------------------------- References import / export / clear ----------------------------- */
function importScientificStudiesSeed() {
  const idsExisting = new Set(state.references.map(r => r.id));
  let added = 0;
  scientificStudiesSeed.forEach(ref => {
    if (!idsExisting.has(ref.id)) {
      state.references.push(ref);
      added++;
    }
  });
  if (added > 0) {
    saveAllToDB();
    alert(`✅ Importados ${added} estudos (2020 → 2025-11).`);
  } else {
    alert('ℹ️ Estudos já importados anteriormente.');
  }
  render();
}

function exportReferencesJSON() {
  const dataStr = JSON.stringify(state.references, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `studies_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function clearReferences() {
  if (!confirm('Deseja mover todas as referências para archive? Elas ficarão preservadas em archive.')) return;
  // move each to archive
  Promise.all(state.references.map(r => archiveItem(STORE_REFERENCES, r.id, 'reference', r))).then(() => {
    state.references = [];
    saveAllToDB();
    alert('✅ Referências movidas para archive.local');
    render();
  }).catch(err => alert('Erro ao mover referências para archive: ' + err));
}

/* ----------------------------- Export muscle evolution CSV ----------------------------- */
function exportMuscleEvolutionCSV(userId) {
  const user = state.users[userId];
  if (!user) return alert('Usuário não encontrado');
  const rows = [['date','weight','bodyFat','muscleMass','muscleSize','waterWeight','bmr']];
  (user.bodyMetrics || []).forEach(m => {
    rows.push([m.date, m.weight, m.bodyFat, m.muscleMass, m.muscleSize, m.waterWeight, m.bmr]);
  });
  const csv = rows.map(r => r.map(cell => (typeof cell === 'string' && cell.includes(',')) ? `"${cell}"` : cell).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${userId}_muscle_evolution_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ----------------------------- API Key and Webhook Management ----------------------------- */
function generateApiKey(userId) {
  const user = state.users[userId];
  if (!user) return alert('Usuário não encontrado');
  
  // Generate a UUID v4 style API key
  const apiKey = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  
  user.apiKey = apiKey;
  addOrUpdateUser(user);
  alert('✅ API Key gerada com sucesso!');
  render();
}

function revokeApiKey(userId) {
  if (!confirm('Tem certeza que deseja revogar a API Key? Isso pode quebrar integrações existentes.')) return;
  
  const user = state.users[userId];
  if (!user) return alert('Usuário não encontrado');
  
  user.apiKey = '';
  addOrUpdateUser(user);
  alert('✅ API Key revogada com sucesso!');
  render();
}

function copyToClipboard(text) {
  if (!text) return alert('Nenhum texto para copiar');
  
  navigator.clipboard.writeText(text).then(() => {
    alert('✅ Copiado para a área de transferência!');
  }).catch(err => {
    alert('❌ Erro ao copiar: ' + err);
  });
}

function toggleWebhookAuthVisibility() {
  const input = document.getElementById('webhookAuthHeader');
  if (!input) return;
  
  input.type = input.type === 'password' ? 'text' : 'password';
}

/* ----------------------------- Hevy API Integration ----------------------------- */
async function saveHevyApiKey(userId) {
  const user = state.users[userId];
  if (!user) return alert('Usuário não encontrado');
  
  const apiKeyInput = document.getElementById('hevyApiKeyInput');
  if (!apiKeyInput) return alert('Campo de API Key não encontrado');
  
  const hevyApiKey = apiKeyInput.value.trim();
  if (!hevyApiKey) return alert('Por favor, insira uma API Key válida');
  
  user.hevyApiKey = hevyApiKey;
  addOrUpdateUser(user);
  alert('✅ Hevy API Key salva com sucesso!');
  render();
}

async function syncHevyWorkouts(userId) {
  const user = state.users[userId];
  if (!user) return alert('Usuário não encontrado');
  
  if (!user.hevyApiKey) {
    return alert('❌ Por favor, configure sua Hevy API Key primeiro');
  }
  
  const syncButton = document.getElementById('syncHevyButton');
  const statusDiv = document.getElementById('hevyStatus');
  
  if (syncButton) syncButton.disabled = true;
  if (statusDiv) statusDiv.innerHTML = '<p class="text-yellow-300">⏳ Sincronizando com Hevy...</p>';
  
  try {
    // Fetch workouts from Hevy API
    const response = await fetch('https://api.hevyapp.com/v1/workouts', {
      method: 'GET',
      headers: {
        'api-key': user.hevyApiKey,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API Hevy: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const workouts = data.workouts || [];
    
    if (workouts.length === 0) {
      if (statusDiv) statusDiv.innerHTML = '<p class="text-blue-300">ℹ️ Nenhum treino encontrado no Hevy</p>';
      return;
    }
    
    // Convert Hevy workouts to our format
    let importedCount = 0;
    for (const hevyWorkout of workouts) {
      // Check if workout already exists (avoid duplicates)
      const workoutId = `hevy_${hevyWorkout.id}`;
      const existingWorkout = user.workoutLogs.find(w => w.id === workoutId);
      
      if (existingWorkout) continue; // Skip if already imported
      
      // Convert Hevy workout to our format
      const workoutLog = {
        id: workoutId,
        date: hevyWorkout.start_time ? new Date(hevyWorkout.start_time).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        title: hevyWorkout.title || 'Treino do Hevy',
        description: hevyWorkout.description || '',
        duration: hevyWorkout.duration_seconds ? Math.round(hevyWorkout.duration_seconds / 60) : 0,
        exercises: [],
        source: 'hevy',
        hevyId: hevyWorkout.id
      };
      
      // Convert exercises
      if (hevyWorkout.exercises && Array.isArray(hevyWorkout.exercises)) {
        for (const hevyExercise of hevyWorkout.exercises) {
          const exercise = {
            name: hevyExercise.title || hevyExercise.exercise_template?.title || 'Exercício',
            sets: []
          };
          
          // Convert sets
          if (hevyExercise.sets && Array.isArray(hevyExercise.sets)) {
            for (const hevySet of hevyExercise.sets) {
              if (hevySet.set_type === 'warmup') continue; // Skip warmup sets
              
              const set = {
                reps: hevySet.reps || 0,
                weight: hevySet.weight_kg || 0,
                restTime: hevySet.rest_seconds || 60
              };
              
              exercise.sets.push(set);
            }
          }
          
          if (exercise.sets.length > 0) {
            workoutLog.exercises.push(exercise);
          }
        }
      }
      
      // Add workout to user's logs
      if (workoutLog.exercises.length > 0) {
        user.workoutLogs.push(workoutLog);
        importedCount++;
      }
    }
    
    // Save updated user data
    if (importedCount > 0) {
      addOrUpdateUser(user);
      if (statusDiv) {
        statusDiv.innerHTML = `<p class="text-green-300">✅ ${importedCount} treino(s) importado(s) com sucesso!</p>`;
      }
      render();
    } else {
      if (statusDiv) {
        statusDiv.innerHTML = '<p class="text-blue-300">ℹ️ Todos os treinos do Hevy já foram importados</p>';
      }
    }
    
  } catch (error) {
    console.error('Erro ao sincronizar com Hevy:', error);
    if (statusDiv) {
      statusDiv.innerHTML = `<p class="text-red-300">❌ Erro: ${error.message}</p>`;
    }
  } finally {
    if (syncButton) syncButton.disabled = false;
  }
}

function toggleHevyApiKeyVisibility() {
  const input = document.getElementById('hevyApiKeyInput');
  if (!input) return;
  
  input.type = input.type === 'password' ? 'text' : 'password';
}

/* ----------------------------- References helper for UI ----------------------------- */
function getReferencesByTags(tags) {
  if (!tags || !tags.length) return [];
  const refs = state.references || [];
  return refs.filter(r => r.tags && r.tags.some(t => tags.includes(t)));
}
function getTopReferencesByTags(tags, limit = 3) {
  const matched = getReferencesByTags(tags);
  matched.sort((a, b) => (b.year || 0) - (a.year || 0));
  return matched.slice(0, limit);
}
function renderReferenceLinksHTML(refs) {
  if (!refs || !refs.length) return '';
  return refs.map(r => `<a href="${r.link}" target="_blank" class="text-blue-300 underline">${r.authors} ${r.year}</a>`).join(' • ');
}
function buildReferenceNotesForWorkout(workoutName) {
  // References have been moved to dedicated page
  return '';
}
function buildReferenceNotesForNutrition() {
  // References have been moved to dedicated page
  return '';
}

/* ----------------------------- Event Delegation for Meal Buttons -----------------------------
   This function attaches event listeners to meal registration buttons using event delegation.
   This approach is more robust than inline onclick handlers and handles special characters properly.
------------------------------------------------------------------------------------------------ */
function attachMealButtons() {
  const mealButtons = document.querySelectorAll('.meal-register-btn');
  mealButtons.forEach(btn => {
    // Remove old listener if exists by replacing with a new one
    btn.onclick = function(e) {
      e.preventDefault();
      const mealName = this.getAttribute('data-meal-name');
      if (mealName) {
        handleLogMeal(mealName);
      }
    };
  });
}

function attachMealDeleteButtons() {
  const deleteButtons = document.querySelectorAll('.meal-delete-btn');
  deleteButtons.forEach(btn => {
    btn.onclick = function(e) {
      e.preventDefault();
      const mealId = parseInt(this.getAttribute('data-meal-id'));
      if (mealId) {
        handleDeleteMeal(mealId);
      }
    };
  });
}

function attachWorkoutButtons() {
  const workoutButtons = document.querySelectorAll('.workout-register-btn');
  workoutButtons.forEach(btn => {
    btn.onclick = function(e) {
      e.preventDefault();
      const exercise = this.getAttribute('data-exercise');
      const category = this.getAttribute('data-category');
      
      // Prompt for sets, reps, and weight
      const sets = prompt(`Registrar: ${exercise}\n\nQuantas séries você fez?`, '3');
      if (sets === null) return; // User cancelled
      
      const reps = prompt(`Registrar: ${exercise}\n\nQuantas repetições por série?`, '3');
      if (reps === null) return; // User cancelled
      
      const weight = prompt(`Registrar: ${exercise}\n\nQual carga você usou? (kg)\nDeixe em branco se não aplicável`, '');
      if (weight === null) return; // User cancelled
      
      if (exercise) {
        handleLogWorkout(exercise, sets, reps, weight, category);
      }
    };
  });
}

function attachWorkoutDeleteButtons() {
  const deleteButtons = document.querySelectorAll('.workout-delete-btn');
  deleteButtons.forEach(btn => {
    btn.onclick = function(e) {
      e.preventDefault();
      const workoutId = parseInt(this.getAttribute('data-workout-id'));
      if (workoutId) {
        handleDeleteWorkout(workoutId);
      }
    };
  });
}

/* ========================================================================
   DASHBOARD HELPER FUNCTIONS - Research-Based Usability Enhancements
   Implements progressive disclosure, guided navigation, and keyboard shortcuts
   Based on: Usability Evaluation of Dashboards (2023), Behavioral Indicators (2025)
   ======================================================================== */

// Toggle help panel visibility (Progressive Disclosure Principle)
function toggleDashboardHelp() {
  const panel = document.getElementById('dashboardHelpPanel');
  if (panel) {
    panel.classList.toggle('hidden');
  }
}

// Toggle photo section in workouts (Progressive Disclosure)
function togglePhotoSection() {
  const section = document.getElementById('photoSection');
  const icon = document.getElementById('togglePhotoIcon');
  const text = document.getElementById('togglePhotoText');
  
  if (section) {
    const isHidden = section.classList.toggle('hidden');
    if (icon) icon.textContent = isHidden ? '▼' : '▲';
    if (text) text.textContent = isHidden ? 'Mostrar Fotos' : 'Ocultar Fotos';
  }
}

// Toggle scientific references panel (Progressive Disclosure)
// Toggle period comparison view (Future enhancement placeholder)
function togglePeriodComparison() {
  showNotification('📊 Comparação de períodos será implementada em breve!', 'info');
  // TODO: Implement period comparison modal
}

// Keyboard shortcuts for dashboard navigation (Usability Enhancement)
document.addEventListener('keydown', function(e) {
  // Ignore if user is typing in an input field
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    return;
  }
  
  // Keyboard shortcuts
  switch(e.key.toLowerCase()) {
    case 'd':
      state.activeTab = 'dashboard';
      updateHash();
      render();
      break;
    case 't':
      state.activeTab = 'treino';
      updateHash();
      render();
      break;
    case 'n':
      state.activeTab = 'alimentacao';
      updateHash();
      render();
      break;
    case 'e':
      state.activeTab = 'evolucao';
      updateHash();
      render();
      break;
    case '?':
      // Show keyboard shortcuts help
      toggleDashboardHelp();
      break;
  }
});

/* ----------------------------- HASH-BASED URL ROUTING (2025 Enhancement) -----------------------------
   Implements clean URL structure for better navigation and bookmarking:
   - /#dashboard - Main dashboard
   - /#treino - Workout tracking page
   - /#nutricao - Nutrition page
   - /#alimentacao - Meal management
   - /#admin - Admin panel (requires admin role)
   
   This provides a logical "genealogical tree" structure while maintaining SPA benefits.
-------------------------------------------------------------------------------------------------------- */

// Update URL hash when tab changes
function updateHash() {
  const hashMap = {
    'dashboard': '#dashboard',
    'treino': '#treino',
    'exercicios': '#exercicios',
    'nutricao': '#nutricao',
    'alimentacao': '#nutricao/alimentacao',
    'evolucao': '#evolucao',
    'referencias': '#referencias',
    'developer': '#developer',
    'admin_tasks': '#admin/tarefas',
    'admin_suggestions': '#admin/sugestoes',
    'admin_security': '#admin/seguranca',
    'admin_changelog': '#admin/changelog',
    'suggestions': '#sugestoes'
  };
  
  const hash = hashMap[state.activeTab] || '#dashboard';
  if (window.location.hash !== hash) {
    window.location.hash = hash;
  }
}

// Load tab from URL hash
function loadFromHash() {
  const hash = window.location.hash.slice(1); // Remove #
  
  const tabMap = {
    '': 'dashboard',
    'dashboard': 'dashboard',
    'treino': 'treino',
    'exercicios': 'exercicios',
    'nutricao': 'nutricao',
    'nutricao/alimentacao': 'alimentacao',
    'alimentacao': 'alimentacao',
    'evolucao': 'evolucao',
    'referencias': 'referencias',
    'developer': 'developer',
    'admin': 'admin_tasks',
    'admin/tarefas': 'admin_tasks',
    'admin/sugestoes': 'admin_suggestions',
    'admin/seguranca': 'admin_security',
    'admin/changelog': 'admin_changelog',
    'paineladmin': 'admin_tasks', // Alias for admin panel
    'sugestoes': 'suggestions'
  };
  
  const newTab = tabMap[hash] || 'dashboard';
  
  // Check admin access
  if (newTab.startsWith('admin_') && !isAdmin()) {
    showNotification('⛔ Acesso negado. Você precisa ser administrador.', 'error');
    state.activeTab = 'dashboard';
    updateHash();
    return;
  }
  
  state.activeTab = newTab;
}

// Listen for hash changes (back/forward navigation)
window.addEventListener('hashchange', () => {
  loadFromHash();
  render();
});

/* ----------------------------- RENDER (UI) -----------------------------
   The UI is intentionally verbose and explanatory to ensure clarity for you.
   Buttons that perform deletions will refer to archive workflow; nothing is removed
   permanently without explicit permanent-delete action in archive manager.
----------------------------------------------------------------------------- */

