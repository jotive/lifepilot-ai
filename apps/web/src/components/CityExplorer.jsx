import React, { useState, useEffect } from 'react';
import { TavilyService } from '../services/tavily.service';
import { SkeletonLoader } from './SkeletonLoader';
import { useRoomiaStore } from '../store/useRoomiaStore';
import { translations } from '../config/i18n';

export function CityExplorer({ currentCity, mode, apiKey }) {
  const { language } = useRoomiaStore();
  const t = translations[language] || translations.es;

  const [searchInput, setSearchInput] = useState('Eventos y conciertos destacados este fin de semana');
  const [activeChip, setActiveChip] = useState('Eventos y festivales culturales');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState({
    title: mode === 'couple' ? 'Itinerario de Roomies / Pareja' : 'Ruta Solo Expat',
    steps: [
      { time: 'Sábado - 10:30 AM', desc: `Visita al Mercado de Productos Locales para hacer compras frescas de alacena y desayuno al aire libre.` },
      { time: 'Sábado - 04:00 PM', desc: `Recorrido por la Ruta de Museos y café de especialidad en el centro de ${currentCity}.` },
      { time: 'Sábado - 08:30 PM', desc: mode === 'couple' ? 'Noche de Jazz en vivo y cena en pareja en terraza con ambiente acogedor.' : 'Cine de verano al aire libre o Meetup cultural local.' },
      { time: 'Domingo - 11:00 AM', desc: `Preparación de comida en casa con recetas anti-desperdicio sugeridas por RoomIA.` }
    ]
  });

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

  const handleGenerateItinerary = () => {
    const isCouple = mode === 'couple';
    setItinerary({
      title: isCouple ? 'Itinerario de Roomies / Pareja' : 'Ruta Solo Expat',
      steps: [
        { time: 'Sábado - 10:30 AM', desc: `Visita al Mercado de Productos Locales para hacer compras frescas y desayuno al aire libre.` },
        { time: 'Sábado - 04:00 PM', desc: `Recorrido por la Ruta de Museos y café de especialidad en el centro de ${currentCity}.` },
        { time: 'Sábado - 08:30 PM', desc: isCouple ? 'Noche de Jazz en vivo y cena en pareja en terraza con ambiente acogedor.' : 'Cine de verano al aire libre o Meetup cultural local.' },
        { time: 'Domingo - 11:00 AM', desc: `Preparación de comida en casa con recetas anti-desperdicio sugeridas por RoomIA y paseo por el parque principal.` }
      ]
    });
  };

  return (
    <section className="tab-panel active">
      <div className="panel-hero">
        <div className="hero-text">
          <h2><i className="fa-solid fa-compass"></i> {t.cityHeroTitle}</h2>
          <p>{t.cityHeroSub} <span className="city-highlight">{currentCity}</span>.</p>
        </div>
        <div className="tavily-status-badge">
          <i className="fa-solid fa-circle-check"></i> {t.radarStatus}
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
            placeholder={t.searchPlaceholder} 
          />
          <button className="btn btn-primary" onClick={() => handleSearch()}>
            <i className="fa-solid fa-wand-magic-sparkles"></i> {t.searchBtn}
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
            <h3><i className="fa-solid fa-fire"></i> {t.featuredEvents}</h3>
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
          <div className="sidebar-card">
            <div className="card-header">
              <h3><i className="fa-solid fa-calendar-heart text-indigo-400"></i> {t.plannerTitle}</h3>
              <span className="badge-mode-indicator">{mode === 'couple' ? 'Modo Roomies / Pareja' : 'Modo Solo Expat'}</span>
            </div>
            <p className="sidebar-desc">RoomIA organiza una ruta personalizada para explorar tu nueva ciudad.</p>
            
            <button className="btn btn-gradient full-width" onClick={handleGenerateItinerary}>
              <i className="fa-solid fa-sparkles"></i> {t.generateRutaBtn}
            </button>

            <div className="itinerary-output">
              <div>
                <div style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.6rem', fontSize: '0.88rem' }}>
                  <i className="fa-solid fa-route"></i> {itinerary.title} ({currentCity})
                </div>
                {itinerary.steps.map((step, i) => (
                  <div key={i} className="itinerary-step">
                    <div className="itinerary-time">{step.time}</div>
                    <p style={{ fontSize: '0.83rem', color: 'var(--text-main)' }}>{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
