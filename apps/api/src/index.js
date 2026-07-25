import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { settings } from './config/settings.js';
import { APP_NAME } from './config/constants.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(routes);

app.listen(settings.port, () => {
  console.log(`🚀 [${APP_NAME} Layered API] Online at http://localhost:${settings.port}`);
});
