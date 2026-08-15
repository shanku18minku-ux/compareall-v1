import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { WebView } from 'react-native-webview';

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

    // Imperative API for zero-latency form submission from native UI
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

    // Generic base script without any platform-specific logic
    const baseScript = `
        // Platform specific scripts will be injected here via modular packets
        window.addEventListener('NATIVE_ACTION', function(e) {
            try {
                var action = e.detail;
                console.log('Action received:', action);
                // Implementation will be handled by specific provider packets
            } catch (err) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ERROR', message: err.message }));
            }
        });
        true;
    `;

    return (
        <WebView
            ref={webViewRef}
            source={{ uri: url }}
            style={{ display: 'none', width: 0, height: 0 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            thirdPartyCookiesEnabled={true}
            injectedJavaScript={baseScript}
            userAgent="Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36"
            onMessage={(event) => {
                try {
                    const data = JSON.parse(event.nativeEvent.data);
                    if (data.type === 'OTP_REQUESTED') onOtpRequested();
                    if (data.type === 'SUCCESS') onSuccess();
                    if (data.type === 'ERROR') onError(data.message);
                } catch (e) {
                    onError('Failed to parse message');
                }
            }}
            onError={(e) => onError(e.nativeEvent.description)}
        />
    );
});
