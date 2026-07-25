export class RealtimeService {
  static createPairingCode() {
    const pairCode = Math.floor(100000 + Math.random() * 900000).toString();
    const pairLink = `${window.location.origin}/?pair=${pairCode}`;
    return { pairCode, pairLink };
  }

  static subscribeHouseholdSync(pairCode, onSyncCallback) {
    console.log(`⚡ [RealtimeSync] Subscribed to Household channel: roomia_pair_${pairCode}`);
    
    const handler = (event) => {
      if (event.key === 'roomia_expenses' || event.key === 'roomia_ingredients' || event.key === 'roomia_tasks') {
        onSyncCallback(event.key, JSON.parse(event.newValue));
      }
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }
}
