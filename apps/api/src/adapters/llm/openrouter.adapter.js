import { BaseLLMAdapter } from './llm.adapter.js';
import { envConfig } from '../../config/env.config.js';

export class OpenRouterLLMAdapter extends BaseLLMAdapter {
  constructor() {
    super('openrouter-ai');
  }

  isAvailable() {
    return Boolean(envConfig.openrouterApiKey || envConfig.openrouterToken1);
  }

  async completeChat(prompt, systemInstruction = 'You are RoomIA, an intelligent roommate and life copilot.') {
    const apiKey = envConfig.openrouterApiKey || envConfig.openrouterToken1;
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/jotive/lifepilot-ai',
        'X-Title': 'RoomIA Life Pilot'
      },
      body: JSON.stringify({
        model: 'auto',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`OpenRouter Adapter error: ${JSON.stringify(err)}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }
}
