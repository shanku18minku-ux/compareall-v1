import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'swiggy_session_valid';

export class SwiggyStorage {
  /**
   * We only store a simple flag to indicate the session is valid.
   * NO passwords, OTPs, or cookies are extracted or stored.
   * Swiggy's native session state relies on its own WebKit secure storage.
   */
  static async saveSessionFlag(isValid: boolean): Promise<void> {
    try {
      await SecureStore.setItemAsync(SESSION_KEY, isValid ? '1' : '0');
    } catch (e) {
      console.error('Failed to save Swiggy session flag to SecureStore', e);
    }
  }

  static async getSessionFlag(): Promise<boolean> {
    try {
      const val = await SecureStore.getItemAsync(SESSION_KEY);
      return val === '1';
    } catch (e) {
      return false;
    }
  }

  static async clearSession(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(SESSION_KEY);
    } catch (e) {
      console.error('Failed to clear Swiggy session from SecureStore', e);
    }
  }
}
