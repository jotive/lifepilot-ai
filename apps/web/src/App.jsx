import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CityExplorer } from './components/CityExplorer';
import { RelocationOps } from './components/RelocationOps';
import { KitchenOps } from './components/KitchenOps';
import { HouseholdOps } from './components/HouseholdOps';
import { DocVault } from './components/DocVault';
import { SettingsModal } from './components/SettingsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { NotFoundPage } from './components/NotFoundPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/ToastContainer';
import { AIAssistantWidget } from './components/AIAssistantWidget';
import { useRoomiaStore } from './store/useRoomiaStore';
import { useAuthStore } from './store/useAuthStore';
import { useToastStore } from './store/useToastStore';

const VALID_HASHES = ['#/', '#/landing', '#/login', '#/logout', '#/explorer', '#/relocation', '#/kitchen', '#/finances', '#/vault'];

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

  const { setIsAuthModalOpen, logout } = useAuthStore();
  const { addToast } = useToastStore();
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#/explorer');

  // Handle URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/explorer';
      setCurrentRoute(hash);

      if (hash === '#/login') {
        setIsAuthModalOpen(true);
      } else if (hash === '#/logout') {
        logout();
        addToast('Sesión cerrada correctamente', 'info');
        window.location.hash = '#/';
      } else if (hash === '#/explorer') {
        setActiveTab('city-events');
      } else if (hash === '#/relocation') {
        setActiveTab('relocation');
      } else if (hash === '#/kitchen') {
        setActiveTab('fridge-kitchen');
      } else if (hash === '#/finances') {
        setActiveTab('couple-expenses');
      } else if (hash === '#/vault') {
        setActiveTab('documents');
      }
    };

    if (!window.location.hash) {
      window.location.hash = '#/explorer';
    } else {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabSelect = (tabKey) => {
    setActiveTab(tabKey);
    const hashMap = {
      'city-events': '#/explorer',
      'relocation': '#/relocation',
      'fridge-kitchen': '#/kitchen',
      'couple-expenses': '#/finances',
      'documents': '#/vault'
    };
    if (hashMap[tabKey]) {
      window.location.hash = hashMap[tabKey];
    }
  };

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

  const isLanding = currentRoute === '#/' || currentRoute === '#/landing';
  const is404 = !VALID_HASHES.includes(currentRoute);

  return (
    <ErrorBoundary>
      <div className="app-container">
        {/* Onboarding 3-step Modal for judges & first-time users */}
        <OnboardingModal />

        {/* User Account Login / Profile Modal */}
        <AuthModal />

        {/* Left Vertical Navigation Sidebar */}
        <aside className="app-sidebar">
          <div 
            className="sidebar-logo" 
            title="RoomIA Landing Page" 
            onClick={() => { window.location.hash = '#/'; }} 
            style={{ cursor: 'pointer' }}
          >
            <i className="fa-solid fa-house-user"></i>
          </div>

          <div className="sidebar-nav-list">
            <button 
              className={`sidebar-nav-item ${activeTab === 'city-events' && !isLanding && !is404 ? 'active' : ''}`}
              onClick={() => handleTabSelect('city-events')}
              title="Explorar Ciudad (/#/explorer)"
              aria-label="Explorar Ciudad"
            >
              <i className="fa-solid fa-compass"></i>
            </button>
            <button 
              className={`sidebar-nav-item ${activeTab === 'relocation' && !isLanding && !is404 ? 'active' : ''}`}
              onClick={() => handleTabSelect('relocation')}
              title="Guía de Mudanza (/#/relocation)"
              aria-label="Guía de Mudanza"
            >
              <i className="fa-solid fa-city"></i>
            </button>
            <button 
              className={`sidebar-nav-item ${activeTab === 'fridge-kitchen' && !isLanding && !is404 ? 'active' : ''}`}
              onClick={() => handleTabSelect('fridge-kitchen')}
              title="Mi Refrigerador (/#/kitchen)"
              aria-label="Mi Refrigerador"
            >
              <i className="fa-solid fa-utensils"></i>
            </button>
            <button 
              className={`sidebar-nav-item ${activeTab === 'couple-expenses' && !isLanding && !is404 ? 'active' : ''}`}
              onClick={() => handleTabSelect('couple-expenses')}
              title="Finanzas Compartidas (/#/finances)"
              aria-label="Finanzas Compartidas"
            >
              <i className="fa-solid fa-wallet"></i>
            </button>
            <button 
              className={`sidebar-nav-item ${activeTab === 'documents' && !isLanding && !is404 ? 'active' : ''}`}
              onClick={() => handleTabSelect('documents')}
              title="Bóveda de Documentos (/#/vault)"
              aria-label="Bóveda de Documentos"
            >
              <i className="fa-solid fa-folder-closed"></i>
            </button>
          </div>

          <button className="sidebar-nav-item" onClick={() => setIsSettingsOpen(true)} title="Ajustes" aria-label="Ajustes">
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
            {isLanding ? (
              <LandingPage onStartDemo={() => { window.location.hash = '#/explorer'; }} />
            ) : is404 ? (
              <NotFoundPage />
            ) : (
              <>
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
                    chores={tasks}
                    onAddExpense={handleAddExpense}
                    onToggleChore={handleRandomizeTasks}
                  />
                )}
                {activeTab === 'documents' && (
                  <DocVault
                    documents={documents}
                    currentCity={currentCity}
                    onAddDoc={handleAddDoc}
                  />
                )}
              </>
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
              <p><strong>RoomIA</strong> — Proyecto para el <strong>Hackatón de IA (Código Facilito & AWS)</strong>. Creado por <strong>jotive</strong>.</p>
            </div>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
}
