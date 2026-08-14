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
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function OTPModal({ providerName, isOpen, onClose, onSuccess }) {
    _s();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [phone, setPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [otp, setOtp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    if (!isOpen) return null;
    const handleSendOtp = (e)=>{
        e.preventDefault();
        if (phone.length < 10) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }
        setIsLoading(true);
        // Simulate network delay
        setTimeout(()=>{
            setIsLoading(false);
            setStep(2);
        }, 1000);
    };
    const handleVerifyOtp = (e)=>{
        e.preventDefault();
        if (otp.length < 4) {
            alert("Please enter the OTP.");
            return;
        }
        setIsLoading(true);
        // Simulate network delay
        setTimeout(()=>{
            setIsLoading(false);
            onSuccess();
            onClose();
            // Reset for next time
            setStep(1);
            setPhone('');
            setOtp('');
        }, 1500);
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
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                background: 'var(--card-bg)',
                width: '100%',
                maxWidth: '400px',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                position: 'relative',
                color: 'var(--foreground)'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
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
                    lineNumber: 70,
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
                    lineNumber: 81,
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
                        " specific discounts. ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: "Your credentials will only be saved locally on this device."
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                            lineNumber: 83,
                            columnNumber: 74
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                    lineNumber: 82,
                    columnNumber: 9
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
                                    lineNumber: 89,
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
                                                color: 'var(--muted)'
                                            },
                                            children: "+91"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                                            lineNumber: 91,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "tel",
                                            value: phone,
                                            onChange: (e)=>setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)),
                                            placeholder: "Enter your registered number",
                                            style: {
                                                flex: 1,
                                                padding: '0.75rem',
                                                border: '1px solid var(--border)',
                                                borderRadius: '0 6px 6px 0',
                                                fontSize: '1rem',
                                                background: 'var(--background)',
                                                color: 'var(--foreground)'
                                            },
                                            autoFocus: true
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                                            lineNumber: 96,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                                    lineNumber: 90,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                            lineNumber: 88,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            disabled: isLoading || phone.length !== 10,
                            style: {
                                width: '100%',
                                padding: '0.75rem',
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: isLoading || phone.length !== 10 ? 'not-allowed' : 'pointer',
                                opacity: isLoading || phone.length !== 10 ? 0.7 : 1
                            },
                            children: isLoading ? 'Sending OTP...' : 'Get OTP'
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                            lineNumber: 110,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                    lineNumber: 87,
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
                                    lineNumber: 128,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: otp,
                                    onChange: (e)=>setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)),
                                    placeholder: "Enter 6-digit OTP",
                                    style: {
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid var(--border)',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        textAlign: 'center',
                                        letterSpacing: '0.5rem',
                                        background: 'var(--background)',
                                        color: 'var(--foreground)'
                                    },
                                    autoFocus: true
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                                    lineNumber: 129,
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
                                        ". ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setStep(1),
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
                                            lineNumber: 143,
                                            columnNumber: 42
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                                    lineNumber: 142,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                            lineNumber: 127,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            disabled: isLoading || otp.length < 4,
                            style: {
                                width: '100%',
                                padding: '0.75rem',
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: isLoading || otp.length < 4 ? 'not-allowed' : 'pointer',
                                opacity: isLoading || otp.length < 4 ? 0.7 : 1
                            },
                            children: isLoading ? 'Verifying & Connecting...' : 'Verify & Connect (Locally)'
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                            lineNumber: 146,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/OTPModal.tsx",
                    lineNumber: 126,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/components/OTPModal.tsx",
            lineNumber: 61,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/components/OTPModal.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_s(OTPModal, "0c+oIeN7/jtY11MuXKYQvctbX78=");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const FOOD_PROVIDERS = [
    // 1. Aggregators
    {
        id: 'food-zomato',
        name: 'Zomato',
        icon: '🍕',
        color: '#e23744',
        subcat: 'Food Delivery',
        tier: 'all'
    },
    {
        id: 'food-swiggy',
        name: 'Swiggy',
        icon: '🍔',
        color: '#fc8019',
        subcat: 'Food Delivery',
        tier: 'all'
    },
    {
        id: 'food-magicpin',
        name: 'Magicpin',
        icon: '📍',
        color: '#f50057',
        subcat: 'Food Delivery',
        tier: 'tier1'
    },
    {
        id: 'food-eatsure',
        name: 'EatSure',
        icon: '🍽️',
        color: '#5e35b1',
        subcat: 'Food Delivery',
        tier: 'tier1'
    },
    {
        id: 'food-pincode',
        name: 'Pincode',
        icon: '📍',
        color: '#00838f',
        subcat: 'ONDC Food',
        tier: 'tier1'
    },
    {
        id: 'food-mystore',
        name: 'Mystore',
        icon: '🏪',
        color: '#d84315',
        subcat: 'ONDC Food',
        tier: 'tier1'
    },
    {
        id: 'food-paytm-ondc',
        name: 'Paytm Food',
        icon: '📱',
        color: '#0277bd',
        subcat: 'ONDC Food',
        tier: 'tier2'
    },
    {
        id: 'food-ola-ondc',
        name: 'Ola Food',
        icon: '🚕',
        color: '#000000',
        subcat: 'ONDC Food',
        tier: 'tier1'
    },
    {
        id: 'food-spicemoney',
        name: 'Spice Money',
        icon: '🌶️',
        color: '#e65100',
        subcat: 'ONDC Food',
        tier: 'tier2'
    },
    // 2. Direct Restaurant
    {
        id: 'food-dominos',
        name: 'Domino\'s',
        icon: '🍕',
        color: '#1565c0',
        subcat: 'Restaurant Direct',
        tier: 'tier2'
    },
    {
        id: 'food-pizzahut',
        name: 'Pizza Hut',
        icon: '🍕',
        color: '#c62828',
        subcat: 'Restaurant Direct',
        tier: 'tier2'
    },
    {
        id: 'food-lapinoz',
        name: 'La Pino\'z',
        icon: '🍕',
        color: '#2e7d32',
        subcat: 'Restaurant Direct',
        tier: 'tier1'
    },
    {
        id: 'food-ovenstory',
        name: 'OvenStory',
        icon: '🍕',
        color: '#c2185b',
        subcat: 'Restaurant Direct',
        tier: 'tier1'
    },
    {
        id: 'food-mojopizza',
        name: 'MojoPizza',
        icon: '🍕',
        color: '#b71c1c',
        subcat: 'Restaurant Direct',
        tier: 'tier1'
    },
    {
        id: 'food-chicagopizza',
        name: 'Chicago Pizza',
        icon: '🍕',
        color: '#ff8f00',
        subcat: 'Restaurant Direct',
        tier: 'tier1'
    },
    {
        id: 'food-mcdonalds',
        name: 'McDonald\'s',
        icon: '🍔',
        color: '#fbc02d',
        subcat: 'Restaurant Direct',
        tier: 'tier2'
    },
    {
        id: 'food-burgerking',
        name: 'Burger King',
        icon: '🍔',
        color: '#e65100',
        subcat: 'Restaurant Direct',
        tier: 'tier2'
    },
    {
        id: 'food-kfc',
        name: 'KFC',
        icon: '🍗',
        color: '#d32f2f',
        subcat: 'Restaurant Direct',
        tier: 'tier2'
    },
    {
        id: 'food-subway',
        name: 'Subway',
        icon: '🥪',
        color: '#2e7d32',
        subcat: 'Restaurant Direct',
        tier: 'tier2'
    },
    {
        id: 'food-wendys',
        name: 'Wendy\'s',
        icon: '🍔',
        color: '#1565c0',
        subcat: 'Restaurant Direct',
        tier: 'tier1'
    },
    // 3. Indian / Biryani
    {
        id: 'food-faasos',
        name: 'Faasos',
        icon: '🌯',
        color: '#512da8',
        subcat: 'Biryani & Indian',
        tier: 'tier1'
    },
    {
        id: 'food-behrouz',
        name: 'Behrouz',
        icon: '🍛',
        color: '#4a148c',
        subcat: 'Biryani & Indian',
        tier: 'tier1'
    },
    {
        id: 'food-biryaniblues',
        name: 'Biryani Blues',
        icon: '🍛',
        color: '#0277bd',
        subcat: 'Biryani & Indian',
        tier: 'tier1'
    },
    {
        id: 'food-bbk',
        name: 'Biryani By Kilo',
        icon: '🥘',
        color: '#b71c1c',
        subcat: 'Biryani & Indian',
        tier: 'tier1'
    },
    {
        id: 'food-box8',
        name: 'BOX8',
        icon: '🍱',
        color: '#d84315',
        subcat: 'Biryani & Indian',
        tier: 'tier1'
    },
    {
        id: 'food-haldirams',
        name: 'Haldiram\'s',
        icon: '🧆',
        color: '#d32f2f',
        subcat: 'Biryani & Indian',
        tier: 'tier2'
    },
    // 4. Bakery / Sweets
    {
        id: 'food-mioamore',
        name: 'Mio Amore',
        icon: '🍰',
        color: '#c2185b',
        subcat: 'Bakery & Sweets',
        tier: 'tier1'
    },
    {
        id: 'food-monginis',
        name: 'Monginis',
        icon: '🎂',
        color: '#ad1457',
        subcat: 'Bakery & Sweets',
        tier: 'tier2'
    },
    {
        id: 'food-theobroma',
        name: 'Theobroma',
        icon: '🧁',
        color: '#880e4f',
        subcat: 'Bakery & Sweets',
        tier: 'tier1'
    },
    {
        id: 'food-bakingo',
        name: 'Bakingo',
        icon: '🍰',
        color: '#ec407a',
        subcat: 'Bakery & Sweets',
        tier: 'tier1'
    },
    {
        id: 'food-baskin',
        name: 'Baskin-Robbins',
        icon: '🍨',
        color: '#0288d1',
        subcat: 'Bakery & Sweets',
        tier: 'tier2'
    },
    {
        id: 'food-fnp',
        name: 'FNP Cakes',
        icon: '🎂',
        color: '#2e7d32',
        subcat: 'Bakery & Sweets',
        tier: 'tier1'
    },
    // 5. Coffee / Snacks
    {
        id: 'food-starbucks',
        name: 'Starbucks',
        icon: '☕',
        color: '#1b5e20',
        subcat: 'Coffee & Snacks',
        tier: 'tier1'
    },
    {
        id: 'food-chaayos',
        name: 'Chaayos',
        icon: '🫖',
        color: '#f57f17',
        subcat: 'Coffee & Snacks',
        tier: 'tier1'
    },
    {
        id: 'food-chaipoint',
        name: 'Chai Point',
        icon: '☕',
        color: '#ffb300',
        subcat: 'Coffee & Snacks',
        tier: 'tier1'
    },
    {
        id: 'food-thirdwave',
        name: 'Third Wave',
        icon: '☕',
        color: '#3e2723',
        subcat: 'Coffee & Snacks',
        tier: 'tier1'
    },
    {
        id: 'food-wowmomo',
        name: 'Wow! Momo',
        icon: '🥟',
        color: '#fbc02d',
        subcat: 'Coffee & Snacks',
        tier: 'tier2'
    },
    // 6. Healthy
    {
        id: 'food-eatfit',
        name: 'EatFit',
        icon: '🥗',
        color: '#4caf50',
        subcat: 'Healthy & Diet',
        tier: 'tier1'
    },
    {
        id: 'food-freshmenu',
        name: 'FreshMenu',
        icon: '🥗',
        color: '#d32f2f',
        subcat: 'Healthy & Diet',
        tier: 'tier1'
    },
    {
        id: 'food-saladdays',
        name: 'Salad Days',
        icon: '🥗',
        color: '#689f38',
        subcat: 'Healthy & Diet',
        tier: 'tier1'
    },
    {
        id: 'food-curefoods',
        name: 'Curefoods',
        icon: '🥦',
        color: '#00796b',
        subcat: 'Healthy & Diet',
        tier: 'tier1'
    },
    // 7. Cloud Kitchen
    {
        id: 'food-eatclub',
        name: 'EatClub',
        icon: '🍴',
        color: '#d84315',
        subcat: 'Cloud Kitchens',
        tier: 'tier1'
    },
    {
        id: 'food-rebelfoods',
        name: 'Rebel Foods',
        icon: '🍳',
        color: '#b71c1c',
        subcat: 'Cloud Kitchens',
        tier: 'tier1'
    },
    // 8. Quick Food
    {
        id: 'food-zeptocafe',
        name: 'Zepto Cafe',
        icon: '⏱️',
        color: '#7e57c2',
        subcat: 'Quick Food',
        tier: 'tier1'
    },
    {
        id: 'food-swiggybolt',
        name: 'Swiggy Bolt',
        icon: '⚡',
        color: '#ff6d00',
        subcat: 'Quick Food',
        tier: 'tier1'
    },
    {
        id: 'food-blinkitbistro',
        name: 'Blinkit Bistro',
        icon: '🛍️',
        color: '#f8cb46',
        subcat: 'Quick Food',
        tier: 'tier1'
    },
    {
        id: 'food-swish',
        name: 'Swish',
        icon: '💨',
        color: '#26c6da',
        subcat: 'Quick Food',
        tier: 'tier1'
    },
    {
        id: 'food-toing',
        name: 'Toing',
        icon: '🍟',
        color: '#ffca28',
        subcat: 'Quick Food',
        tier: 'tier1'
    },
    // 9. Travel Food
    {
        id: 'food-irctc',
        name: 'IRCTC eCatering',
        icon: '🚂',
        color: '#1a237e',
        subcat: 'Train Food',
        tier: 'all'
    },
    {
        id: 'food-zoop',
        name: 'Zoop',
        icon: '🍱',
        color: '#f57c00',
        subcat: 'Train Food',
        tier: 'all'
    },
    {
        id: 'food-railrestro',
        name: 'RailRestro',
        icon: '🍛',
        color: '#c2185b',
        subcat: 'Train Food',
        tier: 'all'
    },
    {
        id: 'food-travelkhana',
        name: 'Travelkhana',
        icon: '🚂',
        color: '#ff8f00',
        subcat: 'Train Food',
        tier: 'all'
    },
    {
        id: 'food-tfs',
        name: 'Travel Food Svs',
        icon: '✈️',
        color: '#01579b',
        subcat: 'Airport Food',
        tier: 'tier1'
    },
    // 10. Regional
    {
        id: 'food-chowman',
        name: 'Chowman',
        icon: '🍜',
        color: '#d32f2f',
        subcat: 'Regional',
        tier: 'tier1'
    },
    {
        id: 'food-yummycloud',
        name: 'Yummy Cloud',
        icon: '☁️',
        color: '#0288d1',
        subcat: 'Regional',
        tier: 'tier1'
    }
];
// Other categories (Groceries, Cabs, etc.)
const SHOPPING_PROVIDERS = [
    // 1. General
    {
        id: 'shop-amazon',
        name: 'Amazon',
        icon: '📦',
        color: '#ff9900',
        subcat: 'General Shopping',
        tier: 'all'
    },
    {
        id: 'shop-flipkart',
        name: 'Flipkart',
        icon: '🛍️',
        color: '#2874f0',
        subcat: 'General Shopping',
        tier: 'all'
    },
    {
        id: 'shop-meesho',
        name: 'Meesho',
        icon: '👚',
        color: '#f43397',
        subcat: 'General Shopping',
        tier: 'all'
    },
    {
        id: 'shop-snapdeal',
        name: 'Snapdeal',
        icon: '🛒',
        color: '#e91e63',
        subcat: 'General Shopping',
        tier: 'all'
    },
    {
        id: 'shop-shopclues',
        name: 'ShopClues',
        icon: '🛒',
        color: '#3f51b5',
        subcat: 'General Shopping',
        tier: 'all'
    },
    {
        id: 'shop-jiomart',
        name: 'JioMart',
        icon: '🛍️',
        color: '#01579b',
        subcat: 'General Shopping',
        tier: 'all'
    },
    {
        id: 'shop-tataneu',
        name: 'Tata Neu',
        icon: '📱',
        color: '#e65100',
        subcat: 'General Shopping',
        tier: 'all'
    },
    {
        id: 'shop-tatacliq',
        name: 'Tata CLiQ',
        icon: '💎',
        color: '#000000',
        subcat: 'General Shopping',
        tier: 'all'
    },
    {
        id: 'shop-shopsy',
        name: 'Shopsy',
        icon: '🛍️',
        color: '#1976d2',
        subcat: 'General Shopping',
        tier: 'all'
    },
    // 2. Fashion
    {
        id: 'shop-myntra',
        name: 'Myntra',
        icon: '👕',
        color: '#ff3f6c',
        subcat: 'Fashion & Clothing',
        tier: 'all'
    },
    {
        id: 'shop-ajio',
        name: 'AJIO',
        icon: '👗',
        color: '#2c3e50',
        subcat: 'Fashion & Clothing',
        tier: 'all'
    },
    {
        id: 'shop-nykaafashion',
        name: 'Nykaa Fashion',
        icon: '👗',
        color: '#e91e63',
        subcat: 'Fashion & Clothing',
        tier: 'all'
    },
    {
        id: 'shop-urbanic',
        name: 'Urbanic',
        icon: '👗',
        color: '#ff8f00',
        subcat: 'Fashion & Clothing',
        tier: 'all'
    },
    {
        id: 'shop-hm',
        name: 'H&M',
        icon: '👕',
        color: '#b71c1c',
        subcat: 'Fashion & Clothing',
        tier: 'tier1'
    },
    {
        id: 'shop-zara',
        name: 'Zara',
        icon: '👗',
        color: '#000000',
        subcat: 'Fashion & Clothing',
        tier: 'tier1'
    },
    {
        id: 'shop-westside',
        name: 'Westside',
        icon: '👕',
        color: '#4a148c',
        subcat: 'Fashion & Clothing',
        tier: 'tier2'
    },
    {
        id: 'shop-pantaloons',
        name: 'Pantaloons',
        icon: '👗',
        color: '#00838f',
        subcat: 'Fashion & Clothing',
        tier: 'tier2'
    },
    {
        id: 'shop-shoppersstop',
        name: 'Shoppers Stop',
        icon: '👕',
        color: '#000000',
        subcat: 'Fashion & Clothing',
        tier: 'tier2'
    },
    {
        id: 'shop-max',
        name: 'Max Fashion',
        icon: '👕',
        color: '#1565c0',
        subcat: 'Fashion & Clothing',
        tier: 'tier2'
    },
    // 3. Shoes
    {
        id: 'shop-bata',
        name: 'Bata',
        icon: '👞',
        color: '#b71c1c',
        subcat: 'Footwear',
        tier: 'all'
    },
    {
        id: 'shop-metro',
        name: 'Metro Shoes',
        icon: '👠',
        color: '#880e4f',
        subcat: 'Footwear',
        tier: 'tier2'
    },
    {
        id: 'shop-woodland',
        name: 'Woodland',
        icon: '🥾',
        color: '#33691e',
        subcat: 'Footwear',
        tier: 'all'
    },
    {
        id: 'shop-redtape',
        name: 'Red Tape',
        icon: '👟',
        color: '#d32f2f',
        subcat: 'Footwear',
        tier: 'all'
    },
    {
        id: 'shop-campus',
        name: 'Campus',
        icon: '👟',
        color: '#b71c1c',
        subcat: 'Footwear',
        tier: 'all'
    },
    {
        id: 'shop-puma',
        name: 'Puma',
        icon: '👟',
        color: '#000000',
        subcat: 'Footwear',
        tier: 'all'
    },
    {
        id: 'shop-adidas',
        name: 'Adidas',
        icon: '👟',
        color: '#000000',
        subcat: 'Footwear',
        tier: 'all'
    },
    {
        id: 'shop-nike',
        name: 'Nike',
        icon: '👟',
        color: '#000000',
        subcat: 'Footwear',
        tier: 'all'
    },
    // 4. Beauty
    {
        id: 'shop-nykaa',
        name: 'Nykaa',
        icon: '💄',
        color: '#e91e63',
        subcat: 'Beauty & Cosmetics',
        tier: 'all'
    },
    {
        id: 'shop-purplle',
        name: 'Purplle',
        icon: '💄',
        color: '#8e24aa',
        subcat: 'Beauty & Cosmetics',
        tier: 'all'
    },
    {
        id: 'shop-tira',
        name: 'Tira',
        icon: '💄',
        color: '#000000',
        subcat: 'Beauty & Cosmetics',
        tier: 'tier1'
    },
    {
        id: 'shop-sephora',
        name: 'Sephora',
        icon: '💄',
        color: '#000000',
        subcat: 'Beauty & Cosmetics',
        tier: 'tier1'
    },
    {
        id: 'shop-sugar',
        name: 'Sugar Cosmetics',
        icon: '💄',
        color: '#000000',
        subcat: 'Beauty & Cosmetics',
        tier: 'all'
    },
    {
        id: 'shop-mamaearth',
        name: 'Mamaearth',
        icon: '🌿',
        color: '#388e3c',
        subcat: 'Beauty & Cosmetics',
        tier: 'all'
    },
    {
        id: 'shop-plum',
        name: 'Plum',
        icon: '🌿',
        color: '#512da8',
        subcat: 'Beauty & Cosmetics',
        tier: 'all'
    },
    // 5. Electronics
    {
        id: 'shop-croma',
        name: 'Croma',
        icon: '📺',
        color: '#00838f',
        subcat: 'Electronics & Gadgets',
        tier: 'all'
    },
    {
        id: 'shop-reliancedigital',
        name: 'Reliance Digital',
        icon: '📱',
        color: '#d32f2f',
        subcat: 'Electronics & Gadgets',
        tier: 'all'
    },
    {
        id: 'shop-vijaysales',
        name: 'Vijay Sales',
        icon: '📺',
        color: '#d32f2f',
        subcat: 'Electronics & Gadgets',
        tier: 'all'
    },
    {
        id: 'shop-apple',
        name: 'Apple',
        icon: '💻',
        color: '#000000',
        subcat: 'Electronics & Gadgets',
        tier: 'all'
    },
    {
        id: 'shop-samsung',
        name: 'Samsung',
        icon: '📱',
        color: '#1565c0',
        subcat: 'Electronics & Gadgets',
        tier: 'all'
    },
    {
        id: 'shop-dell',
        name: 'Dell',
        icon: '💻',
        color: '#1565c0',
        subcat: 'Electronics & Gadgets',
        tier: 'all'
    },
    {
        id: 'shop-lenovo',
        name: 'Lenovo',
        icon: '💻',
        color: '#e65100',
        subcat: 'Electronics & Gadgets',
        tier: 'all'
    },
    {
        id: 'shop-asus',
        name: 'ASUS',
        icon: '💻',
        color: '#1a237e',
        subcat: 'Electronics & Gadgets',
        tier: 'all'
    },
    {
        id: 'shop-lg',
        name: 'LG',
        icon: '📺',
        color: '#b71c1c',
        subcat: 'Electronics & Gadgets',
        tier: 'all'
    },
    // 8. Furniture
    {
        id: 'shop-pepperfry',
        name: 'Pepperfry',
        icon: '🛋️',
        color: '#f57c00',
        subcat: 'Furniture & Home',
        tier: 'tier2'
    },
    {
        id: 'shop-urbanladder',
        name: 'Urban Ladder',
        icon: '🪑',
        color: '#f57c00',
        subcat: 'Furniture & Home',
        tier: 'tier2'
    },
    {
        id: 'shop-ikea',
        name: 'IKEA',
        icon: '🪑',
        color: '#01579b',
        subcat: 'Furniture & Home',
        tier: 'tier1'
    },
    {
        id: 'shop-homecentre',
        name: 'Home Centre',
        icon: '🛋️',
        color: '#e65100',
        subcat: 'Furniture & Home',
        tier: 'tier1'
    },
    {
        id: 'shop-wakefit',
        name: 'Wakefit',
        icon: '🛏️',
        color: '#1565c0',
        subcat: 'Furniture & Home',
        tier: 'all'
    },
    {
        id: 'shop-woodenstreet',
        name: 'WoodenStreet',
        icon: '🛋️',
        color: '#d32f2f',
        subcat: 'Furniture & Home',
        tier: 'tier2'
    },
    {
        id: 'shop-sleepycat',
        name: 'SleepyCat',
        icon: '🛏️',
        color: '#ffb300',
        subcat: 'Furniture & Home',
        tier: 'all'
    },
    // 12. Kids
    {
        id: 'shop-firstcry',
        name: 'FirstCry',
        icon: '👶',
        color: '#0288d1',
        subcat: 'Baby & Kids',
        tier: 'all'
    },
    {
        id: 'shop-hopscotch',
        name: 'Hopscotch',
        icon: '👶',
        color: '#f57c00',
        subcat: 'Baby & Kids',
        tier: 'all'
    },
    {
        id: 'shop-mothercare',
        name: 'Mothercare',
        icon: '👶',
        color: '#1565c0',
        subcat: 'Baby & Kids',
        tier: 'tier1'
    },
    // 13. Jewellery
    {
        id: 'shop-tanishq',
        name: 'Tanishq',
        icon: '💎',
        color: '#880e4f',
        subcat: 'Jewellery',
        tier: 'tier2'
    },
    {
        id: 'shop-caratlane',
        name: 'CaratLane',
        icon: '💎',
        color: '#ad1457',
        subcat: 'Jewellery',
        tier: 'all'
    },
    {
        id: 'shop-bluestone',
        name: 'Bluestone',
        icon: '💎',
        color: '#0288d1',
        subcat: 'Jewellery',
        tier: 'all'
    },
    {
        id: 'shop-kalyan',
        name: 'Kalyan Jewellers',
        icon: '💎',
        color: '#b71c1c',
        subcat: 'Jewellery',
        tier: 'tier2'
    },
    // 14. Eyewear
    {
        id: 'shop-lenskart',
        name: 'Lenskart',
        icon: '👓',
        color: '#00838f',
        subcat: 'Eyewear',
        tier: 'all'
    },
    {
        id: 'shop-titaneye',
        name: 'Titan Eye+',
        icon: '👓',
        color: '#000000',
        subcat: 'Eyewear',
        tier: 'all'
    },
    // 15. Bags
    {
        id: 'shop-safari',
        name: 'Safari',
        icon: '🎒',
        color: '#000000',
        subcat: 'Bags & Luggage',
        tier: 'all'
    },
    {
        id: 'shop-americantourister',
        name: 'American Tourister',
        icon: '🧳',
        color: '#1565c0',
        subcat: 'Bags & Luggage',
        tier: 'all'
    },
    {
        id: 'shop-mokobara',
        name: 'Mokobara',
        icon: '🎒',
        color: '#e65100',
        subcat: 'Bags & Luggage',
        tier: 'tier1'
    },
    {
        id: 'shop-dailyobjects',
        name: 'DailyObjects',
        icon: '👜',
        color: '#000000',
        subcat: 'Bags & Luggage',
        tier: 'all'
    },
    // Niche
    {
        id: 'shop-decathlon',
        name: 'Decathlon',
        icon: '⚽',
        color: '#1565c0',
        subcat: 'Sports & Fitness',
        tier: 'all'
    },
    {
        id: 'shop-indiamart',
        name: 'IndiaMART',
        icon: '🏭',
        color: '#1565c0',
        subcat: 'B2B & Tools',
        tier: 'all'
    },
    {
        id: 'shop-moglix',
        name: 'Moglix',
        icon: '🔧',
        color: '#d32f2f',
        subcat: 'B2B & Tools',
        tier: 'all'
    },
    {
        id: 'shop-udaan',
        name: 'Udaan',
        icon: '📦',
        color: '#0288d1',
        subcat: 'B2B & Tools',
        tier: 'all'
    },
    {
        id: 'shop-crossword',
        name: 'Crossword',
        icon: '📚',
        color: '#ffb300',
        subcat: 'Books & Stationery',
        tier: 'all'
    },
    {
        id: 'shop-gamestheshop',
        name: 'Games The Shop',
        icon: '🎮',
        color: '#d32f2f',
        subcat: 'Gaming',
        tier: 'all'
    },
    {
        id: 'shop-steam',
        name: 'Steam',
        icon: '🎮',
        color: '#1a237e',
        subcat: 'Gaming',
        tier: 'all'
    },
    {
        id: 'shop-huft',
        name: 'Heads Up For Tails',
        icon: '🐕',
        color: '#b71c1c',
        subcat: 'Pets',
        tier: 'tier1'
    },
    {
        id: 'shop-supertails',
        name: 'Supertails',
        icon: '🐕',
        color: '#1565c0',
        subcat: 'Pets',
        tier: 'all'
    },
    {
        id: 'shop-ugaoo',
        name: 'Ugaoo',
        icon: '🌱',
        color: '#388e3c',
        subcat: 'Gardening',
        tier: 'all'
    }
];
const TRAVEL_PROVIDERS = [
    // 1. Flights
    {
        id: 'travel-mmt',
        name: 'MakeMyTrip',
        icon: '✈️',
        color: '#d8232a',
        subcat: 'Flight Booking',
        tier: 'all'
    },
    {
        id: 'travel-goibibo',
        name: 'Goibibo',
        icon: '✈️',
        color: '#2274e0',
        subcat: 'Flight Booking',
        tier: 'all'
    },
    {
        id: 'travel-ixigo',
        name: 'ixigo',
        icon: '✈️',
        color: '#ec5b24',
        subcat: 'Flight Booking',
        tier: 'all'
    },
    {
        id: 'travel-emt',
        name: 'EaseMyTrip',
        icon: '✈️',
        color: '#008cff',
        subcat: 'Flight Booking',
        tier: 'all'
    },
    {
        id: 'travel-cleartrip',
        name: 'Cleartrip',
        icon: '✈️',
        color: '#336699',
        subcat: 'Flight Booking',
        tier: 'all'
    },
    {
        id: 'travel-yatra',
        name: 'Yatra',
        icon: '✈️',
        color: '#ea2330',
        subcat: 'Flight Booking',
        tier: 'all'
    },
    {
        id: 'travel-happyfares',
        name: 'HappyFares',
        icon: '✈️',
        color: '#fbc02d',
        subcat: 'Flight Booking',
        tier: 'tier2'
    },
    {
        id: 'travel-paytm',
        name: 'Paytm Travel',
        icon: '✈️',
        color: '#0277bd',
        subcat: 'Flight Booking',
        tier: 'tier2'
    },
    {
        id: 'travel-google',
        name: 'Google Flights',
        icon: '✈️',
        color: '#4285f4',
        subcat: 'Flight Booking',
        tier: 'all'
    },
    {
        id: 'travel-skyscanner',
        name: 'Skyscanner',
        icon: '✈️',
        color: '#0288d1',
        subcat: 'Flight Booking',
        tier: 'all'
    },
    {
        id: 'travel-wego',
        name: 'Wego',
        icon: '✈️',
        color: '#4caf50',
        subcat: 'Flight Booking',
        tier: 'all'
    },
    {
        id: 'travel-airindia',
        name: 'Air India',
        icon: '✈️',
        color: '#d32f2f',
        subcat: 'Airline Direct',
        tier: 'all'
    },
    {
        id: 'travel-indigo',
        name: 'IndiGo',
        icon: '✈️',
        color: '#1565c0',
        subcat: 'Airline Direct',
        tier: 'all'
    },
    {
        id: 'travel-akasa',
        name: 'Akasa Air',
        icon: '✈️',
        color: '#ff8f00',
        subcat: 'Airline Direct',
        tier: 'tier1'
    },
    {
        id: 'travel-spicejet',
        name: 'SpiceJet',
        icon: '✈️',
        color: '#c62828',
        subcat: 'Airline Direct',
        tier: 'tier2'
    },
    // 2. Trains
    {
        id: 'travel-irctc',
        name: 'IRCTC',
        icon: '🚂',
        color: '#1a237e',
        subcat: 'Train Booking',
        tier: 'all'
    },
    {
        id: 'travel-confirmtkt',
        name: 'ConfirmTkt',
        icon: '🚂',
        color: '#00796b',
        subcat: 'Train Booking',
        tier: 'all'
    },
    {
        id: 'travel-trainman',
        name: 'Trainman',
        icon: '🚂',
        color: '#b71c1c',
        subcat: 'Train Booking',
        tier: 'all'
    },
    {
        id: 'travel-railyatri',
        name: 'RailYatri',
        icon: '🚂',
        color: '#0288d1',
        subcat: 'Train Booking',
        tier: 'all'
    },
    {
        id: 'travel-redrail',
        name: 'redRail',
        icon: '🚂',
        color: '#d84e55',
        subcat: 'Train Booking',
        tier: 'all'
    },
    {
        id: 'travel-wimt',
        name: 'Where Is My Train',
        icon: '🚂',
        color: '#1565c0',
        subcat: 'Train Booking',
        tier: 'all'
    },
    {
        id: 'travel-tripozo',
        name: 'Tripozo',
        icon: '🚂',
        color: '#e65100',
        subcat: 'Train Booking',
        tier: 'all'
    },
    // 3. Buses
    {
        id: 'travel-redbus',
        name: 'redBus',
        icon: '🚌',
        color: '#d84e55',
        subcat: 'Bus Booking',
        tier: 'all'
    },
    {
        id: 'travel-abhibus',
        name: 'AbhiBus',
        icon: '🚌',
        color: '#c7222a',
        subcat: 'Bus Booking',
        tier: 'all'
    },
    {
        id: 'travel-intrcity',
        name: 'IntrCity',
        icon: '🚌',
        color: '#2e7d32',
        subcat: 'Bus Booking',
        tier: 'tier2'
    },
    {
        id: 'travel-flixbus',
        name: 'FlixBus',
        icon: '🚌',
        color: '#8bc34a',
        subcat: 'Bus Booking',
        tier: 'tier2'
    },
    {
        id: 'travel-zingbus',
        name: 'Zingbus',
        icon: '🚌',
        color: '#fbc02d',
        subcat: 'Bus Booking',
        tier: 'tier2'
    },
    {
        id: 'travel-tsrtc',
        name: 'TSRTC',
        icon: '🚌',
        color: '#1565c0',
        subcat: 'State Transport',
        tier: 'tier1'
    },
    {
        id: 'travel-ksrtc',
        name: 'KSRTC',
        icon: '🚌',
        color: '#b71c1c',
        subcat: 'State Transport',
        tier: 'tier1'
    },
    {
        id: 'travel-upsrtc',
        name: 'UPSRTC',
        icon: '🚌',
        color: '#00796b',
        subcat: 'State Transport',
        tier: 'tier1'
    },
    {
        id: 'travel-hrtc',
        name: 'HRTC',
        icon: '🚌',
        color: '#0288d1',
        subcat: 'State Transport',
        tier: 'tier1'
    },
    // 4. Hotels
    {
        id: 'travel-oyo',
        name: 'OYO',
        icon: '🏨',
        color: '#d32f2f',
        subcat: 'Hotel Booking',
        tier: 'all'
    },
    {
        id: 'travel-booking',
        name: 'Booking.com',
        icon: '🏨',
        color: '#003580',
        subcat: 'Hotel Booking',
        tier: 'all'
    },
    {
        id: 'travel-agoda',
        name: 'Agoda',
        icon: '🏨',
        color: '#e65100',
        subcat: 'Hotel Booking',
        tier: 'all'
    },
    {
        id: 'travel-expedia',
        name: 'Expedia',
        icon: '🏨',
        color: '#00005e',
        subcat: 'Hotel Booking',
        tier: 'tier2'
    },
    {
        id: 'travel-kayak',
        name: 'Kayak',
        icon: '🏨',
        color: '#ff6d00',
        subcat: 'Hotel Booking',
        tier: 'tier2'
    },
    {
        id: 'travel-trip',
        name: 'Trip.com',
        icon: '🏨',
        color: '#1565c0',
        subcat: 'Hotel Booking',
        tier: 'tier2'
    },
    {
        id: 'travel-hotelscom',
        name: 'Hotels.com',
        icon: '🏨',
        color: '#b71c1c',
        subcat: 'Hotel Booking',
        tier: 'tier2'
    },
    {
        id: 'travel-trivago',
        name: 'Trivago',
        icon: '🏨',
        color: '#0288d1',
        subcat: 'Hotel Booking',
        tier: 'tier2'
    },
    {
        id: 'travel-hostelworld',
        name: 'Hostelworld',
        icon: '🛏️',
        color: '#f57c00',
        subcat: 'Hotel Booking',
        tier: 'tier1'
    },
    {
        id: 'travel-fabhotels',
        name: 'FabHotels',
        icon: '🏨',
        color: '#2e7d32',
        subcat: 'Hotel Booking',
        tier: 'tier1'
    },
    {
        id: 'travel-treebo',
        name: 'Treebo',
        icon: '🏨',
        color: '#c2185b',
        subcat: 'Hotel Booking',
        tier: 'tier1'
    },
    {
        id: 'travel-taj',
        name: 'Taj Hotels',
        icon: '🏨',
        color: '#880e4f',
        subcat: 'Premium Hotels',
        tier: 'tier1'
    },
    {
        id: 'travel-marriott',
        name: 'Marriott',
        icon: '🏨',
        color: '#000000',
        subcat: 'Premium Hotels',
        tier: 'tier1'
    },
    // 5. Homestay / Villa
    {
        id: 'travel-airbnb',
        name: 'Airbnb',
        icon: '🏡',
        color: '#ff5a5f',
        subcat: 'Villas & Homestays',
        tier: 'tier2'
    },
    {
        id: 'travel-stayvista',
        name: 'StayVista',
        icon: '🏡',
        color: '#2e7d32',
        subcat: 'Villas & Homestays',
        tier: 'tier1'
    },
    {
        id: 'travel-saffronstays',
        name: 'SaffronStays',
        icon: '🏡',
        color: '#c2185b',
        subcat: 'Villas & Homestays',
        tier: 'tier1'
    },
    {
        id: 'travel-vrbo',
        name: 'Vrbo',
        icon: '🏡',
        color: '#1565c0',
        subcat: 'Villas & Homestays',
        tier: 'tier2'
    },
    {
        id: 'travel-zostel',
        name: 'Zostel',
        icon: '🏕️',
        color: '#f57f17',
        subcat: 'Villas & Homestays',
        tier: 'tier2'
    },
    // 6. Cabs
    {
        id: 'travel-uber',
        name: 'Uber',
        icon: '🚕',
        color: '#000000',
        subcat: 'Cabs & Taxis',
        tier: 'tier1'
    },
    {
        id: 'travel-ola',
        name: 'Ola',
        icon: '🚕',
        color: '#8bc34a',
        subcat: 'Cabs & Taxis',
        tier: 'tier1'
    },
    {
        id: 'travel-rapido',
        name: 'Rapido',
        icon: '🛵',
        color: '#ffc107',
        subcat: 'Cabs & Taxis',
        tier: 'tier1'
    },
    {
        id: 'travel-indrive',
        name: 'inDrive',
        icon: '🚕',
        color: '#8bc34a',
        subcat: 'Cabs & Taxis',
        tier: 'tier1'
    },
    {
        id: 'travel-blusmart',
        name: 'BluSmart',
        icon: '🚕',
        color: '#1976d2',
        subcat: 'Cabs & Taxis',
        tier: 'tier1'
    },
    {
        id: 'travel-nammayatri',
        name: 'Namma Yatri',
        icon: '🚕',
        color: '#f57c00',
        subcat: 'Cabs & Taxis',
        tier: 'tier1'
    },
    {
        id: 'travel-yatrisathi',
        name: 'Yatri Sathi',
        icon: '🚕',
        color: '#fbc02d',
        subcat: 'Cabs & Taxis',
        tier: 'tier1'
    },
    {
        id: 'travel-savaari',
        name: 'Savaari',
        icon: '🚕',
        color: '#c2185b',
        subcat: 'Cabs & Taxis',
        tier: 'tier2'
    },
    // 7. Self-drive
    {
        id: 'travel-zoomcar',
        name: 'Zoomcar',
        icon: '🚗',
        color: '#2e7d32',
        subcat: 'Self-Drive',
        tier: 'tier1'
    },
    {
        id: 'travel-revv',
        name: 'Revv',
        icon: '🚗',
        color: '#00796b',
        subcat: 'Self-Drive',
        tier: 'tier1'
    },
    {
        id: 'travel-myles',
        name: 'Myles',
        icon: '🚗',
        color: '#1565c0',
        subcat: 'Self-Drive',
        tier: 'tier1'
    },
    {
        id: 'travel-drivezy',
        name: 'Drivezy',
        icon: '🚗',
        color: '#c2185b',
        subcat: 'Self-Drive',
        tier: 'tier1'
    },
    {
        id: 'travel-avis',
        name: 'Avis',
        icon: '🚗',
        color: '#d32f2f',
        subcat: 'Self-Drive',
        tier: 'tier1'
    },
    // 8. Bike/Scooter
    {
        id: 'travel-royalbros',
        name: 'Royal Brothers',
        icon: '🏍️',
        color: '#fbc02d',
        subcat: 'Bike Rentals',
        tier: 'tier1'
    },
    {
        id: 'travel-vogo',
        name: 'Vogo',
        icon: '🛵',
        color: '#ffb300',
        subcat: 'Bike Rentals',
        tier: 'tier1'
    },
    {
        id: 'travel-bounce',
        name: 'Bounce',
        icon: '🛵',
        color: '#f57f17',
        subcat: 'Bike Rentals',
        tier: 'tier1'
    },
    {
        id: 'travel-yulu',
        name: 'Yulu',
        icon: '🛴',
        color: '#03a9f4',
        subcat: 'Bike Rentals',
        tier: 'tier1'
    },
    {
        id: 'travel-zypp',
        name: 'Zypp',
        icon: '🛴',
        color: '#8bc34a',
        subcat: 'Bike Rentals',
        tier: 'tier1'
    },
    // 9. Metros
    {
        id: 'travel-chalo',
        name: 'Chalo',
        icon: '🚌',
        color: '#ff8f00',
        subcat: 'Local Transport',
        tier: 'tier1'
    },
    {
        id: 'travel-moovit',
        name: 'Moovit',
        icon: '🚇',
        color: '#ff6f00',
        subcat: 'Local Transport',
        tier: 'tier1'
    },
    {
        id: 'travel-delhimetro',
        name: 'Delhi Metro',
        icon: '🚇',
        color: '#d32f2f',
        subcat: 'Local Transport',
        tier: 'tier1'
    },
    {
        id: 'travel-mumbaione',
        name: 'Mumbai One',
        icon: '🚇',
        color: '#1565c0',
        subcat: 'Local Transport',
        tier: 'tier1'
    },
    {
        id: 'travel-nammametro',
        name: 'Namma Metro',
        icon: '🚇',
        color: '#512da8',
        subcat: 'Local Transport',
        tier: 'tier1'
    }
];
const GROCERY_PROVIDERS = [
    // National & Quick Commerce
    {
        id: 'groc-blinkit',
        name: 'Blinkit',
        icon: '🛒',
        color: '#f8cb46',
        subcat: 'Quick Commerce',
        tier: 'tier1'
    },
    {
        id: 'groc-zepto',
        name: 'Zepto',
        icon: '⏱️',
        color: '#7e57c2',
        subcat: 'Quick Commerce',
        tier: 'tier1'
    },
    {
        id: 'groc-instamart',
        name: 'Swiggy Instamart',
        icon: '⚡',
        color: '#fc8019',
        subcat: 'Quick Commerce',
        tier: 'tier1'
    },
    {
        id: 'groc-bigbasket',
        name: 'BigBasket',
        icon: '🥬',
        color: '#689f38',
        subcat: 'National Grocery',
        tier: 'tier2'
    },
    {
        id: 'groc-bbnow',
        name: 'BB Now',
        icon: '🚀',
        color: '#8bc34a',
        subcat: 'Quick Commerce',
        tier: 'tier1'
    },
    {
        id: 'groc-jiomart',
        name: 'JioMart',
        icon: '🛍️',
        color: '#01579b',
        subcat: 'National Grocery',
        tier: 'all'
    },
    {
        id: 'groc-amazon-fresh',
        name: 'Amazon Fresh',
        icon: '📦',
        color: '#ff9900',
        subcat: 'National Grocery',
        tier: 'tier2'
    },
    {
        id: 'groc-flipkart-groc',
        name: 'Flipkart Grocery',
        icon: '🛒',
        color: '#2874f0',
        subcat: 'National Grocery',
        tier: 'tier2'
    },
    {
        id: 'groc-flipkart-min',
        name: 'Flipkart Minutes',
        icon: '⏱️',
        color: '#1976d2',
        subcat: 'Quick Commerce',
        tier: 'tier1'
    },
    {
        id: 'groc-dmart',
        name: 'DMart Ready',
        icon: '🏪',
        color: '#2e7d32',
        subcat: 'Supermarket',
        tier: 'tier2'
    },
    {
        id: 'groc-tataneu',
        name: 'Tata Neu',
        icon: '🔮',
        color: '#4a148c',
        subcat: 'National Grocery',
        tier: 'tier2'
    },
    // Supermarkets
    {
        id: 'groc-spencers',
        name: 'Spencer\'s',
        icon: '🏪',
        color: '#d32f2f',
        subcat: 'Supermarket',
        tier: 'tier2'
    },
    {
        id: 'groc-starquik',
        name: 'StarQuik',
        icon: '⭐',
        color: '#fbc02d',
        subcat: 'Supermarket',
        tier: 'tier1'
    },
    {
        id: 'groc-naturesbasket',
        name: 'Nature\'s Basket',
        icon: '🧺',
        color: '#558b2f',
        subcat: 'Supermarket',
        tier: 'tier1'
    },
    {
        id: 'groc-reliancesmart',
        name: 'Reliance Smart',
        icon: '🏬',
        color: '#0277bd',
        subcat: 'Supermarket',
        tier: 'tier2'
    },
    {
        id: 'groc-more',
        name: 'More Retail',
        icon: '🍎',
        color: '#e65100',
        subcat: 'Supermarket',
        tier: 'tier2'
    },
    // Milk & Essentials
    {
        id: 'groc-milkbasket',
        name: 'Milkbasket',
        icon: '🥛',
        color: '#1565c0',
        subcat: 'Milk & Essentials',
        tier: 'tier1'
    },
    {
        id: 'groc-countrydelight',
        name: 'Country Delight',
        icon: '🐄',
        color: '#c62828',
        subcat: 'Milk & Essentials',
        tier: 'tier1'
    },
    {
        id: 'groc-bbdaily',
        name: 'BB Daily',
        icon: '🍞',
        color: '#689f38',
        subcat: 'Milk & Essentials',
        tier: 'tier2'
    },
    {
        id: 'groc-suprdaily',
        name: 'Supr Daily',
        icon: '🥚',
        color: '#f57c00',
        subcat: 'Milk & Essentials',
        tier: 'tier1'
    },
    {
        id: 'groc-akshayakalpa',
        name: 'Akshayakalpa',
        icon: '🥛',
        color: '#00695c',
        subcat: 'Milk & Essentials',
        tier: 'tier1'
    },
    // Fresh & Meat
    {
        id: 'groc-otipy',
        name: 'Otipy',
        icon: '🥦',
        color: '#2e7d32',
        subcat: 'Fresh & Meat',
        tier: 'tier1'
    },
    {
        id: 'groc-freshtohome',
        name: 'FreshToHome',
        icon: '🐟',
        color: '#e65100',
        subcat: 'Fresh & Meat',
        tier: 'tier1'
    },
    {
        id: 'groc-licious',
        name: 'Licious',
        icon: '🍗',
        color: '#d32f2f',
        subcat: 'Fresh & Meat',
        tier: 'tier1'
    },
    {
        id: 'groc-meatigo',
        name: 'Meatigo',
        icon: '🥩',
        color: '#b71c1c',
        subcat: 'Fresh & Meat',
        tier: 'tier1'
    },
    {
        id: 'groc-tendercuts',
        name: 'TenderCuts',
        icon: '🔪',
        color: '#c62828',
        subcat: 'Fresh & Meat',
        tier: 'tier1'
    },
    // ONDC & B2B
    {
        id: 'groc-pincode',
        name: 'Pincode (ONDC)',
        icon: '📍',
        color: '#00838f',
        subcat: 'ONDC',
        tier: 'tier1'
    },
    {
        id: 'groc-paytmondc',
        name: 'Paytm ONDC',
        icon: '📱',
        color: '#0277bd',
        subcat: 'ONDC',
        tier: 'all'
    },
    {
        id: 'groc-mystore',
        name: 'Mystore',
        icon: '🏪',
        color: '#d84315',
        subcat: 'ONDC',
        tier: 'tier1'
    },
    {
        id: 'groc-udaan',
        name: 'Udaan (B2B)',
        icon: '📦',
        color: '#1565c0',
        subcat: 'B2B & Wholesale',
        tier: 'tier2'
    },
    {
        id: 'groc-jumbotail',
        name: 'Jumbotail',
        icon: '🏬',
        color: '#f57c00',
        subcat: 'B2B & Wholesale',
        tier: 'tier2'
    },
    {
        id: 'groc-ninjacart',
        name: 'Ninjacart',
        icon: '🥬',
        color: '#43a047',
        subcat: 'B2B & Wholesale',
        tier: 'tier2'
    }
];
const MEDICINE_PROVIDERS = [
    // National
    {
        id: 'med-apollo',
        name: 'Apollo 24|7',
        icon: '💊',
        color: '#00539f',
        subcat: 'Pharmacy',
        tier: 'all'
    },
    {
        id: 'med-netmeds',
        name: 'Netmeds',
        icon: '💊',
        color: '#00c6d7',
        subcat: 'Pharmacy',
        tier: 'all'
    },
    {
        id: 'med-1mg',
        name: 'Tata 1mg',
        icon: '💊',
        color: '#ff6f61',
        subcat: 'Pharmacy',
        tier: 'all'
    },
    {
        id: 'med-pharmeasy',
        name: 'PharmEasy',
        icon: '💊',
        color: '#10847e',
        subcat: 'Pharmacy',
        tier: 'all'
    },
    {
        id: 'med-flipkarthealth',
        name: 'Flipkart Health+',
        icon: '💊',
        color: '#2874f0',
        subcat: 'Pharmacy',
        tier: 'all'
    },
    {
        id: 'med-amazonpharmacy',
        name: 'Amazon Pharmacy',
        icon: '💊',
        color: '#ff9900',
        subcat: 'Pharmacy',
        tier: 'all'
    },
    {
        id: 'med-medplus',
        name: 'MedPlus',
        icon: '💊',
        color: '#1565c0',
        subcat: 'Pharmacy',
        tier: 'all'
    },
    // Generic
    {
        id: 'med-truemeds',
        name: 'Truemeds',
        icon: '💊',
        color: '#4a90e2',
        subcat: 'Generic Medicine',
        tier: 'all'
    },
    {
        id: 'med-genericart',
        name: 'Genericart',
        icon: '💊',
        color: '#2e7d32',
        subcat: 'Generic Medicine',
        tier: 'all'
    },
    {
        id: 'med-davaindia',
        name: 'Davaindia',
        icon: '💊',
        color: '#d32f2f',
        subcat: 'Generic Medicine',
        tier: 'all'
    },
    {
        id: 'med-medkart',
        name: 'Medkart',
        icon: '💊',
        color: '#ff8f00',
        subcat: 'Generic Medicine',
        tier: 'all'
    },
    {
        id: 'med-genericaadhaar',
        name: 'Generic Aadhaar',
        icon: '💊',
        color: '#1976d2',
        subcat: 'Generic Medicine',
        tier: 'all'
    },
    {
        id: 'med-zenerics',
        name: 'Zenerics',
        icon: '💊',
        color: '#c2185b',
        subcat: 'Generic Medicine',
        tier: 'all'
    },
    {
        id: 'med-pharmarack',
        name: 'Pharmarack',
        icon: '💊',
        color: '#00796b',
        subcat: 'Generic Medicine',
        tier: 'tier2'
    },
    {
        id: 'med-platinumrx',
        name: 'PlatinumRx',
        icon: '💊',
        color: '#689f38',
        subcat: 'Generic Medicine',
        tier: 'all'
    },
    {
        id: 'med-sastasundar',
        name: 'SastaSundar',
        icon: '💊',
        color: '#0288d1',
        subcat: 'Generic Medicine',
        tier: 'tier2'
    },
    {
        id: 'med-healthmug',
        name: 'Healthmug',
        icon: '💊',
        color: '#d84315',
        subcat: 'Generic Medicine',
        tier: 'all'
    },
    {
        id: 'med-pharmacybazar',
        name: 'Pharmacy Bazar',
        icon: '💊',
        color: '#4a148c',
        subcat: 'Generic Medicine',
        tier: 'all'
    },
    {
        id: 'med-positrarx',
        name: 'Positra Rx',
        icon: '💊',
        color: '#00838f',
        subcat: 'Generic Medicine',
        tier: 'all'
    },
    {
        id: 'med-pulsepharmacy',
        name: 'Pulse Pharmacy',
        icon: '💊',
        color: '#ad1457',
        subcat: 'Generic Medicine',
        tier: 'all'
    },
    {
        id: 'med-schwabe',
        name: 'Schwabe',
        icon: '💊',
        color: '#283593',
        subcat: 'Generic Medicine',
        tier: 'all'
    },
    {
        id: 'med-ayushcare',
        name: 'AyushCare',
        icon: '🌿',
        color: '#558b2f',
        subcat: 'Generic Medicine',
        tier: 'all'
    },
    {
        id: 'med-frankross',
        name: 'Frank Ross',
        icon: '💊',
        color: '#c62828',
        subcat: 'Generic Medicine',
        tier: 'tier2'
    },
    // Quick
    {
        id: 'med-blinkit',
        name: 'Blinkit',
        icon: '⏱️',
        color: '#f8cb46',
        subcat: 'Quick Delivery',
        tier: 'tier1'
    },
    {
        id: 'med-zepto',
        name: 'Zepto',
        icon: '⏱️',
        color: '#7e57c2',
        subcat: 'Quick Delivery',
        tier: 'tier1'
    },
    {
        id: 'med-instamart',
        name: 'Swiggy Instamart',
        icon: '⚡',
        color: '#fc8019',
        subcat: 'Quick Delivery',
        tier: 'tier1'
    },
    {
        id: 'med-medstown',
        name: 'Medstown',
        icon: '⏱️',
        color: '#0277bd',
        subcat: 'Quick Delivery',
        tier: 'tier1'
    }
];
const SERVICES_PROVIDERS = [
    {
        id: 'service-uc',
        name: 'Urban Company',
        icon: '🔧',
        color: '#000000',
        subcat: 'Home Services',
        tier: 'tier1'
    },
    {
        id: 'service-jd',
        name: 'Justdial',
        icon: '🔧',
        color: '#e65100',
        subcat: 'Home Services',
        tier: 'all'
    },
    {
        id: 'service-nobroker',
        name: 'NoBroker Services',
        icon: '🔧',
        color: '#d32f2f',
        subcat: 'Home Services',
        tier: 'tier1'
    },
    {
        id: 'service-yesmadam',
        name: 'Yes Madam',
        icon: '🔧',
        color: '#c2185b',
        subcat: 'Home Services',
        tier: 'tier1'
    },
    {
        id: 'service-helpr',
        name: 'Helpr',
        icon: '🔧',
        color: '#1565c0',
        subcat: 'Home Services',
        tier: 'tier2'
    },
    {
        id: 'service-digitallaborchowk',
        name: 'Digital Labor Chowk',
        icon: '👷',
        color: '#f57f17',
        subcat: 'Home Services',
        tier: 'tier2'
    }
];
function QuickConnect() {
    _s();
    const { connections, actions, isHydrated, location } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStorage"])();
    const [modalOpen, setModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedProvider, setSelectedProvider] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('food');
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
    // Location filtering logic
    const city = (location?.label || '').toLowerCase();
    let userTier = 'tier1';
    if (city.includes('medininagar') || city.includes('daltonganj')) {
        userTier = 'restricted';
    } else if (city.includes('ranchi') || city.includes('patna')) {
        userTier = 'tier2';
    }
    const availableFoodProviders = FOOD_PROVIDERS.filter((p)=>{
        if (userTier === 'restricted') return p.tier === 'all';
        if (userTier === 'tier2') return p.tier === 'all' || p.tier === 'tier2';
        return true;
    });
    const availableGroceryProviders = GROCERY_PROVIDERS.filter((p)=>{
        if (userTier === 'restricted') return p.tier === 'all'; // Medininagar only gets JioMart, Paytm ONDC, etc.
        if (userTier === 'tier2') return p.tier === 'all' || p.tier === 'tier2';
        return true;
    });
    const foodGroups = availableFoodProviders.reduce((acc, p)=>{
        if (!acc[p.subcat]) acc[p.subcat] = [];
        acc[p.subcat].push(p);
        return acc;
    }, {});
    const groceryGroups = availableGroceryProviders.reduce((acc, p)=>{
        if (!acc[p.subcat]) acc[p.subcat] = [];
        acc[p.subcat].push(p);
        return acc;
    }, {});
    const availableMedicineProviders = MEDICINE_PROVIDERS.filter((p)=>{
        if (userTier === 'restricted') return p.tier === 'all';
        if (userTier === 'tier2') return p.tier === 'all' || p.tier === 'tier2';
        return true;
    });
    const medicineGroups = availableMedicineProviders.reduce((acc, p)=>{
        if (!acc[p.subcat]) acc[p.subcat] = [];
        acc[p.subcat].push(p);
        return acc;
    }, {});
    const availableServiceProviders = SERVICES_PROVIDERS.filter((p)=>{
        if (userTier === 'restricted') return p.tier === 'all';
        if (userTier === 'tier2') return p.tier === 'all' || p.tier === 'tier2';
        return true;
    });
    const ProviderButton = ({ provider })=>{
        const isConnected = connections.some((c)=>c.providerId === provider.id && c.status === 'connected');
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
            variants: itemVariants,
            whileHover: {
                scale: 1.02,
                y: -2
            },
            whileTap: {
                scale: 0.98
            },
            onClick: ()=>handleConnectClick(provider.id, provider.name),
            style: {
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                border: `1px solid ${isConnected ? provider.color : 'var(--border)'}`,
                borderRadius: '16px',
                background: isConnected ? `${provider.color}10` : 'var(--card-bg)',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                minWidth: '150px',
                flex: '0 0 auto',
                boxShadow: isConnected ? `0 2px 8px ${provider.color}20` : 'var(--shadow-sm)'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        background: provider.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1rem',
                        boxShadow: `0 2px 4px ${provider.color}40`
                    },
                    children: provider.icon
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                    lineNumber: 461,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        textAlign: 'left'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                color: 'var(--foreground)'
                            },
                            children: provider.name
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                            lineNumber: 470,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: '0.7rem',
                                color: isConnected ? provider.color : 'var(--muted)',
                                fontWeight: 500
                            },
                            children: isConnected ? 'Connected ✓' : 'Connect Account'
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                            lineNumber: 471,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                    lineNumber: 469,
                    columnNumber: 9
                }, this)
            ]
        }, provider.id, true, {
            fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
            lineNumber: 444,
            columnNumber: 7
        }, this);
    };
    const containerVariants = {
        hidden: {
            opacity: 0
        },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };
    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 20
        },
        show: {
            opacity: 1,
            y: 0
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            padding: '2rem',
            marginBottom: '3rem',
            boxShadow: 'var(--shadow-sm)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        style: {
                            margin: 0,
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            letterSpacing: '-0.02em'
                        },
                        children: "Link apps for better deals"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                        lineNumber: 499,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '0.85rem',
                            color: 'var(--muted)',
                            background: 'var(--muted-bg)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '99px'
                        },
                        children: [
                            "📍 ",
                            city || 'Detecting area...'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                        lineNumber: 500,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                lineNumber: 498,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: '1.5rem',
                    borderBottom: '1px solid var(--border)',
                    marginBottom: '1.5rem',
                    overflowX: 'auto',
                    paddingBottom: '0.5rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('food'),
                        style: {
                            padding: '0.5rem 0',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'food' ? '2px solid var(--foreground)' : '2px solid transparent',
                            fontWeight: activeTab === 'food' ? 600 : 500,
                            color: activeTab === 'food' ? 'var(--foreground)' : 'var(--muted)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        },
                        children: "🍔 Food"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                        lineNumber: 507,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('grocery'),
                        style: {
                            padding: '0.5rem 0',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'grocery' ? '2px solid var(--foreground)' : '2px solid transparent',
                            fontWeight: activeTab === 'grocery' ? 600 : 500,
                            color: activeTab === 'grocery' ? 'var(--foreground)' : 'var(--muted)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        },
                        children: "🛒 Groceries"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                        lineNumber: 511,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('shopping'),
                        style: {
                            padding: '0.5rem 0',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'shopping' ? '2px solid var(--foreground)' : '2px solid transparent',
                            fontWeight: activeTab === 'shopping' ? 600 : 500,
                            color: activeTab === 'shopping' ? 'var(--foreground)' : 'var(--muted)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        },
                        children: "🛍️ Shopping"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                        lineNumber: 515,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('medicine'),
                        style: {
                            padding: '0.5rem 0',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'medicine' ? '2px solid var(--foreground)' : '2px solid transparent',
                            fontWeight: activeTab === 'medicine' ? 600 : 500,
                            color: activeTab === 'medicine' ? 'var(--foreground)' : 'var(--muted)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        },
                        children: "💊 Medicine"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                        lineNumber: 519,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('services'),
                        style: {
                            padding: '0.5rem 0',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'services' ? '2px solid var(--foreground)' : '2px solid transparent',
                            fontWeight: activeTab === 'services' ? 600 : 500,
                            color: activeTab === 'services' ? 'var(--foreground)' : 'var(--muted)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        },
                        children: "🔧 Local Services"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                        lineNumber: 523,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('travel'),
                        style: {
                            padding: '0.5rem 0',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === 'travel' ? '2px solid var(--foreground)' : '2px solid transparent',
                            fontWeight: activeTab === 'travel' ? 600 : 500,
                            color: activeTab === 'travel' ? 'var(--foreground)' : 'var(--muted)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        },
                        children: "✈️ Travel & Cabs"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                        lineNumber: 527,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                lineNumber: 506,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                mode: "wait",
                children: [
                    activeTab === 'food' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        variants: containerVariants,
                        initial: "hidden",
                        animate: "show",
                        exit: "hidden",
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem'
                        },
                        children: [
                            Object.entries(foodGroups).map(([subcat, providers])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            style: {
                                                margin: '0 0 0.75rem 0',
                                                fontSize: '0.75rem',
                                                color: 'var(--muted)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                fontWeight: 600
                                            },
                                            children: subcat
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                            lineNumber: 538,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                gap: '1rem',
                                                overflowX: 'auto',
                                                paddingBottom: '1rem'
                                            },
                                            children: providers.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProviderButton, {
                                                    provider: p
                                                }, p.id, false, {
                                                    fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                                    lineNumber: 540,
                                                    columnNumber: 39
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                            lineNumber: 539,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, subcat, true, {
                                    fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                    lineNumber: 537,
                                    columnNumber: 15
                                }, this)),
                            availableFoodProviders.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: 'var(--muted)',
                                    fontSize: '0.9rem',
                                    fontStyle: 'italic'
                                },
                                children: "No providers available in this location."
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                lineNumber: 545,
                                columnNumber: 16
                            }, this)
                        ]
                    }, "food", true, {
                        fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                        lineNumber: 535,
                        columnNumber: 11
                    }, this),
                    activeTab === 'grocery' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        variants: containerVariants,
                        initial: "hidden",
                        animate: "show",
                        exit: "hidden",
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem'
                        },
                        children: [
                            Object.entries(groceryGroups).map(([subcat, providers])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            style: {
                                                margin: '0 0 0.75rem 0',
                                                fontSize: '0.75rem',
                                                color: 'var(--muted)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                fontWeight: 600
                                            },
                                            children: subcat
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                            lineNumber: 554,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                gap: '1rem',
                                                overflowX: 'auto',
                                                paddingBottom: '1rem'
                                            },
                                            children: providers.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProviderButton, {
                                                    provider: p
                                                }, p.id, false, {
                                                    fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                                    lineNumber: 556,
                                                    columnNumber: 39
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                            lineNumber: 555,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, subcat, true, {
                                    fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                    lineNumber: 553,
                                    columnNumber: 15
                                }, this)),
                            availableGroceryProviders.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: 'var(--muted)',
                                    fontSize: '0.9rem',
                                    fontStyle: 'italic'
                                },
                                children: "No providers available in this location."
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                lineNumber: 561,
                                columnNumber: 16
                            }, this)
                        ]
                    }, "grocery", true, {
                        fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                        lineNumber: 551,
                        columnNumber: 11
                    }, this),
                    activeTab === 'shopping' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        variants: containerVariants,
                        initial: "hidden",
                        animate: "show",
                        exit: "hidden",
                        style: {
                            display: 'flex',
                            gap: '1rem',
                            flexWrap: 'wrap'
                        },
                        children: SHOPPING_PROVIDERS.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProviderButton, {
                                provider: p
                            }, p.id, false, {
                                fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                lineNumber: 568,
                                columnNumber: 43
                            }, this))
                    }, "shopping", false, {
                        fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                        lineNumber: 567,
                        columnNumber: 11
                    }, this),
                    activeTab === 'travel' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        variants: containerVariants,
                        initial: "hidden",
                        animate: "show",
                        exit: "hidden",
                        style: {
                            display: 'flex',
                            gap: '1rem',
                            flexWrap: 'wrap'
                        },
                        children: TRAVEL_PROVIDERS.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProviderButton, {
                                provider: p
                            }, p.id, false, {
                                fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                lineNumber: 574,
                                columnNumber: 41
                            }, this))
                    }, "travel", false, {
                        fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                        lineNumber: 573,
                        columnNumber: 11
                    }, this),
                    activeTab === 'medicine' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        variants: containerVariants,
                        initial: "hidden",
                        animate: "show",
                        exit: "hidden",
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem'
                        },
                        children: [
                            Object.entries(medicineGroups).map(([subcat, providers])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            style: {
                                                margin: '0 0 0.75rem 0',
                                                fontSize: '0.75rem',
                                                color: 'var(--muted)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                fontWeight: 600
                                            },
                                            children: subcat
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                            lineNumber: 582,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                gap: '1rem',
                                                overflowX: 'auto',
                                                paddingBottom: '1rem'
                                            },
                                            children: providers.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProviderButton, {
                                                    provider: p
                                                }, p.id, false, {
                                                    fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                                    lineNumber: 584,
                                                    columnNumber: 39
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                            lineNumber: 583,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, subcat, true, {
                                    fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                    lineNumber: 581,
                                    columnNumber: 15
                                }, this)),
                            availableMedicineProviders.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: 'var(--muted)',
                                    fontSize: '0.9rem',
                                    fontStyle: 'italic'
                                },
                                children: "No providers available in this location."
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                lineNumber: 589,
                                columnNumber: 16
                            }, this)
                        ]
                    }, "medicine", true, {
                        fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                        lineNumber: 579,
                        columnNumber: 11
                    }, this),
                    activeTab === 'services' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        variants: containerVariants,
                        initial: "hidden",
                        animate: "show",
                        exit: "hidden",
                        style: {
                            display: 'flex',
                            gap: '1rem',
                            flexWrap: 'wrap'
                        },
                        children: [
                            availableServiceProviders.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProviderButton, {
                                    provider: p
                                }, p.id, false, {
                                    fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                    lineNumber: 596,
                                    columnNumber: 50
                                }, this)),
                            availableServiceProviders.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: 'var(--muted)',
                                    fontSize: '0.9rem',
                                    fontStyle: 'italic'
                                },
                                children: "No providers available in this location."
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                                lineNumber: 598,
                                columnNumber: 16
                            }, this)
                        ]
                    }, "services", true, {
                        fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                        lineNumber: 595,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                lineNumber: 533,
                columnNumber: 7
            }, this),
            selectedProvider && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$OTPModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                providerName: selectedProvider.name,
                isOpen: modalOpen,
                onClose: ()=>setModalOpen(false),
                onSuccess: handleOtpSuccess
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
                lineNumber: 605,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/QuickConnect.tsx",
        lineNumber: 493,
        columnNumber: 5
    }, this);
}
_s(QuickConnect, "pVkyiTxR5Juj85oM+8AKoHoZ3Z4=", false, function() {
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
const CATEGORIES = [
    {
        id: 'all',
        label: 'All',
        icon: '🔍'
    },
    {
        id: 'food',
        label: 'Food',
        icon: '🍔'
    },
    {
        id: 'grocery',
        label: 'Groceries',
        icon: '🛒'
    },
    {
        id: 'shopping',
        label: 'Shopping',
        icon: '🛍️'
    },
    {
        id: 'medicine',
        label: 'Medicine',
        icon: '💊'
    },
    {
        id: 'services',
        label: 'Local Services',
        icon: '🔧'
    },
    {
        id: 'travel',
        label: 'Travel',
        icon: '✈️'
    },
    {
        id: 'cabs',
        label: 'Cabs',
        icon: '🚕'
    }
];
function SearchInterface() {
    _s();
    const { isHydrated, history, location, wishlist, connections, actions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useStorage$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStorage"])();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
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
                window.postMessage({
                    type: "COMPAREALL_LIVE_SEARCH",
                    payload: {
                        query: termToSearch || searchTerm
                    }
                }, "*");
            } else {
                const connectedIds = connections.filter((c)=>c.status === 'connected').map((c)=>c.providerId);
                const res = await fetch(`/api/compare`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        query: termToSearch || searchTerm,
                        sortOrder: newSortOrder || sortOrder,
                        filters: {
                            ...newFilters,
                            ...filters,
                            category: activeTab !== 'all' ? activeTab : undefined
                        },
                        location: location,
                        connectedProviders: connectedIds
                    })
                });
                const json = await res.json();
                if (json.success) {
                    setResults(json.results);
                    setDataSource(json.dataSource);
                    setIsLive(json.isLive);
                    connectedIds.forEach((id)=>{
                        actions.disconnectProvider(id);
                    });
                }
                setIsSearching(false);
            }
        } catch (error) {
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
    const getPlaceholder = ()=>{
        switch(activeTab){
            case 'food':
                return 'Search for food (e.g. Chicken Biryani)';
            case 'grocery':
                return 'Search groceries (e.g. Milk, Bread)';
            case 'shopping':
                return 'Search products (e.g. iPhone 16)';
            case 'medicine':
                return 'Search medicines (e.g. Paracetamol)';
            case 'services':
                return 'Search local services (e.g. Plumber, AC Repair)';
            case 'travel':
                return 'Search flights or hotels (e.g. Delhi to Mumbai)';
            case 'cabs':
                return 'Search cabs (e.g. Airport cab)';
            default:
                return 'What do you want? (e.g. Biryani, Flights)';
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$LocationSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                location: location,
                onLocationChange: actions.saveLocation
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 174,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: '0.75rem',
                    overflowX: 'auto',
                    marginBottom: '1.5rem',
                    paddingBottom: '0.5rem',
                    WebkitOverflowScrolling: 'touch'
                },
                children: CATEGORIES.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setActiveTab(cat.id);
                            setResults([]);
                        },
                        style: {
                            padding: '0.6rem 1rem',
                            borderRadius: '99px',
                            border: `1px solid ${activeTab === cat.id ? 'var(--foreground)' : 'var(--border)'}`,
                            background: activeTab === cat.id ? 'var(--foreground)' : 'var(--card-bg)',
                            color: activeTab === cat.id ? 'white' : 'var(--foreground)',
                            fontWeight: activeTab === cat.id ? 600 : 500,
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s ease',
                            boxShadow: activeTab === cat.id ? 'var(--shadow-sm)' : 'none'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: cat.icon
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 202,
                                columnNumber: 13
                            }, this),
                            cat.label
                        ]
                    }, cat.id, true, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 182,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 180,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: (e)=>handleSearch(e),
                className: "search-box",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "search-input-wrapper",
                    style: {
                        display: 'flex',
                        gap: '0.5rem'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            className: "search-input",
                            style: {
                                flex: 1,
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '1px solid var(--border)',
                                fontSize: '1rem',
                                outline: 'none'
                            },
                            placeholder: getPlaceholder(),
                            value: searchTerm,
                            onChange: (e)=>setSearchTerm(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                            lineNumber: 210,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            className: "search-button",
                            disabled: isSearching,
                            style: {
                                background: 'var(--foreground)',
                                color: 'white',
                                padding: '1rem 1.5rem',
                                borderRadius: '12px',
                                fontWeight: 600,
                                border: 'none',
                                cursor: isSearching ? 'not-allowed' : 'pointer'
                            },
                            children: isSearching ? '...' : 'Search'
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                            lineNumber: 218,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                    lineNumber: 209,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 208,
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
                            lineNumber: 230,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 229,
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
                                lineNumber: 233,
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
                                lineNumber: 234,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 232,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 228,
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
                                    lineNumber: 249,
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
                                    lineNumber: 250,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                            lineNumber: 248,
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
                                            lineNumber: 256,
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
                                            lineNumber: 257,
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
                                            lineNumber: 259,
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
                                                            lineNumber: 264,
                                                            columnNumber: 26
                                                        }, this),
                                                        " â‚¹",
                                                        offer.price.basePrice
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 264,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Fees & Taxes:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 265,
                                                            columnNumber: 26
                                                        }, this),
                                                        " â‚¹",
                                                        (offer.price.deliveryFee || 0) + (offer.price.platformFee || 0) + (offer.price.taxes || 0)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 265,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Discount:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 266,
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
                                                            lineNumber: 266,
                                                            columnNumber: 53
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 266,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Rating:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 267,
                                                            columnNumber: 26
                                                        }, this),
                                                        " ",
                                                        offer.rating ? `â­ ${offer.rating}` : 'N/A'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 267,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "ETA:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 268,
                                                            columnNumber: 26
                                                        }, this),
                                                        " ",
                                                        offer.estimatedTimeMins ? `${offer.estimatedTimeMins} mins` : 'N/A'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 268,
                                                    columnNumber: 21
                                                }, this),
                                                offer.distanceKm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Distance:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 269,
                                                            columnNumber: 47
                                                        }, this),
                                                        " ",
                                                        offer.distanceKm,
                                                        " km"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 269,
                                                    columnNumber: 42
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                            lineNumber: 263,
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
                                            lineNumber: 272,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, offer.id, true, {
                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                    lineNumber: 255,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                            lineNumber: 253,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                    lineNumber: 247,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 246,
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
                                lineNumber: 285,
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
                                        lineNumber: 295,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "price_desc",
                                        children: "Highest Price First"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 296,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "time_asc",
                                        children: "Fastest Delivery/Arrival"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 297,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "availability_desc",
                                        children: "Highest Availability"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 298,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "rating_desc",
                                        children: "Highest Rating"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 299,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "discount_desc",
                                        children: "Highest Discount"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 300,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 286,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 284,
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
                                        lineNumber: 306,
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
                                        lineNumber: 307,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 305,
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
                                        lineNumber: 316,
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
                                                lineNumber: 322,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 3,
                                                children: "3+ Stars"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 323,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 4,
                                                children: "4+ Stars"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 324,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 4.5,
                                                children: "4.5+ Stars"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 325,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 317,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 315,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 304,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 283,
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
                                        lineNumber: 336,
                                        columnNumber: 15
                                    }, this),
                                    " Get Cheaper Prices!"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 335,
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
                                lineNumber: 338,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 334,
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
                        lineNumber: 342,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 333,
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
                                        lineNumber: 353,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "grouped-result-title",
                                        children: group.title
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 354,
                                        columnNumber: 17
                                    }, this),
                                    group.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: 'var(--muted)'
                                        },
                                        children: group.description
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 355,
                                        columnNumber: 39
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 352,
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
                                                lineNumber: 361,
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
                                                lineNumber: 362,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 360,
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
                                                lineNumber: 367,
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
                                                lineNumber: 368,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 366,
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
                                                lineNumber: 372,
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
                                                lineNumber: 374,
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
                                                lineNumber: 376,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 371,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 358,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "provider-list",
                                children: group.offers.filter((offer)=>offer.status !== 'UNAVAILABLE' && offer.isAvailable !== false).map((offer, offerIdx)=>{
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
                                                                lineNumber: 393,
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
                                                                                lineNumber: 403,
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
                                                                                lineNumber: 404,
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
                                                                                lineNumber: 405,
                                                                                columnNumber: 40
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                        lineNumber: 402,
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
                                                                        lineNumber: 407,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 401,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                        lineNumber: 392,
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
                                                                lineNumber: 414,
                                                                columnNumber: 46
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--warning)'
                                                                },
                                                                children: "Unavailable"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 414,
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
                                                                                lineNumber: 432,
                                                                                columnNumber: 47
                                                                            }, this),
                                                                            benefit
                                                                        ]
                                                                    }, bIdx, true, {
                                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                        lineNumber: 421,
                                                                        columnNumber: 34
                                                                    }, this);
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 417,
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
                                                                lineNumber: 440,
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
                                                                lineNumber: 441,
                                                                columnNumber: 45
                                                            }, this) : null,
                                                            offer.brand && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Brand: ",
                                                                    offer.brand
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 442,
                                                                columnNumber: 41
                                                            }, this),
                                                            offer.size && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Size: ",
                                                                    offer.size
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 443,
                                                                columnNumber: 40
                                                            }, this),
                                                            offer.quantity && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Qty: ",
                                                                    offer.quantity
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 444,
                                                                columnNumber: 44
                                                            }, this),
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
                                                                lineNumber: 445,
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
                                                                lineNumber: 446,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                        lineNumber: 413,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 391,
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
                                                            lineNumber: 452,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                        lineNumber: 451,
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
                                                                lineNumber: 462,
                                                                columnNumber: 27
                                                            }, this),
                                                            (offer.price.deliveryFee || 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Delivery fee: ₹",
                                                                    offer.price.deliveryFee
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 463,
                                                                columnNumber: 66
                                                            }, this),
                                                            (offer.price.platformFee || 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Platform fee: ₹",
                                                                    offer.price.platformFee
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 464,
                                                                columnNumber: 66
                                                            }, this),
                                                            (offer.price.taxes || 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Taxes: ₹",
                                                                    offer.price.taxes
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 465,
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
                                                                lineNumber: 466,
                                                                columnNumber: 63
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                        lineNumber: 461,
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
                                                                lineNumber: 472,
                                                                columnNumber: 28
                                                            }, this),
                                                            "₹",
                                                            offer.price.finalPayablePrice
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                        lineNumber: 470,
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
                                                        lineNumber: 477,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 450,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, offer.id, true, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 390,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 380,
                                columnNumber: 17
                            }, this)
                        ]
                    }, idx, true, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 351,
                        columnNumber: 13
                    }, this)) : !isSearching && searchTerm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "No results found."
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                    lineNumber: 493,
                    columnNumber: 41
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 348,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
        lineNumber: 173,
        columnNumber: 5
    }, this);
}
_s(SearchInterface, "nNoFyvUJjBWgGVjlG58DA2RULKs=", false, function() {
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

//# sourceMappingURL=_1f3axb7._.js.map