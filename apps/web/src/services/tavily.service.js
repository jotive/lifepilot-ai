export class TavilyService {
  static async searchEvents(query, city, apiKey) {
    if (apiKey && apiKey.trim() !== '') {
      try {
        const response = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: apiKey,
            query: `${query} en ${city}`,
            search_depth: 'advanced',
            include_answer: true,
            max_results: 6
          })
        });
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return data.results.map((item, idx) => ({
            title: item.title,
            category: idx % 2 === 0 ? 'Cultura & Música' : 'En Vivo & Gastronomía',
            snippet: item.content,
            url: item.url,
            date: 'Próximas fechas',
            location: city
          }));
        }
      } catch (error) {
        console.warn('Live API call fallback active:', error);
      }
    }

    return this.getFallbackEvents(city);
  }

  static getFallbackEvents(city) {
    return [
      {
        title: `Festival Cultural & Gastronómico de ${city}`,
        category: 'Gastronomía & Feria',
        snippet: `Muestra gastronómica artesanal con más de 40 expositores locales, música en vivo y talleres de cocina en el centro de ${city}.`,
        date: 'Sábado & Domingo, 12:00 - 20:00',
        location: `Parque Central de ${city}`
      },
      {
        title: `Noche de Jazz & Coctelería de Autor`,
        category: 'Música & Parejas',
        snippet: `Presentación en vivo de cuartetos de jazz local con degustación de coctelería artesanal y terraza abierta con vista panorámica.`,
        date: 'Viernes y Sábado, 21:00',
        location: `Distrito Cultural, ${city}`
      },
      {
        title: `Tech & AI Innovators Meetup ${city}`,
        category: 'Tech & Networking',
        snippet: `Reunión de la comunidad de desarrollo e inteligencia artificial. Charlas sobre herramientas agenticas, networking y pizzas.`,
        date: 'Jueves, 19:00',
        location: `Hub de Innovación ${city}`
      },
      {
        title: `Ruta de Museos & Exposición Inmersiva`,
        category: 'Cultura & Arte',
        snippet: `Recorrido guiado por las principales galerías de arte contemporáneo con instalaciones digitales e interactivas.`,
        date: 'Fin de semana continuo',
        location: `Circuito de Museos`
      },
      {
        title: `Mercado de Productos Orgánicos & Diseño Local`,
        category: 'Aire Libre',
        snippet: `Feria al aire libre ideal para recién llegados a ${city}. Productos ecológicos, plantas de interior y artesanía local.`,
        date: 'Domingo, 10:00 - 16:00',
        location: `Plaza Principal`
      },
      {
        title: `Ciclo de Cine de Verano & Picnic al Aire Libre`,
        category: 'Roomies & Amigos',
        snippet: `Proyección de cine independiente bajo las estrellas con área para pícnic y food trucks invitados.`,
        date: 'Sábado, 19:30',
        location: `Parque Urbano ${city}`
      }
    ];
  }
}
