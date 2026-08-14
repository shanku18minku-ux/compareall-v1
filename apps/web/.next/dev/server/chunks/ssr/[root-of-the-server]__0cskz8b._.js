module.exports = [
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/apps/web/src/actions/data:422dd3 [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "handleSignOut",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"00de53649b3ef3ff4c7247ce25068877147739a055":{"name":"handleSignOut"}},"apps/web/src/actions/authActions.ts",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("00de53649b3ef3ff4c7247ce25068877147739a055", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "handleSignOut");
;
}),
"[project]/apps/web/src/app/connected-services/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ConnectedServicesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$Navigation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/Navigation.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useStorage.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/mocks/index.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$OTPModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/OTPModal.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function ConnectedServicesPage() {
    const { isHydrated, connections, actions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStorage"])();
    const [modalOpen, setModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedProvider, setSelectedProvider] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    if (!isHydrated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '2rem'
            },
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/connected-services/page.tsx",
            lineNumber: 15,
            columnNumber: 12
        }, this);
    }
    const handleConnectClick = (providerId, providerName, isConnected)=>{
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$Navigation$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/apps/web/src/app/connected-services/page.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    maxWidth: '800px',
                    margin: '0 auto',
                    padding: '1rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        style: {
                            marginTop: '2rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                children: "Connected Services"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/connected-services/page.tsx",
                                lineNumber: 39,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: '#fef08a',
                                    color: '#854d0e',
                                    padding: '1rem',
                                    borderRadius: '4px',
                                    marginBottom: '2rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "⚠️ DEVELOPMENT / DEMO MODE"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/connected-services/page.tsx",
                                        lineNumber: 41,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            margin: '0.5rem 0 0 0'
                                        },
                                        children: "This feature is currently in mock/demo state for architectural testing. CompareAll does NOT have actual access to your external accounts. Future versions will use authorized official APIs/OAuth."
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/connected-services/page.tsx",
                                        lineNumber: 42,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/connected-services/page.tsx",
                                lineNumber: 40,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: 'var(--muted)',
                                    marginBottom: '2rem'
                                },
                                children: [
                                    "(Future Flow) Connect your accounts to view personalized discounts, subscriptions, and better matches.",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/connected-services/page.tsx",
                                        lineNumber: 48,
                                        columnNumber: 115
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Privacy Promise:"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/connected-services/page.tsx",
                                        lineNumber: 49,
                                        columnNumber: 13
                                    }, this),
                                    " We will only use official OAuth when available. Passwords will never be stored."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/connected-services/page.tsx",
                                lineNumber: 47,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "provider-list",
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem'
                                },
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MOCK_PROVIDERS"].map((provider)=>{
                                    const isConnected = connections.some((c)=>c.providerId === provider.config.id && c.status === 'connected');
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "provider-card",
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        style: {
                                                            margin: '0 0 0.5rem 0'
                                                        },
                                                        children: provider.config.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/connected-services/page.tsx",
                                                        lineNumber: 59,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            color: 'var(--muted)',
                                                            fontSize: '0.875rem'
                                                        },
                                                        children: [
                                                            "Category: ",
                                                            provider.config.supportedCategories.join(', ')
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/app/connected-services/page.tsx",
                                                        lineNumber: 60,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            display: 'inline-block',
                                                            background: 'var(--background)',
                                                            padding: '0.2rem 0.5rem',
                                                            borderRadius: '4px',
                                                            fontSize: '0.75rem',
                                                            marginTop: '0.5rem',
                                                            fontWeight: 'bold',
                                                            color: 'var(--muted)'
                                                        },
                                                        children: "MOCK PROVIDER"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/connected-services/page.tsx",
                                                        lineNumber: 61,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/app/connected-services/page.tsx",
                                                lineNumber: 58,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleConnectClick(provider.config.id, provider.config.name, isConnected),
                                                style: {
                                                    background: isConnected ? 'var(--background)' : 'var(--primary)',
                                                    color: isConnected ? 'var(--foreground)' : 'white',
                                                    border: isConnected ? '1px solid var(--border)' : 'none',
                                                    padding: '0.75rem 1.5rem',
                                                    borderRadius: '4px',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer'
                                                },
                                                children: isConnected ? 'Disconnect' : 'Connect Demo Account'
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/connected-services/page.tsx",
                                                lineNumber: 73,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, provider.config.id, true, {
                                        fileName: "[project]/apps/web/src/app/connected-services/page.tsx",
                                        lineNumber: 57,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/connected-services/page.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/connected-services/page.tsx",
                        lineNumber: 38,
                        columnNumber: 9
                    }, this),
                    selectedProvider && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$OTPModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        providerName: selectedProvider.name.replace('[MOCK] ', '').replace(' Clone', ''),
                        isOpen: modalOpen,
                        onClose: ()=>setModalOpen(false),
                        onSuccess: handleOtpSuccess
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/connected-services/page.tsx",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/connected-services/page.tsx",
                lineNumber: 37,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/connected-services/page.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auth",
    ()=>auth,
    "handlers",
    ()=>handlers,
    "signIn",
    ()=>signIn,
    "signOut",
    ()=>signOut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/index.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$google$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-auth/providers/google.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$providers$2f$google$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@auth/core/providers/google.js [app-ssr] (ecmascript)");
;
;
const { handlers, signIn, signOut, auth } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])({
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$providers$2f$google$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    secret: process.env.AUTH_SECRET || "fallback_secret_for_development",
    pages: {
        signIn: '/login'
    }
});
}),
"[project]/apps/web/src/components/Navigation.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Navigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$data$3a$422dd3__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/apps/web/src/actions/data:422dd3 [app-ssr] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
;
;
;
;
async function Navigation() {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auth"])();
    const links = [
        {
            name: 'Home',
            path: '/'
        },
        {
            name: 'Categories',
            path: '/categories'
        },
        {
            name: 'Connected Services',
            path: '/connected-services'
        },
        {
            name: 'Wishlist',
            path: '/wishlist'
        },
        {
            name: 'History',
            path: '/history'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "header-nav",
        style: {
            flexWrap: 'nowrap',
            gap: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 0'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "logo",
                        style: {
                            fontWeight: 'bold',
                            fontSize: '1.5rem',
                            color: 'var(--primary)',
                            textDecoration: 'none'
                        },
                        children: "CompareAll"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/Navigation.tsx",
                        lineNumber: 19,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "header-links",
                        style: {
                            display: 'flex',
                            gap: '1rem',
                            fontSize: '0.875rem'
                        },
                        children: links.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: link.path,
                                style: {
                                    color: 'var(--muted)',
                                    textDecoration: 'none'
                                },
                                children: link.name
                            }, link.name, false, {
                                fileName: "[project]/apps/web/src/components/Navigation.tsx",
                                lineNumber: 24,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/Navigation.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/Navigation.tsx",
                lineNumber: 18,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                },
                children: session?.user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            },
                            children: [
                                session.user.image && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: session.user.image,
                                    alt: "Profile",
                                    style: {
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/Navigation.tsx",
                                    lineNumber: 36,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: '0.875rem',
                                        fontWeight: '500'
                                    },
                                    children: session.user.name
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/Navigation.tsx",
                                    lineNumber: 38,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/Navigation.tsx",
                            lineNumber: 34,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            action: __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$actions$2f$data$3a$422dd3__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["handleSignOut"],
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                style: {
                                    padding: '0.4rem 0.8rem',
                                    fontSize: '0.875rem',
                                    color: 'white',
                                    background: 'var(--foreground)',
                                    borderRadius: '6px',
                                    border: 'none',
                                    cursor: 'pointer'
                                },
                                children: "Logout"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/Navigation.tsx",
                                lineNumber: 41,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/Navigation.tsx",
                            lineNumber: 40,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/Navigation.tsx",
                    lineNumber: 33,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    href: "/login",
                    style: {
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        color: 'white',
                        background: 'var(--primary)',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    },
                    children: "Login / Sign up"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/Navigation.tsx",
                    lineNumber: 47,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/Navigation.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/Navigation.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/OTPModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OTPModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function OTPModal({ providerName, isOpen, onClose, onSuccess }) {
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [phone, setPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [otp, setOtp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        color: 'var(--muted)',
                        fontSize: '0.875rem',
                        marginBottom: '1.5rem'
                    },
                    children: [
                        "We use your number to fetch ",
                        providerName,
                        " specific discounts. ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
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
                step === 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSendOtp,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: '1.5rem'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleVerifyOtp,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: '1.5rem'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
}),
"[project]/apps/web/src/hooks/useStorage.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useStorage",
    ()=>useStorage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/storage/src/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/storage/src/web/LocalStorageManager.ts [app-ssr] (ecmascript)");
"use client";
;
;
function useStorage() {
    const [isHydrated, setIsHydrated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [location, setLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [preferences, setPreferences] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [connections, setConnections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [wishlist, setWishlist] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Load all data on mount to avoid SSR hydration mismatch
        setHistory(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalStorageManager"].getHistory());
        setLocation(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalStorageManager"].getLocation());
        setPreferences(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalStorageManager"].getPreferences());
        setConnections(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalStorageManager"].getConnections());
        setWishlist(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalStorageManager"].getWishlist());
        setIsHydrated(true);
    }, []);
    const addSearchHistory = (term)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalStorageManager"].addHistory(term);
        setHistory(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalStorageManager"].getHistory());
    };
    const clearSearchHistory = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalStorageManager"].clearHistory();
        setHistory([]);
    };
    const saveLocation = (loc)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalStorageManager"].setLocation(loc);
        setLocation(loc);
    };
    const updatePreferences = (prefs)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalStorageManager"].updatePreferences(prefs);
        setPreferences(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalStorageManager"].getPreferences());
    };
    const connectProvider = (id)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalStorageManager"].connectProvider(id);
        setConnections(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalStorageManager"].getConnections());
    };
    const disconnectProvider = (id)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalStorageManager"].disconnectProvider(id);
        setConnections(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalStorageManager"].getConnections());
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
                __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalStorageManager"].toggleWishlist({
                    id: item.id,
                    title: item.title,
                    category: item.category
                });
                setWishlist(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LocalStorageManager"].getWishlist());
            }
        }
    };
}
}),
"[project]/apps/web/src/lib/providers/categories/BaseCategoryProvider.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BaseCategoryProvider",
    ()=>BaseCategoryProvider
]);
class BaseCategoryProvider {
    config;
    constructor(config){
        this.config = config;
    }
    // Optional: Common methods for API connections that can be overridden
    async connect(credentials) {
        return true;
    }
    async disconnect() {}
    async isConnected() {
        return true;
    }
}
}),
"[project]/apps/web/src/lib/providers/categories/FoodProvider.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FoodProvider",
    ()=>FoodProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$BaseCategoryProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/categories/BaseCategoryProvider.ts [app-ssr] (ecmascript)");
