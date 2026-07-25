import { Router } from 'express';
import { SearchController } from '../controllers/search.controller.js';
import { VisionController } from '../controllers/vision.controller.js';
import { ResponseUtil } from '../utils/response.util.js';
import { SUPPORTED_CITIES, APP_NAME } from '../config/constants.js';
import { envConfig } from '../config/env.config.js';

const router = Router();
const searchController = new SearchController();
const visionController = new VisionController();

router.get('/health', (req, res) => {
  return ResponseUtil.success(res, {
    status: 'online',
    environment: envConfig.environment,
    service: `${APP_NAME} Production API Service`
  });
});

router.get('/api/cities', (req, res) => {
  return ResponseUtil.success(res, { cities: SUPPORTED_CITIES });
});

router.post('/api/search/tavily', (req, res, next) => searchController.handleTavilySearch(req, res, next));
router.post('/api/vision/fridge', (req, res, next) => visionController.handleFridgeScan(req, res, next));
router.post('/api/vision/receipt', (req, res, next) => visionController.handleReceiptScan(req, res, next));

export default router;
