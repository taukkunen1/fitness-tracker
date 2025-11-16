/**
 * Authentication UI Module
 * Handles login page rendering and auth-related UI functions
 * @module auth/auth-ui
 */

function renderLoginPage() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div class="max-w-md w-full">
        <!-- Logo and Title -->
        <div class="text-center mb-8">
          <div class="text-5xl font-bold mb-2">
            <!-- Pilgrim journey logo: walking figure with path dots -->
            <span style="letter-spacing: -0.1em;">🚶‍♂️···⛰️</span>
          </div>
          <h2 class="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Pilgrim
          </h2>
          <p class="text-slate-300 text-sm">Sistema seguro de acompanhamento fitness</p>
        </div>

        <!-- Security Features Badge -->
        <div class="bg-gradient-to-r from-green-900 to-emerald-900 p-4 rounded-lg mb-6 border border-green-500">
          <h3 class="font-bold text-green-300 mb-2 flex items-center gap-2">
            🔐 Proteções de Segurança 2025
          </h3>
          <div class="text-xs text-green-200 space-y-1">
            <p>✓ Criptografia de senha com PBKDF2 (100k iterações)</p>
            <p>✓ Proteção contra brute force e XSS</p>
            <p>✓ Rate limiting e CSRF protection</p>
            <p>✓ Dados armazenados localmente (privacidade garantida)</p>
          </div>
        </div>

        <!-- Login/Register Tabs -->
        <div class="bg-slate-800 rounded-lg shadow-2xl overflow-hidden border border-purple-500/30">
          <!-- Tab Headers -->
          <div class="flex border-b border-slate-700">
            <button 
              id="loginTab" 
              onclick="switchAuthTab('login')" 
              class="flex-1 py-3 px-4 font-semibold bg-purple-600 text-white"
            >
              Entrar
            </button>
            <button 
              id="registerTab" 
              onclick="switchAuthTab('register')" 
              class="flex-1 py-3 px-4 font-semibold bg-slate-700 text-slate-300 hover:bg-slate-600"
            >
              Registrar
            </button>
          </div>

          <!-- Login Form -->
          <div id="loginForm" class="p-6">
            <form onsubmit="handleLoginSubmit(event)" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">
                  Usuário
                </label>
                <input 
                  type="text" 
                  id="loginUsername" 
                  name="username" 
                  required 
                  class="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Seu nome de usuário"
                  autocomplete="username"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">
                  Senha
                </label>
                <input 
                  type="password" 
                  id="loginPassword" 
                  name="password" 
                  required 
                  class="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Sua senha"
                  autocomplete="current-password"
                />
              </div>

              <div id="loginError" class="hidden bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm"></div>

              <button 
                type="submit" 
                class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-lg transition-all"
              >
                🔐 Entrar
              </button>
            </form>
          </div>

          <!-- Register Form -->
          <div id="registerForm" class="p-6 hidden">
            <form onsubmit="handleRegisterSubmit(event)" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">
                  Nome de usuário
                </label>
                <input 
                  type="text" 
                  id="registerUsername" 
                  name="username" 
                  required 
                  pattern="[a-zA-Z0-9_]{3,20}"
                  class="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="3-20 caracteres (letras, números, _)"
                  autocomplete="username"
                />
                <p class="text-xs text-slate-400 mt-1">Apenas letras, números e underscore</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input 
                  type="email" 
                  id="registerEmail" 
                  name="email" 
                  required 
                  class="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="seu@email.com"
                  autocomplete="email"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">
                  Senha
                </label>
                <input 
                  type="password" 
                  id="registerPassword" 
                  name="password" 
                  required 
                  class="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Senha forte"
                  autocomplete="new-password"
                />
                <div class="mt-2 space-y-1 text-xs">
                  <p class="text-slate-400">Requisitos da senha:</p>
                  <div class="flex flex-wrap gap-2">
                    <span id="reqLength" class="px-2 py-1 rounded bg-slate-700 text-slate-400">Mín. 8 caracteres</span>
                    <span id="reqUpper" class="px-2 py-1 rounded bg-slate-700 text-slate-400">Maiúscula</span>
                    <span id="reqLower" class="px-2 py-1 rounded bg-slate-700 text-slate-400">Minúscula</span>
                    <span id="reqNumber" class="px-2 py-1 rounded bg-slate-700 text-slate-400">Número</span>
                    <span id="reqSpecial" class="px-2 py-1 rounded bg-slate-700 text-slate-400">Especial</span>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">
                  Confirmar senha
                </label>
                <input 
                  type="password" 
                  id="registerPasswordConfirm" 
                  name="passwordConfirm" 
                  required 
                  class="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Digite a senha novamente"
                  autocomplete="new-password"
                />
              </div>

              <div id="registerError" class="hidden bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm"></div>
              <div id="registerSuccess" class="hidden bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg text-sm"></div>

              <button 
                type="submit" 
                class="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-all"
              >
                ✨ Criar Conta
              </button>
            </form>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-6 text-center text-sm text-slate-400 space-y-2">
          <div class="bg-orange-900/30 border border-orange-500/50 rounded-lg p-3 text-orange-200">
            <p class="font-bold">👑 Primeira Conta = Administrador</p>
            <p class="text-xs mt-1">O primeiro usuário registrado será automaticamente promovido a administrador</p>
          </div>
          <p>🔒 Seus dados ficam armazenados apenas no seu navegador</p>
        </div>
      </div>
    </div>
  `;

  // Add password strength indicator
  const passwordInput = document.getElementById('registerPassword');
  if (passwordInput) {
    passwordInput.addEventListener('input', updatePasswordStrength);
  }
}

function switchAuthTab(tab) {
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (tab === 'login') {
    loginTab.classList.remove('bg-slate-700', 'text-slate-300');
    loginTab.classList.add('bg-purple-600', 'text-white');
    registerTab.classList.remove('bg-purple-600', 'text-white');
    registerTab.classList.add('bg-slate-700', 'text-slate-300');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  } else {
    registerTab.classList.remove('bg-slate-700', 'text-slate-300');
    registerTab.classList.add('bg-purple-600', 'text-white');
    loginTab.classList.remove('bg-purple-600', 'text-white');
    loginTab.classList.add('bg-slate-700', 'text-slate-300');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  }
}

function updatePasswordStrength() {
  const password = document.getElementById('registerPassword').value;
  
  // Check requirements
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  // Update UI
  updateRequirement('reqLength', checks.length);
  updateRequirement('reqUpper', checks.upper);
  updateRequirement('reqLower', checks.lower);
  updateRequirement('reqNumber', checks.number);
  updateRequirement('reqSpecial', checks.special);
}

function updateRequirement(id, met) {
  const elem = document.getElementById(id);
  if (!elem) return;
  
  if (met) {
    elem.classList.remove('bg-slate-700', 'text-slate-400');
    elem.classList.add('bg-green-600', 'text-white');
  } else {
    elem.classList.remove('bg-green-600', 'text-white');
    elem.classList.add('bg-slate-700', 'text-slate-400');
  }
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  const errorDiv = document.getElementById('loginError');
  
  // Hide previous errors
  errorDiv.classList.add('hidden');
  
  try {
    await loginAccount(username, password);
    
    // Link default profiles to account if this is first login
    if (authState.currentAccount.linkedProfiles.length === 0) {
      // Auto-link existing profiles
      for (const profileId of Object.keys(state.users)) {
        await linkProfileToAccount(username, profileId);
      }
    }
    
    render();
  } catch (error) {
    errorDiv.textContent = error.message;
    errorDiv.classList.remove('hidden');
  }
}

async function handleRegisterSubmit(event) {
  event.preventDefault();
  
  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
  const errorDiv = document.getElementById('registerError');
  const successDiv = document.getElementById('registerSuccess');
  
  // Hide previous messages
  errorDiv.classList.add('hidden');
  successDiv.classList.add('hidden');
  
  // Check password confirmation
  if (password !== passwordConfirm) {
    errorDiv.textContent = 'As senhas não coincidem.';
    errorDiv.classList.remove('hidden');
    return;
  }
  
  try {
    await registerAccount(username, email, password);
    
    successDiv.textContent = '✅ Conta criada com sucesso! Você já pode fazer login.';
    successDiv.classList.remove('hidden');
    
    // Clear form
    event.target.reset();
    
    // Switch to login tab after 2 seconds
    setTimeout(() => {
      switchAuthTab('login');
      document.getElementById('loginUsername').value = username;
    }, 2000);
    
  } catch (error) {
    errorDiv.textContent = error.message;
    errorDiv.classList.remove('hidden');
  }
}

function handleLogout() {
  if (confirm('Deseja realmente sair?')) {
    destroySession();
    render();
  }
}

/* ============================= ADMIN HANDLER FUNCTIONS ============================= */

// Load and display tasks
async function loadAndDisplayTasks() {
  const tasks = await getAllTasks();
  
  // Update stats
  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === TASK_STATUSES.DONE).length,
    inProgress: tasks.filter(t => t.status === TASK_STATUSES.IN_PROGRESS).length,
    todo: tasks.filter(t => t.status === TASK_STATUSES.TODO).length
  };
  
  document.getElementById('totalTasks').textContent = stats.total;
  document.getElementById('doneTasks').textContent = stats.done;
  document.getElementById('inProgressTasks').textContent = stats.inProgress;
  document.getElementById('todoTasks').textContent = stats.todo;
  
  // Group by category and sort by priority within each category
  const priorityOrder = {
    [TASK_PRIORITIES.CRITICAL]: 0,
    [TASK_PRIORITIES.HIGH]: 1,
    [TASK_PRIORITIES.MEDIUM]: 2,
    [TASK_PRIORITIES.LOW]: 3
  };
  
  const categories = {
    [TASK_CATEGORIES.SHORT_TERM]: tasks
      .filter(t => t.category === TASK_CATEGORIES.SHORT_TERM)
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]),
    [TASK_CATEGORIES.MEDIUM_TERM]: tasks
      .filter(t => t.category === TASK_CATEGORIES.MEDIUM_TERM)
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]),
    [TASK_CATEGORIES.LONG_TERM]: tasks
      .filter(t => t.category === TASK_CATEGORIES.LONG_TERM)
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  };
  
  let html = '';
  
  for (const [category, categoryTasks] of Object.entries(categories)) {
    if (categoryTasks.length === 0) continue;
    
    const categoryName = category === TASK_CATEGORIES.SHORT_TERM ? 'Curto Prazo (1-2 semanas)' :
                         category === TASK_CATEGORIES.MEDIUM_TERM ? 'Médio Prazo (1-3 meses)' :
                         'Longo Prazo (3-6 meses)';
    
    html += `
      <div class="bg-slate-800 p-4 rounded-lg">
        <h4 class="text-lg font-bold mb-4">${categoryName}</h4>
        <div class="space-y-3">
    `;
    
    categoryTasks.forEach(task => {
      const priorityColor = task.priority === TASK_PRIORITIES.CRITICAL ? 'red' :
                            task.priority === TASK_PRIORITIES.HIGH ? 'orange' :
                            task.priority === TASK_PRIORITIES.MEDIUM ? 'yellow' : 'blue';
      
      const statusColor = task.status === TASK_STATUSES.DONE ? 'green' :
                          task.status === TASK_STATUSES.IN_PROGRESS ? 'blue' :
                          task.status === TASK_STATUSES.BLOCKED ? 'red' : 'slate';
      
      const completedItems = task.checklist.filter(i => i.done).length;
      const totalItems = task.checklist.length;
      const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
      
      html += `
        <div class="bg-slate-700 p-4 rounded-lg border-l-4 border-${priorityColor}-500">
          <div class="flex justify-between items-start mb-2">
            <div class="flex-1">
              <h5 class="font-bold text-lg mb-1">${task.title}</h5>
              <p class="text-slate-300 text-sm">${task.description}</p>
            </div>
            <div class="flex gap-2 ml-4">
              <span class="px-2 py-1 rounded text-xs bg-${priorityColor}-900 text-${priorityColor}-300 border border-${priorityColor}-500">
                ${task.priority}
              </span>
              <span class="px-2 py-1 rounded text-xs bg-${statusColor}-900 text-${statusColor}-300 border border-${statusColor}-500">
                ${task.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          
          ${task.checklist.length > 0 ? `
            <div class="mt-3">
              <div class="flex justify-between items-center mb-2">
                <p class="text-sm text-slate-400">Progresso: ${completedItems}/${totalItems}</p>
                <p class="text-sm font-bold text-${progress === 100 ? 'green' : 'blue'}-400">${progress}%</p>
              </div>
              <div class="w-full bg-slate-600 rounded-full h-2 mb-3">
                <div class="bg-${progress === 100 ? 'green' : 'blue'}-500 h-2 rounded-full transition-all" style="width: ${progress}%"></div>
              </div>
              <div class="space-y-2">
                ${task.checklist.map(item => `
                  <label class="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-600 p-2 rounded">
                    <input type="checkbox" ${item.done ? 'checked' : ''} 
                           onchange="handleToggleChecklistItem('${task.id}', ${item.id})"
                           class="w-4 h-4 rounded" />
                    <span class="${item.done ? 'line-through text-slate-500' : 'text-slate-300'}">${item.text}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          <div class="mt-3 flex gap-2">
            <button onclick="editTask('${task.id}')" class="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded">
              ✏️ Editar
            </button>
            <button onclick="changeTaskStatus('${task.id}')" class="text-sm px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded">
              🔄 Mudar Status
            </button>
            <button onclick="deleteTaskConfirm('${task.id}')" class="text-sm px-3 py-1 bg-red-600 hover:bg-red-500 rounded">
              🗑️ Arquivar
            </button>
          </div>
        </div>
      `;
    });
    
    html += '</div></div>';
  }
  
  document.getElementById('tasksList').innerHTML = html || '<p class="text-slate-400">Nenhuma tarefa encontrada.</p>';
}

// Handle checklist item toggle
async function handleToggleChecklistItem(taskId, checklistItemId) {
  try {
    await toggleChecklistItem(taskId, checklistItemId);
    await loadAndDisplayTasks();
    showNotification('✅ Item atualizado!', 'success');
  } catch (err) {
    showNotification('❌ ' + err.message, 'error');
  }
}

// Show create task modal
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

console.log('✅ Auth UI module loaded');
