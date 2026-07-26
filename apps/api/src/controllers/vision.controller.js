import { VisionService } from '../services/vision.service.js';
import { ResponseUtil } from '../utils/response.util.js';

export class VisionController {
  constructor() {
    this.visionService = new VisionService();
  }

  async handleFridgeScan(req, res, next) {
    const { imageBase64, apiKey } = req.body;

    if (!imageBase64) {
      return ResponseUtil.error(res, 'Base64 image payload is required', 400);
    }

    try {
      const result = await this.visionService.processFridgePhoto(imageBase64, apiKey);
      return ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async handleReceiptScan(req, res, next) {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return ResponseUtil.error(res, 'Receipt image payload is required', 400);
    }

    try {
      const result = await this.visionService.processReceiptPhoto(imageBase64);
      return ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}
