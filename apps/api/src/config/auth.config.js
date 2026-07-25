export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'roomia-super-secret-production-jwt-key-2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  saltRounds: 10
};
