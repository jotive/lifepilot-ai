import { BaseLLMAdapter } from './llm.adapter.js';
import { envConfig } from '../../config/env.config.js';

export class GroqLLMAdapter extends BaseLLMAdapter {
  constructor() {
    super('groq-llama-3');
  }

  isAvailable() {
    return Boolean(envConfig.groqApiKey);
  }

  async completeChat(prompt, systemInstruction = 'You are RoomIA, an intelligent roommate and life copilot.') {
    const apiKey = envConfig.groqApiKey;
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`Groq Adapter error: ${JSON.stringify(err)}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }
}
