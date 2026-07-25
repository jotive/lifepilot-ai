# 🎨 Handbook: Conventions (Estilo, Naming, Patrones & Taste)

> **Proyecto:** RoomIA  
> **Estándares:** Taste & Impeccable Design (Inspirado en Emil Kowalski & Modern UI Standards)

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

* **Archivos HTML / CSS / JS:** `kebab-case` o `lowercase` simple (ej: `styles.css`, `app.js`, `sam-template.yaml`).
* **Variables CSS (Tokens):** `--component-property-modifier` (ej: `--bg-dark`, `--border-glow`, `--radius-md`).
* **Clases HTML (BEM simplificado):** `.block-element` o `.element--modifier` (ej: `.event-card`, `.nav-tab.active`).
* **IDs en el DOM:** `camelCase` descriptivo (ej: `eventSearchInput`, `generateRecipeBtn`).
* **Funciones JS:** Verbo + Objeto en `camelCase` (ej: `performEventSearch`, `calculateRelocationCost`).

---

## 🧩 Patrones de Código

1. **Estado Inmutable & Local Storage:**
   * El estado vive en un objeto centralizado `state`. Cada mutación guarda inmediatamente en `localStorage` mediante funciones puras de renderizado.
2. **Defensa contra Errores (Graceful Degradation):**
   * Si una API externa no está configurada o falla (ej: Tavily API), la aplicación ejecuta una **simulación con datos dinámicos** para mantener una demo 100% funcional.
