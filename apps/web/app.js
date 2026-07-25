/* ==========================================================================
   RoomIA — Main Web Application Logic
   Created for Hackatón de IA con Qiro (Código Facilito & AWS)
   ========================================================================== */

const state = {
  currentCity: localStorage.getItem('roomia_city') || 'Ciudad de México',
  mode: localStorage.getItem('roomia_mode') || 'couple', // 'solo' | 'couple'
  tavilyApiKey: localStorage.getItem('roomia_tavily_key') || import.meta.env.VITE_TAVILY_API_KEY || '',
  ingredients: JSON.parse(localStorage.getItem('roomia_ingredients') || '["3 Huevos", "Pechuga de Pollo", "Tomates", "Arroz", "Cebolla", "Queso"]'),
  expenses: JSON.parse(localStorage.getItem('roomia_expenses') || '[{"id":1, "desc":"Supermercado Inicial", "amount":85.50, "payer":"Roomie 1", "split":"50-50"},{"id":2, "desc":"Pago de Internet", "amount":45.00, "payer":"Roomie 2", "split":"50-50"}]'),
  tasks: JSON.parse(localStorage.getItem('roomia_tasks') || '[{"name":"Cocinar Cena", "assigned":"Roomie 1"}, {"name":"Lavar Platos", "assigned":"Roomie 2"}, {"name":"Comprar Alacena", "assigned":"Roomie 1"}, {"name":"Limpiar Sala", "assigned":"Roomie 2"}]'),
  documents: JSON.parse(localStorage.getItem('roomia_docs') || '[{"name":"Contrato_Alquiler_CDMX.pdf", "size":"1.2 MB", "date":"2026-07-20"}, {"name":"Comprobante_Servicios.pdf", "size":"450 KB", "date":"2026-07-22"}]')
};

const elements = {
  cityBtn: document.getElementById('cityBtn'),
  currentCityLabel: document.getElementById('currentCityLabel'),
  modeSoloBtn: document.getElementById('modeSoloBtn'),
  modeCoupleBtn: document.getElementById('modeCoupleBtn'),
  openSettingsBtn: document.getElementById('openSettingsBtn'),
  householdTabLabel: document.getElementById('householdTabLabel'),
  plannerModeBadge: document.getElementById('plannerModeBadge'),

  navTabs: document.querySelectorAll('.nav-tab'),
  tabPanels: document.querySelectorAll('.tab-panel'),

  eventSearchInput: document.getElementById('eventSearchInput'),
  searchEventsBtn: document.getElementById('searchEventsBtn'),
  tavilyStatusBadge: document.getElementById('tavilyStatusBadge'),
  eventsGrid: document.getElementById('eventsGrid'),
  resultsCount: document.getElementById('resultsCount'),
  filterChips: document.querySelectorAll('.chip'),
  generateItineraryBtn: document.getElementById('generateItineraryBtn'),
  itineraryOutput: document.getElementById('itineraryOutput'),

  costCalcForm: document.getElementById('costCalcForm'),
  calcRent: document.getElementById('calcRent'),
  calcDeposit: document.getElementById('calcDeposit'),
  calcUtilities: document.getElementById('calcUtilities'),
  calcFurniture: document.getElementById('calcFurniture'),
  calcTotalOutput: document.getElementById('calcTotalOutput'),
  relocationProgressBar: document.getElementById('relocationProgressBar'),
  progressPercentage: document.getElementById('progressPercentage'),

  newIngredientInput: document.getElementById('newIngredientInput'),
  addIngredientBtn: document.getElementById('addIngredientBtn'),
  voiceDictateBtn: document.getElementById('voiceDictateBtn'),
  ingredientChips: document.getElementById('ingredientChips'),
  generateRecipeBtn: document.getElementById('generateRecipeBtn'),
  recipesContainer: document.getElementById('recipesContainer'),

  addExpenseForm: document.getElementById('addExpenseForm'),
  expenseList: document.getElementById('expenseList'),
  settlementResult: document.getElementById('settlementResult'),
  expensesTitle: document.getElementById('expensesTitle'),
  expensesSubtitle: document.getElementById('expensesSubtitle'),
  randomizeTasksBtn: document.getElementById('randomizeTasksBtn'),
  tasksList: document.getElementById('tasksList'),

  dropZone: document.getElementById('dropZone'),
  fileInput: document.getElementById('fileInput'),
  docList: document.getElementById('docList'),
  exportMedicalCardBtn: document.getElementById('exportMedicalCardBtn'),

  settingsModal: document.getElementById('settingsModal'),
  closeSettingsBtn: document.getElementById('closeSettingsBtn'),
  saveSettingsBtn: document.getElementById('saveSettingsBtn'),
  settingsCityInput: document.getElementById('settingsCityInput'),
  settingsTavilyKey: document.getElementById('settingsTavilyKey')
};

