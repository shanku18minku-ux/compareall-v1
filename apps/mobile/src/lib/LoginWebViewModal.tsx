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
        // Primary check: URL matches success pattern
        if (packet.successUrlPattern && packet.successUrlPattern.test(url) && !url.includes('login') && !url.includes('otp')) {
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
                        <View>
                            <Text style={styles.headerTitle}>Login to {providerName}</Text>
                            <Text style={styles.headerSub}>We'll detect when you're logged in automatically</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handleClose} style={styles.closeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
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
                    scalesPageToFit={false}
                    bounces={false}
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
