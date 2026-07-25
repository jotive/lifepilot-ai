# ⚠️ Handbook: Errors (Registro de Errores Conocidos & Soluciones)

> **Proyecto:** RoomIA  

---

## ERR-001: Error de sintaxis `&&` en ejecuciones de terminal PowerShell en Windows
* **Síntoma:** Error `The token '&&' is not a valid statement separator in this version.` al encadenar comandos en PowerShell.
* **Causa Raíz:** En PowerShell de Windows, el operador `&&` no es soportado por defecto; se requiere el separador `;`.
* **Solución:** Usar `;` en lugar de `&&` al encadenar comandos de terminal en Windows (ej: `git add .; git commit -m "..."`).

---

## ERR-002: Error de Hoisting / Módulos en Raíz
* **Síntoma:** Creación no deseada de `node_modules` y `package.json` en la raíz del proyecto.
* **Causa Raíz:** Configuración automática de npm workspaces al detectar dependencias compartidas entre subcarpetas.
* **Solución:** Desactivar workspaces en la raíz, eliminar `package.json` raíz y manejar cada aplicación (`apps/web`, `apps/api`) con sus propios comandos e instalaciones independientes.

---

## ERR-003: Fallo de respuesta o cuota en Tavily Search API
* **Síntoma:** La búsqueda de eventos no devuelve resultados o la clave no está configurada por el usuario.
* **Causa Raíz:** Falta de API Key en `localStorage` o límite de cuota alcanzado.
* **Solución:** Se implementó un motor de simulación dinámica en [apps/web/app.js](file:///F:/jotive/hackathon-codigofacilito-2026jul/apps/web/app.js) que genera resultados realistas según la ciudad seleccionada para garantizar una demo fluida en todo momento.
