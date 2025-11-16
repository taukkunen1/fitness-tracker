/**
 * @fileoverview Nutrition (Nutrição) Module
 * @module modules/nutricao
 * 
 * Handles nutrition tracking, meal logging, and dietary recommendations
 * Based on scientific research (Phillips 2022, Schoenfeld 2023, Wang 2024)
 */

/* Meal logging handlers */
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


/* Day navigation for meals */
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


/* Nutrition recommendations and rendering */
function calculateNutritionRecommendations(user) {
  const latestMetrics = user.bodyMetrics && user.bodyMetrics.length > 0 
    ? user.bodyMetrics[user.bodyMetrics.length - 1] 
    : { weight: 70, bmr: 1600, tdee: 2200 };
  
  const weight = latestMetrics.weight || 70;
  const bmr = latestMetrics.bmr || calculateBMR(weight, user.height, user.age, user.gender);
  const tdee = latestMetrics.tdee || (bmr * 1.55); // Moderate activity level
  const goals = user.goals || { weight: weight + 5, muscleMass: (latestMetrics.muscleMass || 25) + 3 };
  
  // Determine if bulking, cutting, or maintaining
  const isGaining = goals.weight > weight;
  const calorieAdjustment = isGaining ? (user.gender === 'male' ? 400 : 300) : -300;
  const targetCalories = Math.round(tdee + calorieAdjustment);
  
  // Protein: 1.8-2.2 g/kg for muscle gain (Phillips 2022)
  const proteinGramsPerKg = isGaining ? 2.0 : 1.8;
  const proteinGrams = Math.round(weight * proteinGramsPerKg);
  const proteinCalories = proteinGrams * 4;
  
  // Fat: 0.8-1.0 g/kg for hormonal health
  const fatGramsPerKg = 0.9;
  const fatGrams = Math.round(weight * fatGramsPerKg);
  const fatCalories = fatGrams * 9;
  
  // Carbs: remaining calories
  const carbCalories = targetCalories - proteinCalories - fatCalories;
  const carbGrams = Math.round(carbCalories / 4);
  
  // Food recommendations based on macros
  // Protein sources (all values per 100g unless specified)
  const foods = {
    // Protein sources
    chicken: {
      name: 'Frango (peito)',
      portion: Math.round(proteinGrams * 0.4 / 0.31), // 40% of protein from chicken (31g protein per 100g)
      unit: 'g',
      macro: 'Proteína',
      perDay: 'daily',
      protein: 31,
      carbs: 0,
      fat: 3.6,
      kcal: 165,
      note: 'Fonte magra de proteína de alta qualidade'
    },
    eggs: {
      name: 'Ovos',
      portion: Math.round(proteinGrams * 0.25 / 6.3), // 25% of protein from eggs (6.3g per egg)
      unit: 'unidades',
      macro: 'Proteína',
      perDay: 'daily',
      protein: 6.3,
      carbs: 0.6,
      fat: 5,
      kcal: 72,
      note: 'Proteína completa com todos aminoácidos essenciais'
    },
    whey: {
      name: 'Whey Protein',
      portion: Math.round(proteinGrams * 0.25 / 25), // 25% of protein from whey (25g per scoop)
      unit: 'scoop (30g)',
      macro: 'Proteína',
      perDay: 'daily',
      protein: 25,
      carbs: 3,
      fat: 1.5,
      kcal: 120,
      note: 'Suplemento pós-treino para síntese proteica rápida'
    },
    
    // Carb sources
    bread: {
      name: 'Pão integral',
      portion: Math.round(carbGrams * 0.15 / 49), // 15% of carbs from bread (49g carbs per 100g)
      unit: 'fatias (25g cada)',
      macro: 'Carboidrato',
      perDay: 'daily',
      protein: 9,
      carbs: 49,
      fat: 3.5,
      kcal: 265,
      note: 'Fonte de carboidratos complexos e fibras'
    },
    rice: {
      name: 'Arroz integral',
      portion: Math.round(carbGrams * 0.35 / 23), // 35% of carbs from rice (23g per 100g cooked)
      unit: 'g (cozido)',
      macro: 'Carboidrato',
      perDay: 'daily',
      protein: 2.6,
      carbs: 23,
      fat: 0.9,
      kcal: 111,
      note: 'Energia sustentada para treinos'
    },
    sweetPotato: {
      name: 'Batata doce',
      portion: Math.round(carbGrams * 0.25 / 20), // 25% of carbs from sweet potato (20g per 100g)
      unit: 'g',
      macro: 'Carboidrato',
      perDay: 'daily',
      protein: 1.6,
      carbs: 20,
      fat: 0.1,
      kcal: 86,
      note: 'Carboidrato de baixo índice glicêmico'
    },
    
    // Fat sources
    peanutButter: {
      name: 'Pasta de amendoim',
      portion: Math.round(fatGrams * 0.3 / 50 * 100), // 30% of fat from PB (50g fat per 100g)
      unit: 'g',
      macro: 'Gordura',
      perDay: 'daily',
      protein: 25,
      carbs: 20,
      fat: 50,
      kcal: 588,
      note: 'Gorduras saudáveis e proteína adicional'
    },
    avocado: {
      name: 'Abacate',
      portion: Math.round(fatGrams * 0.2 / 15), // 20% of fat from avocado (15g per 100g)
      unit: 'g',
      macro: 'Gordura',
      perDay: 'daily',
      protein: 2,
      carbs: 9,
      fat: 15,
      kcal: 160,
      note: 'Gorduras monoinsaturadas e fibras'
    },
    
    // Supplements
    creatine: {
      name: 'Creatina',
      portion: 5,
      unit: 'g',
      macro: 'Suplemento',
      perDay: 'daily',
      protein: 0,
      carbs: 0,
      fat: 0,
      kcal: 0,
      note: 'Melhora força e ganho de massa muscular (Wang 2024)'
    }
  };
  
  return {
    targetCalories,
    bmr,
    tdee,
    proteinGrams,
    carbGrams,
    fatGrams,
    foods,
    isGaining
  };
}

