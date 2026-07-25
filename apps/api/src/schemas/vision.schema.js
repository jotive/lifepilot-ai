import { z } from 'zod';

export const fridgeScanSchema = z.object({
  imageBase64: z.string().min(10, 'Base64 image payload is required'),
  qiroKey: z.string().optional()
});

export const receiptScanSchema = z.object({
  imageBase64: z.string().min(10, 'Receipt image payload is required')
});
