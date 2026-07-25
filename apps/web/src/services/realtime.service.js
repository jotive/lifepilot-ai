export class RealtimeService {
  static createPairingCode() {
    const pairCode = Math.floor(100000 + Math.random() * 900000).toString();
    const pairLink = `${window.location.origin}/?pair=${pairCode}`;
    return { pairCode, pairLink };
  }

  static async broadcastCloudState(pairCode, channelKey, payload) {
    if (!pairCode) return;
    try {
      await fetch('/api/v1/realtime/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pairCode, channelKey, payload })
      });
    } catch (error) {
      console.warn('Realtime cloud broadcast fallback:', error);
    }
  }

  static async fetchCloudState(pairCode) {
    if (!pairCode) return null;
    try {
      const response = await fetch(`/api/v1/realtime/sync/${pairCode}`);
      const data = await response.json();
      return data.data ? data.data.state : null;
    } catch (error) {
      console.warn('Realtime cloud fetch fallback:', error);
      return null;
    }
  }

  static subscribeHouseholdSync(pairCode, onSyncCallback) {
    console.log(`⚡ [RealtimeSync] Cloud Polling Subscribed for pairCode: ${pairCode}`);

    const interval = setInterval(async () => {
      if (!pairCode) return;
      const state = await this.fetchCloudState(pairCode);
      if (state) {
        Object.keys(state).forEach(key => {
          onSyncCallback(key, state[key].payload);
        });
      }
    }, 4000);

    const storageHandler = (event) => {
      if (event.key === 'roomia_expenses' || event.key === 'roomia_ingredients' || event.key === 'roomia_tasks') {
        onSyncCallback(event.key, JSON.parse(event.newValue));
      }
    };

    window.addEventListener('storage', storageHandler);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', storageHandler);
    };
  }
}
