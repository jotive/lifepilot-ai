# 📐 Handbook: Architecture (Arquitectura & Estructura)

> **Proyecto:** RoomIA  
> **Estrategias:** Storage, Authentication & Notifications Architecture

---

## 💾 1. Estrategia de Almacenamiento (Storage & Data)

RoomIA utiliza un enfoque **Hybrid Local-First + Cloud Vault Storage**:

### A. Datos Estructurados (Relacionales & Estado)
- **Producción (Cloud):** PostgreSQL (vía Supabase / GCP Cloud SQL) para sincronización entre dispositivos.
- **Offline & Local First (Navegador):** `IndexedDB` (para archivos y documentos pesados) + `LocalStorage` (para preferencias y estado en Zustand).
- **Garantía:** La app es 100% operativa aun sin conexión a internet.

### B. Archivos & Bóveda de Documentos (PDFs, Recibos e Imágenes)
- **Cloud Storage:** Amazon S3 / GCP Cloud Storage.
- **Cifrado en Cliente (AES-GCM):** Los documentos sensibles (contratos, fichas médicas) se encriptan localmente en el navegador usando Web Crypto API antes de ser enviados a la nube.

---

## 🔐 2. Estrategia de Autenticación (Auth System)

RoomIA implementa un esquema **Dual-Mode Zero-Friction Auth**:

1. **Modo Invitado (Guest 1-Click Session):**
   - El usuario abre la app y obtiene una sesión anónima en 1 clic sin formularios ni contraseñas.
   - Genera un token JWT temporal asociado a su UUID local.
2. **Modo Sincronizado Pareja / Roomies (Account Sync):**
   - Autenticación con email/password o Google OAuth (vía Supabase Auth / Auth0 / Firebase Auth).
   - Genera un token JWT de 7 días firmado con la clave secreta en `apps/api/src/config/auth.config.js`.
   - Permite vincular 2 dispositivos mediante código QR o enlace mágico de invitación (`roomia.ai/sync?pair_id=XYZ`).

---

## 🔔 3. Estrategia de Notificaciones (Web Push & Background Alerts)

1. **Notificaciones Push en Navegador (PWA Web Push API):**
   - Implementado mediante Service Worker en `apps/web/public/sw.js`.
   - Emite alertas directas al SO (Android, iOS, Windows, macOS) para:
     * Alimentos en alacena/refrigerador próximos a vencer (3 días antes).
     * Recordatorios de tareas asignadas en TaskWheel.
     * Eventos recomendados del fin de semana.
2. **Notificaciones Servidor:**
   - VAPID Web Push Keys en `apps/api/src/config/notifications.config.js` + integraciones de correo transactional vía Resend / SendGrid.

---

## 📂 Estructura Completa de Carpetas

```
roomIA/
├── apps/
│   ├── web/
│   │   ├── public/sw.js             # Web Push Service Worker
│   │   └── src/                     # React 18 App (Zustand, Zod, Tailwind)
│   ├── api/
│   │   └── src/
│   │       ├── config/              # env, auth, storage, notifications config
│   │       ├── services/            # search, vision, auth services
│   │       └── routes/              # RESTful API v1 routes
│   └── workers/
│       ├── inference-worker/        # AI Vision & OCR Worker
│       └── cron-worker/             # Scheduled Notifications & Expiration Jobs
├── infra/                           # Docker, AWS SAM, GCP
└── docs/handbook/                   # Architecture & Knowledge Handbook
```
