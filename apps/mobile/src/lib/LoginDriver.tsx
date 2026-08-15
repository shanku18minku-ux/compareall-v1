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

    useImperativeHandle(ref, () => ({
        submitPhone: (phoneNumber: string) => {
            webViewRef.current?.injectJavaScript(`
                window.dispatchEvent(new CustomEvent('NATIVE_ACTION', { 
                    detail: { type: 'PHONE', value: '${phoneNumber}' } 
                }));
                true;
            `);
        },
        submitOtp: (otpValue: string) => {
            webViewRef.current?.injectJavaScript(`
                window.dispatchEvent(new CustomEvent('NATIVE_ACTION', { 
                    detail: { type: 'OTP', value: '${otpValue}' } 
                }));
                true;
            `);
        }
    }));

    // Check if the packet actually exists
    if (!packet) {
       console.error(`No packet registered for provider: ${providerId}`);
       return null;
    }

    const injectedScript = packet.getLoginInjectionScript();

    return (
        <View style={{ position: 'absolute', top: -1000, left: -1000, width: 1, height: 1, opacity: 0 }}>
            <WebView
                ref={webViewRef}
                source={{ uri: url }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            thirdPartyCookiesEnabled={true}
            injectedJavaScript={injectedScript}
            userAgent="Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36"
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

