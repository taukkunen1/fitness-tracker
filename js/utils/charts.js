/**
 * @fileoverview Charts Module
 * @module utils/charts
 * 
 * Chart.js helpers and chart rendering functions
 */

/* Chart functions */
function toggleProfileInChart(profileId) {
  if (window.selectedProfilesForChart.has(profileId)) {
    window.selectedProfilesForChart.delete(profileId);
  } else {
    window.selectedProfilesForChart.add(profileId);
  }
  updateEvolutionChart();
}

// Select/deselect all metrics
function selectAllMetrics() {
  ['metricWeight', 'metricBodyFat', 'metricMuscleMass', 'metricBMI', 'metricWater', 
   'metricBMR', 'metricPhaseAngle', 'metricMetabolicAge', 'metricMuscleSize'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = true;
  });
  updateEvolutionChart();
}

function deselectAllMetrics() {
  ['metricWeight', 'metricBodyFat', 'metricMuscleMass', 'metricBMI', 'metricWater', 
   'metricBMR', 'metricPhaseAngle', 'metricMetabolicAge', 'metricMuscleSize'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });
  updateEvolutionChart();
}

// Update chart based on current selections
function updateEvolutionChart() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded, skipping chart rendering');
    return;
  }
  
  const canvas = document.getElementById('muscleChart');
  if (!canvas) return;
  
  // Get selected metrics
  const selectedMetrics = {
    weight: document.getElementById('metricWeight')?.checked || false,
    bodyFat: document.getElementById('metricBodyFat')?.checked || false,
    muscleMass: document.getElementById('metricMuscleMass')?.checked || false,
    bmi: document.getElementById('metricBMI')?.checked || false,
    water: document.getElementById('metricWater')?.checked || false,
    bmr: document.getElementById('metricBMR')?.checked || false,
    phaseAngle: document.getElementById('metricPhaseAngle')?.checked || false,
    metabolicAge: document.getElementById('metricMetabolicAge')?.checked || false,
    muscleSize: document.getElementById('metricMuscleSize')?.checked || false
  };
  
  // Get all dates from selected profiles
  const allDates = new Set();
  const profileColors = {
    0: { primary: '#8B5CF6', secondary: '#A78BFA' },
    1: { primary: '#EC4899', secondary: '#F472B6' },
    2: { primary: '#10B981', secondary: '#34D399' },
    3: { primary: '#F59E0B', secondary: '#FBBF24' },
    4: { primary: '#3B82F6', secondary: '#60A5FA' },
    5: { primary: '#EF4444', secondary: '#F87171' }
  };
  
  const datasets = [];
  let profileIndex = 0;
  
  // Process each selected profile
  window.selectedProfilesForChart.forEach(profileId => {
    const profile = state.users[profileId];
    if (!profile) return;
    
    const metrics = (profile.bodyMetrics || []).slice().sort((a,b) => new Date(a.date) - new Date(b.date));
    metrics.forEach(m => allDates.add(m.date));
    
    const colors = profileColors[profileIndex % 6];
    const profileName = profile.name;
    
    // Create datasets for each selected metric
    if (selectedMetrics.weight) {
      const data = metrics.map(m => m.weight || null);
      datasets.push({
        label: `${profileName} - Peso (kg)`,
        data: data,
        borderColor: colors.primary,
        backgroundColor: colors.primary + '33',
        tension: 0.2,
        yAxisID: 'y'
      });
    }
    
    if (selectedMetrics.bodyFat) {
      const data = metrics.map(m => m.bodyFat || null);
      datasets.push({
        label: `${profileName} - Gordura (%)`,
        data: data,
        borderColor: colors.secondary,
        backgroundColor: colors.secondary + '33',
        tension: 0.2,
        yAxisID: 'y2',
        borderDash: [5, 5]
      });
    }
    
    if (selectedMetrics.muscleMass) {
      const data = metrics.map(m => m.muscleMass || null);
      datasets.push({
        label: `${profileName} - Massa Muscular (kg)`,
        data: data,
        borderColor: colors.primary,
        backgroundColor: colors.primary + '22',
        tension: 0.2,
        yAxisID: 'y',
        borderDash: [10, 5]
      });
    }
    
    if (selectedMetrics.bmi) {
      const data = metrics.map(m => m.bmi || null);
      datasets.push({
        label: `${profileName} - IMC`,
        data: data,
        borderColor: colors.secondary,
        backgroundColor: colors.secondary + '22',
        tension: 0.2,
        yAxisID: 'y3'
      });
    }
    
    if (selectedMetrics.water) {
      const data = metrics.map(m => m.waterWeight || null);
      datasets.push({
        label: `${profileName} - Água (kg)`,
        data: data,
        borderColor: '#06B6D4',
        backgroundColor: '#06B6D433',
        tension: 0.2,
        yAxisID: 'y'
      });
    }
    
    if (selectedMetrics.bmr) {
      const data = metrics.map(m => m.bmr || null);
      datasets.push({
        label: `${profileName} - TMB (kcal)`,
        data: data,
        borderColor: '#F97316',
        backgroundColor: '#F9731633',
        tension: 0.2,
        yAxisID: 'y4'
      });
    }
    
    if (selectedMetrics.phaseAngle) {
      const data = metrics.map(m => m.phaseAngle || null);
      datasets.push({
        label: `${profileName} - Ângulo Fase (°)`,
        data: data,
        borderColor: '#14B8A6',
        backgroundColor: '#14B8A633',
        tension: 0.2,
        yAxisID: 'y3'
      });
    }
    
    if (selectedMetrics.metabolicAge) {
      const data = metrics.map(m => m.metabolicAge || null);
      datasets.push({
        label: `${profileName} - Idade Met. (anos)`,
        data: data,
        borderColor: '#FBBF24',
        backgroundColor: '#FBBF2433',
        tension: 0.2,
        yAxisID: 'y3'
      });
    }
    
    if (selectedMetrics.muscleSize) {
      const data = metrics.map(m => m.muscleSize || null);
      datasets.push({
        label: `${profileName} - Tamanho Musc. (cm)`,
        data: data,
        borderColor: '#60A5FA',
        backgroundColor: '#60A5FA33',
        tension: 0.2,
        yAxisID: 'y2'
      });
    }
    
    profileIndex++;
  });
  
  const labels = Array.from(allDates).sort();
  
  // Build scales configuration
  const scales = {
    x: {
      ticks: { color: '#E2E8F0' },
      grid: { color: '#475569' }
    },
    y: {
      beginAtZero: false,
      position: 'left',
      title: { display: true, text: 'kg', color: '#E2E8F0' },
      ticks: { color: '#E2E8F0' },
      grid: { color: '#475569' }
    }
  };
  
  // Add additional axes if needed
  if (selectedMetrics.bodyFat || selectedMetrics.muscleSize) {
    scales.y2 = {
      position: 'right',
      grid: { drawOnChartArea: false },
      title: { display: true, text: '% / cm', color: '#E2E8F0' },
      ticks: { color: '#E2E8F0' }
    };
  }
  
  if (selectedMetrics.bmi || selectedMetrics.phaseAngle || selectedMetrics.metabolicAge) {
    scales.y3 = {
      position: 'right',
      grid: { drawOnChartArea: false },
      title: { display: true, text: 'IMC / ° / anos', color: '#E2E8F0' },
      ticks: { color: '#E2E8F0' }
    };
  }
  
  if (selectedMetrics.bmr) {
    scales.y4 = {
      position: 'right',
      grid: { drawOnChartArea: false },
      title: { display: true, text: 'kcal/dia', color: '#E2E8F0' },
      ticks: { color: '#E2E8F0' }
    };
  }
  
  const config = {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          labels: { color: '#E2E8F0', boxWidth: 15, padding: 10 }
        },
        title: {
          display: true,
          text: 'Evolução de Performance e Medidas ao Longo do Tempo',
          color: '#E2E8F0',
          font: { size: 16 }
        }
      },
      scales: scales
    }
  };
  
  if (muscleChart) {
    muscleChart.destroy();
    muscleChart = null;
  }
  muscleChart = new Chart(canvas, config);
}

