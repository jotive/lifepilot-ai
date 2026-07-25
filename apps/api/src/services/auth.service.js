import { authConfig } from '../config/auth.config.js';

export class AuthService {
  async generateGuestSession(city = 'Ciudad de México', mode = 'couple') {
    const userId = `usr_${Math.random().toString(36).substring(2, 10)}`;
    const sessionToken = `jwt_mock_${Buffer.from(`${userId}:${Date.now()}`).toString('base64')}`;

    return {
      user: {
        id: userId,
        type: 'guest',
        currentCity: city,
        mode: mode
      },
      token: sessionToken,
      expiresIn: authConfig.jwtExpiresIn
    };
  }

  async validateToken(token) {
    if (!token || !token.startsWith('Bearer ')) {
      throw new Error('INVALID_TOKEN');
    }
    return { valid: true };
  }
}
