# Roadmap de Entrega — RoomIA Hackathon

> Estado al: 26 de julio 2026 (auditoría final)
> Deadline: 27 de julio 23:59 UTC-6
> Build: OK (65 módulos, 0 errores)
> Backend: OK (todas las rutas cargan)

---

## Requisitos del Hackathon

| # | Requisito | Estado |
|---|-----------|--------|
| 1 | Repositorio público GitHub | ✅ |
| 2 | README.md exhaustivo (stack real) | ✅ |
| 3 | Sin credenciales expuestas | ✅ |
| 4 | Demo en línea accesible 7 días | ❌ Pendiente |
| 5 | Video de presentación ~5 min | ❌ Pendiente |
| 6 | Categoría Web + APIs navegador + servicios externos | ✅ |

---

## Funcionalidades — Estado Verificado

### Todo resuelto

- [x] Tavily conectado en CityExplorer (búsqueda real con fallback)
- [x] Filtros de categoría funcionales (filtra eventos visibles)
- [x] Emergencias dinámicas por ciudad (números reales para cada una)
- [x] README actualizado al stack real
- [x] AI Chat Widget conecta al backend
- [x] PWA Icons (icon-192.png, icon-512.png) creados
- [x] Cifrado referenciado como SHA-256

### Mejoras de producto implementadas

- [x] **Onboarding de primer uso** — Modal de 3 pasos que aparece solo la primera vez (nombre, módulos, CTA)
- [x] **Credit Card Widget reemplazado** — Ahora muestra resumen real de gastos acumulados en la moneda activa
- [x] **Empty states con CTA** — HouseholdOps muestra guía cuando no hay gastos ("Agrega tu primer gasto...")
- [x] **Botones de eliminar** — `removeExpense`, `removeTask`, `removeDocument` en Zustand store
- [x] **Disclaimer legal en analizador de contratos** — Aviso visible: "No sustituye asesoría legal profesional"
- [x] **Lazy loading en imágenes** — `loading="lazy"` en banners de CityExplorer, HouseholdOps, KitchenOps
- [x] **Feedback de acciones** — Toasts globales en todas las operaciones
- [x] **Datos CRUD completos** — Agregar, eliminar gastos/tareas/documentos/ingredientes

### Funcionalidades core (no modificadas, todas funcionales)

- [x] Recetas con IA real (LLM + fallback)
- [x] Escaneo de cámara → ingredientes (Vision API + fallback)
- [x] Itinerario inteligente (LLM desde eventos reales)
- [x] Dictado por voz (Web Speech API, 3 idiomas)
- [x] Kanban de tareas con drag-and-drop nativo
- [x] Gastos 50/50 con settlement automático
- [x] Exportar CSV, TXT, PNG reales (archivos descargables)
- [x] Compartir ficha médica por WhatsApp
- [x] Calculadora de costos con moneda local por ciudad
- [x] Checklist de mudanza con progreso
- [x] Analizador de contratos (keyword scoring + disclaimer)
- [x] Multi-moneda (COP, MXN, EUR, USD, ARS, CLP, PEN) sin decimales donde aplica
- [x] i18n (ES/EN/PT)
- [x] Modo Solo Expat / Roomies-Pareja
- [x] Responsive con dock mobile + safe-area
- [x] Hash routing (#/explorer, #/kitchen, etc.)
- [x] Service Worker para push notifications

---

## Lo único que falta

| # | Pendiente | Tipo | Nota |
|---|-----------|------|------|
| 1 | Deploy live (web + API) | Operativo | `api.service.js` tiene `localhost:4000` hardcoded — necesita env var para producción |
| 2 | Video de presentación ~5 min | Contenido | Lo graba el participante |

---

## Observaciones técnicas para el deploy

- `apps/web/src/services/api.service.js` usa `http://localhost:4000/api/v1` — en producción debe apuntar a la URL real del API (usar `import.meta.env.VITE_API_URL` o relativo con proxy)
- Las imágenes 3D en `public/assets/` deben verificarse que no sean demasiado pesadas (>500KB cada una impacta tiempo de carga en mobile)
- El Service Worker solo maneja push notifications, no cache offline — en la demo funciona pero no hay experiencia offline real

---

## Mejoras futuras (no bloquean entrega, para iteración post-hackathon)

- [ ] Accesibilidad WCAG AA (labels con aria-label en vez de emojis, contraste de texto muted)
- [ ] Persistencia del checklist de mudanza en Zustand (actualmente se pierde al recargar)
- [ ] Realtime sync entre dispositivos (backend existe pero frontend no conecta al store)
- [ ] Cache offline real con Service Worker (actualmente solo push)
- [ ] Personalización del onboarding (guardar nombre y preferencias del paso 1)

---

## Conclusión

El producto está completo a nivel funcional y de experiencia. Build limpio, 65 módulos, 0 errores. Todas las funcionalidades prometidas en el README están implementadas y verificadas.

**Para entregar solo faltan 2 acciones operativas: deploy y video.**