// Legacy function for compatibility - now calls updateEvolutionChart
function renderMuscleEvolutionChart(bodyMetrics, userId) {
  // Initialize selected profiles if needed
  if (!window.selectedProfilesForChart) {
    window.selectedProfilesForChart = new Set([userId]);
  }
  updateEvolutionChart();
}

function compareProgressPhotos() {
  const photo1Id = document.getElementById('comparePhoto1')?.value;
  const photo2Id = document.getElementById('comparePhoto2')?.value;
  
  if (!photo1Id || !photo2Id) {
    alert('Selecione duas fotos para comparar');
    return;
  }
  
  if (photo1Id === photo2Id) {
    alert('Selecione fotos diferentes para comparar');
    return;
  }
  
  const user = state.users[state.activeUser];
  const photo1 = user.progressPhotos.find(p => p.id === photo1Id);
  const photo2 = user.progressPhotos.find(p => p.id === photo2Id);
  
  if (!photo1 || !photo2) {
    alert('Fotos não encontradas');
    return;
  }
  
  const resultDiv = document.getElementById('comparisonResult');
  const img1Container = document.getElementById('compareImg1Container');
  const img2Container = document.getElementById('compareImg2Container');
  
  img1Container.innerHTML = `
    <div class="bg-slate-700 p-3 rounded">
      <img src="${photo1.imageData}" alt="Foto 1" class="w-full h-96 object-cover rounded mb-3" />
      <p class="font-bold text-lg">${new Date(photo1.date).toLocaleDateString('pt-BR')}</p>
      ${photo1.notes ? `<p class="text-sm text-slate-300">${escapeHtml(photo1.notes)}</p>` : ''}
    </div>
  `;
  
  img2Container.innerHTML = `
    <div class="bg-slate-700 p-3 rounded">
      <img src="${photo2.imageData}" alt="Foto 2" class="w-full h-96 object-cover rounded mb-3" />
      <p class="font-bold text-lg">${new Date(photo2.date).toLocaleDateString('pt-BR')}</p>
      ${photo2.notes ? `<p class="text-sm text-slate-300">${escapeHtml(photo2.notes)}</p>` : ''}
    </div>
  `;
  
  resultDiv.classList.remove('hidden');
}

