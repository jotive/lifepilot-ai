import { RecipeService } from '../services/recipe.service.js';
import { ResponseUtil } from '../utils/response.util.js';

export class RecipeController {
  constructor() {
    this.recipeService = new RecipeService();
  }

  async handleGenerateRecipes(req, res, next) {
    const { ingredients, mode, language } = req.body;

    try {
      const result = await this.recipeService.generateRecipes(ingredients, mode, language);
      return ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}
