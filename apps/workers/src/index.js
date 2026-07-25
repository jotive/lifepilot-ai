const appName = 'RoomIA';

console.log(`⚙️ [${appName} Worker] Background Job Worker Initialized.`);
console.log(`📡 Ready for scheduled background jobs.`);

function runPeriodicCheck() {
  console.log(`[${new Date().toISOString()}] Running background task check...`);
}

runPeriodicCheck();
setInterval(runPeriodicCheck, 3600000);