function renderNutritionRecommendations(user) {
  const nutrition = calculateNutritionRecommendations(user);
  const foods = nutrition.foods;
  
  return `
    <div class="bg-gradient-to-r from-green-700 to-emerald-800 p-6 rounded-xl mb-6">
      <h4 class="font-bold text-xl mb-4">🎯 Metas Nutricionais Personalizadas</h4>
      <div class="grid md:grid-cols-4 gap-4">
        <div class="bg-white/10 backdrop-blur p-4 rounded-lg">
          <p class="text-sm text-green-100 mb-1">TMB (Basal)</p>
          <p class="text-3xl font-bold">${nutrition.bmr}</p>
          <p class="text-xs text-green-200">kcal/dia</p>
        </div>
        <div class="bg-white/10 backdrop-blur p-4 rounded-lg">
          <p class="text-sm text-green-100 mb-1">TDEE (Total)</p>
          <p class="text-3xl font-bold">${Math.round(nutrition.tdee)}</p>
          <p class="text-xs text-green-200">kcal/dia</p>
        </div>
        <div class="bg-white/10 backdrop-blur p-4 rounded-lg">
          <p class="text-sm text-green-100 mb-1">Meta Calórica</p>
          <p class="text-3xl font-bold">${nutrition.targetCalories}</p>
          <p class="text-xs text-green-200">${nutrition.isGaining ? 'Ganho' : 'Perda'}</p>
        </div>
        <div class="bg-white/10 backdrop-blur p-4 rounded-lg">
          <p class="text-sm text-green-100 mb-1">Macros</p>
          <p class="text-lg font-bold">${nutrition.proteinGrams}P</p>
          <p class="text-lg font-bold">${nutrition.carbGrams}C • ${nutrition.fatGrams}G</p>
        </div>
      </div>
    </div>

    <div class="bg-slate-800 p-6 rounded-xl mb-6">
      <h4 class="font-bold text-xl mb-4">🍗 Base de Alimentação Diária Recomendada</h4>
      <p class="text-slate-300 text-sm mb-4">Quantidades calculadas com base no seu metabolismo basal (${nutrition.bmr} kcal), TDEE (${Math.round(nutrition.tdee)} kcal) e metas de composição corporal.</p>
      
      <!-- Protein Sources -->
      <div class="mb-6">
        <h5 class="font-semibold text-lg text-blue-300 mb-3">💪 Fontes de Proteína (Meta: ${nutrition.proteinGrams}g/dia)</h5>
        <div class="grid md:grid-cols-3 gap-4">
          ${[foods.chicken, foods.eggs, foods.whey].map(food => `
            <div class="bg-slate-700 p-4 rounded-lg">
              <div class="flex justify-between items-start mb-2">
                <p class="font-bold text-lg">${food.name}</p>
                <span class="bg-blue-600 px-2 py-1 rounded text-xs">${food.macro}</span>
              </div>
              <p class="text-3xl font-bold text-blue-400 mb-2">${food.portion}</p>
              <p class="text-sm text-slate-300 mb-3">${food.unit} por dia</p>
              <div class="text-xs text-slate-400 space-y-1">
                ${food.protein ? `<p>Proteína: ~${Math.round(food.portion * food.protein / (food.unit === 'unidades' ? 1 : food.unit === 'scoop (30g)' ? 1 : 100))}g</p>` : ''}
                ${food.kcal ? `<p>Calorias: ~${Math.round(food.portion * food.kcal / (food.unit === 'unidades' ? 1 : food.unit === 'scoop (30g)' ? 1 : 100))}kcal</p>` : ''}
              </div>
              <p class="text-xs text-green-300 mt-3">${food.note}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Carb Sources -->
      <div class="mb-6">
        <h5 class="font-semibold text-lg text-orange-300 mb-3">🌾 Fontes de Carboidratos (Meta: ${nutrition.carbGrams}g/dia)</h5>
        <div class="grid md:grid-cols-3 gap-4">
          ${[foods.bread, foods.rice, foods.sweetPotato].map(food => `
            <div class="bg-slate-700 p-4 rounded-lg">
              <div class="flex justify-between items-start mb-2">
                <p class="font-bold text-lg">${food.name}</p>
                <span class="bg-orange-600 px-2 py-1 rounded text-xs">${food.macro}</span>
              </div>
              <p class="text-3xl font-bold text-orange-400 mb-2">${food.portion}</p>
              <p class="text-sm text-slate-300 mb-3">${food.unit} por dia</p>
              <div class="text-xs text-slate-400 space-y-1">
                ${food.carbs ? `<p>Carboidratos: ~${Math.round(food.portion * food.carbs / 100)}g</p>` : ''}
                ${food.kcal ? `<p>Calorias: ~${Math.round(food.portion * food.kcal / 100)}kcal</p>` : ''}
              </div>
              <p class="text-xs text-green-300 mt-3">${food.note}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Fat Sources -->
      <div class="mb-6">
        <h5 class="font-semibold text-lg text-yellow-300 mb-3">🥑 Fontes de Gorduras Saudáveis (Meta: ${nutrition.fatGrams}g/dia)</h5>
        <div class="grid md:grid-cols-2 gap-4">
          ${[foods.peanutButter, foods.avocado].map(food => `
            <div class="bg-slate-700 p-4 rounded-lg">
              <div class="flex justify-between items-start mb-2">
                <p class="font-bold text-lg">${food.name}</p>
                <span class="bg-yellow-600 px-2 py-1 rounded text-xs">${food.macro}</span>
              </div>
              <p class="text-3xl font-bold text-yellow-400 mb-2">${food.portion}</p>
              <p class="text-sm text-slate-300 mb-3">${food.unit} por dia</p>
              <div class="text-xs text-slate-400 space-y-1">
                ${food.fat ? `<p>Gorduras: ~${Math.round(food.portion * food.fat / 100)}g</p>` : ''}
                ${food.kcal ? `<p>Calorias: ~${Math.round(food.portion * food.kcal / 100)}kcal</p>` : ''}
              </div>
              <p class="text-xs text-green-300 mt-3">${food.note}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Supplements -->
      <div class="mb-6">
        <h5 class="font-semibold text-lg text-purple-300 mb-3">💊 Suplementação Baseada em Evidências</h5>
        <div class="grid md:grid-cols-2 gap-4">
          ${[foods.creatine, foods.whey].map(food => `
            <div class="bg-slate-700 p-4 rounded-lg border-2 border-purple-500">
              <div class="flex justify-between items-start mb-2">
                <p class="font-bold text-lg">${food.name}</p>
                <span class="bg-purple-600 px-2 py-1 rounded text-xs">${food.macro}</span>
              </div>
              <p class="text-3xl font-bold text-purple-400 mb-2">${food.portion}</p>
              <p class="text-sm text-slate-300 mb-3">${food.unit} por dia</p>
              <p class="text-xs text-green-300 mt-3">${food.note}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Scientific Notes -->
      <div class="bg-gradient-to-r from-cyan-900 to-blue-900 p-4 rounded-lg">
        <h5 class="font-semibold text-lg mb-2">🔬 Base Científica</h5>
        <div class="text-sm text-slate-300 space-y-2">
          <p><strong>Proteína:</strong> Recomendação de 1.8-2.2 g/kg/dia para otimizar síntese proteica e hipertrofia muscular (Phillips et al., 2022).</p>
          <p><strong>Timing:</strong> Distribuir proteína em 4-6 refeições ao longo do dia, com 20-40g por refeição (Schoenfeld et al., 2023).</p>
          <p><strong>Creatina:</strong> 5g/dia melhora força e ganho de massa muscular em adultos que praticam treinamento resistido (Wang et al., 2024).</p>
          <p><strong>Carboidratos:</strong> Essenciais para reposição de glicogênio e performance em treinos intensos. Ajustar conforme nível de atividade.</p>
          <p><strong>Gorduras:</strong> 0.8-1.0 g/kg/dia para suporte hormonal e absorção de vitaminas lipossolúveis.</p>
        </div>
      </div>
    </div>
  `;
}

function renderNutricao(user) {
  const notes = buildReferenceNotesForNutrition();
  return `
    ${renderNutritionRecommendations(user)}
    
    <div class="bg-slate-800 p-4 rounded mb-6">
      <h3 class="font-bold">Plano nutricional (resumo)</h3>
      <p class="text-slate-300 text-sm">${notes || 'Importe referências na aba CIÊNCIA para ver recomendações.'}</p>
      <div class="mt-3 text-slate-300 text-sm">
        <p class="mb-2"><strong>Dicas práticas:</strong></p>
        <ul class="list-disc list-inside space-y-1 text-sm">
          <li>Distribua a proteína em 4-6 refeições ao longo do dia</li>
          <li>Consuma 20-40g de proteína a cada 3-4 horas</li>
          <li>Tome creatina diariamente (5g), preferencialmente com carboidratos</li>
          <li>Whey protein ideal no pós-treino (janela de 0-2h)</li>
          <li>Carboidratos concentrados antes e após treinos intensos</li>
          <li>Gorduras saudáveis em todas as refeições principais</li>
          <li>Hidrate-se: mínimo 35ml/kg de peso corporal por dia</li>
        </ul>
      </div>
    </div>
  `;
}

function renderAlimentacao() {
  const currentUser = state.users[state.activeUser];
  const mealHistory = currentUser.mealHistory || [];
  
  // Filter meals for the selected day
  const selectedDayMeals = mealHistory.filter(m => m.date === state.currentDay);
  
  // Calculate totals for the selected day
  const dayTotals = selectedDayMeals.reduce((acc, log) => {
    // Check if it's a composed meal with stored totals
    if (log.isComposed && log.totalKcal !== undefined) {
      acc.kcal += log.totalKcal;
      acc.prot += log.totalProt || 0;
      acc.carb += log.totalCarb || 0;
      acc.fat += log.totalFat || 0;
    } else {
      // Regular meal - look up nutrition
      const nut = getMealNutritionByNameCombined(log.meal);
      acc.kcal += nut.kcal;
      acc.prot += nut.prot;
      acc.carb += nut.carb || 0;
      acc.fat += nut.fat;
    }
    return acc;
  }, { kcal: 0, prot: 0, carb: 0, fat: 0 });
  
  // Format date for display
  const displayDate = new Date(state.currentDay + 'T00:00:00');
  const isToday = state.currentDay === new Date().toISOString().split('T')[0];
  const dateLabel = isToday ? 'Hoje' : displayDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' });
  
  return `
    <!-- Day Navigation -->
    <div class="bg-slate-800 p-4 rounded mb-6">
      <div class="flex justify-between items-center">
        <button onclick="goToPreviousDay()" class="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded">← Dia Anterior</button>
        <div class="text-center">
          <p class="text-lg font-bold">${dateLabel}</p>
          <p class="text-sm text-slate-300">${state.currentDay}</p>
        </div>
        <button onclick="goToNextDay()" class="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded">Próximo Dia →</button>
      </div>
      ${!isToday ? `<div class="mt-2 text-center"><button onclick="goToToday()" class="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm">Ir para Hoje</button></div>` : ''}
    </div>

    <!-- Day Totals -->
    <div class="bg-gradient-to-r from-green-600 to-green-800 p-4 rounded mb-6">
      <h4 class="font-bold text-lg">Totais de ${dateLabel}</h4>
      <p class="text-white text-xl">${Math.round(dayTotals.kcal)} kcal • ${Math.round(dayTotals.prot)}g prot • ${Math.round(dayTotals.carb)}g carb • ${Math.round(dayTotals.fat)}g gord</p>
    </div>

    <!-- Nutrition Calculator & Guide -->
    <div class="bg-gradient-to-br from-blue-900 to-indigo-900 p-6 rounded-xl mb-6 border-2 border-blue-500">
      <h3 class="font-bold text-2xl mb-4 flex items-center gap-2">
        🧮 Calculadora de Macronutrientes
        <span class="text-xs font-normal bg-yellow-500 text-black px-2 py-1 rounded">NOVO</span>
      </h3>
      
      <div class="bg-white/10 backdrop-blur p-5 rounded-lg mb-6">
        <h4 class="font-semibold text-lg mb-3 text-cyan-300">📚 Como Calcular os Macros da sua Refeição</h4>
        <div class="space-y-3 text-sm text-slate-200">
          <p class="leading-relaxed"><strong>1. Pese os alimentos crus</strong> (antes de cozinhar) sempre que possível, pois as tabelas nutricionais se referem ao peso cru.</p>
          <p class="leading-relaxed"><strong>2. Use a regra de três simples:</strong> Se a tabela nutricional informa valores para 100g, e você tem 150g, multiplique por 1.5 (150 ÷ 100).</p>
          <p class="leading-relaxed"><strong>3. Lembre-se das calorias por grama:</strong></p>
          <ul class="list-disc list-inside ml-4 space-y-1">
            <li><strong>Proteína:</strong> 4 kcal por grama</li>
            <li><strong>Carboidrato:</strong> 4 kcal por grama</li>
            <li><strong>Gordura:</strong> 9 kcal por grama</li>
          </ul>
          <p class="leading-relaxed"><strong>4. Some todos os ingredientes</strong> da sua refeição para obter o total.</p>
        </div>
      </div>

      <!-- Food Database Browser -->
      <div class="bg-slate-800 p-5 rounded-lg mb-4">
        <h4 class="font-semibold text-lg mb-4 text-yellow-300">📚 Banco de Alimentos Comuns</h4>
        <p class="text-sm text-slate-300 mb-4">Selecione um alimento da lista para preencher automaticamente a calculadora. Valores baseados na Tabela TACO (Tabela Brasileira de Composição de Alimentos).</p>
        
        <!-- Search box -->
        <div class="mb-4">
          <input type="text" id="foodSearchInput" placeholder="🔍 Buscar alimento..." onkeyup="filterFoods()" class="w-full px-4 py-2 rounded bg-slate-700 text-white" />
        </div>

        <!-- Food categories -->
        <div class="grid md:grid-cols-2 gap-4" id="foodCategoriesContainer">
          ${Object.keys(commonFoods).map(category => `
            <div class="bg-slate-700 p-4 rounded food-category">
              <h5 class="font-semibold mb-3 capitalize ${
                category === 'proteinas' ? 'text-blue-300' :
                category === 'carboidratos' ? 'text-orange-300' :
                category === 'gorduras' ? 'text-yellow-300' :
                'text-green-300'
              }">
                ${category === 'proteinas' ? '💪 Proteínas' :
                  category === 'carboidratos' ? '🌾 Carboidratos' :
                  category === 'gorduras' ? '🥑 Gorduras Saudáveis' :
                  '🥗 Vegetais'}
              </h5>
              <div class="space-y-2 max-h-64 overflow-y-auto">
                ${commonFoods[category].map((food, idx) => `
                  <div class="food-item bg-slate-800 p-2 rounded hover:bg-slate-600 cursor-pointer transition-colors" data-food-name="${food.name}" onclick="selectFood('${category}', ${idx})">
                    <p class="font-medium text-sm">${food.name}</p>
                    <p class="text-xs text-slate-400">${food.kcal} kcal • ${food.prot}g P • ${food.carb}g C • ${food.fat}g G (${food.per} ${food.unit})</p>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Interactive Calculator -->
      <div class="bg-slate-800 p-5 rounded-lg mb-4">
        <h4 class="font-semibold text-lg mb-4 text-green-300">🔢 Calculadora Interativa</h4>
        <div class="space-y-4">
          <!-- Food input -->
          <div class="grid md:grid-cols-6 gap-3">
            <input type="text" id="calcFoodName" placeholder="Nome do alimento" class="px-3 py-2 rounded bg-slate-700 text-white" />
            <input type="number" id="calcWeight" placeholder="Peso (g)" step="0.1" class="px-3 py-2 rounded bg-slate-700 text-white" />
            <input type="number" id="calcProtPer100" placeholder="Prot/100g" step="0.1" class="px-3 py-2 rounded bg-slate-700 text-white" />
            <input type="number" id="calcCarbPer100" placeholder="Carb/100g" step="0.1" class="px-3 py-2 rounded bg-slate-700 text-white" />
            <input type="number" id="calcFatPer100" placeholder="Gord/100g" step="0.1" class="px-3 py-2 rounded bg-slate-700 text-white" />
            <button onclick="calculateMacros()" class="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded font-semibold">Calcular</button>
          </div>
          
          <!-- Results -->
          <div id="calcResults" class="hidden bg-gradient-to-r from-green-700 to-emerald-800 p-4 rounded-lg">
            <h5 class="font-semibold mb-2">Resultado do Cálculo:</h5>
            <div class="grid md:grid-cols-4 gap-3 text-center">
              <div class="bg-white/10 backdrop-blur p-3 rounded">
                <p class="text-xs text-green-200 mb-1">Proteína</p>
                <p class="text-2xl font-bold" id="resultProt">0g</p>
                <p class="text-xs text-green-300" id="resultProtKcal">0 kcal</p>
              </div>
              <div class="bg-white/10 backdrop-blur p-3 rounded">
                <p class="text-xs text-orange-200 mb-1">Carboidrato</p>
                <p class="text-2xl font-bold" id="resultCarb">0g</p>
                <p class="text-xs text-orange-300" id="resultCarbKcal">0 kcal</p>
              </div>
              <div class="bg-white/10 backdrop-blur p-3 rounded">
                <p class="text-xs text-yellow-200 mb-1">Gordura</p>
                <p class="text-2xl font-bold" id="resultFat">0g</p>
                <p class="text-xs text-yellow-300" id="resultFatKcal">0 kcal</p>
              </div>
              <div class="bg-white/10 backdrop-blur p-3 rounded">
                <p class="text-xs text-cyan-200 mb-1">Total</p>
                <p class="text-2xl font-bold" id="resultTotal">0 kcal</p>
                <p class="text-xs text-cyan-300">calorias totais</p>
              </div>
            </div>
            <!-- Add to Meal Composition Button -->
            <div class="mt-4 text-center">
              <button onclick="addComponentToMeal()" class="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-semibold text-white">
                ➕ Adicionar à Refeição Composta
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Meal Composition Builder -->
      ${state.currentMealComposition.components.length > 0 ? `
      <div class="bg-gradient-to-r from-purple-900 to-indigo-900 p-5 rounded-lg mb-4 border-2 border-purple-500">
        <div class="flex justify-between items-center mb-4">
          <h4 class="font-semibold text-lg text-purple-200">🍽️ Refeição Composta em Construção</h4>
          <button onclick="resetMealComposition()" class="text-red-400 hover:text-red-300 text-sm">
            🗑️ Limpar
          </button>
        </div>
        
        <!-- Components List -->
        <div class="space-y-2 mb-4">
          ${state.currentMealComposition.components.map((comp, idx) => `
            <div class="bg-slate-800 p-3 rounded flex justify-between items-center">
              <div class="flex-1">
                <p class="font-semibold text-white">${comp.foodName}</p>
                <p class="text-xs text-slate-300">${comp.weight}g • ${comp.prot}g prot • ${comp.carb}g carb • ${comp.fat}g gord • ${comp.kcal} kcal</p>
              </div>
              <button onclick="removeComponentFromMeal(${comp.id})" class="text-red-400 hover:text-red-300 ml-2" title="Remover componente">
                ✖
              </button>
            </div>
          `).join('')}
        </div>
        
        <!-- Totals -->
        <div class="bg-gradient-to-r from-green-700 to-emerald-800 p-4 rounded-lg border-2 border-green-500">
          <h5 class="font-bold text-lg mb-3 text-center text-white">📊 Totais da Refeição</h5>
          <div class="grid grid-cols-5 gap-2 text-center">
            <div class="bg-white/10 backdrop-blur p-2 rounded">
              <p class="text-xs text-slate-300 mb-1">Peso Total</p>
              <p class="text-xl font-bold text-white">${state.currentMealComposition.totalWeight}g</p>
            </div>
            <div class="bg-white/10 backdrop-blur p-2 rounded">
              <p class="text-xs text-green-200 mb-1">Proteína</p>
              <p class="text-xl font-bold text-green-300">${state.currentMealComposition.totalProt}g</p>
            </div>
            <div class="bg-white/10 backdrop-blur p-2 rounded">
              <p class="text-xs text-orange-200 mb-1">Carboidrato</p>
              <p class="text-xl font-bold text-orange-300">${state.currentMealComposition.totalCarb}g</p>
            </div>
            <div class="bg-white/10 backdrop-blur p-2 rounded">
              <p class="text-xs text-yellow-200 mb-1">Gordura</p>
              <p class="text-xl font-bold text-yellow-300">${state.currentMealComposition.totalFat}g</p>
            </div>
            <div class="bg-white/10 backdrop-blur p-2 rounded">
              <p class="text-xs text-cyan-200 mb-1">Calorias</p>
              <p class="text-xl font-bold text-cyan-300">${state.currentMealComposition.totalKcal}</p>
            </div>
          </div>
        </div>
        
        <!-- Save Button -->
        <div class="mt-4 text-center">
          <button onclick="saveComposedMeal()" class="bg-green-600 hover:bg-green-500 px-8 py-3 rounded-lg font-bold text-lg text-white">
            💾 Salvar Refeição Composta no Histórico
          </button>
        </div>
      </div>
      ` : ''}

      <!-- Examples Section -->
      <div class="bg-slate-800 p-5 rounded-lg">
        <h4 class="font-semibold text-lg mb-3 text-yellow-300">💡 Exemplos Práticos</h4>
        <div class="space-y-4">
          <div class="bg-slate-700 p-4 rounded">
            <p class="font-bold text-blue-300 mb-2">Exemplo 1: Frango Grelhado (150g)</p>
            <p class="text-sm text-slate-300 mb-2">Valores por 100g: 31g prot, 0g carb, 3.6g gord</p>
            <div class="bg-slate-800 p-3 rounded text-sm">
              <p class="mb-1"><strong>Cálculo:</strong></p>
              <p>• Proteína: 31g × 1.5 = <strong class="text-green-400">46.5g</strong> = 186 kcal</p>
              <p>• Carboidrato: 0g × 1.5 = <strong class="text-orange-400">0g</strong> = 0 kcal</p>
              <p>• Gordura: 3.6g × 1.5 = <strong class="text-yellow-400">5.4g</strong> = 48.6 kcal</p>
              <p class="mt-2 text-cyan-400"><strong>Total: 234.6 kcal</strong></p>
            </div>
            <button onclick="fillCalculatorExample('Frango grelhado', 150, 31, 0, 3.6)" class="mt-2 bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm">Testar na Calculadora</button>
          </div>

          <div class="bg-slate-700 p-4 rounded">
            <p class="font-bold text-blue-300 mb-2">Exemplo 2: Arroz Integral Cozido (200g)</p>
            <p class="text-sm text-slate-300 mb-2">Valores por 100g: 2.6g prot, 23g carb, 0.9g gord</p>
            <div class="bg-slate-800 p-3 rounded text-sm">
              <p class="mb-1"><strong>Cálculo:</strong></p>
              <p>• Proteína: 2.6g × 2 = <strong class="text-green-400">5.2g</strong> = 20.8 kcal</p>
              <p>• Carboidrato: 23g × 2 = <strong class="text-orange-400">46g</strong> = 184 kcal</p>
              <p>• Gordura: 0.9g × 2 = <strong class="text-yellow-400">1.8g</strong> = 16.2 kcal</p>
              <p class="mt-2 text-cyan-400"><strong>Total: 221 kcal</strong></p>
            </div>
            <button onclick="fillCalculatorExample('Arroz integral cozido', 200, 2.6, 23, 0.9)" class="mt-2 bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm">Testar na Calculadora</button>
          </div>

          <div class="bg-slate-700 p-4 rounded">
            <p class="font-bold text-blue-300 mb-2">Exemplo 3: Batata Doce (300g)</p>
            <p class="text-sm text-slate-300 mb-2">Valores por 100g: 1.6g prot, 20g carb, 0.1g gord</p>
            <div class="bg-slate-800 p-3 rounded text-sm">
              <p class="mb-1"><strong>Cálculo:</strong></p>
              <p>• Proteína: 1.6g × 3 = <strong class="text-green-400">4.8g</strong> = 19.2 kcal</p>
              <p>• Carboidrato: 20g × 3 = <strong class="text-orange-400">60g</strong> = 240 kcal</p>
              <p>• Gordura: 0.1g × 3 = <strong class="text-yellow-400">0.3g</strong> = 2.7 kcal</p>
              <p class="mt-2 text-cyan-400"><strong>Total: 261.9 kcal</strong></p>
            </div>
            <button onclick="fillCalculatorExample('Batata doce', 300, 1.6, 20, 0.1)" class="mt-2 bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm">Testar na Calculadora</button>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="bg-gradient-to-r from-purple-900 to-pink-900 p-5 rounded-lg mt-4">
        <h4 class="font-semibold text-lg mb-3">✨ Dicas Importantes</h4>
        <ul class="space-y-2 text-sm text-slate-200">
          <li class="flex items-start gap-2">
            <span class="text-green-400 flex-shrink-0">✓</span>
            <span><strong>Balança digital:</strong> Investir numa balança de cozinha precisa (até 0.1g) facilita muito o controle.</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-green-400 flex-shrink-0">✓</span>
            <span><strong>Aplicativos úteis:</strong> MyFitnessPal, FatSecret e Cronometer têm grandes bancos de dados de alimentos.</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-green-400 flex-shrink-0">✓</span>
            <span><strong>Cozido vs Cru:</strong> Arroz e macarrão absorvem água ao cozinhar (peso aumenta 2-3x, mas calorias não mudam).</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-green-400 flex-shrink-0">✓</span>
            <span><strong>Óleos e temperos:</strong> Não esqueça de contar azeite, óleo, manteiga usados no preparo (1 colher sopa ≈ 15ml ≈ 135 kcal).</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-green-400 flex-shrink-0">✓</span>
            <span><strong>Estimativas:</strong> Quando não puder pesar, use aproximações: 1 palma de mão = ~100g de proteína, 1 punho = ~150g de carboidrato.</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Custom Meal Form -->
    <div class="bg-slate-800 p-4 rounded mb-6">
      <h3 class="font-bold mb-3">➕ Adicionar Refeição Personalizada</h3>
      <form id="customMealForm" class="grid md:grid-cols-5 gap-2">
        <input type="text" name="customMealName" placeholder="Nome da refeição" required class="px-3 py-2 rounded bg-slate-700 text-white" />
        <input type="number" name="customMealKcal" step="0.1" placeholder="Calorias (kcal)" required class="px-3 py-2 rounded bg-slate-700 text-white" />
        <input type="number" name="customMealProt" step="0.1" placeholder="Proteína (g)" class="px-3 py-2 rounded bg-slate-700 text-white" />
        <input type="number" name="customMealFat" step="0.1" placeholder="Gordura (g)" class="px-3 py-2 rounded bg-slate-700 text-white" />
        <div class="flex flex-col gap-2">
          <label class="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" name="saveAsReusable" class="rounded" />
            Salvar como reutilizável
          </label>
          <button type="submit" class="bg-green-600 hover:bg-green-500 px-3 py-2 rounded font-semibold">Adicionar</button>
        </div>
      </form>
      <p class="text-slate-400 text-xs mt-2">A refeição será registrada para ${dateLabel}. Marque "Salvar como reutilizável" para adicioná-la à lista abaixo.</p>
    </div>

    <!-- Custom Meals List -->
    ${state.customMeals.length > 0 ? `
    <div class="bg-slate-800 p-4 rounded mb-6">
      <h3 class="font-bold mb-3">🍽️ Minhas Refeições Personalizadas</h3>
      <div class="grid md:grid-cols-2 gap-3">
        ${state.customMeals.map(m => `
          <div class="bg-slate-700 p-3 rounded flex justify-between items-center">
            <div>
              <p class="font-semibold">${m.name}</p>
              <p class="text-slate-300 text-xs">${m.kcal} kcal • ${m.prot}g prot • ${m.fat}g gord</p>
            </div>
            <div class="flex gap-2">
              <button data-meal-name="${m.name.replace(/"/g, '&quot;')}" class="meal-register-btn bg-orange-500 hover:bg-orange-400 px-3 py-1 rounded">Registrar</button>
              <button onclick="handleDeleteCustomMeal('${m.id}')" class="text-red-400 hover:text-red-300 px-2">🗑️</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    <!-- LiveUp Marmitas -->
    <div class="bg-slate-800 p-4 rounded mb-6">
      <h3 class="font-bold mb-3">🍱 Marmitas LiveUp (Disponíveis)</h3>
      <div class="grid md:grid-cols-2 gap-3">
        ${livUpMarmitas.map(m => `
          <div class="bg-slate-700 p-3 rounded flex justify-between items-center">
            <div>
              <p class="font-semibold">${m.name}</p>
              <p class="text-slate-300 text-xs">${m.category} • ${m.size}${m.kcal ? ' • ' + m.kcal + ' kcal' : ''}${m.notes ? ' • ' + m.notes : ''}</p>
            </div>
            <div>
              <button data-meal-name="${m.name.replace(/"/g, '&quot;')}" class="meal-register-btn bg-orange-500 hover:bg-orange-400 px-3 py-1 rounded">Registrar</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Meal History for Selected Day -->
    <div class="bg-slate-800 p-4 rounded">
      <h3 class="font-bold mb-3">📋 Histórico de ${dateLabel}</h3>
      ${selectedDayMeals.length === 0 ? 
        '<p class="text-slate-400">Nenhuma refeição registrada neste dia.</p>' :
        `<div class="space-y-2">
          ${selectedDayMeals.map(log => {
            // Check if it's a composed meal
            if (log.isComposed && log.components) {
              return `
                <div class="bg-slate-700 p-3 rounded border-l-4 border-purple-500">
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                      <p class="font-semibold text-purple-300">🍽️ ${log.meal}</p>
                      <p class="text-slate-400 text-xs mb-2">${log.time} • Refeição Composta</p>
                      
                      <!-- Components -->
                      <div class="bg-slate-800 p-2 rounded mb-2 space-y-1">
                        <p class="text-xs font-semibold text-slate-300 mb-1">Componentes:</p>
                        ${log.components.map(comp => `
                          <p class="text-xs text-slate-400">• ${comp.weight}g ${comp.foodName} (${comp.prot}g P, ${comp.carb}g C, ${comp.fat}g G, ${comp.kcal} kcal)</p>
                        `).join('')}
                      </div>
                      
                      <!-- Totals -->
                      <div class="bg-gradient-to-r from-purple-800 to-indigo-800 p-2 rounded">
                        <p class="text-xs font-bold text-purple-200 mb-1">Totais:</p>
                        <p class="text-sm text-white">
                          ${log.totalWeight}g • ${log.totalKcal} kcal • ${log.totalProt}g prot • ${log.totalCarb}g carb • ${log.totalFat}g gord
                        </p>
                      </div>
                    </div>
                    <button data-meal-id="${log.id}" class="meal-delete-btn text-red-400 hover:text-red-300 ml-2" title="Excluir registro">🗑️</button>
                  </div>
                </div>
              `;
            } else {
              // Regular meal
              const nut = getMealNutritionByNameCombined(log.meal);
              return `
                <div class="bg-slate-700 p-3 rounded flex justify-between items-center">
                  <div>
                    <p class="font-semibold">${log.meal}</p>
                    <p class="text-slate-300 text-xs">${log.time} • ${nut.kcal} kcal • ${nut.prot}g prot • ${nut.fat}g gord</p>
                  </div>
                  <button data-meal-id="${log.id}" class="meal-delete-btn text-red-400 hover:text-red-300" title="Excluir registro">🗑️</button>
                </div>
              `;
            }
          }).join('')}
        </div>`
      }
    </div>
  `;
}
