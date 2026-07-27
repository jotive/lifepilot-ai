import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api.service';
import { useRoomiaStore } from '../store/useRoomiaStore';
import { useAuthStore } from '../store/useAuthStore';
import { translations } from '../config/i18n';
import { getCityCurrency, formatMoney } from '../config/constants';

const CITY_EVENT_CATALOG = {
  'Bogotá': [
    { title: 'Festival Estéreo Picnic 2026', category: 'Cultural', description: 'El festival musical y de experiencias gastronómicas más grande de Colombia en el Parque Simón Bolívar.', location: 'Parque Simón Bolívar, Bogotá', date: 'Este Fin de Semana' },
    { title: 'Ruta de Café Especial & Brunch en Chapinero', category: 'Gastronomía', description: 'Recorrido guiado de cata por las mejores cafeterías de origen de la Zona G y Chapinero Alto.', location: 'Zona G & Chapinero, Bogotá', date: 'Sábado 10:00 hrs' },
    { title: 'Bogotá Tech & AI Founders Meetup', category: 'Networking', description: 'Encuentro de startups, desarrolladores de Inteligencia Artificial y nómadas digitales en la capital.', location: 'WeWork Parque 93, Bogotá', date: 'Jueves 19:00 hrs' },
    { title: 'Noche de Museos en La Candelaria', category: 'Cultural', description: 'Recorrido nocturno por el Museo Botero, Museo del Oro y galerías independientes del centro histórico.', location: 'La Candelaria, Bogotá', date: 'Viernes 18:30 hrs' },
    { title: 'Cocktails & Vinyl Sessions en Zona T', category: 'Vida Nocturna', description: 'Sesión de música en vinilo, DJ sets en vivo y coctelería de autor en las terrazas de la Zona Rosa.', location: 'Zona T / Zona Rosa, Bogotá', date: 'Viernes 21:00 hrs' },
    { title: 'Feria de Diseño & Mercado Independiente', category: 'Cultural', description: 'Exposición de diseño local, moda sostenible, ilustración y gastronomía emergente en el Parque 93.', location: 'Parque de la 93, Bogotá', date: 'Domingo 11:00 hrs' }
  ],
  'Ciudad de México': [
    { title: 'Exposición Nocturna en Museo Soumaya', category: 'Cultural', description: 'Visita guiada con proyecciones digitales y música de cámara en las galerías de Polanco.', location: 'Polanco, Ciudad de México', date: 'Este Fin de Semana' },
    { title: 'Ruta Tacogourmet & Mezcal en la Roma', category: 'Gastronomía', description: 'Maridaje de tacos de culto y mezcales artesanales por la Roma Norte y Condesa.', location: 'Roma Norte, Ciudad de México', date: 'Viernes 20:00 hrs' },
    { title: 'CDMX Tech & Expat Mixer', category: 'Networking', description: 'Networking bilingüe para emprendedores tech, freelancers internacionales e inversionistas.', location: 'Colonia Juárez, Ciudad de México', date: 'Jueves 19:30 hrs' },
    { title: 'Picnic Nocturno & Jazz en Chapultepec', category: 'Cultural', description: 'Concierto de jazz en vivo al aire libre rodeado de naturaleza en el bosque.', location: 'Bosque de Chapultepec, CDMX', date: 'Sábado 19:00 hrs' },
    { title: 'Rooftop Party & Synthwave Sessions', category: 'Vida Nocturna', description: 'Vista panorámica de la ciudad con DJ sets de música electrónica y coctelería.', location: 'Terraza Roma, CDMX', date: 'Sábado 22:00 hrs' },
    { title: 'Bazar de Arte & Antigüedades en San Ángel', category: 'Cultural', description: 'Mercado tradicional al aire libre con pinturas, artesanías y objetos de colección.', location: 'San Ángel, CDMX', date: 'Sábado 11:00 hrs' }
  ],
  'Madrid': [
    { title: 'Noche Abierta en el Museo del Prado', category: 'Cultural', description: 'Visita nocturna a las galerías del Prado con recitales de música en los claustros.', location: 'Paseo del Prado, Madrid', date: 'Este Fin de Semana' },
    { title: 'Ruta de Tapas & Vinos por La Latina', category: 'Gastronomía', description: 'Degustación de tapas castizas, jamón ibérico de bellota y vinos de Rioja.', location: 'La Latina, Madrid', date: 'Viernes 20:00 hrs' },
    { title: 'Madrid AI & Dev Summit', category: 'Networking', description: 'Ponencias sobre arquitectura agéntica de IA y networking en el Campus de Startups.', location: 'Google Campus, Madrid', date: 'Jueves 18:30 hrs' },
    { title: 'Session de Flamenco & Coctelería en el Barrio de las Letras', category: 'Vida Nocturna', description: 'Tablao flamenco íntimo acompañado de tapas y cócteles de autor.', location: 'Barrio de las Letras, Madrid', date: 'Sábado 21:30 hrs' },
    { title: 'Mercado de Motores & Conciertos Indies', category: 'Cultural', description: 'Feria vintage con food trucks, diseño independiente y música en directo.', location: 'Museo del Ferrocarril, Madrid', date: 'Sábado 12:00 hrs' },
    { title: 'Musicales & Teatro en Gran Vía', category: 'Cultural', description: 'Espectáculos teatrales de clase mundial en los escenarios de Gran Vía.', location: 'Gran Vía, Madrid', date: 'Viernes 20:30 hrs' }
  ],
  'Buenos Aires': [
    { title: 'Milonga Tradicional & Orquesta en Vivo', category: 'Cultural', description: 'Noche de baile de tango abierto con orquesta en directo en un bodegón histórico.', location: 'San Telmo, Buenos Aires', date: 'Este Fin de Semana' },
    { title: 'Ruta de Asado & Cata de Malbec', category: 'Gastronomía', description: 'Experiencia gastronómica en las mejores parrillas y catas de cepas mendocinas.', location: 'Palermo Soho, Buenos Aires', date: 'Viernes 20:30 hrs' },
    { title: 'BA Startups & Expat Meetup', category: 'Networking', description: 'Encuentro de nómadas digitales, creadores de contenido e ingenieros de software.', location: 'Palermo Hollywood, Buenos Aires', date: 'Jueves 19:00 hrs' },
    { title: 'Noche de los Museos en Recoleta', category: 'Cultural', description: 'Exposiciones de arte moderno, instalaciones interactivas y proyecciones visuales.', location: 'Centro Cultural Recoleta, BA', date: 'Sábado 19:00 hrs' },
    { title: 'Fiesta Cumbia & DJ Sets en Niceto', category: 'Vida Nocturna', description: 'Música tropical en vivo, electrónica alternativa y gran ambiente festivo.', location: 'Niceto Club, Buenos Aires', date: 'Sábado 23:30 hrs' },
    { title: 'Feria de Artesanos de Plaza Francia', category: 'Cultural', description: 'Paseo al aire libre con puestos de platería, cuero y espectáculos callejeros.', location: 'Recoleta, Buenos Aires', date: 'Domingo 14:00 hrs' }
  ],
  'Santiago': [
    { title: 'Ruta del Vino & Gastronomía en Lastarria', category: 'Gastronomía', description: 'Degustación de cepas Carmenere y Sauvignon blanc con alta cocina de autor.', location: 'Barrio Lastarria, Santiago', date: 'Este Fin de Semana' },
    { title: 'Santiago AI & Innovation Forum', category: 'Networking', description: 'Conferencias sobre ecosistemas de Venture Capital e Inteligencia Artificial.', location: 'Providencia, Santiago', date: 'Jueves 18:30 hrs' },
    { title: 'Noche Astronomía & Telescopios en el Cerro', category: 'Cultural', description: 'Sesión guiada por astrónomos sobre las luces panorámicas de Santiago.', location: 'Cerro San Cristóbal, Santiago', date: 'Sábado 20:00 hrs' },
    { title: 'Pub Crawl & Música Indie en Bellavista', category: 'Vida Nocturna', description: 'Tocas de bandas locales independientes y pubs de cerveza artesanal.', location: 'Barrio Bellavista, Santiago', date: 'Viernes 22:00 hrs' },
    { title: 'Feria de Diseño & Antigüedades en Barrio Italia', category: 'Cultural', description: 'Bazar de diseño de autor, librerías independientes y café al paso.', location: 'Barrio Italia, Santiago', date: 'Sábado 11:30 hrs' },
    { title: 'Concierto Filarmónico en Teatro Municipal', category: 'Cultural', description: 'Presentación especial de la Orquesta Filarmónica de Santiago.', location: 'Centro Histórico, Santiago', date: 'Viernes 19:00 hrs' }
  ],
  'Lima': [
    { title: 'Ruta Cevichera & Cata de Pisco Sour', category: 'Gastronomía', description: 'Degustación de cebiches marinos, tiraditos y coctelería con pisco peruano.', location: 'Miraflores & Barranco, Lima', date: 'Este Fin de Semana' },
    { title: 'Noche de Arte & Galerías en Barranco', category: 'Cultural', description: 'Recorrido por el Puente de los Suspiros y galerías de arte contemporáneo.', location: 'Barranco, Lima', date: 'Viernes 19:00 hrs' },
    { title: 'Lima Tech & Founders Mixer', category: 'Networking', description: 'Reunión de emprendedores fintech, desarrollo de software e inversionistas.', location: 'San Isidro, Lima', date: 'Jueves 19:00 hrs' },
    { title: 'Peña Criolla en Vivo & Danza Traditional', category: 'Cultural', description: 'Espectáculo con guitarra, cajón peruano y valses criollos en vivo.', location: 'Centro Histórico, Lima', date: 'Sábado 21:00 hrs' },
    { title: 'Sunset Rooftop & Electro Sessions frente al Mar', category: 'Vida Nocturna', description: 'Atardecer frente al Océano Pacífico con DJ en vivo y bebidas de autor.', location: 'Malecón de Miraflores, Lima', date: 'Viernes 18:00 hrs' },
    { title: 'Feria de Artesanías Inca Market', category: 'Cultural', description: 'Exposición de textiles andinos, cerámica fina y joyería en plata.', location: 'Miraflores, Lima', date: 'Domingo 11:00 hrs' }
  ],
  'Medellín': [
    { title: 'Recorrido Comuna 13: Arte, Rap & Breakdance', category: 'Cultural', description: 'Tour de historia y transformación social con artistas locales y muestra de hip hop.', location: 'Comuna 13, Medellín', date: 'Este Fin de Semana' },
    { title: 'Cata de Cafés de Origen & Brunch en Provenza', category: 'Gastronomía', description: 'Experiencia sensorial probando los mejores granos antioqueños de especialidad.', location: 'Provenza, El Poblado, Medellín', date: 'Sábado 10:00 hrs' },
    { title: 'Medellín AI & Tech Expat Community', category: 'Networking', description: 'Encuentro de nómadas digitales, ingenieros de IA y creadores de tecnología.', location: 'Ruta N / El Poblado, Medellín', date: 'Jueves 18:30 hrs' },
    { title: 'Noche Urbana & Terrazas en Provenza', category: 'Vida Nocturna', description: 'Fiesta en terrazas con los DJs más reconocidos de la escena urbana y reggaeton.', location: 'El Poblado, Medellín', date: 'Viernes 22:00 hrs' },
    { title: 'Festival Nocturno de Orquídeas & Luces', category: 'Cultural', description: 'Recorrido iluminado por las colecciones de flores y música acústica.', location: 'Jardín Botánico de Medellín', date: 'Viernes 19:00 hrs' },
    { title: 'Mercado de Diseño Paisa & Artesanías', category: 'Cultural', description: 'Exposición de emprendimientos de moda, accesorios e ilustración local.', location: 'Parque Lleras, Medellín', date: 'Domingo 12:00 hrs' }
  ]
};

