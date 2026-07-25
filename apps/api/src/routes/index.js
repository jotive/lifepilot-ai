import { Router } from 'express';
import { SearchController } from '../controllers/search.controller.js';
import { VisionController } from '../controllers/vision.controller.js';
import { ResponseUtil } from '../utils/response.util.js';
import { SUPPORTED_CITIES, APP_NAME } from '../config/constants.js';
import { envConfig } from '../config/env.config.js';
import { eventSearchSchema } from '../schemas/search.schema.js';
import { fridgeScanSchema, receiptScanSchema } from '../schemas/vision.schema.js';

const router = Router();
const searchController = new SearchController();
const visionController = new VisionController();

const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return ResponseUtil.error(res, 'Validation failed', 400, result.error.errors);
  }
  req.body = result.data;
  next();
};

// RESTful v1 Endpoints
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

export default router;