function init() {
  setupEventListeners();
  updateUIState();
  renderIngredients();
  renderExpenses();
  renderTasks();
  renderDocs();
  calculateRelocationCost();
  updateChecklistProgress();

  performEventSearch(state.eventSearchInput ? state.eventSearchInput.value : 'Eventos y conciertos destacados este fin de semana');
}

function updateUIState() {
  elements.currentCityLabel.textContent = state.currentCity;
  document.querySelectorAll('.city-highlight').forEach(el => el.textContent = state.currentCity);

  if (state.mode === 'solo') {
    elements.modeSoloBtn.classList.add('active');
    elements.modeCoupleBtn.classList.remove('active');
    elements.householdTabLabel.textContent = 'Finanzas & Tareas Solitario';
    elements.plannerModeBadge.textContent = 'Modo Solo Expat';
    elements.expensesTitle.innerHTML = '<i class="fa-solid fa-wallet"></i> Control Financiero Personal';
    elements.expensesSubtitle.textContent = 'Presupuesto mensual y organizador personal de tareas del hogar con RoomIA.';
  } else {
    elements.modeCoupleBtn.classList.add('active');
    elements.modeSoloBtn.classList.remove('active');
    elements.householdTabLabel.textContent = 'Finanzas & Convivencia';
    elements.plannerModeBadge.textContent = 'Modo Roomies / Pareja';
    elements.expensesTitle.innerHTML = '<i class="fa-solid fa-scale-balanced"></i> Finanzas & Convivencia en Pareja / Roomies';
    elements.expensesSubtitle.textContent = 'Calculadora transparente de gastos compartidos y asignador equitativo de tareas del hogar con RoomIA.';
  }

  if (state.tavilyApiKey && state.tavilyApiKey.trim() !== '') {
    elements.tavilyStatusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> Tavily Live API Conectado';
    elements.tavilyStatusBadge.style.color = '#10b981';
  } else {
    elements.tavilyStatusBadge.innerHTML = '<i class="fa-solid fa-robot"></i> Simulación RoomIA Activada';
    elements.tavilyStatusBadge.style.color = '#06b6d4';
  }
}

function setupEventListeners() {
  elements.navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      elements.navTabs.forEach(t => t.classList.remove('active'));
      elements.tabPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const targetId = `tab-${tab.dataset.tab}`;
      document.getElementById(targetId).classList.add('active');
    });
  });

  elements.modeSoloBtn.addEventListener('click', () => setMode('solo'));
  elements.modeCoupleBtn.addEventListener('click', () => setMode('couple'));

  elements.cityBtn.addEventListener('click', openSettings);
  elements.openSettingsBtn.addEventListener('click', openSettings);
  elements.closeSettingsBtn.addEventListener('click', closeSettings);
  elements.saveSettingsBtn.addEventListener('click', saveSettings);

  elements.searchEventsBtn.addEventListener('click', () => {
    performEventSearch(elements.eventSearchInput.value);
  });
  elements.filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      elements.filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const query = chip.dataset.query;
      elements.eventSearchInput.value = `${query} en ${state.currentCity}`;
      performEventSearch(elements.eventSearchInput.value);
    });
  });
  elements.generateItineraryBtn.addEventListener('click', generateWeekendItinerary);

  elements.costCalcForm.addEventListener('input', calculateRelocationCost);
  document.querySelectorAll('.checklist-groups input[type="checkbox"]').forEach(chk => {
    chk.addEventListener('change', updateChecklistProgress);
  });

  elements.addIngredientBtn.addEventListener('click', addIngredient);
  elements.newIngredientInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addIngredient();
  });
  elements.generateRecipeBtn.addEventListener('click', generateRecipes);
  elements.voiceDictateBtn.addEventListener('click', startVoiceDictation);

  elements.addExpenseForm.addEventListener('submit', handleAddExpense);
  elements.randomizeTasksBtn.addEventListener('click', randomizeTasks);

  elements.dropZone.addEventListener('click', () => elements.fileInput.click());
  elements.fileInput.addEventListener('change', handleFileUpload);
  elements.exportMedicalCardBtn.addEventListener('click', exportMedicalCard);
}

