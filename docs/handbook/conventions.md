# 🎨 Handbook: Conventions (Estilo, Naming, Patrones & Taste)

> **Proyecto:** RoomIA  
> **Estándares:** Taste & Impeccable Design (Inspirado en Emil Kowalski & Clean Architecture Standards)

---

## 🚫 Código Semántico y Auto-Documentado (Evitar Comentarios y Docstrings)

1. **Sin Comentarios Redundantes ni Docstrings:**
   * El código debe ser 100% semántico y auto-explicativo. Evitar bloques de comentarios en línea, docstrings o aclaraciones obvias.
   * Si un bloque requiere un comentario para entenderse, debe refactorizarse en variables o funciones con nombres expresivos que hagan el comentario innecesario.

2. **Código en Inglés (English Code Standard):**
   * Todo el código interno (nombres de variables, funciones, clases, constantes, archivos y logs de terminal) debe estar escrito estrictamente en **Inglés**.
   * El texto orientado al usuario final (etiquetas de UI, botones, notificaciones) se mantiene en el idioma del usuario (Español).

---

## 🛠️ Principio de Automatización por Parte del Producto

1. **Comandos Organizados por Componente del Producto (`component-action`):**
   * El `Makefile` organiza sus objetivos explícitamente **por cada parte del producto** (`web`, `api`, `workers`, `all`):
     * `make web-dev`, `make web-build`, `make web-start`
     * `make api-dev`, `make api-build`, `make api-start`
     * `make workers-dev`, `make workers-build`, `make workers-start`
     * `make all-dev`, `make all-build`, `make all-start`, `make all-stop`
   * Esto permite a los desarrolladores operar o desplegar cualquier parte del producto de forma independiente o todo el stack unificado.

---

## 🎨 Principios de Diseño & Taste (Impeccable Design Standards)

1. **Micro-interacciones y Animaciones Fluidas:**
   * Toda interacción (hover, click, tab-switch, modal) debe responder con transiciones suavizadas mediante `cubic-bezier(0.4, 0, 0.2, 1)`.
   * Los botones tienen retroalimentación visual inmediata con transformaciones sutiles (`translateY(-2px)`, elevación de sombra de neón y cambio de borde glow).

2. **Tipografía Jerárquica y Legibilidad:**
   * Títulos: `Outfit` (sans-serif geométrica con personalidad para encabezados).
   * Cuerpo de texto: `Plus Jakarta Sans` (excelente legibilidad en pantallas oscuras).
   * Uso estricto de contrastes con la escala WCAG AAA.

3. **Gama Cromática Integrada (Dark Mode Premium):**
   * Fondo base: `#0b0f19` (Noche profunda) con gradientes radiales suaves en las esquinas.
   * Paneles / Tarjetas: Glassmorphic `rgba(31, 41, 55, 0.7)` con `backdrop-filter: blur(16px)`.
   * Colores de acento:
     * Primario (Acción / Marca): Indigo `#6366f1` / Violeta `#8b5cf6`
     * Éxito / Ahorro: Esmeralda `#10b981`
     * Alertas / Emergencia: Rosa Crimson `#f43f5e`
     * Información / Ciudad: Cyan `#06b6d4`

---

## 🏷️ Convenciones de Naming (Nomenclatura)

* **Archivos HTML / CSS / JS:** `kebab-case` o `lowercase` simple en inglés (ej: `styles.css`, `app.js`, `sam-template.yaml`).
* **Variables CSS (Tokens):** `--component-property-modifier` (ej: `--bg-dark`, `--border-glow`, `--radius-md`).
* **Clases HTML (BEM simplificado):** `.block-element` o `.element--modifier` (ej: `.event-card`, `.nav-tab.active`).
* **IDs en el DOM:** `camelCase` descriptivo en inglés (ej: `eventSearchInput`, `generateRecipeBtn`).
* **Funciones JS:** Verbo + Objeto en `camelCase` en inglés (ej: `performEventSearch`, `calculateRelocationCost`).

---

## 🧩 Patrones de Código

1. **Estado Inmutable & Local Storage:**
   * El estado vive en un objeto centralizado `state`. Cada mutación guarda inmediatamente en `localStorage` mediante funciones puras de renderizado.
2. **Defensa contra Errores (Graceful Degradation):**
   * Si una API externa no está configurada o falla (ej: Tavily API), la aplicación ejecuta una **simulación con datos dinámicos** para mantener una aplicación 100% funcional.
