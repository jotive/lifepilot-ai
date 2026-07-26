# 🏗️ Arquitectura de la Solución — RoomIA Monorepo

> **Estructura separada por Aplicaciones, Paquetes Compartidos e Infraestructura de Despliegue**

```
roomIA/
├── apps/                        # 🚀 Aplicaciones del Sistema
│   ├── web/                     # Frontend Web App (Vite + HTML/CSS/JS)
│   ├── api/                     # Microservicio Backend Express / Proxy API
│   └── workers/                 # Background Jobs / Workers en segundo plano
├── packages/                    # 📦 Paquetes y Librerías Compartidas
│   └── shared/                  # DTOs, constantes y utilidades (@roomia/shared)
├── infra/                       # ☁️ Infraestructura & Despliegue AWS / Docker
│   ├── aws/                     # AWS SAM / CloudFormation Template (S3 + CloudFront + Lambda)
│   └── docker/                  # Dockerfile.web, Dockerfile.api y docker-compose.yml
├── docs/                        # 📑 Documentación e Investigación
│   ├── hackathon_context.md
│   ├── idea_research.md
│   └── architecture.md
├── package.json                 # Monorepo Workspaces root
├── README.md                    # Monorepo Documentation
├── .gitignore                   # Global Gitignore
└── .env.example                 # Environment Templates
```

---

## 📦 Separación de Responsabilidades

1. **`apps/web`:** Aplicación Single-Page (SPA) del usuario final. Compila sus artefactos de producción de manera aislada en `apps/web/dist`.
2. **`apps/api`:** Servidor Express para consumo seguro de APIs (Tavily AI Search, OpenAI Vision & Chat).
3. **`apps/workers`:** Proceso desacoplado para cron-jobs (notificaciones de caducidad y escrutinio de eventos).
4. **`packages/shared`:** Módulo reutilizable de definiciones, ciudades soportadas y plantillas.
5. **`infra/`:** Toda la infraestructura declarativa para AWS (CloudFormation / S3 / Lambda / CloudFront) y contenedores Docker / Docker Compose.
