import { create } from 'zustand';
import { StorageUtil } from '../utils/storage.util';
import { INITIAL_INGREDIENTS, INITIAL_EXPENSES, INITIAL_TASKS, INITIAL_DOCS } from '../config/constants';

// Normalize initial tasks to have status property for Kanban
const normalizedInitialTasks = INITIAL_TASKS.map(t => ({
  ...t,
  status: t.status || (t.completed ? 'done' : 'todo')
}));

export const useRoomiaStore = create((set, get) => ({
  currentCity: StorageUtil.getString('roomia_city', 'Ciudad de México'),
  currencyOverride: StorageUtil.getString('roomia_currency_override', ''),
  mode: StorageUtil.getString('roomia_mode', 'couple'),
  language: StorageUtil.getString('roomia_lang', 'es'),
  tavilyApiKey: StorageUtil.getString('roomia_tavily_key', ''),
  activeTab: 'city-events',
  isSettingsOpen: false,

  ingredients: StorageUtil.get('roomia_ingredients', []),
  expenses: StorageUtil.get('roomia_expenses', []),
  tasks: StorageUtil.get('roomia_tasks', normalizedInitialTasks),
  documents: StorageUtil.get('roomia_docs', []),

  setCurrentCity: (city) => {
    StorageUtil.setString('roomia_city', city);
    set({ currentCity: city });
  },

  setCurrencyOverride: (currencyCode) => {
    StorageUtil.setString('roomia_currency_override', currencyCode);
    set({ currencyOverride: currencyCode });
  },

  setMode: (mode) => {
    StorageUtil.setString('roomia_mode', mode);
    set({ mode });
  },

  setLanguage: (lang) => {
    StorageUtil.setString('roomia_lang', lang);
    set({ language: lang });
  },

  setTavilyApiKey: (key) => {
    StorageUtil.setString('roomia_tavily_key', key);
    set({ tavilyApiKey: key });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setIsSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),

  addIngredient: (item) => {
    const current = get().ingredients;
    if (!current.includes(item)) {
      const updated = [...current, item];
      StorageUtil.set('roomia_ingredients', updated);
      set({ ingredients: updated });
    }
  },

  removeIngredient: (index) => {
    const updated = get().ingredients.filter((_, i) => i !== index);
    StorageUtil.set('roomia_ingredients', updated);
    set({ ingredients: updated });
  },

  addExpense: (expense) => {
    const updated = [...get().expenses, expense];
    StorageUtil.set('roomia_expenses', updated);
    set({ expenses: updated });
  },

  removeExpense: (index) => {
    const updated = get().expenses.filter((_, i) => i !== index);
    StorageUtil.set('roomia_expenses', updated);
    set({ expenses: updated });
  },

  addTask: (task) => {
    const updated = [...get().tasks, task];
    StorageUtil.set('roomia_tasks', updated);
    set({ tasks: updated });
  },

  removeTask: (taskId) => {
    const updated = get().tasks.filter(t => t.id !== taskId);
    StorageUtil.set('roomia_tasks', updated);
    set({ tasks: updated });
  },

  updateTaskStatus: (taskId, newStatus) => {
    const updated = get().tasks.map(t => t.id === taskId ? {
      ...t,
      status: newStatus,
      completed: newStatus === 'done'
    } : t);
    StorageUtil.set('roomia_tasks', updated);
    set({ tasks: updated });
  },

  updateTaskAssignee: (taskId, newAssignee) => {
    const updated = get().tasks.map(t => t.id === taskId ? {
      ...t,
      assignee: newAssignee
    } : t);
    StorageUtil.set('roomia_tasks', updated);
    set({ tasks: updated });
  },

  randomizeTasks: () => {
    const mode = get().mode;
    const people = mode === 'couple' ? ['Alex', 'Sam'] : ['Asignado a ti'];
    const updated = get().tasks.map(t => ({
      ...t,
      assignee: people[Math.floor(Math.random() * people.length)]
    }));
    StorageUtil.set('roomia_tasks', updated);
    set({ tasks: updated });
  },

  addDocument: (doc) => {
    const updated = [...get().documents, doc];
    StorageUtil.set('roomia_docs', updated);
    set({ documents: updated });
  },

  removeDocument: (index) => {
    const updated = get().documents.filter((_, i) => i !== index);
    StorageUtil.set('roomia_docs', updated);
    set({ documents: updated });
  },

  clearUserDataForNewAccount: () => {
    StorageUtil.set('roomia_ingredients', []);
    StorageUtil.set('roomia_expenses', []);
    StorageUtil.set('roomia_tasks', []);
    StorageUtil.set('roomia_docs', []);
    set({
      ingredients: [],
      expenses: [],
      tasks: [],
      documents: []
    });
  },

  clearAllAppData: () => {
    StorageUtil.clear();
    set({
      currentCity: 'Ciudad de México',
      currencyOverride: '',
      mode: 'couple',
      language: 'es',
      tavilyApiKey: '',
      ingredients: [],
      expenses: [],
      tasks: [],
      documents: []
    });
  }
}));
