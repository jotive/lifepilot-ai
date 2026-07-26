# Roadmap de Entrega — RoomIA Hackathon

> Estado al: 26 de julio 2026 (auditoría final post-commit `4187368`)
> Deadline: 27 de julio 23:59 UTC-6
> Build: OK (65 módulos, 0 errores)
> Backend: OK (todas las rutas cargan)

---

## Estado de Requisitos del Hackathon

| # | Requisito | Estado |
|---|-----------|--------|
| 1 | Repositorio público GitHub | ✅ Cumple |
| 2 | README.md exhaustivo con stack real | ✅ Cumple (React, Zustand, Tavily, OpenAI, Groq, Canvas PNG, Web Crypto) |
| 3 | Sin credenciales expuestas | ✅ Cumple |
| 4 | Demo en línea accesible 7 días | ❌ Pendiente — listo para deploy (Cloudflare/Render) |
| 5 | Video de presentación ~5 min | ❌ Pendiente — listo para grabar |
| 6 | Categoría Web + APIs navegador + servicios externos | ✅ Cumple |

---

## Estado de Funcionalidades Completo

### Resuelto en Código & Verificado (100%)

- [x] **Onboarding de primer uso:** Flujo interactivo de 3 pasos (`OnboardingModal.jsx`) para que la demo se cuente sola ante los jueces.
- [x] **Eliminar / Reemplazar el Credit Card Widget:** Sustituido por un Resumen Real de Gastos del Hogar con la moneda activa.
- [x] **Empty states con Call-To-Action:** Guías claras en alacena, recetas, gastos y tareas cuando las listas están vacías.
- [x] **Botones de eliminar (CRUD Completo):** Borrado individual de gastos, tareas, ingredientes y documentos, más botón de restablecimiento total en Ajustes.
- [x] **Disclaimer en analizador de contratos:** Aviso legal destacado sobre la naturaleza orientativa de la IA.
- [x] **Feedback de logro & Toasts:** Notificaciones contextuales para exportaciones (CSV, PNG, WhatsApp).
- [x] **Lazy loading en imágenes 3D:** Propiedad `loading="lazy"` en todas las ilustraciones de cabecera.
- [x] **Accesibilidad WCAG AA:** Etiquetas `aria-label` explícitas en todos los botones e íconos.
- [x] **CityExplorer con Tavily API:** Búsqueda en vivo de eventos con filtrado dinámico por categorías.
- [x] **Emergencias dinámicas por ciudad:** Mapeo de números locales reales (911, 123, 112, 133, etc.).
- [x] **Bóveda con Web Crypto API:** Generación de firma SHA-256 digest para los documentos almacenados.
- [x] **AI Chat Widget LLM:** Conectado al backend de inferencia Express.
- [x] **Formato Monetario sin Centavos:** Redondeo adaptativo para COP, CLP y ARS.
- [x] **Kanban con Drag & Drop:** Arrastrar y soltar nativo entre Por Hacer, Haciendo y Listo.
- [x] **PWA Icons:** `icon-192.png` e `icon-512.png` generados en `public/`.

---

## Lo único que falta para la entrega

| # | Pendiente | Responsable | Nota |
|---|-----------|-------------|------|
| 1 | **Deploy live** (web + API) | Dev | Cloudflare Pages + Railway/Render |
| 2 | **Video de presentación** | Participante | 5 min mostrando el flujo |

---

## Conclusión

El producto cuenta con el 100% de la funcionalidad, refinamiento de usabilidad y accesible para los jueces.
