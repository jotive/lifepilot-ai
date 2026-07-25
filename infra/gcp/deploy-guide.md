# 🚀 Deployment Guide: Cloudflare Pages & GCP Cloud Run

---

## ⚡ 1. Despliegue del Frontend en Cloudflare Pages (`apps/web`)

1. Ve a tu consola de **Cloudflare** -> **Workers & Pages** -> **Create Application** -> **Pages** -> **Connect to Git**.
2. Selecciona el repositorio `jotive/lifepilot-ai`.
3. Configura los parámetros de Build:
   * **Framework Preset:** Vite
   * **Root Directory:** `apps/web`
   * **Build Command:** `npm run build`
   * **Build Output Directory:** `dist`
4. Haz clic en **Save and Deploy**. Tu frontend estará activo en una URL ultra-rápida `.pages.dev`.

---

## ☁️ 2. Despliegue de las APIs en GCP Cloud Run (`apps/api`)

Mediante Google Cloud CLI (`gcloud`):

```bash
# 1. Autenticarse en Google Cloud
gcloud auth login
gcloud config set project TU_PROJECT_ID_GCP

# 2. Desplegar directamente en Cloud Run desde el directorio del API
cd apps/api
gcloud run deploy roomia-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,TAVILY_API_KEY=tu_tavily_key"
```

O usando el Dockerfile específico de GCP:
```bash
gcloud builds submit --tag gcr.io/TU_PROJECT_ID_GCP/roomia-api -f ../../infra/gcp/Dockerfile.cloudrun .
gcloud run deploy roomia-api --image gcr.io/TU_PROJECT_ID_GCP/roomia-api --platform managed --region us-central1 --allow-unauthenticated
```
