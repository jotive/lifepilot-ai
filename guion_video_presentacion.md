# 🎬 Guión de Presentación de Video (~5 min) — RoomIA PRO

> **Hackatón:** Hackatón de IA con Kiro & AWS (Código Facilito & AWS 2026)  
> **Presentador:** Jose Tirado  
> **Proyecto:** RoomIA PRO — Tu Roomie Inteligente & Copiloto de Vida  
> **Tiempo Total:** 4:30 a 5:00 minutos  
> **🌐 URL Demo Pública (Live Demo):** `https://hackathon-codigofacilito-2026jul.vercel.app`  
> **🎬 Enlace del Video Publicado:** `[Añadir enlace público de YouTube / Loom / Drive aquí]`  
> **📦 Repositorio GitHub:** [https://github.com/jotive/lifepilot-ai](https://github.com/jotive/lifepilot-ai)  

---

## ⏱️ TABLA RÁPIDA DE TIEMPOS

| Minuto | Sección | Lo que Muestras |
| :--- | :--- | :--- |
| **0:00 - 0:45** | **1. Introducción & Problema** | Landing / Vista principal de RoomIA PRO |
| **0:45 - 1:45** | **2. Radar Urbano & Mudanza** | `/#/explorer` (Eventos + Planificador IA) y `/#/relocation` (Calculadora + Trámites) |
| **1:45 - 2:45** | **3. Refrigerador IA & Recetas** | `/#/kitchen` (Dictado voz + Escáner Gemini + Recetas Anti-Desperdicio) |
| **2:45 - 3:45** | **4. Finanzas, Kanban & Bóveda** | `/#/finances` (Splitter + Kanban) y `/#/vault` (Contratos + Ficha Médica PNG) |
| **3:45 - 4:50** | **5. Arquitectura & Cierre** | Código en VS Code / GitHub Repo (`github.com/jotive/lifepilot-ai`) |

---

## 🎙️ GUIÓN HABLADO PASO A PASO

### 🎬 ESCENA 1: Introducción & Problema (0:00 - 0:45)
* 🖥️ **Muestra en pantalla:** Vista principal de RoomIA PRO (`http://localhost:3005`).

🗣️ **Dí esto:**
> "Hola a todos y bienvenidos a la presentación de **RoomIA PRO**, nuestro proyecto desarrollado para el Hackatón de Inteligencia Artificial de Código Facilito y AWS.
> 
> Independizarse, mudarse a una nueva ciudad o convivir en pareja o con roomies suele ser un proceso caótico: desinformación sobre la ciudad, desperdicio constante de alimentos, desacuerdos en la división de cuentas y el riesgo de firmar contratos de alquiler con cláusulas abusivas.
> 
> Por eso creamos **RoomIA PRO**: el primer copiloto de vida e independencia inteligente que centraliza la exploración urbana, automatiza la alacena, garantiza la equidad financiera y protege la seguridad legal y médica del usuario directamente desde el navegador."

---

### 🎬 ESCENA 2: Radar Urbano & Guía de Mudanza (0:45 - 1:45)
* 🖥️ **Muestra en pantalla:** Pestaña **Explorar Ciudad** (`/#/explorer`), presiona `Planificar con IA`. Luego pasa a **Mudanza & Trámites** (`/#/relocation`).

🗣️ **Dí esto:**
> "Comenzamos en el **Radar Urbano de Eventos**. Aquí el usuario selecciona su ciudad actual, por ejemplo Bogotá, y RoomIA consulta en tiempo real eventos culturales, gastronómicos y networking mediante **Tavily AI Search**.
> Al presionar **'Planificar con IA'**, la Inteligencia Artificial genera un itinerario personalizado según el perfil del usuario y su modo de convivencia, ya sea Solo Expat o En Pareja.
> 
> Además, en la **Guía de Mudanza**, los recién llegados cuentan con un checklist interactivo de trámites obligatorios, teléfonos de emergencia locales y una calculadora dinámica de instalación ajustada a la moneda local de la ciudad en tiempo real."

---

### 🎬 ESCENA 3: Refrigerador IA, Dictado por Voz & Recetas (1:45 - 2:45)
* 🖥️ **Muestra en pantalla:** Pestaña **Mi Refrigerador** (`/#/kitchen`), presiona `🎙️ Dictar Ingrediente` y luego `Generar Recetas Anti-Desperdicio`.

🗣️ **Dí esto:**
> "Pasamos al módulo de **Mi Refrigerador & Recetas Anti-Desperdicio**. Para resolver la frustración de no saber qué cocinar y evitar tirar comida, el usuario puede ingresar sus compras mediante **dictado por voz en tiempo real con Web Speech API** o usando la cámara para el escáner visual impulsado por **Google Gemini AI**.
> 
> Al presionar **'Generar Recetas'**, nuestra IA analiza exclusivamente los ingredientes disponibles en la alacena y crea recetas gourmet paso a paso para aprovechar cada alimento al máximo."

---

### 🎬 ESCENA 4: Finanzas Compartidas, Kanban & Bóveda Criptográfica (2:45 - 3:45)
* 🖥️ **Muestra en pantalla:** Pestaña **Finanzas & Convivencia** (`/#/finances`) para el splitter y tablero Kanban. Luego pasa a **Bóveda & Salud** (`/#/vault`) para el analizador legal y Ficha Médica PNG.

🗣️ **Dí esto:**
> "En el módulo de **Finanzas Compartidas**, eliminamos la fricción monetaria. RoomIA calcula automáticamente la división de cuentas al 50/50 o proporcional por ingresos, exporta reportes en CSV y formatea cifras en monedas locales como Pesos Colombianos sin centavos innecesarios. Junto al organizador financiero, incluimos un tablero **Kanban de Tareas del Hogar** con asignación equitativa.
> 
> Por último, en la **Bóveda de Documentos**, implementamos cifrado local criptográfico con **Web Crypto API (SHA-256)**, un **Analizador Legal de Contratos de Arrendamiento** que detecta depósitos abusivos o cláusulas de riesgo, y la exportación instantánea de la **Ficha Médica de Emergencia en PNG** de alta resolución lista para compartir por WhatsApp."

---

### 🎬 ESCENA 5: Arquitectura Técnica, APIs & Cierre (3:45 - 4:50)
* 🖥️ **Muestra en pantalla:** Repositorio en GitHub (`github.com/jotive/lifepilot-ai`) o tu editor de código.

🗣️ **Dí esto:**
> "A nivel técnico, RoomIA fue construida con una arquitectura monorepo desacoplada: React 18 con Zustand en el frontend y un servidor REST API v1 en Node.js Express.
> Para garantizar el máximo rendimiento, desarrollamos un **Servicio de Caché Diario por Ciudad y Base de Datos Persistente (EventsDbRepository)** que responde consultas en menos de 5 milisegundos y optimiza el consumo de créditos.
> 
> La aplicación está lista para producción, cuenta con pruebas automatizadas en backend y configuraciones de despliegue en 1 clic para **Vercel** y **Render**.
> 
> Muchas gracias al equipo de **Código Facilito** y **AWS** por esta increíble experiencia. ¡Esperamos que les guste RoomIA PRO!"

---

## 📌 CONSEJOS DE GRABACIÓN
* 🎙️ Usa audífonos o micrófono cercano.
* 🖥️ Graba en formato 16:9 con la pantalla al 100% de zoom.
* ⏱️ Si te pasas unos segundos, no te preocupes: mantén un ritmo fluido y entusiasta.
