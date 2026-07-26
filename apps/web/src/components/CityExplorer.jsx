import React, { useState, useEffect } from 'react';
import { TavilyService } from '../services/tavily.service';
import { ApiService } from '../services/api.service';
import { useRoomiaStore } from '../store/useRoomiaStore';
import { SkeletonLoader } from './SkeletonLoader';

export function CityExplorer({ currentCity, mode, apiKey }) {
  const [searchInput, setSearchInput] = useState('Eventos y conciertos destacados este fin de semana');
  const [activeChip, setActiveChip] = useState('Eventos y festivales culturales');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [itineraryLoading, setItineraryLoading] = useState(false);
  const { language } = useRoomiaStore();

  const filterChips = [
    { label: '🎭 Cultura & Festivales', query: 'Eventos y festivales culturales' },
    { label: '🎵 Conciertos & Música', query: 'Conciertos y música en vivo' },
    { label: '🍲 Gastronomía & Mercados', query: 'Ferias gastronómicas y comida' },
    { label: '💻 Tech & Meetups', query: 'Meetups de tecnología e inteligencia artificial' },
    { label: '🌳 Aire Libre (Gratis)', query: 'Actividades gratuitas al aire libre parques' },
    { label: '❤️ Planes Roomies / Pareja', query: 'Planes románticos citas fin de semana' }
  ];

  const handleSearch = async (queryToUse = searchInput) => {
    setLoading(true);
    const results = await TavilyService.searchEvents(queryToUse, currentCity, apiKey);
    setEvents(results);
    setLoading(false);
  };

  useEffect(() => {
    handleSearch();
  }, [currentCity]);

  const handleChipClick = (chip) => {
    setActiveChip(chip.query);
    const fullQuery = `${chip.query} en ${currentCity}`;
    setSearchInput(fullQuery);
    handleSearch(fullQuery);
  };

  const handleGenerateItinerary = async () => {
    if (events.length === 0) return;
    setItineraryLoading(true);

    try {
      const result = await ApiService.generateItinerary(events, currentCity, mode, language);
      setItinerary(result.itinerary);
    } catch (error) {
      console.warn('Itinerary generation fallback:', error);
      setItinerary(generateLocalFallback(events, currentCity, mode));
    }

    setItineraryLoading(false);
  };

  return (
    <section className="tab-panel active">
      <div className="panel-hero">
        <div className="hero-text">
          <h2><i className="fa-solid fa-compass"></i> Explorar Ciudad & Radar de Eventos</h2>
          <p>Descubre qué hacer en tiempo real, conciertos y actividades culturales en <span className="city-highlight">{currentCity}</span>.</p>
        </div>
        <div className="tavily-status-badge">
          <i className="fa-solid fa-circle-check"></i> Radar de Ciudad Activo
        </div>
      </div>

      <div className="search-section">
        <div className="search-bar-wrap">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Ej: Conciertos este fin de semana, festivales..."
          />
          <button className="btn btn-primary" onClick={() => handleSearch()}>
            <i className="fa-solid fa-wand-magic-sparkles"></i> Buscar Eventos
          </button>
        </div>

        <div className="filter-chips">
          <span className="chip-label">Categorías rápidas:</span>
          {filterChips.map(chip => (
            <button
              key={chip.label}
              className={`chip ${activeChip === chip.query ? 'active' : ''}`}
              onClick={() => handleChipClick(chip)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      <div className="results-layout">
        <div className="events-main">
          <div className="section-title-wrap">
            <h3><i className="fa-solid fa-fire"></i> Eventos Destacados en la Ciudad</h3>
            <span className="results-count">{loading ? 'Explorando...' : `${events.length} Eventos encontrados en ${currentCity}`}</span>
          </div>

          {loading ? (
            <SkeletonLoader count={4} />
          ) : (
            <div className="events-grid">
              {events.map((evt, idx) => (
                <div key={idx} className="event-card">
                  <div>
                    <span className="event-badge">{evt.category}</span>
                    <h4 className="event-title">{evt.title}</h4>
                    <p className="event-snippet">{evt.snippet}</p>
                  </div>
                  <div className="event-footer">
                    <span><i className="fa-solid fa-clock"></i> {evt.date}</span>
                    <span><i className="fa-solid fa-location-dot"></i> {evt.location}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="planner-sidebar">
          <div className="sidebar-card gradient-border">
            <div className="card-header">
              <h3><i className="fa-solid fa-calendar-heart"></i> Planificador de Fin de Semana</h3>
              <span className="badge-mode-indicator">{mode === 'couple' ? 'Modo Roomies / Pareja' : 'Modo Solo Expat'}</span>
            </div>
            <p className="sidebar-desc">RoomIA organiza una ruta personalizada del fin de semana usando los eventos encontrados en tu ciudad.</p>

            <button
              className="btn btn-gradient full-width"
              onClick={handleGenerateItinerary}
              disabled={itineraryLoading || events.length === 0}
            >
              {itineraryLoading
                ? <><i className="fa-solid fa-spinner fa-spin"></i> Generando con IA...</>
                : <><i className="fa-solid fa-sparkles"></i> Generar Ruta de Fin de Semana</>
              }
            </button>

            <div className="itinerary-output">
              {!itinerary ? (
                <div className="itinerary-empty-state">
                  <i className="fa-solid fa-map-location-dot"></i>
                  <p>Busca eventos y haz clic en generar para armar tu ruta de fin de semana con RoomIA.</p>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                    <i className="fa-solid fa-sparkles"></i> {itinerary.title}
                  </div>
                  {itinerary.steps.map((step, i) => (
                    <div key={i} className="itinerary-step">
                      <div className="itinerary-time">{step.time}</div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{step.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function generateLocalFallback(events, city, mode) {
  const isCouple = mode === 'couple';
  const eventTitles = events.slice(0, 3).map(e => e.title);

  return {
    title: isCouple ? `Ruta de Roomies para ${city}` : `Ruta Solo Expat en ${city}`,
    steps: [
      { time: 'Sábado - 10:00 AM', desc: `Desayuno en café de especialidad del centro de ${city}.` },
      { time: 'Sábado - 12:00 PM', desc: eventTitles[0] ? `Asistir a "${eventTitles[0]}".` : `Visita al mercado local.` },
      { time: 'Sábado - 05:00 PM', desc: eventTitles[1] ? `Explorar "${eventTitles[1]}".` : `Recorrido por el barrio cultural.` },
      { time: 'Sábado - 08:30 PM', desc: isCouple ? `Cena en pareja${eventTitles[2] ? ` seguida de "${eventTitles[2]}"` : ''}.` : `Cena y evento nocturno local.` },
      { time: 'Domingo - 11:00 AM', desc: `Brunch y caminata por el parque principal de ${city}.` },
      { time: 'Domingo - 04:00 PM', desc: `Meal prep semanal con recetas anti-desperdicio de RoomIA.` }
    ]
  };
}
