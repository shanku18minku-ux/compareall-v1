export type SessionState = 
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'AUTHENTICATING'
  | 'CONNECTED'
  | 'SESSION_EXPIRED'
  | 'ERROR'
  | 'DISCONNECTING';

export type PlatformErrorType = 
  | 'LOGIN_CANCELLED'
  | 'OTP_REQUIRED'
  | 'OTP_INVALID'
  | 'AUTHENTICATION_FAILED'
  | 'SESSION_EXPIRED'
  | 'NETWORK_ERROR'
  | 'PLATFORM_UNAVAILABLE'
  | 'WEBVIEW_ERROR'
  | 'STORAGE_ERROR'
  | 'UNKNOWN_ERROR';

export interface PlatformMetadata {
  id: string;
  name: string;
  icon: string;
  category: string;
  subcategory: string;
  url: string;
  loginUrl: string;
  desc: string;
  authType?: 'otp' | 'google' | 'both';
  regions?: string[]; // 'all' for everywhere, or list of city/region keywords
}

export interface PlatformPacket {
  metadata: PlatformMetadata;
  
  // Connection and Session
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  getConnectionStatus: () => Promise<SessionState>;
  
  // Scripts for generic WebView engine
  getLoginInjectionScript: () => string;
  getExtractorScript: (url: string) => string;
  
  // Message Handler for WebView events
  handleWebViewMessage?: (data: any, callbacks: {
    onOtpRequested: () => void;
    onSuccess: () => void;
    onError: (msg: string) => void;
  }) => void;
}
