# Roadmap de Entrega — RoomIA Hackathon

> Estado al: 25 de julio 2026 (re-auditoría)
> Deadline: 27 de julio 23:59 UTC-6

---

## Bloqueantes (sin esto no se puede evaluar)

- [ ] **Deploy live accesible por 7 días** — requisito obligatorio del hackathon, sin esto los jueces no pueden evaluar
- [ ] **README.md actualizado** — actualmente dice "Vite + HTML/CSS/JS", no menciona React, Zustand, Tailwind, Kanban, API en capas, i18n, multi-moneda. Los jueces lo leen primero

---

## Funcionalidad Rota (la UI promete algo que no sucede)

- [ ] **CityExplorer no llama a Tavily** — muestra 3 eventos hardcoded. El badge dice "Live Radar Activo" pero no busca nada en vivo. `tavily.service.js` existe pero el componente no lo usa
- [ ] **Badge "Encriptado" en Bóveda** — la UI muestra un candado verde con texto "Encriptado" en cada documento, pero solo guarda en localStorage plano sin cifrado
- [ ] **Emergencias hardcoded** — dice "Directorio de Emergencia (Bogotá)" pero los números (911/123/125/119) no cambian por ciudad. Bogotá usa 123, México usa 911, España usa 112

---

## Funcionalidad Parcial (intenta pero no llega)

- [ ] **AI Chat Widget** — ahora intenta llamar a `/api/v1/recipes/generate` (buena intención) pero lo usa como chat genérico pasando el mensaje como ingrediente. Debería tener un endpoint de chat propio o usar el endpoint correcto
- [ ] **Filtros de categoría en CityExplorer** — los chips cambian `activeCategory` pero no filtran los eventos visibles (no hay lógica que use esa variable)
- [ ] **i18n** — los componentes nuevos (RelocationOps, HouseholdOps, DocVault, Header) sí usan `t.xxx` pero CityExplorer referencia claves que pueden no existir (`t.categoriesLabel`, `t.catAll`, `t.catCultural`, etc.)

---

## Resuelto desde la última auditoría

- [x] PWA icons — `icon-192.png` e `icon-512.png` ahora existen en `public/`
- [x] AI Chat Widget — ya intenta conectar al backend (aunque mal orientado)
- [x] Drag and drop en Kanban de tareas (commit `4c7eb03`)
- [x] Formateo sin decimales para COP/CLP/ARS

---

## Lo que ya funciona correctamente (no tocar)

- [x] Recetas con IA real (backend LLM + fallback local)
- [x] Escaneo de cámara → ingredientes vía Vision API + fallback
- [x] Itinerario inteligente vía LLM (usa los eventos actuales como contexto)
- [x] Dictado por voz (Web Speech API real, multi-idioma)
- [x] Kanban de tareas con drag-and-drop (3 columnas)
- [x] Crear tareas con assignee y frecuencia
- [x] Sorteo aleatorio de responsables
- [x] Registro de gastos con settlement 50/50
- [x] Exportar gastos CSV descargable
- [x] Exportar ficha médica PNG (HTML5 Canvas)
- [x] Compartir ficha por WhatsApp (link directo)
- [x] Exportar guía de mudanza TXT
- [x] Calculadora de costos con moneda local contextual por ciudad
- [x] Checklist de mudanza interactivo con barra de progreso
- [x] Upload de documentos
- [x] Analizador de contratos (keyword matching con score visual)
- [x] Selector de moneda en header
- [x] Selector de idioma (ES/EN/PT)
- [x] Modo Solo Expat / Roomies-Pareja
- [x] Hash routing (#/explorer, #/kitchen, etc.)
- [x] Vinculación de roomie (genera código + link)
- [x] Responsive mobile con dock estilo iOS + safe-area
- [x] Service Worker para push notifications
- [x] 3D Hero banners con imágenes por módulo
- [x] Toast notifications globales
- [x] Credit Card widget contextual por moneda

---

## Orden de ejecución recomendado (por impacto)

| # | Tarea | Tiempo est. | Impacto |
|---|-------|-------------|---------|
| 1 | Reconectar Tavily en CityExplorer + filtros funcionales | 20 min | ALTO — es la feature principal de IA del hackathon |
| 2 | Emergencias contextuales por ciudad (mapa de números) | 10 min | MEDIO — los jueces son de AWS LatAm, lo van a notar |
| 3 | Quitar badge "Encriptado" o implementar cifrado con Web Crypto API | 15 min | ALTO — mentir en la UI es peor que no tener la feature |
| 4 | Actualizar README.md al estado real | 20 min | CRÍTICO — primera impresión para los jueces |
| 5 | Fix AI Chat Widget (usar endpoint de chat o mejorar fallback) | 15 min | MEDIO — si lo abren y no funciona bien, resta |
| 6 | Verificar que todas las claves i18n existan | 10 min | BAJO — solo afecta si cambian a EN/PT |
| 7 | Deploy (Cloudflare Pages web + Railway API) | 30 min | CRÍTICO — sin esto no hay evaluación |
| 8 | Grabar video de 5 min | — | Lo grabas tú |

**Tiempo total estimado para quedar listo: ~2 horas de desarrollo + deploy**
