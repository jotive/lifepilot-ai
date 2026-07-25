# 🏠 RoomIA — Tu Roomie Inteligente para la Vida Cotidiana, Relocalización y Parejas

> **Proyecto desarrollado para el Hackatón de IA con Qiro & AWS (organizado por Código Facilito y Amazon Web Services)**  
> **Categoría / Reto:** 🌐 Aplicaciones Web (Resolver problemas de la vida cotidiana)  
> **Participante:** jotive (Modalidad Individual)  
> **Estructura:** Repositorio Multi-Carpeta (Apps independientes, Infraestructura AWS y Documentación)

---

## 🌟 Visión del Producto: RoomIA

**RoomIA** (haciendo alusión a un *Roomie* o compañero de hogar impulsado por IA) es un copiloto inteligente diseñado para resolver el estrés, la fricción financiera y la desorganización cuando una persona se muda a una nueva ciudad, o cuando una pareja/roomies se independiza.

---

## 📂 Estructura Limpia del Repositorio

```
roomIA/
├── apps/                        # 🚀 Aplicaciones y Servicios independientes
│   ├── web/                     # Frontend SPA (Vite + HTML/CSS Dark Mode / JS)
│   ├── api/                     # Backend API Service (Express.js Proxy para Tavily)
│   └── workers/                 # Background Worker (Crons en segundo plano)
├── infra/                       # ☁️ Infraestructura & Despliegue AWS / Docker
│   ├── aws/                     # Plantilla AWS SAM / CloudFormation (S3 + CloudFront + Lambda)
│   └── docker/                  # Dockerfile.web, Dockerfile.api y docker-compose.yml
├── docs/                        # 📑 Investigación & Contexto
│   ├── hackathon_context.md     # Reglas y entregables del Hackatón de Qiro & AWS
│   ├── idea_research.md         # Investigación del concepto de producto RoomIA
│   ├── architecture.md          # Especificaciones de la estructura del repositorio
│   └── raw_context.txt          # Transcripción del Kickoff
├── .env.example                 # Plantilla de variables de entorno
├── .gitignore                   # Exclusiones de Git
└── README.md                    # Documentación principal del repositorio
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

### 🧊 3. Refrigerador Inteligente & Recetas Anti-Desperdicio (Kitchen Ops)
* **Gestor de Alimentos & Dictado por Voz:** Permite agregar ingredientes mediante teclado o dictado por voz usando la **Web Speech API**.
* **Smart Meal Planner:** Genera recetas paso a paso utilizando únicamente los ingredientes disponibles para evitar desperdicios.

### 👩‍❤️‍👨 4. Control Financiero & Asignador de Tareas (Solo & Couple Ops)
* **Splitter de Gastos Compartidos:** Modos *Solo Expat* y *Roomies / Pareja*. Calcula balances y liquidación de deudas (*"Quién le debe a quién"*) de forma 50/50 o proporcional.
* **TaskWheel (Sorteo de Tareas del Hogar):** Asignador equitativo de tareas (cocina, limpieza, alacena) para convivencia armónica.

### 📄 5. Bóveda de Documentos & Tarjeta de Emergencia
* **Document Vault Local:** Guarda contratos de arrendamiento y recibos cifrados localmente en el navegador (`IndexedDB` / `LocalStorage`).
* **Ficha de Emergencia:** Exporta la tarjeta médica personal en formato de texto plano descargable.

---

## 💻 Instrucciones para Ejecutar en Local

### 1. Aplicación Web Frontend (`apps/web`)
```bash
cd apps/web
npm install
npm run dev
```
Abre en tu navegador `http://localhost:3000`.

### 2. Backend API (`apps/api`)
```bash
cd apps/api
npm install
npm run start
```

---

## 📽️ Entregables del Hackatón

* **Repositorio Público GitHub:** [https://github.com/jotive/lifepilot-ai](https://github.com/jotive/lifepilot-ai)
* **Demo en Línea (Live App):** *(URL de despliegue)*
* **Video de Presentación (5 min):** *(Enlace al video demo funcional)*
