# 🏗️ Arquitectura del Monorepo — RoomIA

> **Estructura Monorepo impulsada por npm / pnpm workspaces**

```
roomIA/
├── apps/
│   ├── web/                     # Aplicación Web Frontend (Vite + HTML/CSS/JS)
│   ├── api/                     # Backend API Service (Node.js / Express Proxy)
│   └── workers/                 # Background Workers / Event Scrapers & Jobs
├── packages/
│   └── shared/                  # Constantes, DTOs y utilidades compartidas
├── docs/                        # Investigación, contexto del hackatón y diseño
│   ├── hackathon_context.md
│   ├── idea_research.md
│   └── architecture.md
├── package.json                 # Monorepo Root workspace configuration
├── README.md                    # Monorepo Documentation
├── .gitignore                   # Monorepo Global Gitignore
└── .env.example                 # Environment variable templates
```

---

## 📦 Descripción de Componentes

### 1. `apps/web` (Frontend Web App)
- SPA moderna construida con HTML5, CSS Vanilla (Dark Mode, Glassmorphism) y JS ESModules.
- Consume servicios de `apps/api` o directa integración cliente con APIs de navegador y Tavily Search.

### 2. `apps/api` (Backend API Microservice)
- Servidor Node.js / Express que actúa como proxy seguro para consultar **Tavily AI Search**, endpoints de **Qiro AI** y procesamiento de visión de ingredientes sin exponer claves en el cliente.

### 3. `apps/workers` (Background Jobs)
- Servicio en segundo plano para sincronización programada de eventos de la ciudad, notificaciones de vencimiento de alimentos y alertas presupuestarias.

### 4. `packages/shared` (Shared Package)
- Paquete interno con definiciones de ciudades, configuraciones por defecto y respuestas simuladas (*fallbacks*).
