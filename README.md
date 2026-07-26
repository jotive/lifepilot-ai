# 🏠 RoomIA PRO — Tu Roomie Inteligente & Copiloto de Vida

> **Proyecto Oficial para el Hackatón de Inteligencia Artificial (Código Facilito & AWS 2026)**  
> **Autor:** [@jotive](https://github.com/jotive)  
> **Repositorio:** [https://github.com/jotive/lifepilot-ai](https://github.com/jotive/lifepilot-ai)

---

## 🌟 Descripción General

**RoomIA PRO** es una aplicación web progresiva (PWA) de asistencia inteligente para la independencia, mudanzas y convivencia en el hogar. Ayuda a jóvenes profesionales, estudiantes y expatriados a desenvolverse en nuevas ciudades, gestionar la despensa sin desperdicio, dividir cuentas equitativamente y resguardar contratos con seguridad.

---

## 🚀 Arquitectura & Tech Stack Real

### 🎨 Frontend (`apps/web`)
* **Core:** React 18 (Vite SPA & PWA Service Worker)
* **Estado Global:** Zustand con persistencia en `localStorage`
* **Estilos:** Vanilla CSS 3D Claymorphic Design System, Micro-animaciones y Responsive Dock Móvil estilo iOS
* **Exportación & Multimedia:** HTML5 Canvas (Generador de Tarjetas PNG) & Web Speech API (Dictado por Voz)
* **Cifrado Local:** Web Crypto API (`SHA-256` digest hashing para Bóveda de Documentos)

### ⚙️ Backend REST API (`apps/api`)
* **Runtime:** Node.js & Express v1 RESTful Router en capas (Controllers, Services, Utilities)
* **Inferencia IA Multi-Proveedor:** Integración directa con **OpenAI (GPT-4o-mini)**, **Groq (Llama-3)** y **Anthropic (Claude)** con sistema de fallback automático local.
* **Búsqueda en Vivo:** **Tavily Event Search API** para el Radar Urbano en tiempo real.

---

## 📦 Módulos Principales de la Aplicación

1. **🚀 Radar Urbano & Ciudad (`/#/explorer`):**  
   Búsqueda de eventos en vivo conectada a Tavily API, categorización por intereses y generador de itinerarios personalizados de fin de semana con IA.

2. **📦 Guía & Calculadora de Mudanza (`/#/relocation`):**  
   Checklist de trámites iniciales y simulador de costos iniciales (renta, depósito, servicios) adaptado a la moneda local de la ciudad seleccionada, junto con directorio de emergencias locales (*911, 123, 112*).

3. **🥗 Mi Refrigerador & Recetas Anti-Desperdicio (`/#/kitchen`):**  
   Inventario de alacena con escaneo simulado por cámara, dictado por voz y generador de recetas de cocina aprovechando ingredientes existentes.

4. **📋 Finanzas Compartidas & Organizador de Tareas (`/#/finances`):**  
   * **Organizador de Tareas:** Tablero con arrastrar y soltar (Drag & Drop), asignación de responsables y sorteo equitativo con IA.  
   * **Registro de Gastos:** División de compras 50/50, exportación real a ficheros `.csv` y formateo sin centavos adaptativo para **COP, CLP, ARS**.

5. **🛡️ Bóveda de Documentos & Tarjeta Médica (`/#/vault`):**  
   Almacenamiento seguro local cifrado con Web Crypto API, analizador de contratos de alquiler y exportación de la Ficha Médica de Emergencia en **Imagen PNG de alta resolución** y enlace directo para **WhatsApp**.

---

## 🔧 Instalación y Ejecución Local

### 1. Clonar e Instalar Dependencias
```bash
git clone https://github.com/jotive/lifepilot-ai.git
cd lifepilot-ai
npm install
```

### 2. Configurar Variables de Entorno (`apps/api/.env`)
Crea el archivo `.env` dentro de `apps/api/`:
```env
PORT=4000
NODE_ENV=development
GROQ_API_KEY=tu_clave_groq
TAVILY_API_KEY=tu_clave_tavily
OPENROUTER_TOKEN1=tu_clave_openrouter
```

### 3. Iniciar Backend API y Web Frontend
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

## 📜 Licencia
Proyecto desarrollado para el **Hackatón de IA 2026** por **jotive**. Licencia MIT.
