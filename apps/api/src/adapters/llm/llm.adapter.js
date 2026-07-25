export class BaseLLMAdapter {
  constructor(name) {
    this.name = name;
  }

  isAvailable() {
    return false;
  }

  async completeChat(prompt, systemInstruction) {
    throw new Error('completeChat must be implemented by subclass');
  }
}
