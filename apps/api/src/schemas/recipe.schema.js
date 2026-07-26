import { z } from 'zod';

export const recipeGenerateSchema = z.object({
  ingredients: z.array(z.string()).min(1, 'At least 1 ingredient is required'),
  mode: z.enum(['solo', 'couple']).optional().default('couple'),
  language: z.enum(['es', 'en', 'pt']).optional().default('es')
});