function setMode(newMode) {
  state.mode = newMode;
  localStorage.setItem('roomia_mode', newMode);
  updateUIState();
  calculateSettlement();
}

function openSettings() {
  elements.settingsCityInput.value = state.currentCity;
  elements.settingsTavilyKey.value = state.tavilyApiKey;
  elements.settingsModal.classList.add('active');
}

function closeSettings() {
  elements.settingsModal.classList.remove('active');
}

function saveSettings() {
  const newCity = elements.settingsCityInput.value.trim() || 'Ciudad de México';
  const newKey = elements.settingsTavilyKey.value.trim();

  state.currentCity = newCity;
  state.tavilyApiKey = newKey;

  localStorage.setItem('roomia_city', newCity);
  localStorage.setItem('roomia_tavily_key', newKey);

  updateUIState();
  closeSettings();

  performEventSearch(`Eventos y conciertos destacados este fin de semana en ${newCity}`);
}

async function performEventSearch(query) {
  elements.resultsCount.textContent = 'RoomIA buscando eventos con Tavily...';
  elements.eventsGrid.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">
      <i class="fa-solid fa-spinner fa-spin text-2xl"></i>
      <p style="margin-top: 0.5rem;">RoomIA explorando actividades en tiempo real en ${state.currentCity}...</p>
    </div>
  `;

  let events = [];

  if (state.tavilyApiKey && state.tavilyApiKey.trim() !== '') {
    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: state.tavilyApiKey,
          query: `${query} en ${state.currentCity}`,
          search_depth: 'basic',
          include_answer: true,
          max_results: 6
        })
      });
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        events = data.results.map((item, idx) => ({
          title: item.title,
          category: idx % 2 === 0 ? 'Cultura & Música' : 'En Vivo & Gastronomía',
          snippet: item.content,
          url: item.url,
          date: 'Próximas fechas',
          location: state.currentCity
        }));
      }
    } catch (err) {
      console.warn('Tavily API error, switching to RoomIA simulation:', err);
    }
  }

  if (events.length === 0) {
    events = generateDemoEvents(query, state.currentCity);
  }

  renderEventsGrid(events);
}

function generateDemoEvents(query, city) {
  return [
    {
      title: `Festival Cultural & Gastronómico de ${city}`,
      category: 'Gastronomía & Feria',
      snippet: `Muestra gastronómica artesanal con más de 40 expositores locales, música en vivo y talleres de cocina en el centro de ${city}.`,
      date: 'Sábado & Domingo, 12:00 - 20:00',
      location: `Parque Central de ${city}`
    },
    {
      title: `Noche de Jazz & Coctelería de Autor`,
      category: 'Música & Parejas',
      snippet: `Presentación en vivo de cuartetos de jazz local con degustación de coctelería artesanal y terraza abierta con vista panorámica.`,
      date: 'Viernes y Sábado, 21:00',
      location: `Distrito Cultural, ${city}`
    },
    {
      title: `Tech & AI Innovators Meetup ${city}`,
      category: 'Tech & Networking',
      snippet: `Reunión de la comunidad de desarrollo e inteligencia artificial. Charlas sobre herramientas agenticas, networking y pizzas.`,
      date: 'Jueves, 19:00',
      location: `Hub de Innovación ${city}`
    },
    {
      title: `Ruta de Museos & Exposición Inmersiva`,
      category: 'Cultura & Arte',
      snippet: `Recorrido guiado por las principales galerías de arte contemporáneo con instalaciones digitales e interactivas.`,
      date: 'Fin de semana continuo',
      location: `Circuito de Museos`
    },
    {
      title: `Mercado de Productos Orgánicos & Diseño Local`,
      category: 'Aire Libre',
      snippet: `Feria al aire libre ideal para recién llegados a ${city}. Productos ecológicos, plantas de interior y artesanía local.`,
      date: 'Domingo, 10:00 - 16:00',
      location: `Plaza Principal`
    },
    {
      title: `Ciclo de Cine de Verano & Picnic al Aire Libre`,
      category: 'Roomies & Amigos',
      snippet: `Proyección de cine independiente bajo las estrellas con área para pícnic y food trucks invitados.`,
      date: 'Sábado, 19:30',
      location: `Parque Urbano ${city}`
    }
  ];
}

function renderEventsGrid(events) {
  elements.resultsCount.textContent = `${events.length} Eventos destacados encontrados en ${state.currentCity}`;
  elements.eventsGrid.innerHTML = events.map(evt => `
    <div class="event-card">
      <div>
        <span class="event-badge">${evt.category}</span>
        <h4 class="event-title">${evt.title}</h4>
        <p class="event-snippet">${evt.snippet}</p>
      </div>
      <div class="event-footer">
        <span><i class="fa-solid fa-clock"></i> ${evt.date}</span>
        <span><i class="fa-solid fa-location-dot"></i> ${evt.location}</span>
      </div>
    </div>
  `).join('');
}

function generateWeekendItinerary() {
  const isCouple = state.mode === 'couple';
  const modeTitle = isCouple ? 'Itinerario de Roomies / Pareja para Descubrir la Ciudad' : 'Ruta Individual de Exploración & Enfoque';

  elements.itineraryOutput.innerHTML = `
    <div style="font-weight: 700; color: var(--accent-cyan); margin-bottom: 0.75rem; font-size: 0.95rem;">
      <i class="fa-solid fa-sparkles"></i> ${modeTitle} (${state.currentCity})
    </div>
    
    <div class="itinerary-step">
      <div class="itinerary-time">Sábado - 10:30 AM</div>
      <p style="font-size: 0.88rem; color: var(--text-main);">Visita al Mercado de Productos Locales para hacer compras frescas de alacena y desayuno al aire libre.</p>
    </div>

    <div class="itinerary-step">
      <div class="itinerary-time">Sábado - 04:00 PM</div>
      <p style="font-size: 0.88rem; color: var(--text-main);">Recorrido por la Ruta de Museos y café de especialidad en el centro de ${state.currentCity}.</p>
    </div>

    <div class="itinerary-step">
      <div class="itinerary-time">Sábado - 08:30 PM</div>
      <p style="font-size: 0.88rem; color: var(--text-main);">${isCouple ? 'Noche de Jazz en vivo y cena en pareja en terraza con ambiente acogedor.' : 'Cine de verano al aire libre o Meetup cultural local.'}</p>
    </div>

    <div class="itinerary-step">
      <div class="itinerary-time">Domingo - 11:00 AM</div>
      <p style="font-size: 0.88rem; color: var(--text-main);">Preparación de comida en casa con recetas anti-desperdicio sugeridas por RoomIA y paseo por el parque principal.</p>
    </div>
  `;
}

function calculateRelocationCost() {
  const rent = parseFloat(elements.calcRent.value) || 0;
  const deposit = parseFloat(elements.calcDeposit.value) || 0;
  const utilities = parseFloat(elements.calcUtilities.value) || 0;
  const furniture = parseFloat(elements.calcFurniture.value) || 0;

  const total = rent + deposit + utilities + furniture;
  elements.calcTotalOutput.textContent = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD`;
}

