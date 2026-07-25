import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CityExplorer } from './components/CityExplorer';
import { RelocationOps } from './components/RelocationOps';
import { KitchenOps } from './components/KitchenOps';
import { HouseholdOps } from './components/HouseholdOps';
import { DocVault } from './components/DocVault';
import { SettingsModal } from './components/SettingsModal';
import { StorageUtil } from './utils/storage.util';
import { INITIAL_INGREDIENTS, INITIAL_EXPENSES, INITIAL_TASKS, INITIAL_DOCS } from './config/constants';

export function App() {
  const [currentCity, setCurrentCity] = useState(StorageUtil.getString('roomia_city', 'Ciudad de México'));
  const [mode, setMode] = useState(StorageUtil.getString('roomia_mode', 'couple'));
  const [apiKey, setApiKey] = useState(StorageUtil.getString('roomia_tavily_key', ''));
  const [activeTab, setActiveTab] = useState('city-events');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [ingredients, setIngredients] = useState(() => StorageUtil.get('roomia_ingredients', INITIAL_INGREDIENTS));
  const [expenses, setExpenses] = useState(() => StorageUtil.get('roomia_expenses', INITIAL_EXPENSES));
  const [tasks, setTasks] = useState(() => StorageUtil.get('roomia_tasks', INITIAL_TASKS));
  const [documents, setDocuments] = useState(() => StorageUtil.get('roomia_docs', INITIAL_DOCS));

  useEffect(() => {
    StorageUtil.setString('roomia_city', currentCity);
  }, [currentCity]);

  useEffect(() => {
    StorageUtil.setString('roomia_mode', mode);
  }, [mode]);

  useEffect(() => {
    StorageUtil.setString('roomia_tavily_key', apiKey);
  }, [apiKey]);

  useEffect(() => {
    StorageUtil.set('roomia_ingredients', ingredients);
  }, [ingredients]);

  useEffect(() => {
    StorageUtil.set('roomia_expenses', expenses);
  }, [expenses]);

  useEffect(() => {
    StorageUtil.set('roomia_tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    StorageUtil.set('roomia_docs', documents);
  }, [documents]);

  const handleAddIngredient = (item) => {
    if (!ingredients.includes(item)) {
      setIngredients([...ingredients, item]);
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddExpense = (newExpense) => {
    setExpenses([...expenses, newExpense]);
  };

  const handleRandomizeTasks = () => {
    const people = mode === 'couple' ? ['Roomie 1 (Alex)', 'Roomie 2 (Sam)'] : ['Asignado a ti'];
    setTasks(tasks.map(t => ({
      ...t,
      assigned: people[Math.floor(Math.random() * people.length)]
    })));
  };

  const handleAddDoc = (newDoc) => {
    setDocuments([...documents, newDoc]);
  };

  const handleSaveSettings = (newCity, newKey) => {
    setCurrentCity(newCity || 'Ciudad de México');
    setApiKey(newKey || '');
  };

  return (
    <div className="app-container">
      <Header
        currentCity={currentCity}
        mode={mode}
        onCityClick={() => setIsSettingsOpen(true)}
        onModeChange={setMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mode={mode}
      />

      <main className="main-content">
        {activeTab === 'city-events' && (
          <CityExplorer currentCity={currentCity} mode={mode} apiKey={apiKey} />
        )}
        {activeTab === 'relocation' && (
          <RelocationOps currentCity={currentCity} />
        )}
        {activeTab === 'fridge-kitchen' && (
          <KitchenOps
            ingredients={ingredients}
            onAddIngredient={handleAddIngredient}
            onRemoveIngredient={handleRemoveIngredient}
          />
        )}
        {activeTab === 'couple-expenses' && (
          <HouseholdOps
            mode={mode}
            expenses={expenses}
            tasks={tasks}
            onAddExpense={handleAddExpense}
            onRandomizeTasks={handleRandomizeTasks}
          />
        )}
        {activeTab === 'documents' && (
          <DocVault
            documents={documents}
            currentCity={currentCity}
            onAddDoc={handleAddDoc}
          />
        )}
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        currentCity={currentCity}
        apiKey={apiKey}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />

      <footer className="main-footer">
        <div className="footer-content">
          <p><strong>RoomIA</strong> — Proyecto para el <strong>Hackatón de IA con Qiro (Código Facilito & AWS)</strong>. Creado por <strong>jotive</strong>.</p>
        </div>
      </footer>
    </div>
  );
}
