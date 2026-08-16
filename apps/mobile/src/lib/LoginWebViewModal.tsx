import React, { useRef, useState, useCallback } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    Vibration,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { getPacket } from './packets/registry';

interface LoginWebViewModalProps {
    visible: boolean;
    providerId: string;
    providerName: string;
    providerIcon: string;
    loginUrl: string;
    location?: { latitude: number; longitude: number; name: string } | null;
    onSuccess: () => void;
    onClose: () => void;
}

/**
 * Shows the REAL platform website in a beautiful modal sheet.
 * Detects login success via:
 *   1. URL pattern change (primary) — no API needed
 *   2. DOM-injected script (backup) — checks for logout button etc.
 *
 * This approach NEVER breaks because we let the platform handle its own login UI.
 */
export const LoginWebViewModal: React.FC<LoginWebViewModalProps> = ({
    visible,
    providerId,
    providerName,
    providerIcon,
    loginUrl,
    location,
    onSuccess,
    onClose,
}) => {
    const webViewRef = useRef<WebView>(null);
    const [loading, setLoading] = useState(true);
    const successFiredRef = useRef(false);

    const packet = getPacket(providerId);

    const handleSuccess = useCallback(() => {
        if (successFiredRef.current) return;
        successFiredRef.current = true;
        Vibration.vibrate(50);
        onSuccess();
    }, [onSuccess]);

    const handleNavigationStateChange = useCallback((navState: WebViewNavigation) => {
        if (!packet || successFiredRef.current) return;
        const url = navState.url || '';
        if (url && packet.successUrlPattern && packet.successUrlPattern.test(url)) {
            handleSuccess();
        }
    }, [packet, handleSuccess]);

    const handleMessage = useCallback((event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'SUCCESS') handleSuccess();
        } catch (_) {}
    }, [handleSuccess]);

    const handleClose = () => {
        successFiredRef.current = false;
        setLoading(true);
        onClose();
    };

    const locName = location?.name || 'Medininagar, Jharkhand';
    const userLat = location?.latitude || 24.0416;
    const userLng = location?.longitude || 84.0706;

    // Inject geolocation, LocalStorage, SessionStorage & Cookies before page scripts load
    const beforeContentScript = `
        (function() {
            var lat = ${userLat};
            var lng = ${userLng};
            var locName = ${JSON.stringify(locName)};

            // 1. High-Precision Geolocation Override
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition = function(success, error, options) {
                    if (success) {
                        success({
                            coords: {
                                latitude: lat,
                                longitude: lng,
                                accuracy: 5,
                                altitude: null,
                                altitudeAccuracy: null,
                                heading: null,
                                speed: null
                            },
                            timestamp: Date.now()
                        });
                    }
                };
                navigator.geolocation.watchPosition = function(success, error, options) {
                    if (navigator.geolocation.getCurrentPosition) {
                        navigator.geolocation.getCurrentPosition(success, error, options);
                    }
                    return 1;
                };
            }

            // 2. Set LocalStorage & SessionStorage for Swiggy, Zomato, Blinkit, Ola, Rapido, etc.
            try {
                var cityPart = locName.split(',')[0].trim();
                var locObj = { lat: lat, lng: lng, address: locName, name: locName, city: cityPart };
                var locStr = JSON.stringify(locObj);
                
                // Swiggy specific storage keys
                localStorage.setItem('userLocation', locStr);
                localStorage.setItem('location', locStr);
                localStorage.setItem('swiggy_address', locName);
                localStorage.setItem('swiggy_city', cityPart);
                localStorage.setItem('swiggy_lat', String(lat));
                localStorage.setItem('swiggy_lng', String(lng));
                localStorage.setItem('swiggy_userLocation', locStr);
                sessionStorage.setItem('userLocation', locStr);
                sessionStorage.setItem('location', locStr);

                // Zomato, Blinkit & general platform storage keys
                localStorage.setItem('current_location', locStr);
                localStorage.setItem('user_coords', JSON.stringify({ latitude: lat, longitude: lng }));
            // 4. Intercept network requests (fetch & XHR) for instant OTP verification detection
            try {
                var origFetch = window.fetch;
                if (origFetch) {
                    window.fetch = function() {
                        var args = arguments;
                        var url = (args[0] && typeof args[0] === 'string') ? args[0] : (args[0] && args[0].url ? args[0].url : '');
                        return origFetch.apply(this, args).then(function(res) {
                            try {
                                if (url && (url.indexOf('auth') !== -1 || url.indexOf('otp') !== -1 || url.indexOf('verify') !== -1 || url.indexOf('login') !== -1 || url.indexOf('session') !== -1)) {
                                    if (res.status >= 200 && res.status < 300) {
                                        setTimeout(function() {
                                            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS' }));
                                        }, 600);
                                    }
                                }
                            } catch(e) {}
                            return res;
                        });
                    };
                }

                var origOpen = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function(method, url) {
                    this.addEventListener('load', function() {
                        try {
                            var urlStr = String(url || '');
                            if (urlStr && (urlStr.indexOf('auth') !== -1 || urlStr.indexOf('otp') !== -1 || urlStr.indexOf('verify') !== -1 || urlStr.indexOf('login') !== -1)) {
                                if (this.status >= 200 && this.status < 300) {
                                    setTimeout(function() {
                                        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SUCCESS' }));
                                    }, 600);
                                }
                            }
                        } catch(e) {}
                    });
                    return origOpen.apply(this, arguments);
                };
            } catch(e) {}
        })();
        true;
    `;

    const injectionScript = packet ? packet.getLoginDetectionScript() : 'true;';

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <SafeAreaView style={styles.container}>
                {/* ── Header ──────────────────────────────────────── */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerIcon}>{providerIcon}</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.headerTitle}>Login to {providerName}</Text>
                            <Text style={styles.headerSub}>Enter mobile & OTP to link account</Text>
                        </View>
                    </View>
                    <View style={styles.headerRightActions}>
                        <TouchableOpacity onPress={handleSuccess} style={styles.doneLinkBtn}>
                            <Text style={styles.doneLinkBtnText}>✓ Connected</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleClose} style={styles.closeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── Loading bar ──────────────────────────────────── */}
                {loading && (
                    <View style={styles.loadingBar}>
                        <View style={styles.loadingBarInner} />
                    </View>
                )}

                {/* ── Real WebView ─────────────────────────────────── */}
                <WebView
                    ref={webViewRef}
                    source={{ uri: loginUrl }}
                    style={styles.webview}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    thirdPartyCookiesEnabled={true}
                    sharedCookiesEnabled={true}
                    geolocationEnabled={true}
                    mixedContentMode="always"
                    bounces={false}
                    userAgent="Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
                    injectedJavaScriptBeforeContentLoaded={beforeContentScript}
                    injectedJavaScript={injectionScript}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                    onNavigationStateChange={handleNavigationStateChange}
                    onMessage={handleMessage}
                    allowsInlineMediaPlayback={true}
                />
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    headerIcon: {
        fontSize: 28,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111',
    },
    headerSub: {
        fontSize: 11,
        color: '#999',
        marginTop: 1,
    },
    headerRightActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    doneLinkBtn: {
        backgroundColor: '#16a34a',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
    },
    doneLinkBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    closeBtn: {
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeText: {
        fontSize: 14,
        color: '#555',
        fontWeight: '600',
    },
    loadingBar: {
        height: 3,
        backgroundColor: '#eee',
        overflow: 'hidden',
    },
    loadingBarInner: {
        height: 3,
        width: '60%',
        backgroundColor: '#FC8019',
        borderRadius: 2,
    },
    webview: {
        flex: 1,
    },
});
