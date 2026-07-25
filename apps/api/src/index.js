import express from 'express';
import routes from './routes/index.js';
import { securityMiddleware } from './middlewares/security.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { envConfig } from './config/env.config.js';
import { APP_NAME } from './config/constants.js';

const app = express();

app.use(securityMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(routes);
app.use(errorMiddleware);

app.listen(envConfig.port, () => {
  console.log(`🚀 [${APP_NAME} Production API] Security & Error Handlers Active at http://localhost:${envConfig.port}`);
});
