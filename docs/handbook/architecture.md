# 📐 Handbook: Architecture (Arquitectura & Estructura)

> **Proyecto:** RoomIA  
> **Patrón:** Layered Architecture & Microservices Decoupling (Frontend, REST API, Inference Worker, Cron Worker)

---

## 🛠️ Desacoplamiento de Servicios & Workers

```
                               ┌─────────────────────────┐
                               │   apps/web (Frontend)   │
                               │  React 18 + Zustand     │
                               └────────────┬────────────┘
                                            │ REST API v1
                               ┌────────────▼────────────┐
                               │    apps/api (Backend)   │
                               │    Express & Zod API    │
                               └──────┬────────────┬─────┘
                                      │            │
             ┌────────────────────────┘            └────────────────────────┐
             │                                                              │
┌────────────▼──────────────────────────┐      ┌────────────────────────────▼────────────┐
│ apps/workers/inference-worker         │      │ apps/workers/cron-worker                │
│ AI Vision & OCR Heavy Inference       │      │ Scheduled Jobs & Pantry Expire Alerts   │
└───────────────────────────────────────┘      └─────────────────────────────────────────┘
```

### 1. `apps/web` (Frontend React)
- SPA moderna construida con React 18, Vite, Zustand, Zod y TailwindCSS.

### 2. `apps/api` (Backend Express RESTful v1)
- Servidor Express estructurado por capas (`config`, `repositories`, `services`, `controllers`, `routes`, `schemas`, `middlewares`, `utils`).

### 3. `apps/workers/inference-worker` (Worker de Inferencia & Visión IA)
- Servicio independiente especializado en el procesamiento pesado asíncrono de Visión por Computadora (fotos de refrigerador) e inferencia OCR de recibos.
- Desplegable como microservicio dedicado o función Serverless (AWS Lambda / GCP Cloud Run).

### 4. `apps/workers/cron-worker` (Worker de Tareas Programadas)
- Proceso programado responsable del escaneo periódico de alimentos en alacena próximos a vencer y caché de eventos culturales en la ciudad.

---

## 📂 Estructura Completa de Carpetas

```
roomIA/
├── apps/
│   ├── web/                         # React 18 + Vite Frontend App
│   ├── api/                         # Layered RESTful Express API
│   └── workers/
│       ├── inference-worker/        # Dedicated AI Vision & OCR Worker
│       └── cron-worker/             # Scheduled Background Jobs Worker
├── infra/                           # Docker Compose, AWS SAM, GCP Configs
├── docs/                            # Handbook & Architecture Guides
├── Makefile                         # Domain-oriented Automation
└── README.md
```
