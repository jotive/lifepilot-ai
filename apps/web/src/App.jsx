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
import { AIAssistantWidget } from './components/AIAssistantWidget';
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
      {/* Left Vertical Navigation Sidebar (Claymorphic Style) */}
      <aside className="app-sidebar">
        <div className="sidebar-logo" title="RoomIA Copilot">
          <i className="fa-solid fa-house-user"></i>
        </div>

        <div className="sidebar-nav-list">
          <button 
            className={`sidebar-nav-item ${activeTab === 'city-events' ? 'active' : ''}`}
            onClick={() => setActiveTab('city-events')}
            title="Explorar Ciudad"
          >
            <i className="fa-solid fa-compass"></i>
          </button>
          <button 
            className={`sidebar-nav-item ${activeTab === 'relocation' ? 'active' : ''}`}
            onClick={() => setActiveTab('relocation')}
            title="Guía de Mudanza"
          >
            <i className="fa-solid fa-city"></i>
          </button>
          <button 
            className={`sidebar-nav-item ${activeTab === 'fridge-kitchen' ? 'active' : ''}`}
            onClick={() => setActiveTab('fridge-kitchen')}
            title="Mi Refrigerador"
          >
            <i className="fa-solid fa-utensils"></i>
          </button>
          <button 
            className={`sidebar-nav-item ${activeTab === 'couple-expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('couple-expenses')}
            title="Finanzas Compartidas"
          >
            <i className="fa-solid fa-wallet"></i>
          </button>
          <button 
            className={`sidebar-nav-item ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
            title="Bóveda de Documentos"
          >
            <i className="fa-solid fa-folder-closed"></i>
          </button>
        </div>

        <button className="sidebar-nav-item" onClick={() => setIsSettingsOpen(true)} title="Ajustes">
          <i className="fa-solid fa-gear"></i>
        </button>
      </aside>

      {/* Main Canvas Area */}
      <div className="app-canvas">
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

        <AIAssistantWidget />
        <ToastContainer />

        <footer className="main-footer">
          <div className="footer-content">
            <p><strong>RoomIA</strong> — Proyecto para el <strong>Hackatón de IA con Qiro (Código Facilito & AWS)</strong>. Creado por <strong>jotive</strong>.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
