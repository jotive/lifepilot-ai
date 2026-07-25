import { Router } from 'express';
import { SearchController } from '../controllers/search.controller.js';
import { VisionController } from '../controllers/vision.controller.js';
import { ContractAnalyzerService } from '../services/contract.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { SUPPORTED_CITIES, APP_NAME } from '../config/constants.js';
import { envConfig } from '../config/env.config.js';
import { eventSearchSchema } from '../schemas/search.schema.js';
import { fridgeScanSchema, receiptScanSchema } from '../schemas/vision.schema.js';

const router = Router();
const searchController = new SearchController();
const visionController = new VisionController();

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

router.post('/api/v1/contracts/analyze', (req, res) => {
  const { contractText } = req.body;
  if (!contractText) {
    return ResponseUtil.error(res, 'Contract text is required for analysis', 400);
  }
  const result = ContractAnalyzerService.analyzeContractText(contractText);
  return ResponseUtil.success(res, result);
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
