export class InferenceWorker {
  static async processImageInference(payload) {
    const { imageBase64, taskType } = payload;
    console.log(`🧠 [InferenceWorker] Processing ${taskType || 'fridge-vision'} task...`);

    if (taskType === 'receipt-ocr') {
      return {
        type: 'receipt-ocr',
        amount: 68.40,
        items: ['Leche', 'Huevos', 'Pan', 'Frutas'],
        status: 'completed'
      };
    }

    return {
      type: 'fridge-vision',
      ingredients: ['Tomates Frescos', 'Queso Blanco', 'Huevos de Granja', 'Leche Entera'],
      status: 'completed'
    };
  }
}

console.log('🤖 [RoomIA Inference Worker] Active and listening for AI Vision & OCR inference tasks.');
