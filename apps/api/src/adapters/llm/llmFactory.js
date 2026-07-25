import { GeminiLLMAdapter } from './gemini.adapter.js';
import { OpenRouterLLMAdapter } from './openrouter.adapter.js';
import { GroqLLMAdapter } from './groq.adapter.js';

export class LLMAdapterFactory {
  static getAdapters() {
    return [
      new GeminiLLMAdapter(),
      new OpenRouterLLMAdapter(),
      new GroqLLMAdapter()
    ];
  }

  static async executeWithFallback(prompt, systemInstruction) {
    const adapters = this.getAdapters();

    for (const adapter of adapters) {
      if (adapter.isAvailable()) {
        try {
          const responseText = await adapter.completeChat(prompt, systemInstruction);
          return {
            responseText,
            source: adapter.name
          };
        } catch (error) {
          console.warn(`[LLMAdapterFactory] ${adapter.name} failed, trying next adapter:`, error.message);
        }
      }
    }

    return null;
  }
}
