import { create } from 'zustand';
import { StorageUtil } from '../utils/storage.util';
import { INITIAL_INGREDIENTS, INITIAL_EXPENSES, INITIAL_TASKS, INITIAL_DOCS } from '../config/constants';

export const useRoomiaStore = create((set, get) => ({
  currentCity: StorageUtil.getString('roomia_city', 'Ciudad de México'),
  mode: StorageUtil.getString('roomia_mode', 'couple'),
  language: StorageUtil.getString('roomia_lang', 'es'),
  tavilyApiKey: StorageUtil.getString('roomia_tavily_key', ''),
  activeTab: 'city-events',
  isSettingsOpen: false,

  ingredients: StorageUtil.get('roomia_ingredients', INITIAL_INGREDIENTS),
  expenses: StorageUtil.get('roomia_expenses', INITIAL_EXPENSES),
  tasks: StorageUtil.get('roomia_tasks', INITIAL_TASKS),
  documents: StorageUtil.get('roomia_docs', INITIAL_DOCS),

  setCurrentCity: (city) => {
    StorageUtil.setString('roomia_city', city);
    set({ currentCity: city });
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

  randomizeTasks: () => {
    const mode = get().mode;
    const people = mode === 'couple' ? ['Roomie 1 (Alex)', 'Roomie 2 (Sam)'] : ['Asignado a ti'];
    const updated = get().tasks.map(t => ({
      ...t,
      assigned: people[Math.floor(Math.random() * people.length)]
    }));
    StorageUtil.set('roomia_tasks', updated);
    set({ tasks: updated });
  },

  addDocument: (doc) => {
    const updated = [...get().documents, doc];
    StorageUtil.set('roomia_docs', updated);
    set({ documents: updated });
  }
}));
