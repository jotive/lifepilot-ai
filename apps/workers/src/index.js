import { APP_NAME } from '@roomia/shared';

console.log(`⚙️ [${APP_NAME} Worker] Background Job Worker Initialized.`);
console.log(`📡 Ready for scheduled cron jobs (City Events scraping & Pantry Expiration alerts).`);

// Periodic job simulation (every hour or on demand)
function runPeriodicCheck() {
  console.log(`[${new Date().toISOString()}] Checking background tasks & notifications...`);
}

runPeriodicCheck();
setInterval(runPeriodicCheck, 3600000);
