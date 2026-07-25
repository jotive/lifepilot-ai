# 📐 Handbook: Architecture (Arquitectura & Estructura)

> **Proyecto:** RoomIA  
> **Fecha de Actualización:** 2026-07-25  

---

## 🛠️ Tech Stack & Tecnologías Principales

| Capa | Tecnología / Herramientas | Justificación |
| :--- | :--- | :--- |
| **Frontend Web** | HTML5 + Vanilla CSS (Dark Mode) + ESModules | Ligero, cero complejidad de compilación, carga instantánea |
| **Tooling & Bundler** | Vite (v5.4+) | HMR ultra-rápido y compilación optimizada en `apps/web/dist` |
| **APIs Externas** | Tavily AI Search API + Web Speech API (Browser) | Búsqueda en vivo de eventos y dictado por voz de almacén |
| **Backend Service** | Node.js + Express.js | Proxy seguro para API keys y endpoints de IA |
| **Infraestructura IaC** | AWS SAM / CloudFormation + Docker / Docker Compose | Despliegue listo para S3, CloudFront y AWS Lambda |

---

## 📂 Mapa de Carpetas y Responsabilidades

```
lifepilot-ai/
├── apps/                        # Aplicaciones ejecutables e independientes
│   ├── web/                     # Frontend SPA principal
│   ├── api/                     # Microservicio backend Express / Proxy
│   └── workers/                 # Jobs en segundo plano (crons / notificaciones)
├── infra/                       # Infraestructura de Despliegue
│   ├── aws/                     # Plantilla SAM CloudFormation (S3 + Lambda + CloudFront)
│   └── docker/                  # Dockerfiles y docker-compose.yml
├── docs/                        # Documentación general e investigación
│   └── handbook/                # 📘 Base de conocimiento del proyecto (Handbook)
│       ├── architecture.md      # Estructura, stack, flujos
│       ├── conventions.md       # Estilo, naming, patrones
│       ├── decisions.md         # Registro de decisiones (ADRs)
│       ├── glossary.md          # Términos y entidades
│       ├── workflow.md           # Checklist y proceso de deploy
│       └── errors.md            # Registro de errores conocidos y soluciones
├── .env.example                 # Variables de entorno
├── .gitignore                   # Exclusiones de control de versiones
└── README.md                    # Manual de inicio del repositorio
```

---

## 🔄 Flujos de Datos Principales

1. **Radar de Eventos (Tavily AI Search):**
   `Usuario (UI) -> Input / Filtro -> app.js / API Proxy -> Tavily API -> Renderizado de Tarjetas + Planificador`.
2. **Escáner de Refrigerador & Recetas:**
   `Micrófono / Entrada de Voz (Web Speech API) -> Array de Ingredientes -> LocalStorage -> Generador de Recetas Anti-desperdicio`.
3. **División de Gastos Compartidos:**
   `Formulario de Gasto -> Math Engine de Liquidación -> Renderizado de Balance 50/50 o Proporcional`.

---

## 🚫 Lo que NO existe en este proyecto

* **No existe estado global pesado (Redux/Zustand):** Se utiliza `LocalStorage` y `IndexedDB` nativos para máxima velocidad.
* **No hay credenciales en el cliente ni en Git:** Todo se configura dinámicamente o vía `.env.example`.
* **No hay frameworks de CSS pesados (Tailwind/Bootstrap):** Se utiliza Vanilla CSS con tokens de diseño personalizados.
