import { z } from 'zod';

export const eventSearchSchema = z.object({
  query: z.string().min(2, 'Query must be at least 2 characters long'),
  city: z.string().optional().default('Ciudad de México'),
  apiKey: z.string().optional()
});
