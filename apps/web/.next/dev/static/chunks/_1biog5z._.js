(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/components/LocationSelector.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LocationSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
function LocationSelector({ location, onLocationChange }) {
    _s();
    const [isLocating, setIsLocating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [manualQuery, setManualQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const requestGPS = ()=>{
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            setError('Geolocation not supported by browser.');
            return;
        }
        setIsLocating(true);
        setError('');
        navigator.geolocation.getCurrentPosition(async (position)=>{
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            let label = 'Current GPS Location';
            try {
                // Changed zoom to 18 for building/street level precision
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.address) {
                        const a = data.address;
                        // Extract the most granular details available
                        const exactPoint = a.amenity || a.building || a.shop || a.house_number || a.house_name || '';
                        const localArea = a.road || a.neighbourhood || a.suburb || a.residential || '';
                        const city = a.city || a.town || a.village || a.county || a.state_district || '';
                        const parts = [];
                        if (exactPoint) parts.push(exactPoint);
                        if (localArea) parts.push(localArea);
                        if (city) parts.push(city);
                        if (!city && a.state) parts.push(a.state); // fallback
                        if (parts.length > 0) {
                            label = parts.join(', ');
                        } else if (data.display_name) {
                            // Fallback to a truncated display name
                            label = data.display_name.split(',').slice(0, 3).join(', ');
                        }
                    }
                }
            } catch (e) {
                console.error("Reverse geocoding failed", e);
            }
            setIsLocating(false);
            onLocationChange({
                lat,
                lng,
                label
            });
        }, (err)=>{
            setIsLocating(false);
            setError('Location access denied or failed.');
        });
    };
    const handleManualSet = ()=>{
        if (!manualQuery.trim()) return;
        onLocationChange({
            pincode: manualQuery.trim(),
            label: manualQuery.trim()
        });
        setManualQuery('');
        setError('');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "location-selector",
        style: {
            background: 'var(--card-bg)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            marginBottom: '1rem'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Deliver/Search At: "
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/LocationSelector.tsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: 'var(--primary)',
                                    fontWeight: '500'
                                },
                                children: location ? location.label : 'Select location'
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/LocationSelector.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/LocationSelector.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: requestGPS,
                        disabled: isLocating,
                        style: {
                            background: 'var(--foreground)',
                            color: 'white',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer'
                        },
                        children: isLocating ? 'Detecting...' : '📍 Use GPS'
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/LocationSelector.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/LocationSelector.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: '0.5rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        placeholder: "Enter Pincode or City manually",
                        value: manualQuery,
                        onChange: (e)=>setManualQuery(e.target.value),
                        style: {
                            flex: 1,
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid var(--border)'
                        }
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/LocationSelector.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleManualSet,
                        style: {
                            background: 'var(--border)',
                            color: 'var(--foreground)',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer'
                        },
                        children: "Set"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/LocationSelector.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/LocationSelector.tsx",
                lineNumber: 95,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    color: 'red',
                    fontSize: '0.8rem',
                    marginTop: '0.5rem'
                },
                children: error
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/LocationSelector.tsx",
                lineNumber: 108,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/LocationSelector.tsx",
        lineNumber: 84,
        columnNumber: 5
    }, this);
}
_s(LocationSelector, "vl+R0StbtiQaNbZ3TQhzCwsyqtE=");
_c = LocationSelector;
var _c;
__turbopack_context__.k.register(_c, "LocationSelector");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/OTPModal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OTPModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/firebase.ts [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'firebase/auth'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function OTPModal({ providerName, isOpen, onClose, onSuccess }) {
    _s();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [phone, setPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [otp, setOtp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [confirmationResult, setConfirmationResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const recaptchaVerifierRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Setup invisible reCAPTCHA when modal opens
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OTPModal.useEffect": ()=>{
            if (!isOpen) return;
            // Clean up any previous instance
            if (recaptchaVerifierRef.current) {
                recaptchaVerifierRef.current.clear();
                recaptchaVerifierRef.current = null;
            }
            const timer = setTimeout({
                "OTPModal.useEffect.timer": ()=>{
                    try {
                        recaptchaVerifierRef.current = new RecaptchaVerifier(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], 'recaptcha-container', {
                            size: 'invisible',
                            callback: {
                                "OTPModal.useEffect.timer": ()=>{}
                            }["OTPModal.useEffect.timer"]
                        });
                    } catch (e) {
                        console.error('reCAPTCHA init error:', e);
                    }
                }
            }["OTPModal.useEffect.timer"], 300);
            return ({
                "OTPModal.useEffect": ()=>{
                    clearTimeout(timer);
                    if (recaptchaVerifierRef.current) {
                        recaptchaVerifierRef.current.clear();
                        recaptchaVerifierRef.current = null;
                    }
                }
            })["OTPModal.useEffect"];
        }
    }["OTPModal.useEffect"], [
        isOpen
    ]);
    const resetModal = ()=>{
        setStep(1);
        setPhone('');
        setOtp('');
        setError('');
        setConfirmationResult(null);
    };
    const handleClose = ()=>{
        resetModal();
        onClose();
    };
    const handleSendOtp = async (e)=>{
        e.preventDefault();
        if (phone.length !== 10) {
            setError('Please enter a valid 10-digit phone number.');
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            if (!recaptchaVerifierRef.current) {
                throw new Error('reCAPTCHA not initialized. Please refresh and try again.');
            }
            const fullPhone = `+91${phone}`;
            const result = await signInWithPhoneNumber(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], fullPhone, recaptchaVerifierRef.current);
            setConfirmationResult(result);
            setStep(2);
        } catch (err) {
            console.error('OTP send error:', err);
            const msg = err?.code === 'auth/too-many-requests' ? 'Too many attempts. Please wait a few minutes and try again.' : err?.code === 'auth/invalid-phone-number' ? 'Invalid phone number. Please check and try again.' : err?.code === 'auth/captcha-check-failed' ? 'Security check failed. Please refresh the page and try again.' : 'Failed to send OTP. Please try again.';
            setError(msg);
        } finally{
            setIsLoading(false);
        }
    };
    const handleVerifyOtp = async (e)=>{
        e.preventDefault();
        if (otp.length < 6) {
            setError('Please enter the 6-digit OTP.');
            return;
        }
        if (!confirmationResult) {
            setError('Session expired. Please request OTP again.');
            setStep(1);
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            await confirmationResult.confirm(otp);
            onSuccess();
            resetModal();
            onClose();
        } catch (err) {
            console.error('OTP verify error:', err);
            const msg = err?.code === 'auth/invalid-verification-code' ? 'Incorrect OTP. Please check the code and try again.' : err?.code === 'auth/code-expired' ? 'OTP has expired. Please request a new one.' : 'Verification failed. Please try again.';
            setError(msg);
        } finally{
            setIsLoading(false);
        }
    };
    if (!isOpen) return null;
    const inputStyle = {
        flex: 1,
        padding: '0.75rem',
        border: '1px solid var(--border)',
        borderRadius: '0 6px 6px 0',
        fontSize: '1rem',
        background: 'var(--background)',
        color: 'var(--foreground)',
        width: '100%',
        outline: 'none'
    };
    const btnStyle = {
        width: '100%',
        padding: '0.75rem',
        background: 'var(--primary)',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.7 : 1,
        transition: 'opacity 0.2s'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '1rem'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "recaptcha-container"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    background: 'var(--card-bg)',
                    width: '100%',
                    maxWidth: '400px',
                    borderRadius: '12px',
                    padding: '2rem',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                    position: 'relative',
                    color: 'var(--foreground)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleClose,
                        style: {
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: 'var(--muted)'
                        },
                        children: "×"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        style: {
                            marginTop: 0,
                            marginBottom: '0.5rem'
                        },
                        children: [
                            "Connect ",
                            providerName
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                        lineNumber: 177,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            color: 'var(--muted)',
                            fontSize: '0.875rem',
                            marginBottom: '1.5rem'
                        },
                        children: [
                            "We use your number to fetch ",
                            providerName,
                            " specific discounts.",
                            ' ',
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Your credentials will only be saved locally on this device."
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                                lineNumber: 180,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: '#fee2e2',
                            border: '1px solid #fca5a5',
                            borderRadius: '6px',
                            padding: '0.75rem',
                            marginBottom: '1rem',
                            color: '#b91c1c',
                            fontSize: '0.875rem'
                        },
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                        lineNumber: 184,
                        columnNumber: 11
                    }, this),
                    step === 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSendOtp,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: '1.5rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: 'bold',
                                            marginBottom: '0.5rem'
                                        },
                                        children: "Phone Number"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                                        lineNumber: 196,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    padding: '0.75rem',
                                                    background: 'var(--background)',
                                                    border: '1px solid var(--border)',
                                                    borderRight: 'none',
                                                    borderRadius: '6px 0 0 6px',
                                                    color: 'var(--muted)',
                                                    whiteSpace: 'nowrap'
                                                },
                                                children: "+91"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                                                lineNumber: 200,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "tel",
                                                value: phone,
                                                onChange: (e)=>{
                                                    setError('');
                                                    setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                                                },
                                                placeholder: "Enter your registered number",
                                                style: inputStyle,
                                                autoFocus: true
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                                                lineNumber: 208,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                                        lineNumber: 199,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                                lineNumber: 195,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: isLoading || phone.length !== 10,
                                style: btnStyle,
                                children: isLoading ? 'Sending OTP...' : 'Get OTP'
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                                lineNumber: 221,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                        lineNumber: 194,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleVerifyOtp,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginBottom: '1.5rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: 'bold',
                                            marginBottom: '0.5rem'
                                        },
                                        children: "Enter OTP"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                                        lineNumber: 228,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: otp,
                                        onChange: (e)=>{
                                            setError('');
                                            setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                                        },
                                        placeholder: "Enter 6-digit OTP",
                                        style: {
                                            ...inputStyle,
                                            borderRadius: '6px',
                                            textAlign: 'center',
                                            letterSpacing: '0.5rem',
                                            fontSize: '1.25rem'
                                        },
                                        autoFocus: true
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                                        lineNumber: 231,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            fontSize: '0.75rem',
                                            color: 'var(--muted)',
                                            marginTop: '0.5rem',
                                            textAlign: 'center'
                                        },
                                        children: [
                                            "OTP sent to +91 ",
                                            phone,
                                            ".",
                                            ' ',
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>{
                                                    setStep(1);
                                                    setOtp('');
                                                    setError('');
                                                },
                                                style: {
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'var(--primary)',
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer'
                                                },
                                                children: "Change"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                                                lineNumber: 247,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                                        lineNumber: 245,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                                lineNumber: 227,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: isLoading || otp.length < 6,
                                style: btnStyle,
                                children: isLoading ? 'Verifying...' : 'Verify & Connect'
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                                lineNumber: 256,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                        lineNumber: 226,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/OTPModal.tsx",
        lineNumber: 154,
        columnNumber: 5
    }, this);
}
_s(OTPModal, "5IvCPOmmcObeLaNlydvQ/3OaJP4=");
_c = OTPModal;
var _c;
__turbopack_context__.k.register(_c, "OTPModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/QuickConnect.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QuickConnect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useStorage.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$OTPModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/OTPModal.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const QUICK_PROVIDERS = [
    {
        id: 'food-a',
        name: 'Swiggy',
        icon: '🍔',
        color: '#fc8019'
    },
    {
        id: 'food-b',
        name: 'Zomato',
        icon: '🍕',
        color: '#e23744'
    },
    {
        id: 'grocery-a',
        name: 'Blinkit',
        icon: '🛒',
        color: '#f8cb46'
    },
    {
        id: 'retail-a',
        name: 'Amazon',
        icon: '📦',
        color: '#232f3e'
    }
];
function QuickConnect() {
    _s();
    const { connections, actions, isHydrated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStorage"])();
    const [modalOpen, setModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedProvider, setSelectedProvider] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    if (!isHydrated) return null;
    const handleConnectClick = (providerId, providerName)=>{
        const isConnected = connections.some((c)=>c.providerId === providerId && c.status === 'connected');
        if (isConnected) {
            actions.disconnectProvider(providerId);
        } else {
            setSelectedProvider({
                id: providerId,
                name: providerName
            });
            setModalOpen(true);
        }
    };
    const handleOtpSuccess = ()=>{
        if (selectedProvider) {
            actions.connectProvider(selectedProvider.id);
            setModalOpen(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                style: {
                    marginTop: 0,
                    marginBottom: '1rem',
                    fontSize: '1.1rem'
                },
                children: "Link your accounts for better deals"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap'
                },
                children: QUICK_PROVIDERS.map((provider)=>{
                    const isConnected = connections.some((c)=>c.providerId === provider.id && c.status === 'connected');
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>handleConnectClick(provider.id, provider.name),
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            border: `1px solid ${isConnected ? provider.color : 'var(--border)'}`,
                            borderRadius: '8px',
                            background: isConnected ? `${provider.color}15` : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            minWidth: '140px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: provider.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '1rem'
                                },
                                children: provider.icon
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                lineNumber: 70,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    textAlign: 'left'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 'bold',
                                            fontSize: '0.9rem'
                                        },
                                        children: provider.name
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                        lineNumber: 79,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '0.75rem',
                                            color: isConnected ? provider.color : 'var(--muted)'
                                        },
                                        children: isConnected ? 'Connected ✓' : 'Connect'
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                        lineNumber: 80,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                lineNumber: 78,
                                columnNumber: 15
                            }, this)
                        ]
                    }, provider.id, true, {
                        fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                        lineNumber: 54,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            selectedProvider && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$OTPModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                providerName: selectedProvider.name,
                isOpen: modalOpen,
                onClose: ()=>setModalOpen(false),
                onSuccess: handleOtpSuccess
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                lineNumber: 90,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
_s(QuickConnect, "wgibsKvqXeOVi3Yq97TGQYYlYTI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStorage"]
    ];
});
_c = QuickConnect;
var _c;
__turbopack_context__.k.register(_c, "QuickConnect");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/components/SearchInterface.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SearchInterface
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$LocationSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/LocationSelector.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useStorage.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function SearchInterface() {
    _s();
    const { isHydrated, history, location, wishlist, connections, actions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStorage"])();
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSearching, setIsSearching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sortOrder, setSortOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('price_asc');
    const [dataSource, setDataSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('demo');
    const [isLive, setIsLive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Filters state
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    // Compare state
    const [compareTray, setCompareTray] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showCompareModal, setShowCompareModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [expandedOfferId, setExpandedOfferId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Extension state
    const [extensionReady, setExtensionReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [wishlistIds, setWishlistIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [manualLocQuery, setManualLocQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchInterface.useEffect": ()=>{
            setWishlistIds(new Set(wishlist.map({
                "SearchInterface.useEffect": (item)=>item.id
            }["SearchInterface.useEffect"])));
        }
    }["SearchInterface.useEffect"], [
        wishlist
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchInterface.useEffect": ()=>{
            // Check if extension was injected before React mounted
            if (document.documentElement.getAttribute('data-compareall-extension') === 'true') {
                setExtensionReady(true);
            }
            // Listen for extension readiness and search results
            const handleMessage = {
                "SearchInterface.useEffect.handleMessage": async (event)=>{
                    if (event.data?.type === "COMPAREALL_EXTENSION_READY") {
                        console.log("Extension detected and ready!");
                        setExtensionReady(true);
                    }
                    if (event.data?.type === "COMPAREALL_LIVE_SEARCH_RESULT") {
                        const rawResults = event.data.results;
                        // Send these raw results to backend /live endpoint for grouping
                        try {
                            const API_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                            const res = await fetch(`${API_URL}/api/compare/live`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    query: searchTerm,
                                    results: rawResults
                                })
                            });
                            const json = await res.json();
                            if (json.success) {
                                setResults(json.results);
                                setDataSource(json.dataSource);
                                setIsLive(json.isLive);
                            }
                        } catch (e) {
                            console.error("Failed to process live results:", e);
                        } finally{
                            setIsSearching(false);
                        }
                    }
                }
            }["SearchInterface.useEffect.handleMessage"];
            window.addEventListener("message", handleMessage);
            return ({
                "SearchInterface.useEffect": ()=>window.removeEventListener("message", handleMessage)
            })["SearchInterface.useEffect"];
        }
    }["SearchInterface.useEffect"], [
        searchTerm
    ]);
    const handleSearch = async (e, termToSearch, newSortOrder, newFilters)=>{
        if (e) e.preventDefault();
        const query = (termToSearch !== undefined ? termToSearch : searchTerm).trim();
        if (!query) return;
        setSearchTerm(query);
        actions.addSearchHistory(query);
        setIsSearching(true);
        try {
            if (extensionReady) {
                // Trigger live search via extension instead of mock backend
                window.postMessage({
                    type: "COMPAREALL_LIVE_SEARCH",
                    payload: {
                        query: termToSearch || searchTerm
                    }
                }, "*");
            } else {
                // Fallback to Next.js API Route (which uses the real proxies we built)
                const connectedIds = connections.filter((c)=>c.status === 'connected').map((c)=>c.providerId);
                const res = await fetch(`/api/compare`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        query: termToSearch || searchTerm,
                        sortOrder: newSortOrder || sortOrder,
                        filters: newFilters || filters,
                        location: location,
                        connectedProviders: connectedIds
                    })
                });
                const json = await res.json();
                if (json.success) {
                    setResults(json.results);
                    setDataSource(json.dataSource);
                    setIsLive(json.isLive);
                    // Auto-disconnect connected services after the comparison is done
                    // as per the user's privacy and ephemeral connection requirement
                    connectedIds.forEach((id)=>{
                        actions.disconnectProvider(id);
                    });
                } else {
                    console.error("Backend error:", json.error);
                }
                setIsSearching(false);
            }
        } catch (error) {
            console.error("Search error:", error);
            setIsSearching(false);
        }
    };
    const toggleWishlist = (offer)=>{
        actions.toggleWishlist(offer);
    };
    const toggleCompare = (offer)=>{
        if (compareTray.find((o)=>o.id === offer.id)) {
            setCompareTray(compareTray.filter((o)=>o.id !== offer.id));
        } else {
            if (compareTray.length >= 4) {
                alert("You can only compare up to 4 items at a time.");
                return;
            }
            setCompareTray([
                ...compareTray,
                offer
            ]);
        }
    };
    const applyFilters = (updates)=>{
        const newFilters = {
            ...filters,
            ...updates
        };
        setFilters(newFilters);
        handleSearch(undefined, searchTerm, sortOrder, newFilters);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$LocationSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                location: location,
                onLocationChange: actions.saveLocation
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: (e)=>handleSearch(e),
                className: "search-box",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        className: "search-input",
                        placeholder: "What do you want? (e.g. Chicken Biryani, iPhone 16, Cab to airport)",
                        value: searchTerm,
                        onChange: (e)=>setSearchTerm(e.target.value)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 162,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "search-button",
                        disabled: isSearching,
                        children: isSearching ? 'Comparing...' : 'Compare Options'
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this),
            compareTray.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'var(--foreground)',
                    color: 'white',
                    padding: '1rem',
                    zIndex: 50,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: [
                                compareTray.length,
                                " items selected for comparison"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                            lineNumber: 178,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 177,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '1rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setCompareTray([]),
                                style: {
                                    color: '#9ca3af',
                                    textDecoration: 'underline'
                                },
                                children: "Clear"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 181,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowCompareModal(true),
                                style: {
                                    background: 'var(--primary)',
                                    color: 'white',
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '8px',
                                    fontWeight: 'bold'
                                },
                                children: "Compare Now"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 182,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 180,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 176,
                columnNumber: 9
            }, this),
            showCompareModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: 'white',
                        width: '100%',
                        maxWidth: '1000px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        borderRadius: '12px',
                        padding: '2rem'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '1.5rem'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Side-by-Side Comparison"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                    lineNumber: 197,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowCompareModal(false),
                                    style: {
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold'
                                    },
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                    lineNumber: 198,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                            lineNumber: 196,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                gap: '1rem',
                                overflowX: 'auto',
                                paddingBottom: '1rem'
                            },
                            children: compareTray.map((offer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        flex: '1',
                                        minWidth: '200px',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        padding: '1rem'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            style: {
                                                fontSize: '1.1rem',
                                                marginBottom: '0.5rem'
                                            },
                                            children: offer.providerName
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                            lineNumber: 204,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                color: 'var(--muted)',
                                                fontSize: '0.875rem',
                                                marginBottom: '1rem'
                                            },
                                            children: offer.title
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                            lineNumber: 205,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: '1.5rem',
                                                fontWeight: 'bold',
                                                color: 'var(--success)',
                                                marginBottom: '1rem'
                                            },
                                            children: [
                                                "â‚¹",
                                                offer.price.finalPayablePrice
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                            lineNumber: 207,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.5rem',
                                                fontSize: '0.875rem',
                                                marginBottom: '1.5rem'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Base Price:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 212,
                                                            columnNumber: 26
                                                        }, this),
                                                        " â‚¹",
                                                        offer.price.basePrice
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 212,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Fees & Taxes:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 213,
                                                            columnNumber: 26
                                                        }, this),
                                                        " â‚¹",
                                                        (offer.price.deliveryFee || 0) + (offer.price.platformFee || 0) + (offer.price.taxes || 0)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 213,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Discount:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 214,
                                                            columnNumber: 26
                                                        }, this),
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: 'var(--success)'
                                                            },
                                                            children: [
                                                                "-â‚¹",
                                                                offer.price.discount || 0
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 214,
                                                            columnNumber: 53
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Rating:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 215,
                                                            columnNumber: 26
                                                        }, this),
                                                        " ",
                                                        offer.rating ? `â­ ${offer.rating}` : 'N/A'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 215,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "ETA:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 216,
                                                            columnNumber: 26
                                                        }, this),
                                                        " ",
                                                        offer.estimatedTimeMins ? `${offer.estimatedTimeMins} mins` : 'N/A'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 216,
                                                    columnNumber: 21
                                                }, this),
                                                offer.distanceKm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Distance:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 217,
                                                            columnNumber: 47
                                                        }, this),
                                                        " ",
                                                        offer.distanceKm,
                                                        " km"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 217,
                                                    columnNumber: 42
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                            lineNumber: 211,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: offer.deepLinkUrl,
                                            target: "_blank",
                                            rel: "noreferrer",
                                            style: {
                                                display: 'block',
                                                textAlign: 'center',
                                                background: 'var(--primary)',
                                                color: 'white',
                                                padding: '0.75rem',
                                                borderRadius: '6px',
                                                fontWeight: 'bold'
                                            },
                                            children: "Book / Order"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                            lineNumber: 220,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, offer.id, true, {
                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                    lineNumber: 203,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                            lineNumber: 201,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                    lineNumber: 195,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 194,
                columnNumber: 9
            }, this),
            results.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    margin: '1.5rem 0',
                    padding: '1rem',
                    background: 'white',
                    borderRadius: '8px',
                    border: '1px solid var(--border)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                style: {
                                    fontSize: '1.1rem'
                                },
                                children: "Filters & Sorting"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 233,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: sortOrder,
                                onChange: (e)=>{
                                    const val = e.target.value;
                                    setSortOrder(val);
                                    handleSearch(undefined, searchTerm, val, filters);
                                },
                                style: {
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "price_asc",
                                        children: "Lowest Price First"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 243,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "price_desc",
                                        children: "Highest Price First"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 244,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "time_asc",
                                        children: "Fastest Delivery/Arrival"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 245,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "availability_desc",
                                        children: "Highest Availability"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 246,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "rating_desc",
                                        children: "Highest Rating"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 247,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "discount_desc",
                                        children: "Highest Discount"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 248,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 234,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 232,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '1rem',
                            flexWrap: 'wrap'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            fontSize: '0.75rem',
                                            color: 'var(--muted)',
                                            display: 'block'
                                        },
                                        children: "Max Price (â‚¹)"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 254,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        placeholder: "Any",
                                        value: filters.maxPrice || '',
                                        onChange: (e)=>applyFilters({
                                                maxPrice: e.target.value ? Number(e.target.value) : undefined
                                            }),
                                        style: {
                                            padding: '0.4rem',
                                            borderRadius: '4px',
                                            border: '1px solid var(--border)',
                                            width: '100px'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 255,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 253,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            fontSize: '0.75rem',
                                            color: 'var(--muted)',
                                            display: 'block'
                                        },
                                        children: "Min Rating"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 264,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: filters.minRating || 0,
                                        onChange: (e)=>applyFilters({
                                                minRating: Number(e.target.value)
                                            }),
                                        style: {
                                            padding: '0.4rem',
                                            borderRadius: '4px',
                                            border: '1px solid var(--border)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 0,
                                                children: "Any"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 270,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 3,
                                                children: "3+ Stars"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 271,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 4,
                                                children: "4+ Stars"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 272,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 4.5,
                                                children: "4.5+ Stars"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 273,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 265,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 263,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 252,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 231,
                columnNumber: 9
            }, this),
            results.length > 0 && connections.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    margin: '1rem 0',
                    padding: '1rem',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: '1 1 300px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                style: {
                                    margin: 0,
                                    color: '#1e3a8a',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "💡"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 284,
                                        columnNumber: 15
                                    }, this),
                                    " Get Cheaper Prices!"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 283,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    margin: '0.25rem 0 0 0',
                                    fontSize: '0.875rem',
                                    color: '#1e40af'
                                },
                                children: "Connect your Swiggy, Zomato, or Uber accounts to automatically apply your memberships (like Zomato Gold) and see your personalized cheaper prices. Data stays on your device."
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 286,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 282,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "/connected-services",
                        style: {
                            background: '#2563eb',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap'
                        },
                        children: "Connect Accounts"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 290,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 281,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "results-container",
                style: {
                    paddingBottom: compareTray.length > 0 ? '5rem' : '0'
                },
                children: results.length > 0 ? results.map((group, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grouped-result",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grouped-result-header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "grouped-result-category",
                                        children: group.category
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 301,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "grouped-result-title",
                                        children: group.title
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 302,
                                        columnNumber: 17
                                    }, this),
                                    group.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: 'var(--muted)'
                                        },
                                        children: group.description
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 303,
                                        columnNumber: 39
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 300,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '1rem',
                                    flexWrap: 'wrap',
                                    marginBottom: '1rem',
                                    padding: '0.75rem',
                                    backgroundColor: 'var(--card-bg)',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)'
                                },
                                children: [
                                    group.lowestPrice !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '0.85rem',
                                                    color: 'var(--muted)',
                                                    display: 'block'
                                                },
                                                children: "Best Price"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 309,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                style: {
                                                    fontSize: '1.25rem',
                                                    color: 'var(--primary)'
                                                },
                                                children: [
                                                    "₹",
                                                    group.lowestPrice
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 310,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 308,
                                        columnNumber: 21
                                    }, this),
                                    group.savings !== undefined && group.savings > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '0.85rem',
                                                    color: 'var(--success)',
                                                    display: 'block'
                                                },
                                                children: "You Save"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 315,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                style: {
                                                    fontSize: '1.25rem',
                                                    color: '#10b981'
                                                },
                                                children: [
                                                    "₹",
                                                    group.savings
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 316,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 314,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '0.85rem',
                                                    color: 'var(--muted)',
                                                    display: 'block'
                                                },
                                                children: "Data Source"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 320,
                                                columnNumber: 21
                                            }, this),
                                            isLive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                style: {
                                                    fontSize: '1rem',
                                                    color: '#047857',
                                                    backgroundColor: '#d1fae5',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px'
                                                },
                                                children: [
                                                    dataSource.toUpperCase(),
                                                    " - LIVE"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 322,
                                                columnNumber: 23
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                style: {
                                                    fontSize: '1rem',
                                                    color: '#b45309',
                                                    backgroundColor: '#fef3c7',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px'
                                                },
                                                children: [
                                                    dataSource.toUpperCase(),
                                                    " - MOCK"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 324,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 319,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 306,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "provider-list",
                                children: group.offers.map((offer, offerIdx)=>{
                                    const isExpanded = expandedOfferId === offer.id;
                                    const isWishlisted = wishlistIds.has(offer.id);
                                    const isBest = offerIdx === 0 && offer.status !== 'UNAVAILABLE' && sortOrder === 'price_asc';
                                    const inCompare = compareTray.some((o)=>o.id === offer.id);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `provider-card ${isBest ? 'best-price' : ''} ${offer.status === 'UNAVAILABLE' ? 'opacity-50' : ''}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "provider-info",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: inCompare,
                                                                onChange: ()=>toggleCompare(offer),
                                                                disabled: offer.status === 'UNAVAILABLE',
                                                                style: {
                                                                    width: '1.25rem',
                                                                    height: '1.25rem',
                                                                    cursor: 'pointer'
                                                                },
                                                                title: "Add to comparison"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 339,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    flex: 1,
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'flex-start'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        style: {
                                                                            margin: 0,
                                                                            paddingRight: '10px'
                                                                        },
                                                                        children: [
                                                                            offer.title,
                                                                            " ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontSize: '0.8rem',
                                                                                    color: 'var(--muted)',
                                                                                    fontWeight: 'normal'
                                                                                },
                                                                                children: [
                                                                                    "via ",
                                                                                    offer.providerName
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                                lineNumber: 349,
                                                                                columnNumber: 43
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "status-badge",
                                                                                style: {
                                                                                    background: offer.status === 'LIVE' ? '#dbeafe' : '#fef3c7',
                                                                                    color: offer.status === 'LIVE' ? '#1e3a8a' : '#92400e'
                                                                                },
                                                                                children: offer.status
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                                lineNumber: 350,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            isBest && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "status-badge",
                                                                                style: {
                                                                                    background: '#dcfce7',
                                                                                    color: '#166534'
                                                                                },
                                                                                children: "BEST"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                                lineNumber: 351,
                                                                                columnNumber: 40
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                        lineNumber: 348,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>toggleWishlist(offer),
                                                                        style: {
                                                                            background: 'none',
                                                                            border: 'none',
                                                                            cursor: 'pointer',
                                                                            fontSize: '1.25rem'
                                                                        },
                                                                        children: isWishlisted ? '❤️' : '♡'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                        lineNumber: 353,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 347,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                        lineNumber: 338,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "provider-meta",
                                                        style: {
                                                            flexDirection: 'column',
                                                            gap: '0.25rem',
                                                            marginTop: '0.5rem',
                                                            marginLeft: '1.75rem'
                                                        },
                                                        children: [
                                                            offer.isAvailable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--success)',
                                                                    fontWeight: '500'
                                                                },
                                                                children: "Available"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 360,
                                                                columnNumber: 46
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--warning)'
                                                                },
                                                                children: "Unavailable"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 360,
                                                                columnNumber: 124
                                                            }, this),
                                                            offer.accountBenefits && offer.accountBenefits.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    marginTop: '0.25rem'
                                                                },
                                                                children: offer.accountBenefits.map((benefit, bIdx)=>{
                                                                    const isDemo = benefit.includes('[DEMO]');
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        style: {
                                                                            display: 'inline-block',
                                                                            background: isDemo ? '#f3f4f6' : '#dcfce7',
                                                                            color: isDemo ? '#4b5563' : '#166534',
                                                                            border: isDemo ? '1px dashed #9ca3af' : '1px solid #166534',
                                                                            padding: '0.25rem 0.5rem',
                                                                            borderRadius: '4px',
                                                                            fontSize: '0.75rem',
                                                                            fontWeight: 'bold',
                                                                            marginRight: '0.5rem'
                                                                        },
                                                                        children: [
                                                                            isDemo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    marginRight: '4px'
                                                                                },
                                                                                children: "⚠"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                                lineNumber: 378,
                                                                                columnNumber: 47
                                                                            }, this),
                                                                            benefit
                                                                        ]
                                                                    }, bIdx, true, {
                                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                        lineNumber: 367,
                                                                        columnNumber: 34
                                                                    }, this);
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 363,
                                                                columnNumber: 27
                                                            }, this),
                                                            offer.estimatedTimeMins ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "ETA: ",
                                                                    offer.estimatedTimeMins,
                                                                    " min"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 386,
                                                                columnNumber: 52
                                                            }, this) : null,
                                                            offer.distanceKm ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Distance: ",
                                                                    offer.distanceKm,
                                                                    " km"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 387,
                                                                columnNumber: 45
                                                            }, this) : null,
                                                            offer.rating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Reputation: ⭐ ",
                                                                    offer.rating,
                                                                    " (",
                                                                    offer.reviewCount || 0,
                                                                    " reviews)"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 388,
                                                                columnNumber: 42
                                                            }, this),
                                                            offer.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'red',
                                                                    fontWeight: 'bold'
                                                                },
                                                                children: offer.error
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 389,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                        lineNumber: 359,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 337,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "provider-price",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            textAlign: 'right'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setExpandedOfferId(isExpanded ? null : offer.id),
                                                            style: {
                                                                fontSize: '0.75rem',
                                                                background: 'none',
                                                                border: 'none',
                                                                color: 'var(--primary)',
                                                                cursor: 'pointer',
                                                                marginBottom: '0.5rem'
                                                            },
                                                            children: isExpanded ? 'Hide Details ▲' : 'Show Details ▼'
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 395,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                        lineNumber: 394,
                                                        columnNumber: 23
                                                    }, this),
                                                    isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "price-breakdown",
                                                        style: {
                                                            textAlign: 'right',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: '0.25rem'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Base price: ₹",
                                                                    offer.price.basePrice
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 405,
                                                                columnNumber: 27
                                                            }, this),
                                                            (offer.price.deliveryFee || 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Delivery fee: ₹",
                                                                    offer.price.deliveryFee
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 406,
                                                                columnNumber: 66
                                                            }, this),
                                                            (offer.price.platformFee || 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Platform fee: ₹",
                                                                    offer.price.platformFee
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 407,
                                                                columnNumber: 66
                                                            }, this),
                                                            (offer.price.taxes || 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Taxes: ₹",
                                                                    offer.price.taxes
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 408,
                                                                columnNumber: 60
                                                            }, this),
                                                            (offer.price.discount || 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--success)'
                                                                },
                                                                children: [
                                                                    "Discount: -₹",
                                                                    offer.price.discount
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 409,
                                                                columnNumber: 63
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                        lineNumber: 404,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "final-price",
                                                        style: {
                                                            marginTop: '0.5rem',
                                                            borderTop: isExpanded ? '1px solid var(--border)' : 'none',
                                                            paddingTop: isExpanded ? '0.5rem' : '0'
                                                        },
                                                        children: [
                                                            offer.originalPrice && offer.originalPrice > offer.price.finalPayablePrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    textDecoration: 'line-through',
                                                                    color: 'var(--muted)',
                                                                    fontSize: '0.875rem',
                                                                    marginRight: '0.5rem'
                                                                },
                                                                children: [
                                                                    "₹",
                                                                    offer.originalPrice
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 415,
                                                                columnNumber: 28
                                                            }, this),
                                                            "₹",
                                                            offer.price.finalPayablePrice
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                        lineNumber: 413,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: offer.status === 'UNAVAILABLE' ? '#' : offer.deepLinkUrl,
                                                        target: offer.status === 'UNAVAILABLE' ? '_self' : "_blank",
                                                        rel: "noreferrer",
                                                        className: "continue-btn",
                                                        style: {
                                                            opacity: offer.status === 'UNAVAILABLE' ? 0.5 : 1,
                                                            pointerEvents: offer.status === 'UNAVAILABLE' ? 'none' : 'auto',
                                                            marginTop: '0.5rem'
                                                        },
                                                        children: "View / Book"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                        lineNumber: 420,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 393,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, offer.id, true, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 336,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 328,
                                columnNumber: 17
                            }, this)
                        ]
                    }, idx, true, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 299,
                        columnNumber: 13
                    }, this)) : !isSearching && searchTerm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "No results found."
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                    lineNumber: 436,
                    columnNumber: 41
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 296,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
        lineNumber: 155,
        columnNumber: 5
    }, this);
}
_s(SearchInterface, "XYu/CXRIFBW76jW6lAQJm5fZhco=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStorage"]
    ];
});
_c = SearchInterface;
var _c;
__turbopack_context__.k.register(_c, "SearchInterface");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/hooks/useStorage.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useStorage",
    ()=>useStorage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/storage/src/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/storage/src/web/LocalStorageManager.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function useStorage() {
    _s();
    const [isHydrated, setIsHydrated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [location, setLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [preferences, setPreferences] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [connections, setConnections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [wishlist, setWishlist] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useStorage.useEffect": ()=>{
            // Load all data on mount to avoid SSR hydration mismatch
            setHistory(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].getHistory());
            setLocation(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].getLocation());
            setPreferences(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].getPreferences());
            setConnections(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].getConnections());
            setWishlist(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].getWishlist());
            setIsHydrated(true);
        }
    }["useStorage.useEffect"], []);
    const addSearchHistory = (term)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].addHistory(term);
        setHistory(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].getHistory());
    };
    const clearSearchHistory = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].clearHistory();
        setHistory([]);
    };
    const saveLocation = (loc)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].setLocation(loc);
        setLocation(loc);
    };
    const updatePreferences = (prefs)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].updatePreferences(prefs);
        setPreferences(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].getPreferences());
    };
    const connectProvider = (id)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].connectProvider(id);
        setConnections(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].getConnections());
    };
    const disconnectProvider = (id)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].disconnectProvider(id);
        setConnections(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].getConnections());
    };
    return {
        isHydrated,
        history,
        location,
        preferences,
        connections,
        wishlist,
        actions: {
            addSearchHistory,
            clearSearchHistory,
            saveLocation,
            updatePreferences,
            connectProvider,
            disconnectProvider,
            toggleWishlist: (item)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].toggleWishlist({
                    id: item.id,
                    title: item.title,
                    category: item.category
                });
                setWishlist(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].getWishlist());
            }
        }
    };
}
_s(useStorage, "5Utwr2JHBPdqEVyZn8/aeU+uJ18=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/firebase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auth",
    ()=>auth,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'firebase/app'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module 'firebase/auth'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
const firebaseConfig = {
    apiKey: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_FIREBASE_APP_ID
};
// Prevent re-initialization in Next.js hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const __TURBOPACK__default__export__ = app;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/storage/src/android/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AndroidStorageService",
    ()=>AndroidStorageService
]);
class AndroidStorageService {
    get(key) {
        // Placeholder for AsyncStorage / SQLite
        console.warn("AndroidStorageService not fully implemented for:", key);
        return null;
    }
    set(key, value) {
        // Placeholder for AsyncStorage / SQLite
        console.warn("AndroidStorageService set called for:", key);
    }
    remove(key) {
    // Placeholder for AsyncStorage / SQLite
    }
    clear() {
    // Placeholder for AsyncStorage / SQLite
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/storage/src/extension/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExtensionStorageService",
    ()=>ExtensionStorageService
]);
class ExtensionStorageService {
    get(key) {
        // Placeholder for chrome.storage.local.get
        console.warn("ExtensionStorageService sync get not fully implemented for:", key);
        return null;
    }
    set(key, value) {
        // Placeholder for chrome.storage.local.set
        console.warn("ExtensionStorageService set called for:", key);
    }
    remove(key) {
    // Placeholder for chrome.storage.local.remove
    }
    clear() {
    // Placeholder for chrome.storage.local.clear
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/storage/src/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/storage/src/types/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/storage/src/web/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$android$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/storage/src/android/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$extension$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/storage/src/extension/index.ts [app-client] (ecmascript)");
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/storage/src/types/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "STORAGE_KEYS",
    ()=>STORAGE_KEYS
]);
const STORAGE_KEYS = {
    LOCATION: "compareall.location",
    PINCODE: "compareall.pincode",
    RECENT_SEARCHES: "compareall.recentSearches",
    RECENT_COMPARISONS: "compareall.recentComparisons",
    FAVORITES: "compareall.favorites",
    PREFERENCES: "compareall.preferences",
    CACHED_RESULTS: "compareall.cachedResults",
    CONNECTIONS: "compareall.connections"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/storage/src/web/LocalStorageManager.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LocalStorageManager",
    ()=>LocalStorageManager
]);
class LocalStorageManager {
    static HISTORY_KEY = 'ca_search_history';
    static WISHLIST_KEY = 'ca_wishlist';
    static CONNECTIONS_KEY = 'ca_connections';
    static PREFERENCES_KEY = 'ca_preferences';
    static LOCATION_KEY = 'ca_location';
    static get(key, defaultValue) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch  {
            return defaultValue;
        }
    }
    static set(key, value) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to localStorage', e);
        }
    }
    // --- Search History ---
    static getHistory() {
        return this.get(this.HISTORY_KEY, []);
    }
    static addHistory(term) {
        if (!term.trim()) return;
        const history = this.getHistory();
        // Remove duplicates
        const filtered = history.filter((h)=>h.term.toLowerCase() !== term.toLowerCase());
        filtered.unshift({
            id: Date.now().toString(),
            term,
            timestamp: Date.now()
        });
        // Keep only last 10
        this.set(this.HISTORY_KEY, filtered.slice(0, 10));
    }
    static clearHistory() {
        this.set(this.HISTORY_KEY, []);
    }
    // --- Wishlist ---
    static getWishlist() {
        return this.get(this.WISHLIST_KEY, []);
    }
    static toggleWishlist(item) {
        const list = this.getWishlist();
        const existingIdx = list.findIndex((i)=>i.id === item.id);
        if (existingIdx >= 0) {
            list.splice(existingIdx, 1); // Remove
        } else {
            list.unshift({
                ...item,
                addedAt: Date.now()
            }); // Add
        }
        this.set(this.WISHLIST_KEY, list);
    }
    static isInWishlist(id) {
        return this.getWishlist().some((i)=>i.id === id);
    }
    // --- Connections ---
    static getConnections() {
        return this.get(this.CONNECTIONS_KEY, []);
    }
    static connectProvider(providerId, status = 'connected') {
        const connections = this.getConnections();
        const existing = connections.find((c)=>c.providerId === providerId);
        if (existing) {
            existing.status = status;
        } else {
            connections.push({
                providerId,
                status,
                connectedAt: Date.now(),
                mockToken: `mock_tok_${Date.now()}` // Privacy by design: NEVER store real passwords
            });
        }
        this.set(this.CONNECTIONS_KEY, connections);
    }
    static disconnectProvider(providerId) {
        const connections = this.getConnections();
        this.set(this.CONNECTIONS_KEY, connections.filter((c)=>c.providerId !== providerId));
    }
    static isConnected(providerId) {
        return this.getConnections().some((c)=>c.providerId === providerId && c.status === 'connected');
    }
    // --- Preferences & Settings ---
    static getPreferences() {
        return this.get(this.PREFERENCES_KEY, {
            theme: 'system'
        });
    }
    static updatePreferences(prefs) {
        const current = this.getPreferences();
        this.set(this.PREFERENCES_KEY, {
            ...current,
            ...prefs
        });
    }
    // --- Location ---
    static getLocation() {
        return this.get(this.LOCATION_KEY, null);
    }
    static setLocation(location) {
        this.set(this.LOCATION_KEY, location);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/packages/storage/src/web/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WebStorageService",
    ()=>WebStorageService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/storage/src/web/LocalStorageManager.ts [app-client] (ecmascript)");
;
class WebStorageService {
    get(key) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.warn(`[Storage] Failed to read ${key}:`, e);
            return null;
        }
    }
    set(key, value) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn(`[Storage] Quota or Write Error for ${key}:`, e);
        }
    }
    remove(key) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        window.localStorage.removeItem(key);
    }
    clear() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        window.localStorage.clear();
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_1biog5z._.js.map