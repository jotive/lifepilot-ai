console.log('⏰ [RoomIA Cron Worker] Scheduled Job Worker Initialized.');

function checkExpiringFoodAlerts() {
  console.log(`[${new Date().toISOString()}] Checking fridge pantry items for expiration alerts...`);
}

function syncCityEventsCache() {
  console.log(`[${new Date().toISOString()}] Syncing city events cache...`);
}

checkExpiringFoodAlerts();
syncCityEventsCache();

setInterval(() => {
  checkExpiringFoodAlerts();
  syncCityEventsCache();
}, 3600000);
