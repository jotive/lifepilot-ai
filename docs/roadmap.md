# Roadmap de Entrega — RoomIA Hackathon

> Estado al: 26 de julio 2026 (auditoría #6 — producto, funcionalidades, rendimiento, usabilidad)
> Deadline: 27 de julio 23:59 UTC-6
> Build: OK (70 módulos, 0 errores, 250 KB JS gzipped a 74 KB)
> Backend: OK (rutas cargan)

---

## Requisitos del Hackathon

| # | Requisito | Estado |
|---|-----------|--------|
| 1 | Repositorio público GitHub | ✅ |
| 2 | README.md exhaustivo | ✅ |
| 3 | Sin credenciales expuestas | ✅ |
| 4 | Demo en línea accesible 7 días | ❌ Pendiente |
| 5 | Video de presentación ~5 min | ❌ Pendiente |
| 6 | Categoría Web + APIs navegador + servicios externos | ✅ |

---

## BUGS FUNCIONALES (rompen features prometidas)

### 🔴 Crítico

- [ ] **Endpoint de búsqueda desalineado** — El frontend llama `POST /api/v1/search` pero el backend registra la ruta como `POST /api/v1/events/search`. La búsqueda de Tavily NUNCA funciona en la app actual. El useEffect de CityExplorer falla silenciosamente y muestra solo los 3 eventos hardcoded de fallback

### 🟡 Alto

- [ ] **`api.service.js` hardcodea `http://localhost:4000`** — En producción el frontend no podrá conectar al backend. Debe usar `import.meta.env.VITE_API_URL || ''` o path relativo con proxy
- [ ] **Auth inicia como "Invitado" pero Landing Page no guía al registro** — El botón "Crear Cuenta Gratis" abre el modal de auth que funciona, pero si el juez hace clic en "Entrar a la App / Demo" entra directo sin cuenta. El flujo no es consistente — o es guest-first (sin pedir login) o es auth-first

---

## USABILIDAD

### Flujo del juez (primera impresión)

1. Abre la URL → ve Landing Page ✅ (buena primera impresión)
2. Click "Entrar a la App" → entra a CityExplorer
3. Ve "Live Radar Activo" y 3 eventos genéricos → busca algo → falla silenciosamente (bug del endpoint) → queda con los mismos 3 eventos → pierde confianza
4. Va a Kitchen → inventario vacío (arrays inician en `[]` ahora). Click "Generar Recetas" → botón deshabilitado. No sabe que primero debe agregar ingredientes → **no hay empty state en Kitchen**
5. Va a Finanzas → empty state funciona ✅, guía la acción
6. Va a Bóveda → documentos vacíos, ficha médica funciona ✅

### Problemas de usabilidad detectados

- [ ] **KitchenOps sin empty state** — Con 0 ingredientes el área está vacía sin guía. Debería decir "Agrega ingredientes con el teclado, dictado por voz o escaneo de cámara para generar recetas"
- [ ] **CityExplorer falla silenciosamente** — Si la API no responde, no hay feedback visible de error. El usuario no sabe si está buscando o si falló
- [ ] **Onboarding no setea datos demo** — El tour de 3 pasos muestra texto genérico pero al terminar el usuario tiene todo vacío. Un juez ve una app vacía después de 3 slides prometedores
- [ ] **El selector de moneda desapareció del header** — Ahora la moneda solo se ve en el utility bar badge (no editable desde ahí). Se configura solo al registrarse. Si el juez no se registra, queda con la moneda default

---

## RENDIMIENTO

| Métrica | Valor | Evaluación |
|---------|-------|------------|
| Bundle JS (gzip) | 74 KB | ✅ Bien para React + Zustand |
| Bundle CSS (gzip) | 6.2 KB | ✅ Compacto |
| Módulos | 70 | ✅ Tamaño razonable |
| Imágenes 3D | 6 archivos JPG en public/assets | ⚠️ Sin verificar peso. Si son >300KB c/u, impactan LCP en mobile |
| Lazy loading | Implementado en banners | ✅ |
| Cache de eventos (backend) | In-memory + JSON file DB | ✅ Excelente — evita llamadas repetidas a Tavily |
| Service Worker | Solo push notifications | ⚠️ No cachea la app shell para offline |

---

## SEGURIDAD

| Aspecto | Estado | Nota |
|---------|--------|------|
| Credenciales en código | ✅ | Ninguna |
| Auth en backend | ⚠️ | El auth store es solo localStorage, no hay validación de password en backend |
| CORS | ✅ | Configurado en API |
| Input validation (Zod) | ✅ | Todos los endpoints validados |
| XSS en inputs | ✅ | React escapa por defecto |
| Contraseña visible | ⚠️ | AuthModal pide password pero lo ignora — solo usa email para generar perfil. Un auditor notaría que la contraseña no se usa |

---

## FUNCIONALIDADES — MAPA COMPLETO

### Funciona correctamente
- [x] Landing Page con propuesta de valor
- [x] Auth modal (login/registro/logout)
- [x] Onboarding 3 pasos (primera visita)
- [x] Itinerario generado con LLM
- [x] Recetas con IA (cuando hay ingredientes)
- [x] Escaneo de cámara → Vision API
- [x] Dictado por voz (Web Speech API)
- [x] Kanban drag-and-drop
- [x] Gastos 50/50 con CRUD
- [x] Export CSV, TXT, PNG
- [x] WhatsApp share
- [x] Calculadora de costos por ciudad
- [x] Checklist de mudanza
- [x] Emergencias por ciudad
- [x] Analizador de contratos + disclaimer
- [x] Filtros de categoría en CityExplorer
- [x] Hash routing (12 rutas)
- [x] 404 y ErrorBoundary
- [x] AI Chat Widget
- [x] Responsive + dock mobile
- [x] i18n, multi-moneda, modo solo/pareja
- [x] Cache de eventos (backend, evita spam a Tavily)

### No funciona (bugs)
- [ ] Búsqueda real de eventos (endpoint desalineado)
- [ ] Conexión frontend → backend en producción (localhost hardcoded)

---

## ACCIÓN INMEDIATA REQUERIDA

| # | Fix | Impacto | Tiempo est. |
|---|-----|---------|-------------|
| 1 | Cambiar `/search` → `/events/search` en `api.service.js` | CRÍTICO — sin esto el feature principal no funciona | 1 min |
| 2 | Hacer API_BASE configurable: `import.meta.env.VITE_API_URL \|\| '/api/v1'` | CRÍTICO para deploy | 2 min |
| 3 | Agregar empty state en KitchenOps (0 ingredientes) | ALTO — usabilidad del juez | 5 min |
| 4 | Deploy | BLOQUEANTE | 30 min |
| 5 | Video | BLOQUEANTE | — |

---

## Conclusión

El producto tiene 70 módulos, landing, auth, 5 módulos core, cache inteligente de eventos y exportaciones reales. Pero **la funcionalidad estrella (búsqueda de Tavily) está rota por un path incorrecto en 1 línea de código**. Eso arruina la demo si no se corrige.

**Fix #1 es de 1 minuto y desbloquea toda la propuesta de valor de la app.**
