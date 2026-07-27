# 🏠 RoomIA PRO — Tu Roomie Inteligente & Copiloto de Vida 🚀

![RoomIA Cover Banner](apps/web/public/assets/roomia_hero_3d.jpg)

> **Proyecto Oficial para el Hackatón de Inteligencia Artificial (Código Facilito & AWS 2026)**  
> **Autor:** [@jotive](https://github.com/jotive)  
> **Repositorio GitHub:** [https://github.com/jotive/lifepilot-ai](https://github.com/jotive/lifepilot-ai)  
> **🌐 Demo en Vivo (Enlace Público):** [https://hackathon-codigofacilito-2026jul.vercel.app](https://hackathon-codigofacilito-2026jul.vercel.app)  
> **🎬 Video de Presentación:** [Ver Video en YouTube / Loom](https://youtube.com) *(añadir tu enlace del video)*  
> **Reto Seleccionado:** 🌐 *Aplicaciones Web & Servicios Externos de IA*

---

## 🌟 Descripción General

**RoomIA PRO** es una aplicación web inteligente (PWA) de asistencia para la independencia, mudanzas y convivencia en el hogar. Diseñada para jóvenes profesionales, estudiantes y expatriados, RoomIA centraliza la exploración urbana en tiempo real, la gestión de despensa anti-desperdicio, la división equitativa de cuentas, el mantenimiento del hogar y la protección legal de contratos.

---

## 🚀 Arquitectura & Tecnologías Principales

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend SPA (React 18 + Vite)             │
│   Web Speech API • Web Crypto API • HTML5 Canvas • ServiceWorker│
└────────────────────────────────┬────────────────────────────────┘
                                 │ REST API v1 (/api/v1)
┌────────────────────────────────▼────────────────────────────────┐
│               Backend REST API (Node.js + Express)              │
│   Controller ➔ Service ➔ Repository ➔ Daily Cache ➔ Events DB  │
└───────┬────────────────────────┬────────────────────────┬───────┘
        │                        │                        │
┌───────▼──────┐         ┌───────▼──────┐         ┌───────▼──────┐
│  Google      │         │   Tavily AI  │         │ Persistent   │
│  Gemini AI   │         │  Search API  │         │ Events DB    │
└──────────────┘         └──────────────┘         └──────────────┘
```

### 🎨 Frontend (`apps/web`)
* **Core:** React 18 + Vite SPA con enrutamiento limpio en inglés (`/#/explorer`, `/#/finances`, `/#/kitchen`, `/#/vault`, `/#/relocation`, `/#/landing`, `/#/login`, `/#/signup`, `/#/profile`, `/#/settings`, `/#/404`).
* **Estado Global & Cuentas:** Zustand con persistencia en `localStorage` y soporte completo de inicio de sesión/registro de usuario con formulario split dual-panel.
* **Diseño & Estética:** Glassmorphism 3D Claymorphic, paletas Tailored HSL, fuentes Inter & Outfit de Google Fonts y dock de navegación flotante estilo iOS.
* **APIs del Navegador:**
  * **Web Speech API:** Dictado de voz para la despensa en tiempo real.
  * **Web Crypto API (`SHA-256`):** Firmado criptográfico y hashes de documentos.
  * **HTML5 Canvas:** Generador e identificador visual de la Ficha Médica de Emergencia descargable en PNG.
  * **HTML5 Drag & Drop:** Movimiento intuitivo de tareas en el tablero Kanban.

### ⚙️ Backend REST API (`apps/api`)
* **Arquitectura:** Express v1 RESTful Router estructurado en Controllers, Services y Repositories con Zod Validation y Error Handling.
* **Inferencia IA:** Integración directa con **Google Gemini AI** para recetas anti-desperdicio, escáner de visión de refrigerador e itinerarios urbanos.
* **Búsqueda en Vivo:** **Tavily AI Search API** para la cartelera urbana de eventos en vivo.
* **Servicio de Caché Diario & BD Persistente (`EventsDbRepository`):**
  * Sistema de caché en memoria RAM (< 5ms) y base de datos persistente en disco (`events_db.json`) para maximizar velocidad y optimizar consumo de créditos.

---

## 📦 Módulos Principales de RoomIA

### 1. 🧭 Radar Urbano & Ciudad (`/#/explorer`)
* Búsqueda en vivo de eventos culturales, gastronómicos y networking por ciudad (Bogotá, Ciudad de México, Madrid, Buenos Aires, Santiago, Lima, Medellín).
* Planificador con IA personalizado según el perfil del usuario (*Jose Tirado*, *María*, etc.) y modo de convivencia (*Solo Expat* vs *En Pareja*).
* Caché diario persistente en Base de Datos para respuestas ultrarrápidas.

### 2. 📦 Guía & Calculadora de Mudanza (`/#/relocation`)
* Checklist interactivo de trámites para recién llegados (visas, empadronamiento, servicios).
* Calculadora dinámica de gastos iniciales de instalación (renta, depósito, mudanza, servicios) ajustada a la moneda local (COP, MXN, EUR, ARS, CLP, PEN).
* Directorio de líneas de emergencia locales (*123, 911, 112*).

### 3. 🥗 Mi Refrigerador & Recetas Anti-Desperdicio (`/#/kitchen`)
* Escáner visual de ingredientes en el refrigerador alimentado por IA.
* Dictado de voz rápido con Web Speech API para agregar compras.
* Generador de recetas gourmet aprovechando exclusivamente los ingredientes disponibles para reducir el desperdicio de alimentos.

### 4. 📋 Finanzas Compartidas & Tablero de Tareas (`/#/finances`)
* **Splitter de Gastos:** División equitativa 50/50 y proporcional por ingresos, exportación a `.csv` y formateo numérico adaptativo sin centavos para **COP, CLP, ARS**.
* **Tablero Kanban de Tareas:** Organizado por columnas (*Por Hacer*, *En Proceso*, *Completado*) con arrastrar y soltar y asignación aleatoria equitativa.

### 5. 🛡️ Bóveda de Documentos & Ficha Médica (`/#/vault`)
* Almacenamiento seguro local cifrado con Web Crypto API.
* **Analizador Legal de Contratos de Alquiler:** Detección de cláusulas de riesgo, depósitos no reembolsables e inspecciones invasivas con alerta legal.
* Exportación de la Ficha Médica de Emergencia en **Imagen PNG de alta resolución** y enlace directo de compartición por **WhatsApp**.

---

## 🔧 Instalación y Ejecución Local

### 1. Clonar el Repositorio
```bash
git clone https://github.com/jotive/lifepilot-ai.git
cd lifepilot-ai
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno (`apps/api/.env`)
Crea un archivo `.env` dentro de `apps/api/`:
```env
PORT=4000
NODE_ENV=development
OPENAI_API_KEY=tu_clave_gemini_o_openai
TAVILY_API_KEY=tu_clave_tavily
```

### 4. Iniciar en Modo Desarrollo
```bash
# Terminal 1 — Backend Express API (Puerto 4000)
cd apps/api
npm run dev

# Terminal 2 — Frontend React Vite (Puerto 3005)
cd apps/web
npm run dev
```

Abre **`http://localhost:3005`** en tu navegador.

---

## ☁️ Despliegue en 1-Clic a la Nube (Hosting Gratuito)

El repositorio incluye archivos de configuración preconfigurados para publicar en la nube de forma 100% gratuita:

* **Vercel (`vercel.json`):**  
  Conecta el repositorio en [vercel.com/new](https://vercel.com/new) para desplegar el cliente Web y las Serverless Functions de la API en una sola URL pública HTTPS.
* **Render.com (`render.yaml`):**  
  Importa el proyecto como *Blueprint* en [dashboard.render.com](https://dashboard.render.com) para desplegar el servidor API REST, el cliente estático y el Background Worker en paralelo.

---

## 👨‍💻 Autor

Desarrollado con ❤️ por **[@jotive](https://github.com/jotive)** para el **Hackatón de Inteligencia Artificial 2026 (Código Facilito & AWS)**.

* **Licencia:** MIT  
* **Repositorio GitHub:** [https://github.com/jotive/lifepilot-ai](https://github.com/jotive/lifepilot-ai)
