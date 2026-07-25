# 🔄 Handbook: Workflow (Flujo de Trabajo & Deploy)

> **Proyecto:** RoomIA  

---

## 📋 Checklist de Desarrollo & Calidad antes de Commit

- [x] **No Credenciales Hardcoded:** Verificar que no existan claves de API en el código. Usar `.env.example` y modal de ajustes.
- [x] **Construcción Limpia:** Ejecutar `npm run build` en `apps/web` y verificar cero errores en la consola.
- [x] **Prueba Responsive:** Verificar visualización en dispositivos móviles (pantallas < 640px) y escritorios.
- [x] **Documentación Actualizada:** Actualizar los archivos del `docs/handbook/` si se modifica la arquitectura o decisiones.

---

## 🚀 Proceso de Despliegue (Deploy)

### 1. Despliegue Web Frontend (`apps/web`)
* **Plataforma recomendada:** Vercel / Netlify / GitHub Pages.
* **Directorio Raíz del Build:** `apps/web`
* **Comando de Compilación:** `npm run build`
* **Carpeta de Salida:** `dist`

### 2. Despliegue de Infraestructura en AWS (`infra/aws`)
* Mediante AWS SAM CLI:
  ```bash
  cd infra/aws
  sam build
  sam deploy --guided
  ```
* Se creará el Bucket S3, la distribución de CloudFront y la función Lambda Proxy automáticamente.

### 3. Entrega en el Hackatón
1. Verificar que el repositorio [jotive/lifepilot-ai](https://github.com/jotive/lifepilot-ai) esté en estado **Público**.
2. Garantizar que la Demo en línea esté activa durante al menos 7 días.
3. Grabar el video demo de ~5 minutos mostrando las 5 pestañas de RoomIA.
