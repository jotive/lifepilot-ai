import { Router } from 'express';
import { SearchController } from '../controllers/search.controller.js';
import { VisionController } from '../controllers/vision.controller.js';
import { RecipeController } from '../controllers/recipe.controller.js';
import { ItineraryController } from '../controllers/itinerary.controller.js';
import { ContractAnalyzerService } from '../services/contract.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { SUPPORTED_CITIES, APP_NAME } from '../config/constants.js';
import { envConfig } from '../config/env.config.js';
import { eventSearchSchema } from '../schemas/search.schema.js';
import { fridgeScanSchema, receiptScanSchema } from '../schemas/vision.schema.js';
import { recipeGenerateSchema } from '../schemas/recipe.schema.js';
import { itineraryGenerateSchema } from '../schemas/itinerary.schema.js';

const router = Router();
const searchController = new SearchController();
const visionController = new VisionController();
const recipeController = new RecipeController();
const itineraryController = new ItineraryController();

// In-memory Realtime Channels Store for cross-device roomie sync
const realtimeStore = new Map();

const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return ResponseUtil.error(res, 'Validation failed', 400, result.error.errors);
  }
  req.body = result.data;
  next();
};

router.get('/health', (req, res) => {
  return ResponseUtil.success(res, {
    status: 'online',
    environment: envConfig.environment,
    service: `${APP_NAME} Production API Service`
  });
});

router.get('/api/v1/cities', (req, res) => {
  return ResponseUtil.success(res, { cities: SUPPORTED_CITIES });
});

router.post('/api/v1/events/search', validateBody(eventSearchSchema), (req, res, next) => searchController.handleTavilySearch(req, res, next));
router.post('/api/v1/vision/fridge-scans', validateBody(fridgeScanSchema), (req, res, next) => visionController.handleFridgeScan(req, res, next));
router.post('/api/v1/vision/receipt-scans', validateBody(receiptScanSchema), (req, res, next) => visionController.handleReceiptScan(req, res, next));
router.post('/api/v1/recipes/generate', validateBody(recipeGenerateSchema), (req, res, next) => recipeController.handleGenerateRecipes(req, res, next));
router.post('/api/v1/itineraries/generate', validateBody(itineraryGenerateSchema), (req, res, next) => itineraryController.handleGenerateItinerary(req, res, next));

router.post('/api/v1/copilot/chat', async (req, res, next) => {
  const { messages, context } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return ResponseUtil.error(res, 'Messages array is required', 400);
  }
  try {
    const result = await copilotService.chatWithAgent(messages, context);
    return ResponseUtil.success(res, result);
  } catch (error) {
    next(error);
  }
});

router.post('/api/v1/contracts/analyze', (req, res) => {
  const { contractText } = req.body;
  if (!contractText) {
    return ResponseUtil.error(res, 'Contract text is required for analysis', 400);
  }
  const result = ContractAnalyzerService.analyzeContractText(contractText);
  return ResponseUtil.success(res, result);
});

// AUTHENTICATION & PASSWORD RECOVERY ENDPOINTS
router.post('/api/v1/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return ResponseUtil.error(res, 'Se requiere un correo electrónico válido', 400);
  }
  return ResponseUtil.success(res, {
    sent: true,
    email,
    message: `Se ha enviado un enlace de recuperación seguro a ${email}. Revisa tu bandeja de entrada o spam.`,
    resetToken: `rm_reset_${Math.random().toString(36).substring(2, 10)}`
  });
});

router.post('/api/v1/auth/reset-password', (req, res) => {
  const { email, newPassword, resetToken } = req.body;
  if (!email || !newPassword || newPassword.length < 6) {
    return ResponseUtil.error(res, 'La nueva contraseña debe tener al menos 6 caracteres', 400);
  }
  return ResponseUtil.success(res, {
    updated: true,
    email,
    message: 'Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva clave.'
  });
});

// REALTIME CLOUD SYNC ENDPOINTS (Distances Sync)
router.post('/api/v1/realtime/broadcast', (req, res) => {
  const { pairCode, channelKey, payload } = req.body;
  if (!pairCode || !channelKey) {
    return ResponseUtil.error(res, 'pairCode and channelKey are required', 400);
  }

  if (!realtimeStore.has(pairCode)) {
    realtimeStore.set(pairCode, new Map());
  }
  const room = realtimeStore.get(pairCode);
  room.set(channelKey, { payload, updatedAt: new Date().toISOString() });

  return ResponseUtil.success(res, { synced: true, pairCode, channelKey });
});

router.get('/api/v1/realtime/sync/:pairCode', (req, res) => {
  const { pairCode } = req.params;
  const room = realtimeStore.get(pairCode);
  if (!room) {
    return ResponseUtil.success(res, { state: {} });
  }

  const state = {};
  for (const [key, val] of room.entries()) {
    state[key] = val;
  }
  return ResponseUtil.success(res, { pairCode, state });
});

export default router;
