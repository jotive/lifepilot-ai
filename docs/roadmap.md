# Roadmap de Entrega — RoomIA Hackathon

> Estado al: 25 de julio 2026 (auditoría final)
> Deadline: 27 de julio 23:59 UTC-6
> Build: OK (64 módulos, 0 errores)
> Backend: OK (todas las rutas cargan)

---

## Estado de Requisitos del Hackathon

| # | Requisito | Estado |
|---|-----------|--------|
| 1 | Repositorio público GitHub | ✅ Cumple |
| 2 | README.md exhaustivo con stack real | ✅ Cumple (actualizado: React, Zustand, Tavily, OpenAI, Groq, Canvas PNG, Web Crypto) |
| 3 | Sin credenciales expuestas | ✅ Cumple |
| 4 | Demo en línea accesible 7 días | ❌ Pendiente — no hay URL de deploy |
| 5 | Video de presentación ~5 min | ❌ Pendiente — lo graba el participante |
| 6 | Categoría Web + APIs navegador + servicios externos | ✅ Cumple |

---

## Estado de Funcionalidades (verificado en código)

### Resuelto (7/7 items del commit `765b059`)

- [x] **CityExplorer ahora llama a Tavily** — `handleSearch` usa `ApiService.searchEvents` con fallback local
- [x] **Filtros de categoría funcionales** — `filteredEventsByCategory` filtra por `activeCategory`
- [x] **Emergencias dinámicas por ciudad** — cada ciudad tiene su array `emergencies` en `CITY_CURRENCY_MAP`
- [x] **README actualizado** — refleja React, Zustand, Canvas PNG, Web Crypto, Tavily, OpenAI/Groq
- [x] **AI Chat Widget** — intenta llamar al backend primero, cae a fallback contextual
- [x] **PWA Icons** — `icon-192.png` e `icon-512.png` existen en `public/`
- [x] **Cifrado referenciado como SHA-256 digest** — el README y UI ajustados

### Funcionalidades completas verificadas

- [x] Búsqueda de eventos en vivo (Tavily API + fallback)
- [x] Itinerario generado con IA (LLM + fallback)
- [x] Recetas con IA desde ingredientes reales (LLM + fallback)
- [x] Escaneo de cámara → ingredientes (Vision API + fallback)
- [x] Dictado por voz (Web Speech API, 3 idiomas)
- [x] Kanban de tareas con drag-and-drop
- [x] Gastos 50/50 con settlement
- [x] Exportar CSV, TXT, PNG reales
- [x] Compartir ficha médica por WhatsApp
- [x] Calculadora con moneda local por ciudad
- [x] Checklist interactivo con progreso
- [x] Analizador de contratos (keyword scoring)
- [x] Multi-moneda (COP, MXN, EUR, USD, ARS, CLP, PEN)
- [x] i18n (ES/EN/PT)
- [x] Modo Solo Expat / Roomies-Pareja
- [x] Responsive con dock mobile + safe-area
- [x] Hash routing funcional
- [x] Toast notifications

---

## Lo único que falta

| # | Pendiente | Responsable | Nota |
|---|-----------|-------------|------|
| 1 | **Deploy live** (web + API) | Dev | Cloudflare Pages + Railway/Render sugerido |
| 2 | **Video de presentación** | Participante | 5 min mostrando flujo funcional |

---

## Observaciones menores (no bloquean, pero mejorables)

- `api.service.js` usa `http://localhost:4000` hardcoded — en deploy necesita variable de entorno o proxy
- AI Chat Widget usa `/recipes/generate` como proxy de chat genérico — funciona pero no es semánticamente correcto
- El badge "Encriptado" en DocVault ahora referencia SHA-256 pero no hay cifrado real de archivos (es un hash, no encriptación). Para un hackathon es aceptable pero técnicamente incorrecto
- Service Worker solo maneja push notifications, no cache offline

---

## Mejoras de Producto (usabilidad, confianza, retención)

Pensando como usuario real, no como desarrollador:

### Alta prioridad (impactan la demo y la primera impresión)

- [ ] **Onboarding de primer uso** — Flujo de 3 pasos: nombre, ciudad, modo (solo/pareja). Sin esto el usuario no sabe qué hacer. Con esto, la demo se cuenta sola
- [ ] **Eliminar o reemplazar el Credit Card Widget** — Muestra un balance ficticio de $75,000 que confunde y genera desconfianza. Reemplazar por un resumen real de gastos del mes
- [ ] **Empty states con call-to-action** — Cuando no hay gastos, recetas o eventos, mostrar una guía de acción ("Agrega tu primer gasto para ver quién le debe a quién") en vez de cálculos vacíos

### Media prioridad (usabilidad y confianza)

- [ ] **Botones de eliminar** — No hay forma de borrar un gasto, un ingrediente individual, o un documento de la bóveda. El usuario necesita control sobre sus datos
- [ ] **Disclaimer en analizador de contratos** — "Este análisis es orientativo y no sustituye asesoría legal profesional". El keyword matching puede dar falsa seguridad con contratos abusivos bien redactados
- [ ] **Feedback de éxito más visible** — Exportar CSV, generar PNG, sortear tareas: todo pasa silencioso. Los toasts son pequeños y desaparecen rápido. Celebrar los momentos de logro
- [ ] **Lazy loading en imágenes de banner** — Los 6 archivos .jpg cargan todos al inicio sin `loading="lazy"`. En mobile con 3G la primera carga se siente lenta

### Baja prioridad (mejora continua)

- [ ] **Accesibilidad** — Botones del Kanban dicen "← 📌" y "Iniciar ⏳" (un lector de pantalla no entiende emojis como label). Contraste de texto muted puede no cumplir WCAG AA
- [ ] **Limpiar datos del mes** — Botón de "Reiniciar gastos", "Vaciar alacena" para ciclos mensuales
- [ ] **Persistencia de checklist de mudanza** — Actualmente se resetea al recargar (estado local del componente, no en Zustand)

---

## Conclusión

El producto está listo para demo. Las tareas de código están completas. Quedan:
- 2 tareas operativas (deploy + video)
- Mejoras de producto opcionales que elevan la experiencia pero no bloquean la entrega