/* ----------------------------- Comparison Chart ----------------------------- */
function renderComparisonChart() {
  // Check if Chart.js is available
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded, skipping chart rendering');
    return;
  }
  
  const canvas = document.getElementById('comparisonChartCanvas');
  if (!canvas) return;
  
  const profiles = Object.values(state.users);
  if (profiles.length < 2) return;
  
  const profile1Id = state.compareProfile1 || profiles[0].id;
  const profile2Id = state.compareProfile2 || (profiles.length > 1 ? profiles[1].id : profiles[0].id);
  
  const profile1 = state.users[profile1Id];
  const profile2 = state.users[profile2Id];
  
  if (!profile1 || !profile2) return;
  
  const metrics1 = (profile1.bodyMetrics || []).slice().sort((a,b) => new Date(a.date) - new Date(b.date));
  const metrics2 = (profile2.bodyMetrics || []).slice().sort((a,b) => new Date(a.date) - new Date(b.date));
  
  // Combine and sort all dates
  const allDates = [...new Set([...metrics1.map(m => m.date), ...metrics2.map(m => m.date)])].sort();
  
  // Create data arrays
  const weight1 = allDates.map(date => {
    const metric = metrics1.find(m => m.date === date);
    return metric ? metric.weight : null;
  });
  
  const weight2 = allDates.map(date => {
    const metric = metrics2.find(m => m.date === date);
    return metric ? metric.weight : null;
  });
  
  const bodyFat1 = allDates.map(date => {
    const metric = metrics1.find(m => m.date === date);
    return metric ? metric.bodyFat : null;
  });
  
  const bodyFat2 = allDates.map(date => {
    const metric = metrics2.find(m => m.date === date);
    return metric ? metric.bodyFat : null;
  });
  
  const muscleMass1 = allDates.map(date => {
    const metric = metrics1.find(m => m.date === date);
    return metric ? metric.muscleMass : null;
  });
  
  const muscleMass2 = allDates.map(date => {
    const metric = metrics2.find(m => m.date === date);
    return metric ? metric.muscleMass : null;
  });
  
  const datasets = [
    {
      label: `${profile1.name} - Peso (kg)`,
      data: weight1,
      borderColor: '#8B5CF6',
      backgroundColor: '#8B5CF633',
      tension: 0.2,
      yAxisID: 'y'
    },
    {
      label: `${profile2.name} - Peso (kg)`,
      data: weight2,
      borderColor: '#EC4899',
      backgroundColor: '#EC489933',
      tension: 0.2,
      yAxisID: 'y'
    },
    {
      label: `${profile1.name} - Gordura (%)`,
      data: bodyFat1,
      borderColor: '#10B981',
      backgroundColor: '#10B98133',
      tension: 0.2,
      yAxisID: 'y2',
      borderDash: [5, 5]
    },
    {
      label: `${profile2.name} - Gordura (%)`,
      data: bodyFat2,
      borderColor: '#F59E0B',
      backgroundColor: '#F59E0B33',
      tension: 0.2,
      yAxisID: 'y2',
      borderDash: [5, 5]
    },
    {
      label: `${profile1.name} - Massa Muscular (kg)`,
      data: muscleMass1,
      borderColor: '#3B82F6',
      backgroundColor: '#3B82F633',
      tension: 0.2,
      yAxisID: 'y',
      borderDash: [10, 5]
    },
    {
      label: `${profile2.name} - Massa Muscular (kg)`,
      data: muscleMass2,
      borderColor: '#EF4444',
      backgroundColor: '#EF444433',
      tension: 0.2,
      yAxisID: 'y',
      borderDash: [10, 5]
    }
  ];
  
  const config = {
    type: 'line',
    data: {
      labels: allDates,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#E2E8F0'
          }
        },
        title: {
          display: true,
          text: 'Comparação de Evolução',
          color: '#E2E8F0',
          font: {
            size: 16
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#94A3B8' },
          grid: { color: '#334155' }
        },
        y: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'Peso / Massa Muscular (kg)',
            color: '#E2E8F0'
          },
          ticks: { color: '#94A3B8' },
          grid: { color: '#334155' }
        },
        y2: {
          type: 'linear',
          position: 'right',
          title: {
            display: true,
            text: 'Gordura Corporal (%)',
            color: '#E2E8F0'
          },
          ticks: { color: '#94A3B8' },
          grid: {
            drawOnChartArea: false
          }
        }
      }
    }
  };
  
  // Destroy existing chart if it exists
  if (window.comparisonChart) {
    window.comparisonChart.destroy();
  }
  
  window.comparisonChart = new Chart(canvas, config);
}

/* ============================= AUTHENTICATION UI ============================= */

function renderLoginPage() {
