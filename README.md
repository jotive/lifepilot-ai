# 🧭 LifePilot AI — Copiloto de Vida Cotidiana, Relocalización y Convivencia

> **Proyecto desarrollado para el Hackatón de IA con Qiro & AWS (organizado por Código Facilito y Amazon Web Services)**  
> **Categoría / Reto:** 🌐 Aplicaciones Web (Resolver problemas de la vida cotidiana)  
> **Participante:** jotive (Modalidad Individual)

---

## 🌟 Descripción General

**LifePilot AI** es una aplicación web integral y densa en utilidad diseñada para resolver uno de los momentos de mayor desorganización, estrés y gasto financiero en la vida diaria: **relocalizarse en una nueva ciudad, independizarse o iniciar la convivencia en pareja/individual**.

La plataforma actúa como un copiloto ejecutivo para el hogar y la vida social, combinando **búsquedas en tiempo real con Tavily AI Search**, procesamiento de imágenes/voz para la cocina anti-desperdicio, control presupuestario transparente y una bóveda segura de documentos personales.

---

## 🚀 Módulos Principales & Funcionalidades

### 🎟️ 1. Tavily City Explorer & Live Event Radar
* **Eventos en Tiempo Real:** Integración directa con **Tavily AI Search API** para descubrir en vivo conciertos, festivales gastronómicos, eventos culturales, meetups tech y actividades al aire libre en la ciudad seleccionada.
* **Planificador de Fin de Semana Inteligente:** Algoritmo que genera itinerarios sugeridos adaptados al perfil seleccionado (Individual vs Pareja).

### 🌆 2. Guía de Asentamiento & Trámites de Ciudad (Relocation Ops)
* **Roadmap por Fases:** Checklist interactivo desde la firma del contrato de alquiler hasta la contratación de servicios (luz, agua, internet, tarjeta de transporte público y centros de salud).
* **Calculadora de Costos de Instalación:** Estimador en tiempo real de la inversión necesaria para el Mes 1 (renta, depósito, servicios y alacena inicial).
* **Directorio de Emergencias Locales:** Acceso rápido a números de emergencia (911, salud 24h, bomberos) según la ciudad.

### 🧊 3. Refrigerador Inteligente & Recetas Anti-Desperdicio (Kitchen Ops)
* **Gestor de Alimentos & Dictado por Voz:** Permite agregar ingredientes mediante escaneo visual, teclado o dictado por voz usando la **Web Speech API** del navegador.
* **Smart Meal Planner:** Genera recetas rápidas y nutritivas paso a paso utilizando únicamente los ingredientes disponibles para evitar desperdicio de comida y gastos innecesarios.

### 👩‍❤️‍👨 4. Control Financiero & Asignador de Tareas (Solo & Couple Ops)
* **Splitter de Gastos Compartidos:** Modos *Individual* y *Pareja*. Calcula balances y liquidación de deudas (*"Quién le debe a quién"*) de forma equitativa (50/50) o proporcional.
* **TaskWheel (Organizador de Convivencia):** Asignador aleatorio y equitativo de tareas del hogar (cocina, limpieza, alacena) para evitar fricciones de convivencia.

### 📄 5. Bóveda de Documentos & Tarjeta de Emergencia
* **Document Vault Local:** Guarda contratos de arrendamiento, identificaciones y recibos cifrados localmente en el navegador (`IndexedDB` / `LocalStorage`).
* **Ficha de Salud y Emergencia:** Exporta un documento de texto plano o imprimible con tipo de sangre, alergias, dirección actual y contacto de emergencia local.

---

## 🔒 Privacidad & Seguridad de Credenciales

En estricto cumplimiento de las mejores prácticas de seguridad e instrucciones del hackatón:
* **Ninguna API Key o credencial sensible se encuentra en el repositorio.**
* Las API Keys (como **Tavily AI Search**) se pueden configurar en tiempo de ejecución a través del panel de **Ajustes** de la aplicación web y se almacenan exclusivamente en el `localStorage` del navegador del usuario.
* Se incluye una simulación inteligente con datos dinámicos como *fallback* en caso de no proveer una clave de API.
* Se incluyen los archivos [.gitignore](file:///F:/jotive/hackathon-codigofacilito-2026jul/.gitignore) y [.env.example](file:///F:/jotive/hackathon-codigofacilito-2026jul/.env.example) para evitar cualquier filtración involuntaria.

---

## 🛠️ Tecnologías y APIs Utilizadas

* **Frontend:** HTML5 Semántico, CSS3 Vanilla (Sistema de diseño moderno, Dark Mode, Glassmorphism, CSS Grid & Custom Properties).
* **JavaScript / Engine:** JavaScript Moderno (ESModules) alimentado por **Vite**.
* **APIs de IA & Búsqueda:** **Tavily AI Search API** (Búsquedas web en tiempo real) + Simulador Qiro AI.
* **APIs del Navegador:** `Web Speech API` (Dictado por voz), `MediaDevices` / File API (Subida de documentos y fotos), `LocalStorage` / `IndexedDB` (Persistencia de datos del usuario).
* **Iconografía & Tipografía:** FontAwesome 6 + Google Fonts (*Outfit* y *Plus Jakarta Sans*).

---

## 💻 Instrucciones para Ejecutar en Local

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone https://github.com/jotive/lifepilot-ai.git
cd lifepilot-ai
npm install
```

### 2. (Opcional) Configurar variables de entorno
Copia el archivo de plantilla `.env.example` a `.env` si deseas establecer tu clave de Tavily desde el entorno:
```bash
cp .env.example .env
```

### 3. Iniciar servidor de desarrollo
```bash
npm run dev
```
Abre tu navegador en `http://localhost:3000`.

### 4. Compilar para producción
```bash
npm run build
```

---

## 📽️ Entregables del Hackatón

* **Repositorio Público GitHub:** [https://github.com/jotive/lifepilot-ai](https://github.com/jotive/lifepilot-ai)
* **Demo en Línea (Live App):** *(URL de despliegue en Vercel/Netlify)*
* **Video de Presentación (5 min):** *(Enlace al video demo funcional)*

---

## 👏 Agradecimientos

Agradecimiento especial a **Código Facilito**, **AWS (Amazon Web Services)** y **Qiro AI** por la organización de este Hackatón.
