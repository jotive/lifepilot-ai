import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api.service';
import { useRoomiaStore } from '../store/useRoomiaStore';
import { useAuthStore } from '../store/useAuthStore';
import { translations } from '../config/i18n';
import { getCityCurrency, formatMoney } from '../config/constants';

export function CityExplorer({ currentCity, mode }) {
  const { language, tavilyApiKey, expenses, currencyOverride } = useRoomiaStore();
  const { user } = useAuthStore();
  const t = translations[language] || translations.es;
  const defaultCurrency = getCityCurrency(currentCity);
  const activeCurrencyCode = currencyOverride || defaultCurrency.code;
  const currencySymbol = defaultCurrency.symbol;

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [events, setEvents] = useState([
    { title: 'Festival de Arte & Luces 2026', category: 'Cultural', description: `Exposición interactiva de arte digital y videomapping nocturno en ${currentCity}.`, location: currentCity, date: 'Este Fin de Semana' },
    { title: 'Ruta Gastronómica & Craft Beer', category: 'Gastronomía', description: `Recorrido guiado por los mejores mercados gastronómicos y restaurantes de ${currentCity}.`, location: currentCity, date: 'Viernes 20:00 hrs' },
    { title: 'Meetup de Expat & Tech Founders', category: 'Networking', description: `Encuentro informal de emprendedores, nómadas digitales y desarrolladores en ${currentCity}.`, location: currentCity, date: 'Jueves 19:00 hrs' }
  ]);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);

  // Automatically fetch personalized live web events from Tavily when city or user profile changes
  useEffect(() => {
    let isMounted = true;
    const fetchLiveEvents = async () => {
      setLoading(true);
      try {
        const userName = user.name && user.name !== 'Invitado' ? user.name : 'Expat';
        const searchQuery = `Eventos destacados cultura y gastronomia recomendados para ${userName} en ${currentCity}`;
        const searchResults = await ApiService.searchEvents(searchQuery, currentCity, tavilyApiKey);
        if (isMounted && searchResults && Array.isArray(searchResults.results) && searchResults.results.length > 0) {
          const formatted = searchResults.results.map(r => ({
            title: r.title,
            category: r.category || 'Evento En Vivo',
            description: r.snippet || r.content || r.title,
            location: currentCity,
            date: 'Esta Semana',
            url: r.url
          }));
          setEvents(formatted);
        }
      } catch (err) {
        console.warn('Tavily search fallback to local initial events:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLiveEvents();
    return () => { isMounted = false; };
  }, [currentCity, tavilyApiKey, user.name]);

  const totalExpenseSum = (expenses || []).reduce((sum, item) => sum + (item.amount || 0), 0);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const userName = user.name && user.name !== 'Invitado' ? user.name : 'Expat';
    const searchQuery = query.trim() || `Eventos y cultura recomendados para ${userName} en ${currentCity}`;
    setLoading(true);

    try {
      const searchResults = await ApiService.searchEvents(searchQuery, currentCity, tavilyApiKey);
      if (searchResults && Array.isArray(searchResults.results) && searchResults.results.length > 0) {
        const formatted = searchResults.results.map(r => ({
          title: r.title,
          category: r.category || 'Evento En Vivo',
          description: r.snippet || r.content || r.title,
          location: currentCity,
          date: 'Esta Semana',
          url: r.url
        }));
        setEvents(formatted);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Conexión Tavily fallback local:', err);
    }

    const filtered = events.filter(evt => evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || evt.description.toLowerCase().includes(searchQuery.toLowerCase()));
    setEvents(filtered.length > 0 ? filtered : events);
    setLoading(false);
  };

  const handleGenerateItinerary = async () => {
    setLoading(true);
    const userName = user.name && user.name !== 'Invitado' ? user.name : 'Alex';
    try {
      const res = await ApiService.generateItinerary(events, currentCity, mode, language);
      setItinerary({
        ...res,
        title: `Ruta Recomendada RoomIA para ${userName} en ${currentCity}`
      });
    } catch (err) {
      console.warn('Usando respuesta inteligente local para itinerario:', err);
      setItinerary({
        title: `Ruta Recomendada RoomIA para ${userName} en ${currentCity}`,
        steps: [
          { time: '10:00 AM', activity: 'Desayuno en Café de Especialidad Local', location: `Centro Histórico, ${currentCity}` },
          { time: '01:30 PM', activity: 'Recorrido por Galería de Arte & Museo', location: `Distrito Cultural, ${currentCity}` },
          { time: '07:00 PM', activity: 'Cena & Coctelería de Autor', location: `Zona Gastronómica, ${currentCity}` }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEventsByCategory = activeCategory === 'all' 
    ? events 
    : events.filter(e => (e.category || '').toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <section className="tab-panel active">
      {/* 3D Hero Widget Banner with lazy loading */}
      <div className="hero-3d-banner">
        <div className="hero-3d-text">
          <h3>Explora {currentCity} en Tiempo Real 🚀</h3>
          <p>Eventos culturales, gastronomía e itinerarios inteligentes seleccionados por IA para tu estancia en <span className="city-highlight">{currentCity}</span>.</p>
        </div>
        <img 
          src="/assets/roomia_city_3d.jpg" 
          alt="City Explorer 3D Illustration" 
          className="hero-3d-img" 
          loading="lazy"
        />
      </div>

      <div className="panel-hero">
        <div className="hero-text">
          <h2><i className="fa-solid fa-compass"></i> Radar Urbano de Eventos</h2>
          <p>Descubre experiencias seleccionadas y panoramas imperdibles para {user.name || 'ti'} en {currentCity}.</p>
        </div>
        <div className="tavily-status-badge">
          <i className="fa-solid fa-satellite-dish"></i> Live Radar Activo
        </div>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-bar-wrap">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input 
            type="text" 
            placeholder={`${t.searchPlaceholder} ${currentCity}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <i className="fa-solid fa-radar"></i> {t.searchBtn}
          </button>
        </form>

        <div className="filter-chips">
          <span className="chip-label">{t.categoriesLabel}:</span>
          {[
            { id: 'all', name: t.catAll, icon: 'fa-border-all' },
            { id: 'cultural', name: t.catCultural, icon: 'fa-masks-theater' },
            { id: 'gastro', name: t.catGastro, icon: 'fa-utensils' },
            { id: 'networking', name: t.catNetworking, icon: 'fa-users' },
            { id: 'nightlife', name: t.catNightlife, icon: 'fa-martini-glass-citrus' },
          ].map(cat => (
            <button 
              key={cat.id}
              className={`chip ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <i className={`fa-solid ${cat.icon}`}></i> {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="results-layout">
        <div className="events-column">
          <div className="section-title-wrap">
            <h3>Eventos Destacados en {currentCity}</h3>
            <span className="results-count">{filteredEventsByCategory.length} resultados</span>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <i className="fa-solid fa-spinner fa-spin text-3xl text-coral" style={{ marginBottom: '1rem', display: 'block' }}></i>
              <span>Consultando Radar Urbano personalizado para {user.name || 'ti'} en {currentCity}...</span>
            </div>
          ) : filteredEventsByCategory.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', background: '#f8fafc', borderRadius: '20px', border: '2px dashed #cbd5e1' }}>
              <i className="fa-solid fa-calendar-xmark text-3xl text-coral" style={{ marginBottom: '0.75rem', display: 'block' }}></i>
              <h4 style={{ fontWeight: 800, margin: 0 }}>No se encontraron eventos para esta búsqueda</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>Prueba buscando otras palabras clave como "conciertos", "museos" o "comida".</p>
            </div>
          ) : (
            <div className="events-grid">
              {filteredEventsByCategory.map((evt, idx) => (
                <div key={idx} className="event-card">
                  <div>
                    <span className="event-badge">{evt.category || 'Evento'}</span>
                    <h4 className="event-title">{evt.title}</h4>
                    <p className="event-snippet">{evt.snippet || evt.description}</p>
                  </div>
                  <div className="event-footer">
                    <span><i className="fa-solid fa-location-dot"></i> {evt.location || currentCity}</span>
                    <span><i className="fa-solid fa-calendar"></i> {evt.date || 'Hoy'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="planner-sidebar">
          {/* REAL SHARED EXPENSES SUMMARY WIDGET */}
          <div className="credit-card-widget" style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }}>
            <div className="card-brand-row">
              <span>Resumen de Gastos del Hogar</span>
              <i className="fa-solid fa-wallet text-xl"></i>
            </div>
            <div className="card-number" style={{ fontSize: '0.85rem', letterSpacing: '1px', opacity: 0.9 }}>
              Moneda Oficial: <strong>{activeCurrencyCode}</strong>
            </div>
            <div className="card-balance-label">Total Acumulado en Compras</div>
            <div className="card-balance-val">{currencySymbol}{formatMoney(totalExpenseSum, activeCurrencyCode)} {activeCurrencyCode}</div>
          </div>

          <div className="sidebar-card">
            <div className="card-header" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.4rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                  <i className="fa-solid fa-wand-magic-sparkles text-coral"></i> Planificador IA
                </h3>
              </div>
              <span className="badge-mode-indicator">
                {mode === 'couple' ? 'En Pareja' : 'Solo Expat'}
              </span>
            </div>
            <p className="sidebar-desc" style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>
              Crea un itinerario personalizado para <strong>{user.name || 'ti'}</strong> en {currentCity}.
            </p>

            <button 
              className="btn btn-gradient full-width" 
              onClick={handleGenerateItinerary}
              disabled={loading}
              style={{ marginTop: '0.75rem' }}
            >
              <i className="fa-solid fa-bolt"></i> Planificar con IA
            </button>

            {itinerary && (
              <div className="itinerary-output">
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                  {itinerary.title || 'Plan del Día'}
                </h4>
                {itinerary.steps && itinerary.steps.map((step, sIdx) => (
                  <div key={sIdx} className="itinerary-step">
                    <span className="itinerary-time">{step.time}</span>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{step.activity}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{step.location}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
