import React, { forwardRef, useImperativeHandle, useRef, useMemo, useEffect } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { PlatformRegistry } from './packets/registry';

export interface LoginDriverRef {
    submitPhone: (phone: string) => void;
    submitOtp: (otp: string) => void;
}

interface LoginDriverProps {
    providerId: string;
    url: string;
    phone: string;
    otp: string;
    triggerPhone: boolean;
    triggerOtp: boolean;
    onOtpRequested: () => void;
    onSuccess: () => void;
    onError: (msg: string) => void;
}

export const LoginDriver = forwardRef<LoginDriverRef, LoginDriverProps>(({
    providerId,
    url,
    phone,
    otp,
    triggerPhone,
    triggerOtp,
    onOtpRequested,
    onSuccess,
    onError
}, ref) => {
    const webViewRef = useRef<WebView>(null);
    
    // Lazy load the packet logic from registry
    const packet = useMemo(() => PlatformRegistry.get(providerId), [providerId]);

    const isLoaded = useRef(false);
    const actionQueue = useRef<{type: string, value: string}[]>([]);

    const fireAction = (type: string, value: string) => {
        webViewRef.current?.injectJavaScript(`
            window.dispatchEvent(new CustomEvent('NATIVE_ACTION', { 
                detail: { type: '${type}', value: '${value}' } 
            }));
            true;
        `);
    };

    useImperativeHandle(ref, () => ({
        submitPhone: (phoneNumber: string) => {
            if (isLoaded.current) {
                fireAction('PHONE', phoneNumber);
            } else {
                actionQueue.current.push({ type: 'PHONE', value: phoneNumber });
            }
        },
        submitOtp: (otpValue: string) => {
            if (isLoaded.current) {
                fireAction('OTP', otpValue);
            } else {
                actionQueue.current.push({ type: 'OTP', value: otpValue });
            }
        }
    }));

    // Check if the packet actually exists
    if (!packet) {
       console.error(`No packet registered for provider: ${providerId}`);
       return null;
    }

    const visualSuppressionScript = `
        var style = document.createElement('style');
        style.innerHTML = 'body, * { visibility: hidden !important; background: transparent !important; color: transparent !important; }';
        document.head.appendChild(style);
    `;

    const fullInjectedScript = visualSuppressionScript + packet.getLoginInjectionScript();

    return (
        <View style={{ position: 'absolute', top: -1000, left: -1000, width: 1, height: 1, opacity: 0 }}>
            <WebView
                ref={webViewRef}
                source={{ uri: url }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                thirdPartyCookiesEnabled={true}
                injectedJavaScript={fullInjectedScript}
                userAgent="Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36"
                onLoadEnd={() => {
                    isLoaded.current = true;
                    // Process any queued actions that were triggered while page was loading
                    while (actionQueue.current.length > 0) {
                        const action = actionQueue.current.shift();
                        if (action) fireAction(action.type, action.value);
                    }
                }}
                onMessage={(event) => {
                    try {
                        const data = JSON.parse(event.nativeEvent.data);
                        
                        // Delegate message parsing back to the specific packet to keep engine clean
                        if (packet.handleWebViewMessage) {
                            packet.handleWebViewMessage(data, {
                                onOtpRequested,
                                onSuccess,
                                onError
                            });
                        }
                    } catch (e) {
                        onError('Failed to parse message');
                    }
                }}
                onError={(e) => onError(e.nativeEvent.description)}
            />
        </View>
    );
});