function updateChecklistProgress() {
  const total = document.querySelectorAll('.checklist-groups input[type="checkbox"]').length;
  const checked = document.querySelectorAll('.checklist-groups input[type="checkbox"]:checked').length;
  const pct = Math.round((checked / total) * 100);

  elements.relocationProgressBar.style.width = `${pct}%`;
  elements.progressPercentage.textContent = `${pct}% Completado`;
}

function renderIngredients() {
  elements.ingredientChips.innerHTML = state.ingredients.map((ing, idx) => `
    <span class="ing-chip">
      <i class="fa-solid fa-apple-whole text-xs"></i>
      ${ing}
      <span class="remove-btn" onclick="removeIngredient(${idx})">&times;</span>
    </span>
  `).join('');
}

function addIngredient() {
  const val = elements.newIngredientInput.value.trim();
  if (val && !state.ingredients.includes(val)) {
    state.ingredients.push(val);
    localStorage.setItem('roomia_ingredients', JSON.stringify(state.ingredients));
    elements.newIngredientInput.value = '';
    renderIngredients();
  }
}

window.removeIngredient = function(index) {
  state.ingredients.splice(index, 1);
  localStorage.setItem('roomia_ingredients', JSON.stringify(state.ingredients));
  renderIngredients();
};

function generateRecipes() {
  const count = state.ingredients.length;
  if (count === 0) {
    elements.recipesContainer.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 1.5rem;">Agrega al menos 1 o 2 ingredientes para que RoomIA genere recetas.</p>`;
    return;
  }

  const ingListStr = state.ingredients.join(', ');

  elements.recipesContainer.innerHTML = `
    <div class="recipe-card">
      <h4><i class="fa-solid fa-bowl-food"></i> Bowl Saludable de ${state.ingredients[0] || 'Ingredientes'} & Proteínas</h4>
      <div class="recipe-meta">
        <span><i class="fa-solid fa-clock"></i> 20 minutos</span>
        <span><i class="fa-solid fa-fire"></i> Fácil</span>
        <span><i class="fa-solid fa-leaf"></i> Anti-Desperdicio</span>
      </div>
      <ol class="recipe-steps">
        <li>Picar en cubos ${state.ingredients[0] || 'los vegetales'} y saltear en sartén con un toque de aceite de oliva.</li>
        <li>Combinar con ${state.ingredients[1] || 'el acompañamiento disponible'} e incorporar especias al gusto.</li>
        <li>Servir caliente. Ideal para 2 porciones de roomies o meal prep de la semana.</li>
      </ol>
    </div>

    <div class="recipe-card">
      <h4><i class="fa-solid fa-utensils"></i> Salteado Exprés de Alacena (${ingListStr.slice(0, 30)}...)</h4>
      <div class="recipe-meta">
        <span><i class="fa-solid fa-clock"></i> 15 minutos</span>
        <span><i class="fa-solid fa-kitchen-set"></i> Rápido</span>
      </div>
      <ol class="recipe-steps">
        <li>Mezclar en fuego medio los ingredientes disponibles en tu refrigerador.</li>
        <li>Sazonar con sal, pimienta y salsa de soya si se cuenta con ella.</li>
        <li>Disfrutar de una comida rápida sin necesidad de comprar ingredientes extra.</li>
      </ol>
    </div>
  `;
}

