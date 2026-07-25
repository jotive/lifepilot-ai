import { ResponseUtil } from '../utils/response.util.js';

export const errorMiddleware = (err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return ResponseUtil.error(res, message, status, err.details || null);
};
