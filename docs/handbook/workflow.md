# 🗺️ Handbook: Workflow & Product Roadmap

> **Proyecto:** RoomIA  
> **Estatus:** Producción Funcional desde el Día 1  
> **Hackatón:** Hackatón de IA con Qiro & AWS (Código Facilito + AWS)

---

## 🎯 Roadmap Oficial de Desarrollo (Milestones & Fases)

```
┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐     ┌──────────────────────────────────────┐
│ FASE 1: FUNDAMENTOS & CORE MVP (100%)│ ──► │ FASE 2: REALTIME SYNC & PWA (PRÓX)   │ ──► │ FASE 3: AGENTES IA & FINANCIERO      │
│  - React 18 + Zustand + Zod + REST v1│     │  - WebSockets / Supabase Realtime    │     │  - Open Banking & Categorización     │
│  - 5 Módulos Core Funcionales        │     │  - PWA Instalable iOS/Android        │     │  - Agente Analizador de Contratos    │
│  - Multi-Worker & Multi-Cloud Docker │     │  - Web Push Notifications Activas    │     │  - Modo Multilingüe (ES/EN/PT)       │
└──────────────────────────────────────┘     └──────────────────────────────────────┘     └──────────────────────────────────────┘
```

---

### ✅ FASE 1: Fundamentos, Arquitectura & Producto Core (100% COMPLETADO)

* [x] **Monorepo por Carpetas Desacoplado:** `apps/web`, `apps/api`, `apps/workers/inference-worker`, `apps/workers/cron-worker`.
* [x] **Frontend Moderno:** React 18 + Vite + Zustand + Zod + TailwindCSS con estándares de diseño Emil Kowalski.
* [x] **Backend RESTful v1:** Express + Zod + Middleware de Seguridad + Error Handler + Response Util.
* [x] **5 Módulos de Producto Funcionales desde el Día 1:**
  1. *Explorar Ciudad & Radar de Eventos:* Búsqueda en tiempo real con Tavily API y generador de rutas.
  2. *Guía de Mudanza & Trámites:* Checklist interactivo y calculadora de instalación.
  3. *Mi Refrigerador & Recetas:* Escáner de cámara, dictado por voz y recetas anti-desperdicio.
  4. *Finanzas & Convivencia:* Splitter 50/50 y proporcional + TaskWheel de tareas.
  5. *Bóveda de Documentos & Salud:* Cifrado local AES-GCM y exportador de ficha de emergencia.
* [x] **Infraestructura Multi-Cloud:** Docker Compose, AWS SAM template y guía GCP Cloud Run + Cloudflare Pages.
* [x] **Handbook Completo (`docs/handbook/`):** `architecture.md`, `conventions.md`, `decisions.md`, `glossary.md`, `workflow.md`, `errors.md`.
* [x] **Comandos de Dominio:** `Makefile` desacoplado (`make web-*`, `make api-*`, `make inference-*`, `make cron-*`, `make all-*`).

---

### ⏳ FASE 2: Sincronización en Tiempo Real, PWA & Web Push (Siguiente Paso)

* [ ] **Sincronización en Tiempo Real entre Dispositivos:** WebSockets / Supabase Realtime para que 2 roomies o parejas vean actualizaciones instantáneas en el refrigerador y gastos.
* [ ] **PWA Instalable (Progressive Web App):** Manifest nativo, iconos de alta resolución y soporte completo offline.
* [ ] **Notificaciones Web Push Activas (VAPID):** Alertas push al sistema operativo sobre alimentos próximos a vencer.

---

### 🔮 FASE 3: Agentes Especializados de IA & Expansión Global (Futuro)

* [ ] **Agente Analizador de Contratos de Arrendamiento:** Análisis automático de PDFs de alquiler para detectar cláusulas abusivas.
* [ ] **Integración Open Banking / OCR Avance:** Sincronización automática de cuentas bancarias y recibos de supermercado.
* [ ] **Soporte Multilingüe Automático:** Detección de idioma y traducción automática para Expats globales (Español, Inglés, Portugués, Francés).

---

## 📋 Checklist de Verificación de Despliegue

```bash
# 1. Ejecutar pruebas locales
make all-build

# 2. Iniciar stack completo en contenedores
make all-start

# 3. Transmitir logs del sistema
make logs
```