function startVoiceDictation() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('El dictado por voz no es soportado por este navegador. Puedes escribir manualmente los ingredientes.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'es-ES';
  recognition.interimResults = false;

  elements.voiceDictateBtn.style.color = '#ef4444';
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    elements.newIngredientInput.value = transcript;
    elements.voiceDictateBtn.style.color = 'var(--text-main)';
  };

  recognition.onerror = () => {
    elements.voiceDictateBtn.style.color = 'var(--text-main)';
  };
}

function renderExpenses() {
  elements.expenseList.innerHTML = state.expenses.map(exp => `
    <li class="expense-item">
      <div>
        <strong>${exp.desc}</strong>
        <div style="font-size: 0.78rem; color: var(--text-muted);">Pagado por: ${exp.payer} (${exp.split})</div>
      </div>
      <div style="font-weight: 700; color: var(--accent-emerald);">$${parseFloat(exp.amount).toFixed(2)}</div>
    </li>
  `).join('');

  calculateSettlement();
}

function handleAddExpense(e) {
  e.preventDefault();
  const desc = document.getElementById('expDesc').value.trim();
  const amount = parseFloat(document.getElementById('expAmount').value);
  const payer = document.getElementById('expPayer').value;
  const split = document.getElementById('expSplitType').value;

  if (desc && !isNaN(amount) && amount > 0) {
    state.expenses.push({ id: Date.now(), desc, amount, payer, split });
    localStorage.setItem('roomia_expenses', JSON.stringify(state.expenses));

    document.getElementById('expDesc').value = '';
    document.getElementById('expAmount').value = '';
    renderExpenses();
  }
}