const generateCuratedCityEvents = (city) => {
  if (CITY_EVENT_CATALOG[city]) {
    return CITY_EVENT_CATALOG[city];
  }
  // Generic fallback for any other city
  return [
    { title: `Festival de Arte & Luces ${city} 2026`, category: 'Cultural', description: `Exposición interactiva de arte digital y videomapping nocturno en ${city}.`, location: city, date: 'Este Fin de Semana' },
    { title: `Ruta Gastronómica & Craft Beer ${city}`, category: 'Gastronomía', description: `Recorrido guiado por los mejores mercados gastronómicos y restaurantes de ${city}.`, location: city, date: 'Viernes 20:00 hrs' },
    { title: `Meetup de Expat & Tech Founders ${city}`, category: 'Networking', description: `Encuentro informal de emprendedores, nómadas digitales y desarrolladores en ${city}.`, location: city, date: 'Jueves 19:00 hrs' },
    { title: `Noche de Música en Vivo & Coctelería ${city}`, category: 'Vida Nocturna', description: `Sesión de música en vivo y coctelería de autor en la zona rosa de ${city}.`, location: city, date: 'Sábado 21:00 hrs' }
  ];
};

export function CityExplorer({ currentCity, mode }) {
  const { language, tavilyApiKey, expenses, currencyOverride } = useRoomiaStore();
  const { user } = useAuthStore();
  const t = translations[language] || translations.es;
  const defaultCurrency = getCityCurrency(currentCity);
  const activeCurrencyCode = currencyOverride || defaultCurrency.code;
  const currencySymbol = defaultCurrency.symbol;

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [events, setEvents] = useState(() => generateCuratedCityEvents(currentCity || 'Bogotá'));
  const [eventMeta, setEventMeta] = useState({ source: 'curated', cached: true });
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);

  // Automatically fetch personalized live web events from Tavily when city or user profile changes
  useEffect(() => {
    let isMounted = true;

    // Instantly update default curated events to match selected city
    setEvents(generateCuratedCityEvents(currentCity));
    setEventMeta({ source: 'curated', cached: true });

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
          setEventMeta({
            source: searchResults.source || 'live_web',
            cached: searchResults.cached ?? false,
            cacheDate: searchResults.cacheDate
          });
        }
      } catch (err) {
        console.warn('Tavily search fallback to local city events:', err);
        if (isMounted) {
          setEvents(generateCuratedCityEvents(currentCity));
          setEventMeta({ source: 'curated', cached: true });
        }
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
        <div className="tavily-status-badge" style={{ background: eventMeta.cached ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 107, 74, 0.12)', color: eventMeta.cached ? '#059669' : 'var(--primary)' }}>
          <i className={`fa-solid ${eventMeta.cached ? 'fa-bolt' : 'fa-satellite-dish'}`}></i>{' '}
          {eventMeta.cached 
            ? `Caché Diario DB (${currentCity}) — 0 Créditos Gastados Hoy`
            : eventMeta.source === 'live_web'
              ? `Tavily AI Live Web (${currentCity})`
              : `Radar Urbano Activo (${currentCity})`}
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
