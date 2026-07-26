import { ItineraryService } from '../services/itinerary.service.js';
import { ResponseUtil } from '../utils/response.util.js';

export class ItineraryController {
  constructor() {
    this.itineraryService = new ItineraryService();
  }

  async handleGenerateItinerary(req, res, next) {
    const { events, city, mode, language } = req.body;

    try {
      const result = await this.itineraryService.generateItinerary(events, city, mode, language);
      return ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}