;
class FoodProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$BaseCategoryProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BaseCategoryProvider"] {
    constructor(id, name){
        super({
            id,
            name,
            supportedCategories: [
                'food'
            ],
            requiresAuth: true
        });
    }
    // Enforce specific location rules for food
    async search(query) {
        if (!query.location || !query.location.lat && !query.location.pincode) {
            throw new Error(`Location (Lat/Lng or Pincode) is strictly required for Food delivery searches on ${this.config.name}.`);
        }
        return this.fetchFoodOptions(query);
    }
}
}),
"[project]/apps/web/src/lib/providers/categories/GroceryProvider.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GroceryProvider",
    ()=>GroceryProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$BaseCategoryProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/categories/BaseCategoryProvider.ts [app-ssr] (ecmascript)");
;
class GroceryProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$BaseCategoryProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BaseCategoryProvider"] {
    constructor(id, name){
        super({
            id,
            name,
            supportedCategories: [
                'grocery'
            ],
            requiresAuth: true
        });
    }
    async search(query) {
        if (!query.location || !query.location.lat && !query.location.pincode) {
            throw new Error(`Location (Lat/Lng or Pincode) is strictly required for Grocery delivery searches on ${this.config.name}.`);
        }
        return this.fetchGroceryOptions(query);
    }
}
}),
"[project]/apps/web/src/lib/providers/categories/ShoppingProvider.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ShoppingProvider",
    ()=>ShoppingProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$BaseCategoryProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/categories/BaseCategoryProvider.ts [app-ssr] (ecmascript)");
;
class ShoppingProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$BaseCategoryProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BaseCategoryProvider"] {
    constructor(id, name){
        super({
            id,
            name,
            supportedCategories: [
                'shopping',
                'electronics',
                'fashion'
            ],
            requiresAuth: false
        });
    }
    async search(query) {
        // Shopping can operate nationwide, so location is optional but helpful for ETA
        return this.fetchShoppingOptions(query);
    }
}
}),
"[project]/apps/web/src/lib/providers/categories/TravelProvider.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TravelProvider",
    ()=>TravelProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$BaseCategoryProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/categories/BaseCategoryProvider.ts [app-ssr] (ecmascript)");
;
class TravelProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$BaseCategoryProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BaseCategoryProvider"] {
    constructor(id, name){
        super({
            id,
            name,
            supportedCategories: [
                'travel'
            ],
            requiresAuth: false
        });
    }
    async search(query) {
        return this.fetchTravelOptions(query);
    }
}
}),
"[project]/apps/web/src/lib/providers/mocks/index.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MOCK_PROVIDERS",
    ()=>MOCK_PROVIDERS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockFoodProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/mocks/mockFoodProviders.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockShoppingProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/mocks/mockShoppingProviders.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockTravelProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/mocks/mockTravelProviders.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockGroceryProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/mocks/mockGroceryProviders.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockMedicineProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/mocks/mockMedicineProviders.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockServiceProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/mocks/mockServiceProviders.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
