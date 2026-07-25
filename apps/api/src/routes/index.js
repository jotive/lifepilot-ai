import { Router } from 'express';
import { SearchController } from '../controllers/search.controller.js';
import { VisionController } from '../controllers/vision.controller.js';
import { SUPPORTED_CITIES, APP_NAME } from '../config/constants.js';
import { settings } from '../config/settings.js';

const router = Router();
const searchController = new SearchController();
const visionController = new VisionController();

router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    environment: settings.environment,
    service: `${APP_NAME} Production API Service`,
    timestamp: new Date().toISOString()
  });
});

router.get('/api/cities', (req, res) => {
  res.json({ cities: SUPPORTED_CITIES });
});

router.post('/api/search/tavily', (req, res) => searchController.handleTavilySearch(req, res));
router.post('/api/vision/fridge', (req, res) => visionController.handleFridgeScan(req, res));
router.post('/api/vision/receipt', (req, res) => visionController.handleReceiptScan(req, res));

export default router;
