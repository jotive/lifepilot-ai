# 🧠 Handbook: Decisions (Decisiones de Arquitectura ADR)

> **Proyecto:** RoomIA  
> **Registro de Decisiones de Arquitectura (ADR)**

---

## ADR-001: Almacenamiento Híbrido Local-First + Amazon S3 / PostgreSQL
* **Fecha:** 2026-07-25
* **Decisión:** Usar `LocalStorage` e `IndexedDB` para funcionamiento Offline First instantáneo en el cliente, sincronizando con PostgreSQL / S3 en la nube.
* **¿Por qué?:** Garantiza cero latencia en la UI y privacidad absoluta en documentos mediante cifrado local previo.

---

## ADR-002: Autenticación Híbrida (Guest 1-Click + JWT Sync)
* **Fecha:** 2026-07-25
* **Decisión:** Permitir entrada instantánea en modo invitado y upgrade a cuenta compartida mediante JWT.
* **¿Por qué?:** Elimina la fricción de registro inicial para la demo/MVP funcional desde el Día 1.

---

## ADR-003: Notificaciones vía Web Push API + Service Worker
* **Fecha:** 2026-07-25
* **Decisión:** Implementar Service Worker (`public/sw.js`) y VAPID Keys en el servidor.
* **¿Por qué?:** Permite enviar notificaciones nativas en el sistema operativo del usuario sin obligar a instalar una app de tienda.
