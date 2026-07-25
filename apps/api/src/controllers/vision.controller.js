import { VisionService } from '../services/vision.service.js';

export class VisionController {
  constructor() {
    this.visionService = new VisionService();
  }

  async handleFridgeScan(req, res) {
    const { imageBase64, qiroKey } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Base64 image payload is required' });
    }

    try {
      const result = await this.visionService.processFridgePhoto(imageBase64, qiroKey);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to process fridge photo', details: error.message });
    }
  }

  async handleReceiptScan(req, res) {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Receipt image payload is required' });
    }

    try {
      const result = await this.visionService.processReceiptPhoto(imageBase64);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to process receipt', details: error.message });
    }
  }
}
