export const settings = {
  port: process.env.PORT || 4000,
  environment: process.env.NODE_ENV || 'production',
  tavilyApiKey: process.env.TAVILY_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || ''
};
