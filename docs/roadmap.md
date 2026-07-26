# Roadmap de Entrega — RoomIA Hackathon

> Estado al: 26 de julio 2026 (auditoría #5)
> Deadline: 27 de julio 23:59 UTC-6
> Build: OK (70 módulos, 0 errores, 247 KB JS gzipped a 73 KB)
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

## Nuevas funcionalidades implementadas (desde última auditoría)

- [x] **Landing Page** — Página de conversión con hero, grid de features, CTA. Accesible en `#/` o `#/landing`
- [x] **Sistema de autenticación** — Login, registro, perfil con avatar (Dicebear), logout. Persiste en localStorage
- [x] **Registro unifica preferencias** — Al crear cuenta se configura ciudad, moneda y modo (solo/pareja) de una vez
- [x] **Top Utility Bar** — Barra superior separada con ciudad, usuario, idioma y vinculación
- [x] **React ErrorBoundary** — Captura errores de renderizado sin crashear toda la app
- [x] **Página 404** — Rutas inválidas muestran un NotFound amigable con navegación de vuelta
- [x] **Routing mejorado** — Hash router con rutas: `/`, `/landing`, `/login`, `/signup`, `/profile`, `/settings`, `/logout`, `/explorer`, `/relocation`, `/kitchen`, `/finances`, `/vault`
- [x] **Aria-labels en sidebar** — Accesibilidad mejorada en botones de navegación

---

## Estado completo de funcionalidades

### Flujo de usuario y navegación
- [x] Landing page con propuesta de valor clara y CTAs
- [x] Onboarding de 3 pasos (primera visita)
- [x] Login / Registro con configuración integrada de ciudad y modo
- [x] Perfil de usuario con avatar y badge de ciudad
- [x] Logout funcional con redirección
- [x] 404 para rutas inválidas
- [x] ErrorBoundary para errores de renderizado
- [x] Hash routing funcional con 12 rutas

### Módulo 1: Radar Urbano
- [x] Búsqueda real con Tavily API + fallback
- [x] Filtros de categoría funcionales
- [x] Itinerario generado con LLM
- [x] Resumen real de gastos en sidebar (reemplaza credit card fake)

### Módulo 2: Guía de Mudanza
- [x] Checklist interactivo con progreso
- [x] Calculadora de costos en moneda local por ciudad
- [x] Exportar guía TXT
- [x] Emergencias dinámicas por ciudad (números reales)

### Módulo 3: Refrigerador & Recetas
- [x] Inventario con add/remove + persistencia
- [x] Dictado por voz (Web Speech API, 3 idiomas)
- [x] Escaneo de cámara → Vision API + fallback
- [x] Recetas generadas por LLM + fallback

### Módulo 4: Finanzas & Tareas
- [x] Registro de gastos con CRUD completo (agregar + eliminar)
- [x] Settlement 50/50 automático
- [x] Exportar CSV real
- [x] Kanban drag-and-drop (3 columnas)
- [x] Crear, asignar, mover y eliminar tareas
- [x] Sorteo aleatorio de responsables
- [x] Empty states con CTAs

### Módulo 5: Bóveda & Salud
- [x] Upload de documentos
- [x] Eliminar documentos
- [x] Ficha médica exportable en PNG (Canvas)
- [x] Compartir por WhatsApp (link directo)
- [x] Analizador de contratos con disclaimer legal
- [x] Lazy loading en imágenes

### Transversales
- [x] i18n (ES/EN/PT) con traducciones
- [x] Multi-moneda sin decimales donde aplica (COP, CLP, ARS)
- [x] Modo Solo Expat / Roomies-Pareja
- [x] Responsive con dock mobile + safe-area
- [x] PWA manifest + icons + Service Worker
- [x] AI Chat Widget con intento de conexión al backend
- [x] Toast notifications globales

---

## Lo que falta

| # | Pendiente | Tipo |
|---|-----------|------|
| 1 | **Deploy live** (web + API) | Operativo |
| 2 | **Video de presentación** (~5 min) | Contenido |

---

## Observaciones para deploy

- `api.service.js` usa `http://localhost:4000/api/v1` hardcoded — necesita variable `VITE_API_URL` o proxy reverso en producción
- Auth es solo localStorage (no hay backend de auth) — correcto para la demo, pero el formulario pide contraseña que no se valida realmente
- `useAuthStore` inicia con `isLoggedIn: true` y `DEFAULT_USER` prefabricado — un juez que abra la app verá que ya está "logueado" como Alex Morgan sin haber hecho nada. Puede confundir
- El `App.jsx` tiene una modificación sin committear (M en git status)

---

## Mejoras futuras (post-hackathon)

- [ ] Auth real con backend (JWT + base de datos)
- [ ] Cifrado real de documentos (AES-GCM, no solo SHA-256 digest)
- [ ] Cache offline con Service Worker
- [ ] Realtime sync funcional entre dispositivos
- [ ] Persistencia del checklist de mudanza en Zustand
- [ ] Contraste WCAG AA en texto muted

---

## Conclusión

El producto tiene 70 módulos, landing page, auth, 5 módulos core funcionales, routing completo, error handling, y exportaciones reales. Build limpio, 0 errores.

**Para entregar: deploy + video. Committear el cambio pendiente en App.jsx.**
