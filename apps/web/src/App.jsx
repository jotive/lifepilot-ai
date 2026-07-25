import React from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { CityExplorer } from './components/CityExplorer';
import { RelocationOps } from './components/RelocationOps';
import { KitchenOps } from './components/KitchenOps';
import { HouseholdOps } from './components/HouseholdOps';
import { DocVault } from './components/DocVault';
import { SettingsModal } from './components/SettingsModal';
import { ToastContainer } from './components/ToastContainer';
import { useRoomiaStore } from './store/useRoomiaStore';
import { useToastStore } from './store/useToastStore';

export function App() {
  const {
    currentCity,
    mode,
    tavilyApiKey,
    activeTab,
    isSettingsOpen,
    ingredients,
    expenses,
    tasks,
    documents,
    setCurrentCity,
    setMode,
    setTavilyApiKey,
    setActiveTab,
    setIsSettingsOpen,
    addIngredient,
    removeIngredient,
    addExpense,
    randomizeTasks,
    addDocument
  } = useRoomiaStore();

  const { addToast } = useToastStore();

  const handleAddIngredient = (item) => {
    addIngredient(item);
    addToast(`Ingrediente "${item}" agregado a la alacena`, 'success');
  };

  const handleAddExpense = (expense) => {
    addExpense(expense);
    addToast(`Gasto "${expense.desc}" registrado ($${expense.amount})`, 'success');
  };

  const handleRandomizeTasks = () => {
    randomizeTasks();
    addToast('Sorteo de tareas del hogar completado', 'info');
  };

  const handleAddDoc = (doc) => {
    addDocument(doc);
    addToast(`Documento "${doc.name}" guardado en la bóveda`, 'success');
  };

  const handleSaveSettings = (newCity, newKey) => {
    setCurrentCity(newCity || 'Ciudad de México');
    setTavilyApiKey(newKey || '');
    addToast('Configuración de ciudad y API guardada', 'success');
  };

  return (
    <div className="app-container">
      <Header
        currentCity={currentCity}
        mode={mode}
        onCityClick={() => setIsSettingsOpen(true)}
        onModeChange={(newMode) => {
          setMode(newMode);
          addToast(`Modo cambiado a: ${newMode === 'solo' ? 'Solo Expat' : 'Roomies / Pareja'}`, 'info');
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mode={mode}
      />

      <main className="main-content">
        {activeTab === 'city-events' && (
          <CityExplorer currentCity={currentCity} mode={mode} apiKey={tavilyApiKey} />
        )}
        {activeTab === 'relocation' && (
          <RelocationOps currentCity={currentCity} />
        )}
        {activeTab === 'fridge-kitchen' && (
          <KitchenOps
            ingredients={ingredients}
            onAddIngredient={handleAddIngredient}
            onRemoveIngredient={removeIngredient}
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
        apiKey={tavilyApiKey}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />

      <ToastContainer />

      <footer className="main-footer">
        <div className="footer-content">
          <p><strong>RoomIA</strong> — Proyecto para el <strong>Hackatón de IA con Qiro (Código Facilito & AWS)</strong>. Creado por <strong>jotive</strong>.</p>
        </div>
      </footer>
    </div>
  );
}
