import { PlatformPacket, SessionState } from '../types';
import { SwiggyStorage } from './SwiggyStorage';
import { getSwiggyLoginScript } from './SwiggyLogin';
import { getSwiggyExtractorScript } from './SwiggyData';

export const swiggyPacket: PlatformPacket = {
  metadata: {
    id: 'food-a',
    name: 'Swiggy',
    icon: '🍔',
    category: 'Food',
    subcategory: 'Food Delivery',
    url: 'https://www.swiggy.com',
    loginUrl: 'https://www.swiggy.com',
    desc: 'Local packet handles OTP safely.',
    authType: 'otp',
    regions: ['all'],
  },

  connect: async () => {
    // Connection happens via WebView native actions in LoginDriver.
    // This could initialize pre-flight checks if needed.
  },

  disconnect: async () => {
    // Clear local encrypted storage entirely.
    await SwiggyStorage.clearSession();
  },

  getConnectionStatus: async (): Promise<SessionState> => {
    const isValid = await SwiggyStorage.getSessionFlag();
    return isValid ? 'CONNECTED' : 'DISCONNECTED';
  },

  getLoginInjectionScript: () => {
    return getSwiggyLoginScript();
  },

  getExtractorScript: (url: string) => {
    return getSwiggyExtractorScript(url);
  },

  handleWebViewMessage: async (data, callbacks) => {
    if (data.type === 'OTP_REQUESTED') {
      callbacks.onOtpRequested();
    } else if (data.type === 'SUCCESS' || data.type === 'SESSION_ACTIVE') {
      // Secure local state update only. Never hits backend.
      await SwiggyStorage.saveSessionFlag(true);
      callbacks.onSuccess();
    } else if (data.type === 'ERROR') {
      callbacks.onError(data.message);
    }
  }
};
