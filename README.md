# 🏠 RoomIA — Tu Roomie Inteligente para la Vida Cotidiana, Relocalización y Parejas

> **Proyecto desarrollado para el Hackatón de IA con Qiro & AWS (organizado por Código Facilito y Amazon Web Services)**  
> **Categoría / Reto:** 🌐 Aplicaciones Web (Resolver problemas de la vida cotidiana)  
> **Participante:** jotive (Modalidad Individual)  
> **Arquitectura:** Monorepo Workspace (Web, API, Workers, Shared Packages & Docs)

---

## 🌟 Visión del Producto: RoomIA

**RoomIA** (haciendo alusión a un *Roomie* o compañero de hogar impulsado por IA) es un copiloto inteligente omnicanal diseñado para resolver el estrés, la fricción financiera y la desorganización cuando una persona se mudan solo a una nueva ciudad, o cuando una pareja/roomies se independiza.

---

## 🏗️ Estructura del Monorepo

```
roomIA/
├── apps/
│   ├── web/                     # 🌐 Aplicación Web Frontend (Vite + HTML5 / CSS Dark Mode / JS)
│   ├── api/                     # ⚡ Backend API Service (Express.js Proxy & Microservices)
│   └── workers/                 # ⚙️ Background Workers & Scheduled Jobs
├── packages/
│   └── shared/                  # 📦 Constantes, DTOs y utilidades compartidas (@roomia/shared)
├── docs/                        # 📑 Documentación & Investigación del Proyecto
│   ├── hackathon_context.md     # Reglas y entregables del Hackatón de Qiro & AWS
│   ├── idea_research.md         # Investigación y concepto de producto RoomIA
│   ├── architecture.md          # Especificaciones de la arquitectura monorepo
│   └── raw_context.txt          # Transcripción de la sesión de arranque
├── package.json                 # Configuración Root de npm workspaces
├── README.md                    # Documentación del Monorepo
├── .gitignore                   # Exclusiones de Git globales
└── .env.example                 # Plantilla de variables de entorno
```

---

## 🚀 Módulos Funcionales de RoomIA

### 🎟️ 1. Tavily City Explorer & Live Event Radar (`apps/web` + `apps/api`)
* **Eventos en Tiempo Real:** Integración con **Tavily AI Search API** para descubrir en vivo conciertos, festivales gastronómicos, eventos culturales y meetups en la ciudad.
* **Planificador de Fin de Semana Inteligente:** Algoritmo que genera itinerarios sugeridos adaptados al perfil (*Solo Expat* vs *Roomies / Pareja*).

### 🌆 2. Guía de Asentamiento & Trámites de Ciudad (Relocation Ops)
* **Roadmap por Fases:** Checklist interactivo desde la firma del contrato de alquiler hasta la contratación de servicios (luz, agua, internet, transporte público).
* **Calculadora de Instalación:** Estimador del costo total del Mes 1 (renta, depósito, servicios y alacena).
* **Directorio de Emergencias Locales:** Teléfonos de emergencia según la ciudad.

### 3. Refrigerador Inteligente & Recetas Anti-Desperdicio (Kitchen Ops)
* **Gestor de Alimentos & Dictado por Voz:** Permite agregar ingredientes mediante teclado o dictado por voz usando la **Web Speech API**.
* **Smart Meal Planner:** Genera recetas paso a paso utilizando únicamente los ingredientes disponibles para evitar desperdicios.

### 👩‍❤️‍👨 4. Control Financiero & Asignador de Tareas (Solo & Couple Ops)
* **Splitter de Gastos Compartidos:** Modos *Solo Expat* y *Roomies / Pareja*. Calcula balances y liquidación de deudas (*"Quién le debe a quién"*) de forma 50/50 o proporcional.
* **TaskWheel (Sorteo de Tareas del Hogar):** Asignador equitativo de tareas (cocina, limpieza, alacena) para convivencia armónica.

### 📄 5. Bóveda de Documentos & Tarjeta de Emergencia
* **Document Vault Local:** Guarda contratos de arrendamiento y recibos cifrados localmente en el navegador (`IndexedDB` / `LocalStorage`).
* **Ficha de Emergencia:** Exporta la tarjeta médica personal en formato de texto plano descargable.

---

## 🔒 Privacidad & Seguridad de Credenciales

En estricto cumplimiento de las instrucciones de seguridad del hackatón:
* **Ninguna API Key o credencial privada se encuentra en el repositorio.**
* Las API Keys (como **Tavily AI Search**) se configuran en el panel de **Ajustes** y se guardan exclusivamente en el `localStorage` del usuario o mediante variables de entorno en [.env.example](file:///F:/jotive/hackathon-codigofacilito-2026jul/.env.example).
* Se incluye una simulación inteligente con datos dinámicos como *fallback* si no se provee clave.

---

## 💻 Instrucciones para Ejecutar en Local

### 1. Clonar el repositorio e instalar dependencias monorepo
```bash
git clone https://github.com/jotive/lifepilot-ai.git
cd lifepilot-ai
npm install
```

### 2. Iniciar la aplicación Web (Frontend)
```bash
npm run dev
```
Abre en tu navegador `http://localhost:3000`.

### 3. (Opcional) Iniciar el Backend API o Workers
```bash
npm run dev:api       # Inicia Express API en http://localhost:4000
npm run dev:workers   # Inicia el Worker de segundo plano
```

### 4. Compilar para producción
```bash
npm run build
```

---

## 📑 Documentación del Proyecto (`/docs`)

Toda la investigación, contexto del hackatón y diseño arquitectónico se encuentra preservado en la carpeta `docs/`:
* [docs/hackathon_context.md](file:///F:/jotive/hackathon-codigofacilito-2026jul/docs/hackathon_context.md): Reglas del hackatón Qiro & AWS.
* [docs/idea_research.md](file:///F:/jotive/hackathon-codigofacilito-2026jul/docs/idea_research.md): Investigación de la idea RoomIA.
* [docs/architecture.md](file:///F:/jotive/hackathon-codigofacilito-2026jul/docs/architecture.md): Detalles del Monorepo.

---

## 📽️ Entregables del Hackatón

* **Repositorio Público GitHub:** [https://github.com/jotive/lifepilot-ai](https://github.com/jotive/lifepilot-ai)
* **Demo en Línea (Live App):** *(URL de despliegue)*
* **Video de Presentación (5 min):** *(Enlace al video demo funcional)*
