import { z } from 'zod';

export const itineraryGenerateSchema = z.object({
  events: z.array(z.object({
    title: z.string(),
    category: z.string().optional(),
    snippet: z.string().optional(),
    date: z.string().optional(),
    location: z.string().optional()
  })).min(1, 'At least 1 event is required'),
  city: z.string().optional().default('Ciudad de México'),
  mode: z.enum(['solo', 'couple']).optional().default('couple'),
  language: z.enum(['es', 'en', 'pt']).optional().default('es')
});
