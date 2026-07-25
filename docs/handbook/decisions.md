# 📜 Handbook: Decisions (Registro de Decisiones - ADR)

> **Proyecto:** RoomIA  

---

## ADR-001: Selección de Marca "RoomIA" en lugar de "LifePilot AI"
* **Fecha:** 2026-07-25  
* **Estado:** ✅ Aprobado / Implementado  
* **Contexto:** Se necesitaba una identidad de marca cercana y memorable que hiciera alusión directa al concepto de un compañero de cuarto (*Roomie*) inteligente para parejas e independientes.  
* **Decisión:** Renombrar la solución a **RoomIA**.  
* **Alternativas Descartadas:** `LifePilot AI` (demasiado genérico), `RelocateOS` (enfocado solo en mudanzas).

---

## ADR-002: Estructura Multi-Carpeta Limpia sin Workspaces Raíz
* **Fecha:** 2026-07-25  
* **Estado:** ✅ Aprobado / Implementado  
* **Contexto:** Se evaluó el uso de monorepos con workspaces izados (`node_modules` en raíz con Turborepo). El usuario solicitó mantener un repositorio multi-carpeta limpio sin archivos o paquetes sobrantes en la raíz.  
* **Decisión:** Organizar el proyecto en carpetas independientes (`apps/`, `infra/`, `docs/`) sin `package.json` o `node_modules` en la raíz.  
* **Alternativas Descartadas:** Turborepo / npm workspaces con izamiento de paquetes en raíz.

---

## ADR-003: Uso de Tavily AI Search para Radar de Eventos en Tiempo Real
* **Fecha:** 2026-07-25  
* **Estado:** ✅ Aprobado / Implementado  
* **Contexto:** El módulo de exploración de la ciudad requería información actualizada sobre eventos, conciertos y actividades culturales locales.  
* **Decisión:** Integrar **Tavily AI Search API** con fallback a simulación inteligente para asegurar funcionamiento continuo en la demo evaluada por los jueces de AWS.  
* **Alternativas Descartadas:** Web scrapers estáticos locales (información desactualizada).

---

## ADR-004: Persistencia Local (LocalStorage & IndexedDB) en el Cliente
* **Fecha:** 2026-07-25  
* **Estado:** ✅ Aprobado / Implementado  
* **Contexto:** Maximizar la privacidad del usuario y asegurar que la demo funcione sin depender de bases de datos remotas costosas o de alta latencia.  
* **Decisión:** Almacenar datos de despensa, gastos y documentos cifrados localmente en el navegador del usuario.  
* **Alternativas Descartadas:** Base de datos PostgreSQL/MongoDB remota obligatoria para el MVP.
