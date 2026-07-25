import { envConfig } from '../config/env.config.js';

export class GeminiService {
  static async completeChat(prompt, systemInstruction = 'You are RoomIA, an intelligent roommate and life copilot.') {
    const apiKey = envConfig.geminiApiKey;

    if (!apiKey) {
      throw new Error('MISSING_GEMINI_KEY');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemInstruction}\n\n${prompt}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600
        }
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${JSON.stringify(err)}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }
}
