import AsyncStorage from '@react-native-async-storage/async-storage';

const CONNECTED_KEY = 'compareall_connected_platforms';
const SESSION_KEY = 'compareall_sessions';

export const StorageService = {
  // Get all connected platform IDs
  getConnectedPlatforms: async () => {
    try {
      const data = await AsyncStorage.getItem(CONNECTED_KEY);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  },

  // Save a connected platform
  connectPlatform: async (platformId) => {
    try {
      const current = await StorageService.getConnectedPlatforms();
      if (!current.includes(platformId)) {
        await AsyncStorage.setItem(CONNECTED_KEY, JSON.stringify([...current, platformId]));
      }
    } catch(e) { console.error(e); }
  },

  // Disconnect a platform
  disconnectPlatform: async (platformId) => {
    try {
      const current = await StorageService.getConnectedPlatforms();
      const updated = current.filter(id => id !== platformId);
      await AsyncStorage.setItem(CONNECTED_KEY, JSON.stringify(updated));
      // Also clear session
      const sessions = await StorageService.getAllSessions();
      delete sessions[platformId];
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
    } catch(e) { console.error(e); }
  },

  // Save session cookies for a platform
  saveSession: async (platformId, cookies) => {
    try {
      const sessions = await StorageService.getAllSessions();
      sessions[platformId] = { cookies, savedAt: Date.now() };
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
    } catch(e) { console.error(e); }
  },

  getAllSessions: async () => {
    try {
      const data = await AsyncStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : {};
    } catch { return {}; }
  },

  // Search history
  getSearchHistory: async () => {
    try {
      const data = await AsyncStorage.getItem('compareall_history');
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  },

  addSearchHistory: async (query) => {
    try {
      const history = await StorageService.getSearchHistory();
      const updated = [query, ...history.filter(h => h !== query)].slice(0, 10);
      await AsyncStorage.setItem('compareall_history', JSON.stringify(updated));
    } catch(e) {}
  },

  clearAll: async () => {
    try {
      await AsyncStorage.multiRemove([CONNECTED_KEY, SESSION_KEY, 'compareall_history']);
    } catch(e) {}
  }
};