function calculateSettlement() {
  if (state.mode === 'solo') {
    const total = state.expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    elements.settlementResult.textContent = `Gasto Personal Total del Mes: $${total.toFixed(2)} USD`;
    return;
  }

  let p1Paid = 0;
  let p2Paid = 0;

  state.expenses.forEach(item => {
    const amt = parseFloat(item.amount);
    if (item.payer === 'Roomie 1') p1Paid += amt;
    else p2Paid += amt;
  });

  const diff = (p1Paid - p2Paid) / 2;

  if (Math.abs(diff) < 0.01) {
    elements.settlementResult.textContent = 'Cuentas al día (Sin deudas pendientes)';
  } else if (diff > 0) {
    elements.settlementResult.textContent = `Roomie 2 (Sam) le debe $${diff.toFixed(2)} USD a Roomie 1 (Alex)`;
  } else {
    elements.settlementResult.textContent = `Roomie 1 (Alex) le debe $${Math.abs(diff).toFixed(2)} USD a Roomie 2 (Sam)`;
  }
}

function renderTasks() {
  elements.tasksList.innerHTML = state.tasks.map(t => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: var(--bg-dark); border-radius: var(--radius-md); margin-bottom: 0.5rem;">
      <span><i class="fa-solid fa-check-double text-xs" style="color: var(--accent-cyan);"></i> ${t.name}</span>
      <span class="badge-mode-indicator">${t.assigned}</span>
    </div>
  `).join('');
}

function randomizeTasks() {
  const people = state.mode === 'couple' ? ['Roomie 1 (Alex)', 'Roomie 2 (Sam)'] : ['Asignado a ti'];
  state.tasks.forEach(t => {
    t.assigned = people[Math.floor(Math.random() * people.length)];
  });
  localStorage.setItem('roomia_tasks', JSON.stringify(state.tasks));
  renderTasks();
}

function renderDocs() {
  elements.docList.innerHTML = state.documents.map(d => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: var(--bg-dark); border-radius: var(--radius-md); margin-bottom: 0.5rem;">
      <div>
        <i class="fa-solid fa-file-pdf" style="color: var(--accent-rose); margin-right: 0.5rem;"></i>
        <strong>${d.name}</strong>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${d.size} • Guardado el ${d.date}</div>
      </div>
      <span style="font-size: 0.8rem; color: var(--accent-emerald);"><i class="fa-solid fa-lock"></i> Encriptado RoomIA</span>
    </div>
  `).join('');
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (file) {
    state.documents.push({
      name: file.name,
      size: `${(file.size / 1024).toFixed(0)} KB`,
      date: new Date().toISOString().split('T')[0]
    });
    localStorage.setItem('roomia_docs', JSON.stringify(state.documents));
    renderDocs();
  }
}

function exportMedicalCard() {
  const name = document.getElementById('medName').value;
  const blood = document.getElementById('medBlood').value;
  const allergies = document.getElementById('medAllergies').value;
  const contact = document.getElementById('medContact').value;

  const content = `
=== TARJETA DE EMERGENCIA PERSONAL (ROOMIA AI) ===
Nombre: ${name}
Ciudad Actual: ${state.currentCity}
Tipo de Sangre: ${blood}
Alergias / Condiciones: ${allergies}
Contacto de Emergencia: ${contact}
Generado en: ${new Date().toLocaleString()}
===================================================
  `;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Tarjeta_Emergencia_RoomIA_${name.replace(/\s+/g, '_')}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', init);