const MOCK_PROVIDERS = [
    ...__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockFoodProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extendedFoodProviders"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockShoppingProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extendedShoppingProviders"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockTravelProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extendedTravelProviders"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockGroceryProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extendedGroceryProviders"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockMedicineProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extendedMedicineProviders"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockServiceProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extendedServiceProviders"]
];
}),
"[project]/apps/web/src/lib/providers/mocks/mockFoodProviders.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GenericFoodProvider",
    ()=>GenericFoodProvider,
    "extendedFoodProviders",
    ()=>extendedFoodProviders
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$FoodProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/categories/FoodProvider.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/mocks/mockUtils.ts [app-ssr] (ecmascript)");
;
;
class GenericFoodProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$FoodProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FoodProvider"] {
    baseDeliveryFee;
    supportedKeywords;
    restrictedKeywords;
    metroOnly;
    constructor(id, name, baseDeliveryFee, supportedKeywords = [], restrictedKeywords = [], metroOnly = false){
        super(id, name), this.baseDeliveryFee = baseDeliveryFee, this.supportedKeywords = supportedKeywords, this.restrictedKeywords = restrictedKeywords, this.metroOnly = metroOnly;
    }
    async fetchFoodOptions(query) {
        const term = query.term.toLowerCase();
        // Strict Location Mocking Logic
        if (query.location?.label) {
            const loc = query.location.label.toLowerCase();
            const isMetro = [
                'mumbai',
                'delhi',
                'bangalore',
                'bengaluru',
                'hyderabad',
                'chennai',
                'kolkata',
                'pune',
                'ahmedabad',
                'gurugram',
                'noida',
                'gurgaon'
            ].some((m)=>loc.includes(m));
            const isTier2 = [
                'chandigarh',
                'jaipur',
                'lucknow',
                'indore',
                'bhopal',
                'kochi',
                'patna',
                'kanpur',
                'nagpur',
                'surat',
                'visakhapatnam'
            ].some((m)=>loc.includes(m));
            // If provider is marked as Metro Only, it ONLY shows in Metros
            if (this.metroOnly && !isMetro) {
                return [];
            }
            // If it's NOT metro only, but it's a small town (Tier 3+ like Daltonganj), 
            // we should ONLY allow Zomato, Swiggy, Dominos, and Train/Airport services.
            if (!isMetro && !isTier2) {
                const allowedAnywhere = [
                    'food-zomato',
                    'food-swiggy',
                    'food-dominos',
                    'food-irctc',
                    'food-zoop',
                    'food-railrestro',
                    'food-travelkhana',
                    'food-tfs'
                ];
                if (!allowedAnywhere.includes(this.config.id)) {
                    return [];
                }
            }
        }
        // Check if query is explicitly restricted
        if (this.restrictedKeywords.length > 0 && this.restrictedKeywords.some((k)=>term.includes(k))) {
            return [];
        }
        // If provider has specific supported keywords, ensure query matches at least one (unless query is empty)
        if (this.supportedKeywords.length > 0 && term.trim() !== '') {
            const matches = this.supportedKeywords.some((k)=>term.includes(k));
            if (!matches && !term.includes(this.config.name.toLowerCase())) {
                return [];
            }
        }
        const isConnected = query.connectedProviders?.includes(this.config.id);
        // Mock Pricing Logic based on keywords to make results look realistic
        let basePrice = 250;
        if (term.includes('pizza')) basePrice = 350;
        if (term.includes('burger')) basePrice = 150;
        if (term.includes('biryani')) basePrice = 280;
        if (term.includes('cake') || term.includes('dessert')) basePrice = 450;
        if (term.includes('coffee') || term.includes('tea')) basePrice = 180;
        if (term.includes('salad') || term.includes('healthy')) basePrice = 300;
        const variation = this.config.name.length * 17 % (basePrice * 0.2) - basePrice * 0.1;
        const finalPrice = Math.max(50, Math.floor(basePrice + variation));
        const deliveryFee = isConnected ? 0 : this.baseDeliveryFee;
        const discount = isConnected ? Math.floor(finalPrice * 0.1) : 0;
        await new Promise((r)=>setTimeout(r, 200 + Math.random() * 300));
        return [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMockResult"])(this.config.id, this.config.name, `${this.config.id}-1`, {
                title: `${query.term.charAt(0).toUpperCase() + query.term.slice(1) || 'Delicious Meal'}`,
                description: `Delivered by ${this.config.name}`,
                category: 'food',
                price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateFinalPrice"])(finalPrice, deliveryFee, 20, 0, discount, 0, 0),
                originalPrice: finalPrice,
                estimatedTimeMins: this.baseDeliveryFee < 20 ? 15 : 35,
                rating: 3.5 + this.config.name.length % 15 / 10,
                accountBenefits: isConnected ? [
                    `${this.config.name} Pro: Free Delivery`
                ] : [],
                deepLinkUrl: `https://${this.config.name.toLowerCase().replace(/[^a-z]/g, '')}.com/search?q=${encodeURIComponent(term)}`
            })
        ];
    }
}
// Keyword groups
const trainKeywords = [
    'train',
    'irctc',
    'station',
    'pnr'
];
const airportKeywords = [
    'airport',
    'flight',
    'terminal'
];
const pizzaKeywords = [
    'pizza',
    'garlic bread'
];
const burgerKeywords = [
    'burger',
    'fries'
];
const biryaniKeywords = [
    'biryani',
    'kebab',
    'thali',
    'meal'
];
const bakeryKeywords = [
    'cake',
    'pastry',
    'dessert',
    'sweet',
    'ice cream'
];
const coffeeKeywords = [
    'coffee',
    'tea',
    'beverage',
    'snack'
];
const healthyKeywords = [
    'salad',
    'healthy',
    'diet',
    'protein'
];
const ZomatoProvider = new GenericFoodProvider('food-zomato', 'Zomato', 40, [], [
    ...trainKeywords,
    ...airportKeywords
]);
const SwiggyProvider = new GenericFoodProvider('food-swiggy', 'Swiggy', 40, [], [
    ...trainKeywords,
    ...airportKeywords
]);
const MagicpinProvider = new GenericFoodProvider('food-magicpin', 'Magicpin', 30, [], [], true);
const EatSureProvider = new GenericFoodProvider('food-eatsure', 'EatSure', 0, [], [], true);
// Hiding ONDC providers as requested
// const PincodeProvider = new GenericFoodProvider('food-pincode', 'Pincode (ONDC)', 20, [], [], true);
// const MystoreProvider = new GenericFoodProvider('food-mystore', 'Mystore (ONDC)', 25, [], [], true);
// const PaytmONDCProvider = new GenericFoodProvider('food-paytm-ondc', 'Paytm ONDC', 20, [], [], true);
// const OlaONDCProvider = new GenericFoodProvider('food-ola-ondc', 'Ola ONDC Food', 30, [], [], true);
// const SpiceMoneyProvider = new GenericFoodProvider('food-spicemoney', 'Spice Money', 25, [], [], true);
// 2. Direct Restaurant (Pizza & Burger)
const DominosProvider = new GenericFoodProvider('food-dominos', 'Domino\'s', 0, pizzaKeywords);
const PizzaHutProvider = new GenericFoodProvider('food-pizzahut', 'Pizza Hut', 30, pizzaKeywords);
const LaPinozProvider = new GenericFoodProvider('food-lapinoz', 'La Pino\'z Pizza', 20, pizzaKeywords);
const OvenStoryProvider = new GenericFoodProvider('food-ovenstory', 'OvenStory Pizza', 0, pizzaKeywords, [], true);
const MojoPizzaProvider = new GenericFoodProvider('food-mojopizza', 'MojoPizza', 25, pizzaKeywords, [], true);
const ChicagoPizzaProvider = new GenericFoodProvider('food-chicagopizza', 'Chicago Pizza', 40, pizzaKeywords, [], true);
const McDonaldsProvider = new GenericFoodProvider('food-mcdonalds', 'McDonald\'s', 40, burgerKeywords);
const BurgerKingProvider = new GenericFoodProvider('food-burgerking', 'Burger King', 35, burgerKeywords);
const KFCProvider = new GenericFoodProvider('food-kfc', 'KFC', 40, [
    ...burgerKeywords,
    'chicken'
]);
const SubwayProvider = new GenericFoodProvider('food-subway', 'Subway', 30, [
    'sub',
    'sandwich',
    'salad'
]);
const WendysProvider = new GenericFoodProvider('food-wendys', 'Wendy\'s', 40, burgerKeywords, [], true);
// 3. Indian / Biryani
const FaasosProvider = new GenericFoodProvider('food-faasos', 'Faasos', 0, [
    'wrap',
    'roll',
    'meal'
], [], true);
const BehrouzProvider = new GenericFoodProvider('food-behrouz', 'Behrouz Biryani', 0, biryaniKeywords, [], true);
const BiryaniBluesProvider = new GenericFoodProvider('food-biryaniblues', 'Biryani Blues', 40, biryaniKeywords, [], true);
const BiryaniByKiloProvider = new GenericFoodProvider('food-bbk', 'Biryani By Kilo', 50, biryaniKeywords, [], true);
const Box8Provider = new GenericFoodProvider('food-box8', 'BOX8', 0, biryaniKeywords, [], true);
const HaldiramsProvider = new GenericFoodProvider('food-haldirams', 'Haldiram\'s', 30, [
    'thali',
    'snack',
    'sweet',
    'chole'
]);
// 4. Bakery / Sweets
const MioAmoreProvider = new GenericFoodProvider('food-mioamore', 'Mio Amore', 20, bakeryKeywords);
const MonginisProvider = new GenericFoodProvider('food-monginis', 'Monginis', 30, bakeryKeywords);
const TheobromaProvider = new GenericFoodProvider('food-theobroma', 'Theobroma', 50, bakeryKeywords, [], true);
const BakingoProvider = new GenericFoodProvider('food-bakingo', 'Bakingo', 0, bakeryKeywords);
const BaskinRobbinsProvider = new GenericFoodProvider('food-baskin', 'Baskin-Robbins', 40, [
    'ice cream',
    'dessert'
]);
const FNPProvider = new GenericFoodProvider('food-fnp', 'Ferns N Petals', 60, bakeryKeywords);
// 5. Coffee / Beverages
const StarbucksProvider = new GenericFoodProvider('food-starbucks', 'Starbucks', 50, coffeeKeywords, [], true);
const ChaayosProvider = new GenericFoodProvider('food-chaayos', 'Chaayos', 30, coffeeKeywords, [], true);
const ChaiPointProvider = new GenericFoodProvider('food-chaipoint', 'Chai Point', 30, coffeeKeywords, [], true);
const ThirdWaveProvider = new GenericFoodProvider('food-thirdwave', 'Third Wave Coffee', 40, coffeeKeywords, [], true);
const WowMomoProvider = new GenericFoodProvider('food-wowmomo', 'Wow! Momo', 20, [
    'momo',
    'snack'
]);
// 6. Healthy / Diet
const EatFitProvider = new GenericFoodProvider('food-eatfit', 'EatFit', 0, healthyKeywords, [], true);
const FreshMenuProvider = new GenericFoodProvider('food-freshmenu', 'FreshMenu', 30, healthyKeywords, [], true);
const SaladDaysProvider = new GenericFoodProvider('food-saladdays', 'Salad Days', 40, healthyKeywords, [], true);
const CurefoodsProvider = new GenericFoodProvider('food-curefoods', 'Curefoods', 0, healthyKeywords, [], true);
// 7. Cloud-Kitchen (Aggregated above mostly, adding EatClub/Rebel)
const EatClubProvider = new GenericFoodProvider('food-eatclub', 'EatClub', 0, [], [], true); // Sells everything
const RebelFoodsProvider = new GenericFoodProvider('food-rebelfoods', 'Rebel Foods', 0, [], [], true); // Sells everything
// 8. Quick Food
const ZeptoCafeProvider = new GenericFoodProvider('food-zeptocafe', 'Zepto Cafe', 15, [], [], true);
const SwiggyBoltProvider = new GenericFoodProvider('food-swiggybolt', 'Swiggy Bolt', 15, [], [], true);
const BlinkitBistroProvider = new GenericFoodProvider('food-blinkitbistro', 'Blinkit Bistro', 15, [], [], true);
const SwishProvider = new GenericFoodProvider('food-swish', 'Swish', 10, [], [], true);
const ToingProvider = new GenericFoodProvider('food-toing', 'Toing', 10, [], [], true);
// 9. Train / Railway
const IrctcProvider = new GenericFoodProvider('food-irctc', 'IRCTC eCatering', 0, trainKeywords);
const ZoopProvider = new GenericFoodProvider('food-zoop', 'Zoop', 20, trainKeywords);
const RailRestroProvider = new GenericFoodProvider('food-railrestro', 'RailRestro', 30, trainKeywords);
const TravelkhanaProvider = new GenericFoodProvider('food-travelkhana', 'Travelkhana', 25, trainKeywords);
// 10. Airport Food
const TfsProvider = new GenericFoodProvider('food-tfs', 'Travel Food Services', 50, airportKeywords);
// 11. Regional
const ChowmanProvider = new GenericFoodProvider('food-chowman', 'Chowman', 40, [
    'chinese',
    'noodle',
    'rice'
]);
const YummyCloudProvider = new GenericFoodProvider('food-yummycloud', 'Yummy Cloud', 20);
const extendedFoodProviders = [
    ZomatoProvider,
    SwiggyProvider,
    MagicpinProvider,
    EatSureProvider,
    DominosProvider,
    PizzaHutProvider,
    LaPinozProvider,
    OvenStoryProvider,
    MojoPizzaProvider,
    ChicagoPizzaProvider,
    McDonaldsProvider,
    BurgerKingProvider,
    KFCProvider,
    SubwayProvider,
    WendysProvider,
    FaasosProvider,
    BehrouzProvider,
    BiryaniBluesProvider,
    BiryaniByKiloProvider,
    Box8Provider,
    HaldiramsProvider,
    MioAmoreProvider,
    MonginisProvider,
    TheobromaProvider,
    BakingoProvider,
    BaskinRobbinsProvider,
    FNPProvider,
    StarbucksProvider,
    ChaayosProvider,
    ChaiPointProvider,
    ThirdWaveProvider,
    WowMomoProvider,
    EatFitProvider,
    FreshMenuProvider,
    SaladDaysProvider,
    CurefoodsProvider,
    EatClubProvider,
    RebelFoodsProvider,
    ZeptoCafeProvider,
    SwiggyBoltProvider,
    BlinkitBistroProvider,
    SwishProvider,
    ToingProvider,
    IrctcProvider,
    ZoopProvider,
    RailRestroProvider,
    TravelkhanaProvider,
    TfsProvider,
    ChowmanProvider,
    YummyCloudProvider
];
}),
"[project]/apps/web/src/lib/providers/mocks/mockGroceryProviders.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AkshayakalpaProvider",
    ()=>AkshayakalpaProvider,
    "AmazonFreshProvider",
    ()=>AmazonFreshProvider,
    "BBDailyProvider",
    ()=>BBDailyProvider,
    "BBNowProvider",
    ()=>BBNowProvider,
    "BigBasketProvider",
    ()=>BigBasketProvider,
    "BlinkitProvider",
    ()=>BlinkitProvider,
    "CountryDelightProvider",
    ()=>CountryDelightProvider,
    "DMartReadyProvider",
    ()=>DMartReadyProvider,
    "FlipkartGroceryProvider",
    ()=>FlipkartGroceryProvider,
    "FlipkartMinutesProvider",
    ()=>FlipkartMinutesProvider,
    "FreshToHomeProvider",
    ()=>FreshToHomeProvider,
    "GenericGroceryProvider",
    ()=>GenericGroceryProvider,
    "JioMartProvider",
    ()=>JioMartProvider,
    "JumbotailProvider",
    ()=>JumbotailProvider,
    "LiciousProvider",
    ()=>LiciousProvider,
    "Mantra24Provider",
    ()=>Mantra24Provider,
    "MeatigoProvider",
    ()=>MeatigoProvider,
    "MilkbasketProvider",
    ()=>MilkbasketProvider,
    "MoreRetailProvider",
    ()=>MoreRetailProvider,
    "MystoreProvider",
    ()=>MystoreProvider,
    "NaturesBasketProvider",
    ()=>NaturesBasketProvider,
    "NinjacartProvider",
    ()=>NinjacartProvider,
    "OrganicTattvaProvider",
    ()=>OrganicTattvaProvider,
    "OtipyProvider",
    ()=>OtipyProvider,
    "PaytmONDCProvider",
    ()=>PaytmONDCProvider,
    "PincodeProvider",
    ()=>PincodeProvider,
    "RelianceSmartProvider",
    ()=>RelianceSmartProvider,
    "SpencersProvider",
    ()=>SpencersProvider,
    "StarQuikProvider",
    ()=>StarQuikProvider,
    "SuprDailyProvider",
    ()=>SuprDailyProvider,
    "SwiggyInstamartProvider",
    ()=>SwiggyInstamartProvider,
    "TataNeuProvider",
    ()=>TataNeuProvider,
    "TenderCutsProvider",
    ()=>TenderCutsProvider,
    "UdaanProvider",
    ()=>UdaanProvider,
    "ZeptoProvider",
    ()=>ZeptoProvider,
    "extendedGroceryProviders",
    ()=>extendedGroceryProviders
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$GroceryProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/categories/GroceryProvider.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/mocks/mockUtils.ts [app-ssr] (ecmascript)");
;
;
class GenericGroceryProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$GroceryProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GroceryProvider"] {
    baseDeliveryFee;
    supportedKeywords;
    restrictedKeywords;
    isB2B;
    constructor(id, name, baseDeliveryFee, supportedKeywords = [], restrictedKeywords = [], isB2B = false){
        super(id, name), this.baseDeliveryFee = baseDeliveryFee, this.supportedKeywords = supportedKeywords, this.restrictedKeywords = restrictedKeywords, this.isB2B = isB2B;
    }
    async fetchGroceryOptions(query) {
        const term = query.term.toLowerCase();
        // Quick filtering
        if (this.restrictedKeywords.length > 0 && this.restrictedKeywords.some((k)=>term.includes(k))) {
            return [];
        }
        if (this.supportedKeywords.length > 0) {
            const matches = this.supportedKeywords.some((k)=>term.includes(k));
            if (!matches && !term.includes(this.config.name.toLowerCase())) {
                return [];
            }
        }
        const isConnected = query.connectedProviders?.includes(this.config.id);
        // Mock Pricing Logic
        let basePrice = 60;
        if (term.includes('milk')) basePrice = 30;
        if (term.includes('chicken') || term.includes('meat')) basePrice = 250;
        if (term.includes('apple') || term.includes('fruit')) basePrice = 150;
        if (term.includes('atta') || term.includes('rice')) basePrice = 400;
        // B2B platforms sell in bulk
        let quantityText = '1 unit';
        if (this.isB2B) {
            basePrice = basePrice * 10;
            quantityText = '10 Kg / Bulk';
        } else if (term.includes('milk')) {
            quantityText = '500 ml';
        } else if (term.includes('chicken')) {
            quantityText = '500 g';
        } else if (term.includes('apple')) {
            quantityText = '1 Kg';
        } else if (term.includes('atta')) {
            quantityText = '5 Kg';
        }
        const variation = this.config.name.length * 13 % (basePrice * 0.2) - basePrice * 0.1;
        const finalPrice = Math.max(10, Math.floor(basePrice + variation));
        const deliveryFee = isConnected ? 0 : this.baseDeliveryFee;
        const discount = isConnected ? Math.floor(finalPrice * 0.1) : 0;
        await new Promise((r)=>setTimeout(r, 150 + Math.random() * 300));
        return [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMockResult"])(this.config.id, this.config.name, `${this.config.id}-1`, {
                title: `${query.term.charAt(0).toUpperCase() + query.term.slice(1)}`,
                description: this.isB2B ? 'Wholesale Price' : 'Fresh Delivery',
                category: 'grocery',
                price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateFinalPrice"])(finalPrice, deliveryFee, 5, 0, discount, 0, 0),
                originalPrice: Math.floor(finalPrice * 1.1),
                estimatedTimeMins: this.baseDeliveryFee > 20 ? 120 : 15,
                rating: 4.0 + this.config.name.length % 10 / 10,
                brand: 'Generic',
                quantity: this.isB2B ? 10 : 1,
                size: quantityText,
                accountBenefits: isConnected ? [
                    `${this.config.name} Saved: Free Delivery & Member Price`
                ] : [],
                deepLinkUrl: `https://${this.config.name.toLowerCase().replace(/[^a-z]/g, '')}.com/search?q=${encodeURIComponent(term)}`
            })
        ];
    }
}
const BlinkitProvider = new GenericGroceryProvider('groc-blinkit', 'Blinkit', 15);
const ZeptoProvider = new GenericGroceryProvider('groc-zepto', 'Zepto', 15);
const SwiggyInstamartProvider = new GenericGroceryProvider('groc-instamart', 'Swiggy Instamart', 20);
const BigBasketProvider = new GenericGroceryProvider('groc-bigbasket', 'BigBasket', 50);
const BBNowProvider = new GenericGroceryProvider('groc-bbnow', 'BB Now', 15);
const JioMartProvider = new GenericGroceryProvider('groc-jiomart', 'JioMart', 0);
const AmazonFreshProvider = new GenericGroceryProvider('groc-amazon-fresh', 'Amazon Fresh', 40);
const FlipkartGroceryProvider = new GenericGroceryProvider('groc-flipkart-groc', 'Flipkart Grocery', 50);
const FlipkartMinutesProvider = new GenericGroceryProvider('groc-flipkart-min', 'Flipkart Minutes', 25);
const DMartReadyProvider = new GenericGroceryProvider('groc-dmart', 'DMart Ready', 50);
const TataNeuProvider = new GenericGroceryProvider('groc-tataneu', 'Tata Neu', 40);
const SpencersProvider = new GenericGroceryProvider('groc-spencers', 'Spencer\'s', 50);
const StarQuikProvider = new GenericGroceryProvider('groc-starquik', 'StarQuik', 40);
const NaturesBasketProvider = new GenericGroceryProvider('groc-naturesbasket', 'Nature\'s Basket', 100);
const RelianceSmartProvider = new GenericGroceryProvider('groc-reliancesmart', 'Reliance Smart', 30);
const MoreRetailProvider = new GenericGroceryProvider('groc-more', 'More Retail', 40);
// 3. Milk & Daily Essentials
const milkKeywords = [
    'milk',
    'curd',
    'bread',
    'butter',
    'paneer',
    'egg',
    'coconut'
];
const MilkbasketProvider = new GenericGroceryProvider('groc-milkbasket', 'Milkbasket', 0, milkKeywords);
const CountryDelightProvider = new GenericGroceryProvider('groc-countrydelight', 'Country Delight', 0, milkKeywords);
const BBDailyProvider = new GenericGroceryProvider('groc-bbdaily', 'BB Daily', 0, milkKeywords);
const SuprDailyProvider = new GenericGroceryProvider('groc-suprdaily', 'Supr Daily', 0, milkKeywords);
const AkshayakalpaProvider = new GenericGroceryProvider('groc-akshayakalpa', 'Akshayakalpa', 0, milkKeywords);
// 4. Fresh, Meat & Organic
const meatKeywords = [
    'chicken',
    'mutton',
    'fish',
    'prawn',
    'meat'
];
const freshKeywords = [
    'apple',
    'banana',
    'tomato',
    'onion',
    'potato',
    'veg',
    'fruit'
];
const OtipyProvider = new GenericGroceryProvider('groc-otipy', 'Otipy', 20, freshKeywords);
const FreshToHomeProvider = new GenericGroceryProvider('groc-freshtohome', 'FreshToHome', 30, [
    ...meatKeywords,
    ...freshKeywords
]);
const LiciousProvider = new GenericGroceryProvider('groc-licious', 'Licious', 40, meatKeywords);
const MeatigoProvider = new GenericGroceryProvider('groc-meatigo', 'Meatigo', 50, meatKeywords);
const TenderCutsProvider = new GenericGroceryProvider('groc-tendercuts', 'TenderCuts', 35, meatKeywords);
const OrganicTattvaProvider = new GenericGroceryProvider('groc-organictattva', 'Organic Tattva', 50, [
    'organic',
    'atta',
    'dal',
    'rice'
]);
const Mantra24Provider = new GenericGroceryProvider('groc-24mantra', '24 Mantra Organic', 50, [
    'organic',
    'atta',
    'dal',
    'rice'
]);
const PincodeProvider = new GenericGroceryProvider('groc-pincode', 'Pincode (ONDC)', 10);
const PaytmONDCProvider = new GenericGroceryProvider('groc-paytmondc', 'Paytm (ONDC)', 20);
const MystoreProvider = new GenericGroceryProvider('groc-mystore', 'Mystore (ONDC)', 30);
const UdaanProvider = new GenericGroceryProvider('groc-udaan', 'Udaan (B2B)', 100, [], [], true);
const JumbotailProvider = new GenericGroceryProvider('groc-jumbotail', 'Jumbotail (B2B)', 100, [], [], true);
const NinjacartProvider = new GenericGroceryProvider('groc-ninjacart', 'Ninjacart (B2B)', 100, freshKeywords, [], true);
const extendedGroceryProviders = [
    BlinkitProvider,
    ZeptoProvider,
    SwiggyInstamartProvider,
    BigBasketProvider,
    BBNowProvider,
    JioMartProvider,
    AmazonFreshProvider,
    FlipkartGroceryProvider,
    FlipkartMinutesProvider,
    DMartReadyProvider,
    TataNeuProvider,
    SpencersProvider,
    StarQuikProvider,
    NaturesBasketProvider,
    RelianceSmartProvider,
    MoreRetailProvider,
    MilkbasketProvider,
    CountryDelightProvider,
    BBDailyProvider,
    SuprDailyProvider,
    AkshayakalpaProvider,
    OtipyProvider,
    FreshToHomeProvider,
    LiciousProvider,
    MeatigoProvider,
    TenderCutsProvider,
    OrganicTattvaProvider,
    Mantra24Provider,
    PincodeProvider,
    PaytmONDCProvider,
    MystoreProvider,
    UdaanProvider,
    JumbotailProvider,
    NinjacartProvider
];
}),
"[project]/apps/web/src/lib/providers/mocks/mockMedicineProviders.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GenericMedicineProvider",
    ()=>GenericMedicineProvider,
    "extendedMedicineProviders",
    ()=>extendedMedicineProviders
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/mocks/mockUtils.ts [app-ssr] (ecmascript)");
;
class GenericMedicineProvider {
    baseDeliveryFee;
    config;
    constructor(id, name, baseDeliveryFee){
        this.baseDeliveryFee = baseDeliveryFee;
        this.config = {
            id: '',
            name: '',
            supportedCategories: [
                'medicine'
            ],
            requiresAuth: true
        };
        this.config.id = id;
        this.config.name = name;
    }
    async search(query) {
        if (query.category && query.category !== 'medicine') return [];
        const term = query.term.toLowerCase();
        const isConnected = query.connectedProviders?.includes(this.config.id);
        // Mock Pricing Logic based on keywords
        let basePrice = 150;
        if (term.includes('protein') || term.includes('whey')) basePrice = 2500;
        if (term.includes('sugar') || term.includes('machine') || term.includes('bp')) basePrice = 1200;
        if (term.includes('syrup') || term.includes('cough')) basePrice = 120;
        if (term.includes('vitamin') || term.includes('zinc')) basePrice = 350;
        const variation = this.config.name.length * 73 % (basePrice * 0.15) - basePrice * 0.05;
        const finalPrice = Math.max(10, Math.floor(basePrice + variation));
        const deliveryFee = isConnected ? 0 : this.baseDeliveryFee;
        const discount = isConnected ? Math.floor(finalPrice * 0.15) : 0;
        await new Promise((r)=>setTimeout(r, 200 + Math.random() * 300));
        return [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMockResult"])(this.config.id, this.config.name, `${this.config.id}-1`, {
                title: `${query.term.charAt(0).toUpperCase() + query.term.slice(1) || 'Medicine/Supplement'}`,
                description: `Delivered by ${this.config.name}`,
                category: 'medicine',
                price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateFinalPrice"])(finalPrice, deliveryFee, 0, 0, discount, 0, 0),
                originalPrice: finalPrice,
                estimatedTimeMins: this.baseDeliveryFee < 30 ? 60 : 1440,
                rating: 4.0 + this.config.name.length % 10 / 10,
                accountBenefits: isConnected ? [
                    `${this.config.name} Member: 15% Off + Free Delivery`
                ] : [],
                deepLinkUrl: `https://${this.config.name.toLowerCase().replace(/[^a-z]/g, '')}.com/search?q=${encodeURIComponent(term)}`
            })
        ];
    }
}
// 1. National Pharmacies
const Apollo247Provider = new GenericMedicineProvider('med-apollo', 'Apollo 24|7', 49);
const NetmedsProvider = new GenericMedicineProvider('med-netmeds', 'Netmeds', 50);
const Tata1mgProvider = new GenericMedicineProvider('med-1mg', 'Tata 1mg', 50);
const PharmEasyProvider = new GenericMedicineProvider('med-pharmeasy', 'PharmEasy', 40);
const FlipkartHealthProvider = new GenericMedicineProvider('med-flipkarthealth', 'Flipkart Health+', 40);
const AmazonPharmacyProvider = new GenericMedicineProvider('med-amazonpharmacy', 'Amazon Pharmacy', 0);
const MedPlusProvider = new GenericMedicineProvider('med-medplus', 'MedPlus', 40);
// 2. Generic Medicine Platforms
const TruemedsProvider = new GenericMedicineProvider('med-truemeds', 'Truemeds', 30);
const GenericartProvider = new GenericMedicineProvider('med-genericart', 'Genericart', 30);
const DavaindiaProvider = new GenericMedicineProvider('med-davaindia', 'Davaindia', 30);
const MedkartProvider = new GenericMedicineProvider('med-medkart', 'Medkart', 30);
const GenericAadhaarProvider = new GenericMedicineProvider('med-genericaadhaar', 'Generic Aadhaar', 30);
const ZenericsProvider = new GenericMedicineProvider('med-zenerics', 'Zenerics', 30);
const PharmarackProvider = new GenericMedicineProvider('med-pharmarack', 'Pharmarack', 30);
const PlatinumRxProvider = new GenericMedicineProvider('med-platinumrx', 'PlatinumRx', 30);
const SastaSundarProvider = new GenericMedicineProvider('med-sastasundar', 'SastaSundar', 30);
const HealthmugProvider = new GenericMedicineProvider('med-healthmug', 'Healthmug', 30);
const PharmacyBazarProvider = new GenericMedicineProvider('med-pharmacybazar', 'Pharmacy Bazar', 30);
const PositraRxProvider = new GenericMedicineProvider('med-positrarx', 'Positra Rx', 30);
const PulsePharmacyProvider = new GenericMedicineProvider('med-pulsepharmacy', 'Pulse Pharmacy', 30);
const SchwabeProvider = new GenericMedicineProvider('med-schwabe', 'Schwabe', 30);
const AyushCareProvider = new GenericMedicineProvider('med-ayushcare', 'AyushCare', 30);
const FrankRossProvider = new GenericMedicineProvider('med-frankross', 'Frank Ross', 30);
// 3. Quick / Instant Delivery
const BlinkitProvider = new GenericMedicineProvider('med-blinkit', 'Blinkit', 20);
const ZeptoProvider = new GenericMedicineProvider('med-zepto', 'Zepto', 20);
const SwiggyInstamartProvider = new GenericMedicineProvider('med-instamart', 'Swiggy Instamart', 20);
const MedstownProvider = new GenericMedicineProvider('med-medstown', 'Medstown', 20);
const extendedMedicineProviders = [
    // National
    Apollo247Provider,
    NetmedsProvider,
    Tata1mgProvider,
    PharmEasyProvider,
    FlipkartHealthProvider,
    AmazonPharmacyProvider,
    MedPlusProvider,
    // Generic
    TruemedsProvider,
    GenericartProvider,
    DavaindiaProvider,
    MedkartProvider,
    GenericAadhaarProvider,
    ZenericsProvider,
    PharmarackProvider,
    PlatinumRxProvider,
    SastaSundarProvider,
    HealthmugProvider,
    PharmacyBazarProvider,
    PositraRxProvider,
    PulsePharmacyProvider,
    SchwabeProvider,
    AyushCareProvider,
    FrankRossProvider,
    // Quick
    BlinkitProvider,
    ZeptoProvider,
    SwiggyInstamartProvider,
    MedstownProvider
];
}),
"[project]/apps/web/src/lib/providers/mocks/mockServiceProviders.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GenericServiceProvider",
    ()=>GenericServiceProvider,
    "extendedServiceProviders",
    ()=>extendedServiceProviders
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/mocks/mockUtils.ts [app-ssr] (ecmascript)");
;
class GenericServiceProvider {
    baseVisitingFee;
    config;
    constructor(id, name, baseVisitingFee){
        this.baseVisitingFee = baseVisitingFee;
        this.config = {
            id: '',
            name: '',
            supportedCategories: [
                'services'
            ],
            requiresAuth: true
        };
        this.config.id = id;
        this.config.name = name;
    }
    async search(query) {
        if (query.category && query.category !== 'services') return [];
        const term = query.term.toLowerCase();
        const isConnected = query.connectedProviders?.includes(this.config.id);
        // Mock Pricing Logic based on keywords
        let basePrice = 299;
        if (term.includes('ac') || term.includes('repair') || term.includes('mechanic')) basePrice = 499;
        if (term.includes('clean') || term.includes('home') || term.includes('sofa')) basePrice = 899;
        if (term.includes('massage') || term.includes('salon') || term.includes('spa')) basePrice = 999;
        if (term.includes('plumber') || term.includes('electrician') || term.includes('carpenter')) basePrice = 249;
        if (term.includes('paint') || term.includes('pest')) basePrice = 2500;
        const variation = this.config.name.length * 73 % (basePrice * 0.2) - basePrice * 0.1;
        const finalPrice = Math.max(99, Math.floor(basePrice + variation));
        const visitingFee = isConnected ? 0 : this.baseVisitingFee;
        const discount = isConnected ? Math.floor(finalPrice * 0.1) : 0;
        await new Promise((r)=>setTimeout(r, 200 + Math.random() * 300));
        return [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMockResult"])(this.config.id, this.config.name, `${this.config.id}-1`, {
                title: `${query.term.charAt(0).toUpperCase() + query.term.slice(1) || 'Home Service'}`,
                description: `Professional provided by ${this.config.name}`,
                category: 'services',
                price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateFinalPrice"])(finalPrice, visitingFee, 0, 0, discount, 0, 0),
                originalPrice: finalPrice,
                estimatedTimeMins: 60,
                rating: 4.2 + this.config.name.length % 8 / 10,
                accountBenefits: isConnected ? [
                    `${this.config.name} Member: Waived Visiting Fee`
                ] : [],
                deepLinkUrl: `https://${this.config.name.toLowerCase().replace(/[^a-z]/g, '')}.com/search?q=${encodeURIComponent(term)}`
            })
        ];
    }
}
const UrbanCompanyProvider = new GenericServiceProvider('service-uc', 'Urban Company', 49);
const JustdialProvider = new GenericServiceProvider('service-jd', 'Justdial', 0);
const NoBrokerProvider = new GenericServiceProvider('service-nobroker', 'NoBroker Services', 99);
const YesMadamProvider = new GenericServiceProvider('service-yesmadam', 'Yes Madam', 49);
const HelprProvider = new GenericServiceProvider('service-helpr', 'Helpr', 50);
const DigitalLaborChowkProvider = new GenericServiceProvider('service-digitallaborchowk', 'Digital Labor Chowk', 0);
const extendedServiceProviders = [
    UrbanCompanyProvider,
    JustdialProvider,
    NoBrokerProvider,
    YesMadamProvider,
    HelprProvider,
    DigitalLaborChowkProvider
];
}),
"[project]/apps/web/src/lib/providers/mocks/mockShoppingProviders.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GenericShoppingProvider",
    ()=>GenericShoppingProvider,
    "extendedShoppingProviders",
    ()=>extendedShoppingProviders
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$ShoppingProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/categories/ShoppingProvider.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/mocks/mockUtils.ts [app-ssr] (ecmascript)");
;
;
class GenericShoppingProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$ShoppingProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShoppingProvider"] {
    baseDeliveryFee;
    supportedKeywords;
    constructor(id, name, baseDeliveryFee, supportedKeywords = [] // if empty, matches anything (used for Amazon, Flipkart)
    ){
        super(id, name), this.baseDeliveryFee = baseDeliveryFee, this.supportedKeywords = supportedKeywords;
    }
    async fetchShoppingOptions(query) {
        const term = query.term.toLowerCase();
        // Keyword Matching
        if (this.supportedKeywords.length > 0 && term.trim() !== '') {
            const matches = this.supportedKeywords.some((k)=>term.includes(k));
            if (!matches && !term.includes(this.config.name.toLowerCase())) {
                return [];
            }
        }
        const isConnected = query.connectedProviders?.includes(this.config.id);
        // Mock Pricing Logic based on keywords
        let basePrice = 999;
        if (term.includes('phone') || term.includes('laptop') || term.includes('tv')) basePrice = 45000;
        if (term.includes('shirt') || term.includes('jeans') || term.includes('dress') || term.includes('shoe')) basePrice = 1499;
        if (term.includes('makeup') || term.includes('lipstick') || term.includes('cream')) basePrice = 899;
        if (term.includes('bed') || term.includes('sofa') || term.includes('table')) basePrice = 15000;
        if (term.includes('toy') || term.includes('baby')) basePrice = 1200;
        if (term.includes('jewel') || term.includes('gold')) basePrice = 35000;
        if (term.includes('book')) basePrice = 499;
        if (term.includes('game')) basePrice = 2999;
        const variation = this.config.name.length * 73 % (basePrice * 0.2) - basePrice * 0.1;
        const finalPrice = Math.max(99, Math.floor(basePrice + variation));
        const deliveryFee = isConnected ? 0 : this.baseDeliveryFee;
        const discount = isConnected ? Math.floor(finalPrice * 0.1) : 0;
        await new Promise((r)=>setTimeout(r, 200 + Math.random() * 300));
        return [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMockResult"])(this.config.id, this.config.name, `${this.config.id}-1`, {
                title: `${query.term.charAt(0).toUpperCase() + query.term.slice(1) || 'Amazing Product'}`,
                description: `Sold by ${this.config.name}`,
                category: 'shopping',
                price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateFinalPrice"])(finalPrice, deliveryFee, 0, 0, discount, 0, 0),
                originalPrice: finalPrice,
                estimatedTimeMins: this.baseDeliveryFee < 30 ? 15 : this.baseDeliveryFee === 40 ? 4320 : 2880,
                rating: 3.5 + this.config.name.length % 15 / 10,
                accountBenefits: isConnected ? [
                    `${this.config.name} Member: Free Delivery`
                ] : [],
                deepLinkUrl: `https://${this.config.name.toLowerCase().replace(/[^a-z]/g, '')}.com/search?q=${encodeURIComponent(term)}`
            })
        ];
    }
}
// Keyword groups
const fashionKeywords = [
    'shirt',
    'tshirt',
    'jeans',
    'dress',
    'pant',
    'wear',
    'cloth',
    'jacket',
    'fashion'
];
const shoeKeywords = [
    'shoe',
    'sneaker',
    'sandal',
    'boot',
    'footwear',
    'heel'
];
const beautyKeywords = [
    'makeup',
    'lipstick',
    'cream',
    'lotion',
    'skin',
    'beauty',
    'hair',
    'perfume',
    'cosmetic'
];
const electronicKeywords = [
    'phone',
    'mobile',
    'laptop',
    'tablet',
    'tv',
    'earphone',
    'headphone',
    'watch',
    'electronic',
    'charger'
];
const computerKeywords = [
    'laptop',
    'pc',
    'mouse',
    'keyboard',
    'monitor',
    'drive',
    'computer'
];
const applianceKeywords = [
    'tv',
    'fridge',
    'ac',
    'washing machine',
    'cooler',
    'appliance'
];
const furnitureKeywords = [
    'bed',
    'sofa',
    'chair',
    'table',
    'furniture',
    'mattress',
    'desk'
];
const decorKeywords = [
    'decor',
    'lamp',
    'cushion',
    'curtain',
    'vase'
];
const kitchenKeywords = [
    'cookware',
    'pan',
    'pot',
    'bottle',
    'kitchen',
    'utensil',
    'mixer'
];
const mattressKeywords = [
    'mattress',
    'pillow',
    'bedding'
];
const kidsKeywords = [
    'toy',
    'baby',
    'diaper',
    'kid',
    'children',
    'game'
];
const jewelKeywords = [
    'jewel',
    'ring',
    'necklace',
    'gold',
    'silver',
    'diamond',
    'earring'
];
const eyewearKeywords = [
    'glass',
    'spectacle',
    'sunglass',
    'lens',
    'eye'
];
const bagsKeywords = [
    'bag',
    'luggage',
    'backpack',
    'suitcase',
    'wallet',
    'purse'
];
const sportsKeywords = [
    'sport',
    'bat',
    'ball',
    'fitness',
    'gym',
    'dumbell',
    'shoe'
];
const autoKeywords = [
    'car accessory',
    'helmet',
    'tyre',
    'bike accessory'
];
const toolKeywords = [
    'tool',
    'drill',
    'hardware',
    'industrial',
    'safety'
];
const bookKeywords = [
    'book',
    'novel',
    'stationery',
    'pen',
    'notebook'
];
const gameKeywords = [
    'game',
    'console',
    'playstation',
    'xbox',
    'controller'
];
const petKeywords = [
    'pet',
    'dog',
    'cat',
    'food',
    'collar'
];
const plantKeywords = [
    'plant',
    'seed',
    'pot',
    'garden'
];
// 1. General (No keywords = matches all)
const AmazonProvider = new GenericShoppingProvider('shop-amazon', 'Amazon', 40);
const FlipkartProvider = new GenericShoppingProvider('shop-flipkart', 'Flipkart', 40);
const MeeshoProvider = new GenericShoppingProvider('shop-meesho', 'Meesho', 0);
const SnapdealProvider = new GenericShoppingProvider('shop-snapdeal', 'Snapdeal', 0);
const ShopcluesProvider = new GenericShoppingProvider('shop-shopclues', 'ShopClues', 30);
const JioMartProvider = new GenericShoppingProvider('shop-jiomart', 'JioMart', 0);
const TataNeuProvider = new GenericShoppingProvider('shop-tataneu', 'Tata Neu', 0);
const TataCliqProvider = new GenericShoppingProvider('shop-tatacliq', 'Tata CLiQ', 50);
const ShopsyProvider = new GenericShoppingProvider('shop-shopsy', 'Shopsy', 0);
// 2. Fashion
const MyntraProvider = new GenericShoppingProvider('shop-myntra', 'Myntra', 50, [
    ...fashionKeywords,
    ...shoeKeywords
]);
const AjioProvider = new GenericShoppingProvider('shop-ajio', 'AJIO', 50, [
    ...fashionKeywords,
    ...shoeKeywords
]);
const NykaaFashionProvider = new GenericShoppingProvider('shop-nykaafashion', 'Nykaa Fashion', 50, fashionKeywords);
const UrbanicProvider = new GenericShoppingProvider('shop-urbanic', 'Urbanic', 50, fashionKeywords);
const HMProvider = new GenericShoppingProvider('shop-hm', 'H&M', 100, fashionKeywords);
const ZaraProvider = new GenericShoppingProvider('shop-zara', 'Zara', 150, fashionKeywords);
const WestsideProvider = new GenericShoppingProvider('shop-westside', 'Westside', 50, fashionKeywords);
const PantaloonsProvider = new GenericShoppingProvider('shop-pantaloons', 'Pantaloons', 50, fashionKeywords);
const ShoppersStopProvider = new GenericShoppingProvider('shop-shoppersstop', 'Shoppers Stop', 50, fashionKeywords);
const MaxFashionProvider = new GenericShoppingProvider('shop-max', 'Max Fashion', 50, fashionKeywords);
// 3. Shoes
const BataProvider = new GenericShoppingProvider('shop-bata', 'Bata', 50, shoeKeywords);
const MetroShoesProvider = new GenericShoppingProvider('shop-metro', 'Metro Shoes', 50, shoeKeywords);
const WoodlandProvider = new GenericShoppingProvider('shop-woodland', 'Woodland', 50, shoeKeywords);
const RedTapeProvider = new GenericShoppingProvider('shop-redtape', 'Red Tape', 50, shoeKeywords);
const CampusProvider = new GenericShoppingProvider('shop-campus', 'Campus', 50, shoeKeywords);
const PumaProvider = new GenericShoppingProvider('shop-puma', 'Puma', 0, shoeKeywords);
const AdidasProvider = new GenericShoppingProvider('shop-adidas', 'Adidas', 0, shoeKeywords);
const NikeProvider = new GenericShoppingProvider('shop-nike', 'Nike', 0, shoeKeywords);
// 4. Beauty
const NykaaProvider = new GenericShoppingProvider('shop-nykaa', 'Nykaa', 50, beautyKeywords);
const PurplleProvider = new GenericShoppingProvider('shop-purplle', 'Purplle', 40, beautyKeywords);
const TiraProvider = new GenericShoppingProvider('shop-tira', 'Tira', 50, beautyKeywords);
const SephoraProvider = new GenericShoppingProvider('shop-sephora', 'Sephora', 100, beautyKeywords);
const SugarProvider = new GenericShoppingProvider('shop-sugar', 'Sugar Cosmetics', 50, beautyKeywords);
const MamaearthProvider = new GenericShoppingProvider('shop-mamaearth', 'Mamaearth', 40, beautyKeywords);
const PlumProvider = new GenericShoppingProvider('shop-plum', 'Plum', 40, beautyKeywords);
// 5. Electronics & Computers
const CromaProvider = new GenericShoppingProvider('shop-croma', 'Croma', 0, [
    ...electronicKeywords,
    ...computerKeywords,
    ...applianceKeywords
]);
const RelianceDigitalProvider = new GenericShoppingProvider('shop-reliancedigital', 'Reliance Digital', 0, [
    ...electronicKeywords,
    ...computerKeywords,
    ...applianceKeywords
]);
const VijaySalesProvider = new GenericShoppingProvider('shop-vijaysales', 'Vijay Sales', 0, [
    ...electronicKeywords,
    ...applianceKeywords
]);
const AppleProvider = new GenericShoppingProvider('shop-apple', 'Apple', 0, electronicKeywords);
const SamsungProvider = new GenericShoppingProvider('shop-samsung', 'Samsung', 0, [
    ...electronicKeywords,
    ...applianceKeywords
]);
const DellProvider = new GenericShoppingProvider('shop-dell', 'Dell', 0, computerKeywords);
const LenovoProvider = new GenericShoppingProvider('shop-lenovo', 'Lenovo', 0, computerKeywords);
const AsusProvider = new GenericShoppingProvider('shop-asus', 'ASUS', 0, computerKeywords);
const LgProvider = new GenericShoppingProvider('shop-lg', 'LG', 0, applianceKeywords);
// 8. Furniture & Home
const PepperfryProvider = new GenericShoppingProvider('shop-pepperfry', 'Pepperfry', 500, [
    ...furnitureKeywords,
    ...decorKeywords
]);
const UrbanLadderProvider = new GenericShoppingProvider('shop-urbanladder', 'Urban Ladder', 500, [
    ...furnitureKeywords,
    ...decorKeywords
]);
const IkeaProvider = new GenericShoppingProvider('shop-ikea', 'IKEA', 300, [
    ...furnitureKeywords,
    ...decorKeywords,
    ...kitchenKeywords
]);
const HomeCentreProvider = new GenericShoppingProvider('shop-homecentre', 'Home Centre', 200, [
    ...furnitureKeywords,
    ...decorKeywords
]);
const WakefitProvider = new GenericShoppingProvider('shop-wakefit', 'Wakefit', 0, [
    ...furnitureKeywords,
    ...mattressKeywords
]);
const WoodenStreetProvider = new GenericShoppingProvider('shop-woodenstreet', 'WoodenStreet', 0, furnitureKeywords);
const SleepyCatProvider = new GenericShoppingProvider('shop-sleepycat', 'SleepyCat', 0, mattressKeywords);
// 12. Kids
const FirstCryProvider = new GenericShoppingProvider('shop-firstcry', 'FirstCry', 50, kidsKeywords);
const HopscotchProvider = new GenericShoppingProvider('shop-hopscotch', 'Hopscotch', 50, kidsKeywords);
const MothercareProvider = new GenericShoppingProvider('shop-mothercare', 'Mothercare', 100, kidsKeywords);
// 13. Jewellery
const TanishqProvider = new GenericShoppingProvider('shop-tanishq', 'Tanishq', 0, jewelKeywords);
const CaratLaneProvider = new GenericShoppingProvider('shop-caratlane', 'CaratLane', 0, jewelKeywords);
const BluestoneProvider = new GenericShoppingProvider('shop-bluestone', 'Bluestone', 0, jewelKeywords);
const KalyanProvider = new GenericShoppingProvider('shop-kalyan', 'Kalyan Jewellers', 0, jewelKeywords);
// 14. Eyewear
const LenskartProvider = new GenericShoppingProvider('shop-lenskart', 'Lenskart', 0, eyewearKeywords);
const TitanEyeProvider = new GenericShoppingProvider('shop-titaneye', 'Titan Eye+', 0, eyewearKeywords);
// 15. Bags
const SafariProvider = new GenericShoppingProvider('shop-safari', 'Safari', 0, bagsKeywords);
const AmericanTouristerProvider = new GenericShoppingProvider('shop-americantourister', 'American Tourister', 0, bagsKeywords);
const MokobaraProvider = new GenericShoppingProvider('shop-mokobara', 'Mokobara', 0, bagsKeywords);
const DailyObjectsProvider = new GenericShoppingProvider('shop-dailyobjects', 'DailyObjects', 0, bagsKeywords);
// 16. Sports
const DecathlonProvider = new GenericShoppingProvider('shop-decathlon', 'Decathlon', 50, sportsKeywords);
// 18. Tools / B2B
const IndiaMartProvider = new GenericShoppingProvider('shop-indiamart', 'IndiaMART', 0, toolKeywords);
const MoglixProvider = new GenericShoppingProvider('shop-moglix', 'Moglix', 0, toolKeywords);
const UdaanProvider = new GenericShoppingProvider('shop-udaan', 'Udaan', 0, toolKeywords);
// 19. Books
const CrosswordProvider = new GenericShoppingProvider('shop-crossword', 'Crossword', 50, bookKeywords);
// 20. Gaming
const GamesTheShopProvider = new GenericShoppingProvider('shop-gamestheshop', 'Games The Shop', 50, gameKeywords);
const SteamProvider = new GenericShoppingProvider('shop-steam', 'Steam', 0, gameKeywords);
// 21. Pets
const HuftProvider = new GenericShoppingProvider('shop-huft', 'Heads Up For Tails', 50, petKeywords);
const SupertailsProvider = new GenericShoppingProvider('shop-supertails', 'Supertails', 0, petKeywords);
// 22. Garden
const UgaooProvider = new GenericShoppingProvider('shop-ugaoo', 'Ugaoo', 50, plantKeywords);
const extendedShoppingProviders = [
    // General
    AmazonProvider,
    FlipkartProvider,
    MeeshoProvider,
    SnapdealProvider,
    ShopcluesProvider,
    JioMartProvider,
    TataNeuProvider,
    TataCliqProvider,
    ShopsyProvider,
    // Fashion
    MyntraProvider,
    AjioProvider,
    NykaaFashionProvider,
    UrbanicProvider,
    HMProvider,
    ZaraProvider,
    WestsideProvider,
    PantaloonsProvider,
    ShoppersStopProvider,
    MaxFashionProvider,
    // Shoes
    BataProvider,
    MetroShoesProvider,
    WoodlandProvider,
    RedTapeProvider,
    CampusProvider,
    PumaProvider,
    AdidasProvider,
    NikeProvider,
    // Beauty
    NykaaProvider,
    PurplleProvider,
    TiraProvider,
    SephoraProvider,
    SugarProvider,
    MamaearthProvider,
    PlumProvider,
    // Electronics
    CromaProvider,
    RelianceDigitalProvider,
    VijaySalesProvider,
    AppleProvider,
    SamsungProvider,
    DellProvider,
    LenovoProvider,
    AsusProvider,
    LgProvider,
    // Furniture & Home
    PepperfryProvider,
    UrbanLadderProvider,
    IkeaProvider,
    HomeCentreProvider,
    WakefitProvider,
    WoodenStreetProvider,
    SleepyCatProvider,
    // Kids
    FirstCryProvider,
    HopscotchProvider,
    MothercareProvider,
    // Jewel
    TanishqProvider,
    CaratLaneProvider,
    BluestoneProvider,
    KalyanProvider,
    // Eye
    LenskartProvider,
    TitanEyeProvider,
    // Bags
    SafariProvider,
    AmericanTouristerProvider,
    MokobaraProvider,
    DailyObjectsProvider,
    // Niche
    DecathlonProvider,
    IndiaMartProvider,
    MoglixProvider,
    UdaanProvider,
    CrosswordProvider,
    GamesTheShopProvider,
    SteamProvider,
    HuftProvider,
    SupertailsProvider,
    UgaooProvider
];
}),
"[project]/apps/web/src/lib/providers/mocks/mockTravelProviders.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GenericTravelProvider",
    ()=>GenericTravelProvider,
    "extendedTravelProviders",
    ()=>extendedTravelProviders
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$TravelProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/categories/TravelProvider.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/mocks/mockUtils.ts [app-ssr] (ecmascript)");
;
;
class GenericTravelProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$TravelProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TravelProvider"] {
    baseFee;
    supportedKeywords;
    constructor(id, name, baseFee, supportedKeywords = [] // if empty, matches anything (used for OTAs)
    ){
        super(id, name), this.baseFee = baseFee, this.supportedKeywords = supportedKeywords;
    }
    async fetchTravelOptions(query) {
        const term = query.term.toLowerCase();
        // Keyword Matching
        if (this.supportedKeywords.length > 0 && term.trim() !== '') {
            const matches = this.supportedKeywords.some((k)=>term.includes(k));
            if (!matches && !term.includes(this.config.name.toLowerCase())) {
                return [];
            }
        }
        const isConnected = query.connectedProviders?.includes(this.config.id);
        // Mock Pricing Logic based on keywords
        let basePrice = 2500;
        if (term.includes('flight') || term.includes('air')) basePrice = 5500;
        if (term.includes('train') || term.includes('rail')) basePrice = 800;
        if (term.includes('bus') || term.includes('volvo')) basePrice = 1200;
        if (term.includes('hotel') || term.includes('stay') || term.includes('room')) basePrice = 3000;
        if (term.includes('villa') || term.includes('resort')) basePrice = 8500;
        if (term.includes('cab') || term.includes('taxi') || term.includes('ride')) basePrice = 450;
        if (term.includes('bike') || term.includes('scooter')) basePrice = 150;
        if (term.includes('metro') || term.includes('public')) basePrice = 40;
        if (term.includes('rent') || term.includes('drive')) basePrice = 2000;
        const variation = this.config.name.length * 97 % (basePrice * 0.2) - basePrice * 0.1;
        const finalPrice = Math.max(20, Math.floor(basePrice + variation));
        const convenienceFee = isConnected ? 0 : this.baseFee;
        const discount = isConnected ? Math.floor(finalPrice * 0.15) : 0;
        await new Promise((r)=>setTimeout(r, 200 + Math.random() * 300));
        return [
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMockResult"])(this.config.id, this.config.name, `${this.config.id}-1`, {
                title: `${query.term.charAt(0).toUpperCase() + query.term.slice(1) || 'Travel Booking'}`,
                description: `Booked via ${this.config.name}`,
                category: 'travel',
                price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateFinalPrice"])(finalPrice, convenienceFee, 0, 0, discount, 0, 0),
                originalPrice: finalPrice,
                rating: 3.5 + this.config.name.length % 15 / 10,
                accountBenefits: isConnected ? [
                    `${this.config.name} Elite: Zero Convenience Fee`
                ] : [],
                deepLinkUrl: `https://${this.config.name.toLowerCase().replace(/[^a-z]/g, '')}.com/search?q=${encodeURIComponent(term)}`
            })
        ];
    }
}
// Keyword groups
const flightKeywords = [
    'flight',
    'plane',
    'air',
    'ticket'
];
const trainKeywords = [
    'train',
    'rail',
    'irctc',
    'ticket'
];
const busKeywords = [
    'bus',
    'volvo',
    'sleeper',
    'ticket'
];
const hotelKeywords = [
    'hotel',
    'room',
    'stay',
    'resort'
];
const villaKeywords = [
    'villa',
    'homestay',
    'home',
    'vacation',
    'stay'
];
const cabKeywords = [
    'cab',
    'taxi',
    'ride',
    'auto',
    'uber',
    'ola'
];
const selfDriveKeywords = [
    'car',
    'rent',
    'drive',
    'self'
];
const bikeKeywords = [
    'bike',
    'scooter',
    'rent',
    'ride'
];
const metroKeywords = [
    'metro',
    'local',
    'bus',
    'public',
    'transport'
];
// 1. Flight Booking (OTAs often support multiple, so some have no keywords, some are flight only)
const MMTProvider = new GenericTravelProvider('travel-mmt', 'MakeMyTrip', 250); // General OTA
const GoibiboProvider = new GenericTravelProvider('travel-goibibo', 'Goibibo', 250);
const IxigoProvider = new GenericTravelProvider('travel-ixigo', 'ixigo', 150);
const EMTProvider = new GenericTravelProvider('travel-emt', 'EaseMyTrip', 50);
const CleartripProvider = new GenericTravelProvider('travel-cleartrip', 'Cleartrip', 200);
const YatraProvider = new GenericTravelProvider('travel-yatra', 'Yatra', 200);
const HappyFaresProvider = new GenericTravelProvider('travel-happyfares', 'HappyFares', 100, flightKeywords);
const PaytmTravelProvider = new GenericTravelProvider('travel-paytm', 'Paytm Travel', 150);
const GoogleFlightsProvider = new GenericTravelProvider('travel-google', 'Google Flights', 0, flightKeywords);
const SkyscannerProvider = new GenericTravelProvider('travel-skyscanner', 'Skyscanner', 0, flightKeywords);
const WegoProvider = new GenericTravelProvider('travel-wego', 'Wego', 0, flightKeywords);
const BookingComProvider = new GenericTravelProvider('travel-booking', 'Booking.com', 0, hotelKeywords); // Mostly hotels
const AgodaProvider = new GenericTravelProvider('travel-agoda', 'Agoda', 0, hotelKeywords);
const ExpediaProvider = new GenericTravelProvider('travel-expedia', 'Expedia', 0);
const KayakProvider = new GenericTravelProvider('travel-kayak', 'Kayak', 0);
const TripComProvider = new GenericTravelProvider('travel-trip', 'Trip.com', 0);
// Airline Direct
const AirIndiaProvider = new GenericTravelProvider('travel-airindia', 'Air India', 0, flightKeywords);
const IndigoProvider = new GenericTravelProvider('travel-indigo', 'IndiGo', 0, flightKeywords);
const AkasaProvider = new GenericTravelProvider('travel-akasa', 'Akasa Air', 0, flightKeywords);
const SpiceJetProvider = new GenericTravelProvider('travel-spicejet', 'SpiceJet', 0, flightKeywords);
// 2. Train Booking
const IRCTCProvider = new GenericTravelProvider('travel-irctc', 'IRCTC Rail Connect', 0, trainKeywords);
const ConfirmTktProvider = new GenericTravelProvider('travel-confirmtkt', 'ConfirmTkt', 20, trainKeywords);
const TrainmanProvider = new GenericTravelProvider('travel-trainman', 'Trainman', 20, trainKeywords);
const RailYatriProvider = new GenericTravelProvider('travel-railyatri', 'RailYatri', 20, trainKeywords);
const RedRailProvider = new GenericTravelProvider('travel-redrail', 'redRail', 15, trainKeywords);
const WhereIsMyTrainProvider = new GenericTravelProvider('travel-wimt', 'Where Is My Train', 0, trainKeywords);
const TripozoProvider = new GenericTravelProvider('travel-tripozo', 'Tripozo', 10, trainKeywords);
// 3. Bus Booking
const RedBusProvider = new GenericTravelProvider('travel-redbus', 'redBus', 30, busKeywords);
const AbhiBusProvider = new GenericTravelProvider('travel-abhibus', 'AbhiBus', 25, busKeywords);
const IntrCityProvider = new GenericTravelProvider('travel-intrcity', 'IntrCity SmartBus', 20, busKeywords);
const FlixBusProvider = new GenericTravelProvider('travel-flixbus', 'FlixBus India', 25, busKeywords);
const ZingbusProvider = new GenericTravelProvider('travel-zingbus', 'Zingbus', 20, busKeywords);
const TSRTCProvider = new GenericTravelProvider('travel-tsrtc', 'TSRTC', 0, busKeywords);
const KSRTCProvider = new GenericTravelProvider('travel-ksrtc', 'KSRTC', 0, busKeywords);
const UPSRTCProvider = new GenericTravelProvider('travel-upsrtc', 'UPSRTC', 0, busKeywords);
const HRTCProvider = new GenericTravelProvider('travel-hrtc', 'HRTC', 0, busKeywords);
// 4. Hotel Booking
const OYOProvider = new GenericTravelProvider('travel-oyo', 'OYO', 50, hotelKeywords);
const HotelsComProvider = new GenericTravelProvider('travel-hotelscom', 'Hotels.com', 0, hotelKeywords);
const TrivagoProvider = new GenericTravelProvider('travel-trivago', 'Trivago', 0, hotelKeywords);
const HostelworldProvider = new GenericTravelProvider('travel-hostelworld', 'Hostelworld', 0, hotelKeywords);
const FabHotelsProvider = new GenericTravelProvider('travel-fabhotels', 'FabHotels', 30, hotelKeywords);
const TreeboProvider = new GenericTravelProvider('travel-treebo', 'Treebo', 30, hotelKeywords);
const TajHotelsProvider = new GenericTravelProvider('travel-taj', 'Taj Hotels', 0, hotelKeywords);
const MarriottProvider = new GenericTravelProvider('travel-marriott', 'Marriott', 0, hotelKeywords);
// 5. Homestay / Villa
const AirbnbProvider = new GenericTravelProvider('travel-airbnb', 'Airbnb', 400, villaKeywords);
const StayVistaProvider = new GenericTravelProvider('travel-stayvista', 'StayVista', 500, villaKeywords);
const SaffronStaysProvider = new GenericTravelProvider('travel-saffronstays', 'SaffronStays', 500, villaKeywords);
const VrboProvider = new GenericTravelProvider('travel-vrbo', 'Vrbo', 400, villaKeywords);
const ZostelProvider = new GenericTravelProvider('travel-zostel', 'Zostel', 50, villaKeywords);
// 6. Cab / Taxi
const UberProvider = new GenericTravelProvider('travel-uber', 'Uber', 10, cabKeywords);
const OlaProvider = new GenericTravelProvider('travel-ola', 'Ola', 10, cabKeywords);
const RapidoProvider = new GenericTravelProvider('travel-rapido', 'Rapido', 5, cabKeywords);
const InDriveProvider = new GenericTravelProvider('travel-indrive', 'inDrive', 0, cabKeywords);
const BluSmartProvider = new GenericTravelProvider('travel-blusmart', 'BluSmart', 10, cabKeywords);
const NammaYatriProvider = new GenericTravelProvider('travel-nammayatri', 'Namma Yatri', 0, cabKeywords);
const YatriSathiProvider = new GenericTravelProvider('travel-yatrisathi', 'Yatri Sathi', 0, cabKeywords);
const SavaariProvider = new GenericTravelProvider('travel-savaari', 'Savaari', 100, cabKeywords);
// 7. Self-drive
const ZoomcarProvider = new GenericTravelProvider('travel-zoomcar', 'Zoomcar', 200, selfDriveKeywords);
const RevvProvider = new GenericTravelProvider('travel-revv', 'Revv', 150, selfDriveKeywords);
const MylesProvider = new GenericTravelProvider('travel-myles', 'Myles', 150, selfDriveKeywords);
const DrivezyProvider = new GenericTravelProvider('travel-drivezy', 'Drivezy', 100, selfDriveKeywords);
const AvisProvider = new GenericTravelProvider('travel-avis', 'Avis India', 300, selfDriveKeywords);
// 8. Bike / Scooter
const RoyalBrothersProvider = new GenericTravelProvider('travel-royalbros', 'Royal Brothers', 50, bikeKeywords);
const VogoProvider = new GenericTravelProvider('travel-vogo', 'Vogo', 20, bikeKeywords);
const BounceProvider = new GenericTravelProvider('travel-bounce', 'Bounce', 20, bikeKeywords);
const YuluProvider = new GenericTravelProvider('travel-yulu', 'Yulu', 10, bikeKeywords);
const ZyppProvider = new GenericTravelProvider('travel-zypp', 'Zypp', 15, bikeKeywords);
// 9. Local Bus / Metro
const ChaloProvider = new GenericTravelProvider('travel-chalo', 'Chalo', 0, metroKeywords);
const MoovitProvider = new GenericTravelProvider('travel-moovit', 'Moovit', 0, metroKeywords);
const DelhiMetroProvider = new GenericTravelProvider('travel-delhimetro', 'Delhi Metro', 0, metroKeywords);
const MumbaiOneProvider = new GenericTravelProvider('travel-mumbaione', 'Mumbai One', 0, metroKeywords);
const NammaMetroProvider = new GenericTravelProvider('travel-nammametro', 'Namma Metro', 0, metroKeywords);
const extendedTravelProviders = [
    MMTProvider,
    GoibiboProvider,
    IxigoProvider,
    EMTProvider,
    CleartripProvider,
    YatraProvider,
    HappyFaresProvider,
    PaytmTravelProvider,
    GoogleFlightsProvider,
    SkyscannerProvider,
    WegoProvider,
    BookingComProvider,
    AgodaProvider,
    ExpediaProvider,
    KayakProvider,
    TripComProvider,
    AirIndiaProvider,
    IndigoProvider,
    AkasaProvider,
    SpiceJetProvider,
    IRCTCProvider,
    ConfirmTktProvider,
    TrainmanProvider,
    RailYatriProvider,
    RedRailProvider,
    WhereIsMyTrainProvider,
    TripozoProvider,
    RedBusProvider,
    AbhiBusProvider,
    IntrCityProvider,
    FlixBusProvider,
    ZingbusProvider,
    TSRTCProvider,
    KSRTCProvider,
    UPSRTCProvider,
    HRTCProvider,
    OYOProvider,
    HotelsComProvider,
    TrivagoProvider,
    HostelworldProvider,
    FabHotelsProvider,
    TreeboProvider,
    TajHotelsProvider,
    MarriottProvider,
    AirbnbProvider,
    StayVistaProvider,
    SaffronStaysProvider,
    VrboProvider,
    ZostelProvider,
    UberProvider,
    OlaProvider,
    RapidoProvider,
    InDriveProvider,
    BluSmartProvider,
    NammaYatriProvider,
    YatriSathiProvider,
    SavaariProvider,
    ZoomcarProvider,
    RevvProvider,
    MylesProvider,
    DrivezyProvider,
    AvisProvider,
    RoyalBrothersProvider,
    VogoProvider,
    BounceProvider,
    YuluProvider,
    ZyppProvider,
    ChaloProvider,
    MoovitProvider,
    DelhiMetroProvider,
    MumbaiOneProvider,
    NammaMetroProvider
];
}),
"[project]/apps/web/src/lib/providers/mocks/mockUtils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateFinalPrice",
    ()=>calculateFinalPrice,
    "createMockResult",
    ()=>createMockResult
]);
function calculateFinalPrice(basePrice, deliveryFee = 0, platformFee = 0, taxes = 0, discount = 0, packagingFee = 0, otherCredits = 0) {
    const finalPrice = basePrice + deliveryFee + platformFee + packagingFee + taxes - discount - otherCredits;
    return {
        basePrice,
        deliveryFee,
        platformFee,
        packagingFee,
        taxes,
        discount,
        otherCredits,
        finalPayablePrice: Math.max(0, finalPrice),
        currency: 'INR'
    };
}
function createMockResult(providerId, providerName, id, data) {
    return {
        id: `${providerId}-${id}`,
        providerId,
        providerName,
        title: data.title || 'Unknown Item',
        category: data.category || 'other',
        status: 'LIVE',
        price: data.price || calculateFinalPrice(0),
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        deepLinkUrl: data.deepLinkUrl || `https://www.google.com/search?q=${encodeURIComponent(providerName + ' ' + (data.title || ''))}`,
        ...data
    };
}
}),
"[project]/packages/storage/src/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/storage/src/web/index.ts [app-ssr] (ecmascript) <locals>");
;
;
;
;
}),
"[project]/packages/storage/src/web/LocalStorageManager.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
        if ("TURBOPACK compile-time truthy", 1) return defaultValue;
        //TURBOPACK unreachable
        ;
    }
    static set(key, value) {
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
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
}),
"[project]/packages/storage/src/web/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WebStorageService",
    ()=>WebStorageService
]);
;
class WebStorageService {
    get(key) {
        if ("TURBOPACK compile-time truthy", 1) return null;
        //TURBOPACK unreachable
        ;
    }
    set(key, value) {
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }
    remove(key) {
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }
    clear() {
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0cskz8b._.js.map