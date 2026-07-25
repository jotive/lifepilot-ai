# 📐 Handbook: Architecture (Arquitectura & Estructura)

> **Proyecto:** RoomIA  
> **Patrón:** Layered Architecture (Separación de Responsabilidades: Config, Repositories, Services, Controllers, Routes)

---

## 🛠️ Capas de Arquitectura (Separation of Concerns)

Every module follows clean separation of concerns:

```
[Presentation Layer] -> [Controllers / UI] -> [Services (Business Logic)] -> [Repositories (Data Access)] -> [Config / Settings]
```

### 1. `config/` & `settings/`
- Encapsula constantes globales, claves de entorno y parámetros de la aplicación.
- Archivos: `config/constants.js`, `config/settings.js`.

### 2. `repositories/` (Capa de Acceso a Datos / APIs)
- Abstrae llamadas a APIs externas (Tavily, Vision LLMs) y persistencia (`LocalStorage`, `IndexedDB`).
- Archivos: `repositories/tavily.repository.js`.

### 3. `services/` (Capa de Lógica de Negocio)
- Contiene reglas de negocio, cálculo de presupuestos, motores de liquidación de deudas y formateo de datos.
- Archivos: `services/search.service.js`, `services/vision.service.js`.

### 4. `controllers/` & `routes/` (Capa de Presentación / API)
- Maneja peticiones HTTP, validaciones de entrada y respuestas JSON.
- Archivos: `controllers/search.controller.js`, `controllers/vision.controller.js`, `routes/index.js`.

---

## 📂 Estructura Limpia del Repositorio

```
roomIA/
├── apps/
│   ├── web/                     # Frontend Application
│   ├── api/                     # Layered Backend API (config, repositories, services, controllers, routes)
│   └── workers/                 # Background Worker
├── infra/                       # Infrastructure IaC (AWS SAM, Docker, GCP)
├── docs/                        # Handbook & Research
├── .env.example
├── .gitignore
└── README.md
```
