module.exports = [
"[project]/apps/web/src/components/LocationSelector.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LocationSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
function LocationSelector({ location, onLocationChange }) {
    const [isLocating, setIsLocating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [manualQuery, setManualQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const requestGPS = ()=>{
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            setError('Geolocation not supported by browser.');
            return;
        }
        setIsLocating(true);
        setError('');
        navigator.geolocation.getCurrentPosition((position)=>{
            setIsLocating(false);
            onLocationChange({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                label: 'Current GPS Location'
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "location-selector",
        style: {
            background: 'var(--card-bg)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            marginBottom: '1rem'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Deliver/Search At: "
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/LocationSelector.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: 'var(--primary)',
                                    fontWeight: '500'
                                },
                                children: location ? location.label : 'Select location'
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/LocationSelector.tsx",
                                lineNumber: 54,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/LocationSelector.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                        lineNumber: 56,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/LocationSelector.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    gap: '0.5rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                        lineNumber: 69,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/LocationSelector.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    color: 'red',
                    fontSize: '0.8rem',
                    marginTop: '0.5rem'
                },
                children: error
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/LocationSelector.tsx",
                lineNumber: 74,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/LocationSelector.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, this);
}
}),
"[project]/apps/web/src/components/QuickConnect.tsx [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

var e = new Error("Could not parse module '[project]/apps/web/src/components/QuickConnect.tsx'\n\nUnexpected token. Did you mean `{'}'}` or `&rbrace;`?");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[project]/apps/web/src/components/SearchInterface.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SearchInterface
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$LocationSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/components/LocationSelector.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useStorage.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function SearchInterface() {
    const { isHydrated, history, location, wishlist, connections, actions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useStorage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStorage"])();
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSearching, setIsSearching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sortOrder, setSortOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('price_asc');
    const [dataSource, setDataSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('demo');
    const [isLive, setIsLive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Filters state
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    // Compare state
    const [compareTray, setCompareTray] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showCompareModal, setShowCompareModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [expandedOfferId, setExpandedOfferId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Extension state
    const [extensionReady, setExtensionReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [wishlistIds, setWishlistIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [manualLocQuery, setManualLocQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setWishlistIds(new Set(wishlist.map((item)=>item.id)));
    }, [
        wishlist
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Check if extension was injected before React mounted
        if (document.documentElement.getAttribute('data-compareall-extension') === 'true') {
            setExtensionReady(true);
        }
        // Listen for extension readiness and search results
        const handleMessage = async (event)=>{
            if (event.data?.type === "COMPAREALL_EXTENSION_READY") {
                console.log("Extension detected and ready!");
                setExtensionReady(true);
            }
            if (event.data?.type === "COMPAREALL_LIVE_SEARCH_RESULT") {
                const rawResults = event.data.results;
                // Send these raw results to backend /live endpoint for grouping
                try {
                    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
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
        };
        window.addEventListener("message", handleMessage);
        return ()=>window.removeEventListener("message", handleMessage);
    }, [
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
                // Fallback to existing mock API
                const connectedIds = connections.filter((c)=>c.status === 'connected').map((c)=>c.providerId);
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const res = await fetch(`${API_URL}/api/compare`, {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$components$2f$LocationSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                location: location,
                onLocationChange: actions.saveLocation
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 157,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: (e)=>handleSearch(e),
                className: "search-box",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        className: "search-input",
                        placeholder: "What do you want? (e.g. Chicken Biryani, iPhone 16, Cab to airport)",
                        value: searchTerm,
                        onChange: (e)=>setSearchTerm(e.target.value)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "search-button",
                        disabled: isSearching,
                        children: isSearching ? 'Comparing...' : 'Compare Options'
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 170,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 162,
                columnNumber: 7
            }, this),
            compareTray.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                            children: [
                                compareTray.length,
                                " items selected for comparison"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                            lineNumber: 179,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 178,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '1rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setCompareTray([]),
                                style: {
                                    color: '#9ca3af',
                                    textDecoration: 'underline'
                                },
                                children: "Clear"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 182,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                lineNumber: 183,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 181,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 177,
                columnNumber: 9
            }, this),
            showCompareModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '1.5rem'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    children: "Side-by-Side Comparison"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                    lineNumber: 198,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowCompareModal(false),
                                    style: {
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold'
                                    },
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                    lineNumber: 199,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                            lineNumber: 197,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                gap: '1rem',
                                overflowX: 'auto',
                                paddingBottom: '1rem'
                            },
                            children: compareTray.map((offer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        flex: '1',
                                        minWidth: '200px',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        padding: '1rem'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            style: {
                                                fontSize: '1.1rem',
                                                marginBottom: '0.5rem'
                                            },
                                            children: offer.providerName
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                            lineNumber: 205,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                color: 'var(--muted)',
                                                fontSize: '0.875rem',
                                                marginBottom: '1rem'
                                            },
                                            children: offer.title
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                            lineNumber: 206,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                            lineNumber: 208,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.5rem',
                                                fontSize: '0.875rem',
                                                marginBottom: '1.5rem'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Base Price:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 213,
                                                            columnNumber: 26
                                                        }, this),
                                                        " â‚¹",
                                                        offer.price.basePrice
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 213,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Fees & Taxes:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 214,
                                                            columnNumber: 26
                                                        }, this),
                                                        " â‚¹",
                                                        (offer.price.deliveryFee || 0) + (offer.price.platformFee || 0) + (offer.price.taxes || 0)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Discount:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 215,
                                                            columnNumber: 26
                                                        }, this),
                                                        " ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: 'var(--success)'
                                                            },
                                                            children: [
                                                                "-â‚¹",
                                                                offer.price.discount || 0
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 215,
                                                            columnNumber: 53
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 215,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Rating:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 216,
                                                            columnNumber: 26
                                                        }, this),
                                                        " ",
                                                        offer.rating ? `â­ ${offer.rating}` : 'N/A'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 216,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "ETA:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 217,
                                                            columnNumber: 26
                                                        }, this),
                                                        " ",
                                                        offer.estimatedTimeMins ? `${offer.estimatedTimeMins} mins` : 'N/A'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 217,
                                                    columnNumber: 21
                                                }, this),
                                                offer.distanceKm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Distance:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 218,
                                                            columnNumber: 47
                                                        }, this),
                                                        " ",
                                                        offer.distanceKm,
                                                        " km"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 218,
                                                    columnNumber: 42
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                            lineNumber: 212,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
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
                                            lineNumber: 221,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, offer.id, true, {
                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                    lineNumber: 204,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                            lineNumber: 202,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                    lineNumber: 196,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 195,
                columnNumber: 9
            }, this),
            results.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                style: {
                                    fontSize: '1.1rem'
                                },
                                children: "Filters & Sorting"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 234,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "price_asc",
                                        children: "Lowest Price First"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 244,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "price_desc",
                                        children: "Highest Price First"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 245,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "time_asc",
                                        children: "Fastest Delivery/Arrival"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 246,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "availability_desc",
                                        children: "Highest Availability"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 247,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "rating_desc",
                                        children: "Highest Rating"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 248,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "discount_desc",
                                        children: "Highest Discount"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 249,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 235,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 233,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '1rem',
                            flexWrap: 'wrap'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            fontSize: '0.75rem',
                                            color: 'var(--muted)',
                                            display: 'block'
                                        },
                                        children: "Max Price (â‚¹)"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 255,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                        lineNumber: 256,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 254,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        style: {
                                            fontSize: '0.75rem',
                                            color: 'var(--muted)',
                                            display: 'block'
                                        },
                                        children: "Min Rating"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 265,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 0,
                                                children: "Any"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 271,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 3,
                                                children: "3+ Stars"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 272,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 4,
                                                children: "4+ Stars"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 273,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 4.5,
                                                children: "4.5+ Stars"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 274,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 266,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 264,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 253,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 232,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "results-container",
                style: {
                    paddingBottom: compareTray.length > 0 ? '5rem' : '0'
                },
                children: results.length > 0 ? results.map((group, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grouped-result",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grouped-result-header",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "grouped-result-category",
                                        children: group.category
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 286,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "grouped-result-title",
                                        children: group.title
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 287,
                                        columnNumber: 17
                                    }, this),
                                    group.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: 'var(--muted)'
                                        },
                                        children: group.description
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 288,
                                        columnNumber: 39
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 285,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                    group.lowestPrice !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '0.85rem',
                                                    color: 'var(--muted)',
                                                    display: 'block'
                                                },
                                                children: "Best Price"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 294,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
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
                                                lineNumber: 295,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 293,
                                        columnNumber: 21
                                    }, this),
                                    group.savings !== undefined && group.savings > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '0.85rem',
                                                    color: 'var(--success)',
                                                    display: 'block'
                                                },
                                                children: "You Save"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 300,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
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
                                                lineNumber: 301,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 299,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '0.85rem',
                                                    color: 'var(--muted)',
                                                    display: 'block'
                                                },
                                                children: "Data Source"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 305,
                                                columnNumber: 21
                                            }, this),
                                            isLive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
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
                                                lineNumber: 307,
                                                columnNumber: 23
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
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
                                                lineNumber: 309,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 304,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 291,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "provider-list",
                                children: group.offers.map((offer, offerIdx)=>{
                                    const isExpanded = expandedOfferId === offer.id;
                                    const isWishlisted = wishlistIds.has(offer.id);
                                    const isBest = offerIdx === 0 && offer.status !== 'UNAVAILABLE' && sortOrder === 'price_asc';
                                    const inCompare = compareTray.some((o)=>o.id === offer.id);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `provider-card ${isBest ? 'best-price' : ''} ${offer.status === 'UNAVAILABLE' ? 'opacity-50' : ''}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "provider-info",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                                                                lineNumber: 324,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    flex: 1,
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'flex-start'
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        style: {
                                                                            margin: 0,
                                                                            paddingRight: '10px'
                                                                        },
                                                                        children: [
                                                                            offer.title,
                                                                            " ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                                                lineNumber: 334,
                                                                                columnNumber: 43
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "status-badge",
                                                                                style: {
                                                                                    background: offer.status === 'LIVE' ? '#dbeafe' : '#fef3c7',
                                                                                    color: offer.status === 'LIVE' ? '#1e3a8a' : '#92400e'
                                                                                },
                                                                                children: offer.status
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                                lineNumber: 335,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            isBest && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "status-badge",
                                                                                style: {
                                                                                    background: '#dcfce7',
                                                                                    color: '#166534'
                                                                                },
                                                                                children: "BEST"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                                lineNumber: 336,
                                                                                columnNumber: 40
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                        lineNumber: 333,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                                        lineNumber: 338,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 332,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                        lineNumber: 323,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "provider-meta",
                                                        style: {
                                                            flexDirection: 'column',
                                                            gap: '0.25rem',
                                                            marginTop: '0.5rem',
                                                            marginLeft: '1.75rem'
                                                        },
                                                        children: [
                                                            offer.isAvailable ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--success)',
                                                                    fontWeight: '500'
                                                                },
                                                                children: "Available"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 345,
                                                                columnNumber: 46
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--warning)'
                                                                },
                                                                children: "Unavailable"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 345,
                                                                columnNumber: 124
                                                            }, this),
                                                            offer.accountBenefits && offer.accountBenefits.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    marginTop: '0.25rem'
                                                                },
                                                                children: offer.accountBenefits.map((benefit, bIdx)=>{
                                                                    const isDemo = benefit.includes('[DEMO]');
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                                            isDemo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    marginRight: '4px'
                                                                                },
                                                                                children: "⚠"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                                lineNumber: 363,
                                                                                columnNumber: 47
                                                                            }, this),
                                                                            benefit
                                                                        ]
                                                                    }, bIdx, true, {
                                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                        lineNumber: 352,
                                                                        columnNumber: 34
                                                                    }, this);
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 348,
                                                                columnNumber: 27
                                                            }, this),
                                                            offer.estimatedTimeMins ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "ETA: ",
                                                                    offer.estimatedTimeMins,
                                                                    " min"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 371,
                                                                columnNumber: 52
                                                            }, this) : null,
                                                            offer.distanceKm ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Distance: ",
                                                                    offer.distanceKm,
                                                                    " km"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 372,
                                                                columnNumber: 45
                                                            }, this) : null,
                                                            offer.rating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Reputation: ⭐ ",
                                                                    offer.rating,
                                                                    " (",
                                                                    offer.reviewCount || 0,
                                                                    " reviews)"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 373,
                                                                columnNumber: 42
                                                            }, this),
                                                            offer.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'red',
                                                                    fontWeight: 'bold'
                                                                },
                                                                children: offer.error
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 374,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                        lineNumber: 344,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 322,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "provider-price",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            textAlign: 'right'
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                            lineNumber: 380,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                        lineNumber: 379,
                                                        columnNumber: 23
                                                    }, this),
                                                    isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "price-breakdown",
                                                        style: {
                                                            textAlign: 'right',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: '0.25rem'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Base price: ₹",
                                                                    offer.price.basePrice
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 390,
                                                                columnNumber: 27
                                                            }, this),
                                                            (offer.price.deliveryFee || 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Delivery fee: ₹",
                                                                    offer.price.deliveryFee
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 391,
                                                                columnNumber: 66
                                                            }, this),
                                                            (offer.price.platformFee || 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Platform fee: ₹",
                                                                    offer.price.platformFee
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 392,
                                                                columnNumber: 66
                                                            }, this),
                                                            (offer.price.taxes || 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Taxes: ₹",
                                                                    offer.price.taxes
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 393,
                                                                columnNumber: 60
                                                            }, this),
                                                            (offer.price.discount || 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--success)'
                                                                },
                                                                children: [
                                                                    "Discount: -₹",
                                                                    offer.price.discount
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 394,
                                                                columnNumber: 63
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                        lineNumber: 389,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "final-price",
                                                        style: {
                                                            marginTop: '0.5rem',
                                                            borderTop: isExpanded ? '1px solid var(--border)' : 'none',
                                                            paddingTop: isExpanded ? '0.5rem' : '0'
                                                        },
                                                        children: [
                                                            offer.originalPrice && offer.originalPrice > offer.price.finalPayablePrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                                lineNumber: 400,
                                                                columnNumber: 28
                                                            }, this),
                                                            "₹",
                                                            offer.price.finalPayablePrice
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                        lineNumber: 398,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
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
                                                        lineNumber: 405,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 378,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, offer.id, true, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 321,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 313,
                                columnNumber: 17
                            }, this)
                        ]
                    }, idx, true, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 284,
                        columnNumber: 13
                    }, this)) : !isSearching && searchTerm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "No results found."
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                    lineNumber: 421,
                    columnNumber: 41
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 281,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
        lineNumber: 156,
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
"[project]/apps/web/src/lib/providers/categories/CabProvider.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CabProvider",
    ()=>CabProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$BaseCategoryProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/categories/BaseCategoryProvider.ts [app-ssr] (ecmascript)");
;
class CabProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$BaseCategoryProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BaseCategoryProvider"] {
    constructor(id, name){
        super({
            id,
            name,
            supportedCategories: [
                'cab'
            ],
            requiresAuth: true
        });
    }
    async search(query) {
        if (!query.location || !query.location.lat) {
            throw new Error(`Precise Location (Lat/Lng) is strictly required for Cab searches on ${this.config.name}.`);
        }
        return this.fetchCabOptions(query);
    }
}
}),
"[project]/apps/web/src/lib/providers/categories/EducationProvider.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EducationProvider",
    ()=>EducationProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$BaseCategoryProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/categories/BaseCategoryProvider.ts [app-ssr] (ecmascript)");
;
class EducationProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$BaseCategoryProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BaseCategoryProvider"] {
    constructor(id, name){
        super({
            id,
            name,
            supportedCategories: [
                'education'
            ],
            requiresAuth: false
        });
    }
    async search(query) {
        return this.fetchEducationOptions(query);
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
"[project]/apps/web/src/lib/providers/categories/JobProvider.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JobProvider",
    ()=>JobProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$BaseCategoryProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/categories/BaseCategoryProvider.ts [app-ssr] (ecmascript)");
;
class JobProvider extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$BaseCategoryProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BaseCategoryProvider"] {
    constructor(id, name){
        super({
            id,
            name,
            supportedCategories: [
                'jobs'
            ],
            requiresAuth: false
        });
    }
    async search(query) {
        return this.fetchJobOptions(query);
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
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/mocks/mockProviders.ts [app-ssr] (ecmascript)");
;
const MOCK_PROVIDERS = [
    new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FoodProviderA"](),
    new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FoodProviderB"](),
    new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FoodProviderC"](),
    new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GroceryProviderA"](),
    new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GroceryProviderB"](),
    new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShoppingProviderA"](),
    new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShoppingProviderB"](),
    new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CabProviderA"](),
    new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CabProviderB"](),
    new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CabProviderC"](),
    new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TravelProviderA"](),
    new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["JobProviderA"](),
    new __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockProviders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EducationProviderA"]()
];
}),
"[project]/apps/web/src/lib/providers/mocks/mockProviders.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CabProviderA",
    ()=>CabProviderA,
    "CabProviderB",
    ()=>CabProviderB,
    "CabProviderC",
    ()=>CabProviderC,
    "EducationProviderA",
    ()=>EducationProviderA,
    "FoodProviderA",
    ()=>FoodProviderA,
    "FoodProviderB",
    ()=>FoodProviderB,
    "FoodProviderC",
    ()=>FoodProviderC,
    "GroceryProviderA",
    ()=>GroceryProviderA,
    "GroceryProviderB",
    ()=>GroceryProviderB,
    "JobProviderA",
    ()=>JobProviderA,
    "ShoppingProviderA",
    ()=>ShoppingProviderA,
    "ShoppingProviderB",
    ()=>ShoppingProviderB,
    "TravelProviderA",
    ()=>TravelProviderA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$FoodProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/categories/FoodProvider.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$GroceryProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/categories/GroceryProvider.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$ShoppingProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/categories/ShoppingProvider.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$CabProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/categories/CabProvider.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$TravelProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/categories/TravelProvider.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$JobProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/categories/JobProvider.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$EducationProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/categories/EducationProvider.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/providers/mocks/mockUtils.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
class FoodProviderA extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$FoodProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FoodProvider"] {
    constructor(){
        super('food-a', 'Swiggy');
    }
    async fetchFoodOptions(query) {
        const isConnected = query.connectedProviders?.includes(this.config.id);
        // We only trigger this if query term is somewhat food related, or always if it's broad
        const lat = query.location?.lat || 12.9715987;
        const lng = query.location?.lng || 77.5945627;
        try {
            const swiggyUrl = `https://www.swiggy.com/dapi/restaurants/search/v3?lat=${lat}&lng=${lng}&str=${encodeURIComponent(query.term)}&trackingId=undefined&submitAction=ENTER&queryUniqueId=74e14f6b-73b8-500b-3b32-94f4c9c80d46`;
            const response = await fetch(swiggyUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'application/json',
                    'Referer': 'https://www.swiggy.com/'
                },
                next: {
                    revalidate: 60
                }
            });
            if (!response.ok) return [];
            const data = await response.json();
            const results = [];
            // Basic recursive extractor
            const seenIds = new Set();
            function search(obj, currentRestaurant) {
                if (!obj || typeof obj !== 'object' || results.length >= 10) return;
                let restaurant = currentRestaurant;
                if (obj.restaurant && obj.restaurant.info) {
                    restaurant = obj.restaurant.info;
                }
                if (Array.isArray(obj.dishes)) {
                    obj.dishes.forEach((dishObj)=>{
                        if (dishObj.info && dishObj.info.name && dishObj.info.price && !seenIds.has(dishObj.info.id)) {
                            seenIds.add(dishObj.info.id);
                            const price = dishObj.info.price / 100;
                            const deliveryFee = isConnected ? 0 : 40;
                            const discount = isConnected ? 50 : 0;
                            results.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMockResult"])('food-a', 'Swiggy', `s-${dishObj.info.id}`, {
                                title: `${dishObj.info.name} (${restaurant?.name || 'Unknown'})`,
                                category: 'food',
                                price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateFinalPrice"])(price, deliveryFee, 0, 0, discount, 0, 0),
                                originalPrice: price,
                                estimatedTimeMins: restaurant?.sla?.deliveryTime || 35,
                                rating: parseFloat(dishObj.info.ratings?.aggregatedRating?.rating || restaurant?.avgRating || '4.0'),
                                accountBenefits: isConnected ? [
                                    'Swiggy One Benefit: Free Delivery'
                                ] : []
                            }));
                        }
                    });
                }
                for(const key in obj){
                    if (typeof obj[key] === 'object') {
                        search(obj[key], restaurant);
                    }
                }
            }
            search(data);
            return results;
        } catch (e) {
            console.error("Swiggy API Error:", e);
            return [];
        }
    }
}
class FoodProviderB extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$FoodProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FoodProvider"] {
    constructor(){
        super('food-b', '[MOCK] Zomato Clone');
    }
    async fetchFoodOptions(query) {
        const isConnected = query.connectedProviders?.includes(this.config.id);
        if (query.term.toLowerCase().includes('biryani')) {
            const discount = isConnected ? 60 : 0; // Flat ₹60 off if connected
            return [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMockResult"])(this.config.id, this.config.name, 'b1', {
                    title: 'Chicken Biryani (Behrouz Biryani)',
                    category: 'food',
                    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateFinalPrice"])(240, 40, 6, 12, discount, 15, 0),
                    originalPrice: 240,
                    estimatedTimeMins: 45,
                    rating: 4.5,
                    accountBenefits: isConnected ? [
                        '[DEMO] Mock Zomato Gold Benefit: ₹60 Off'
                    ] : []
                }),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMockResult"])(this.config.id, this.config.name, 'b2', {
                    title: 'Chicken Dum Biryani (Meghana Foods)',
                    category: 'food',
                    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateFinalPrice"])(290, 40, 6, 14, discount, 15, 0),
                    originalPrice: 290,
                    estimatedTimeMins: 35,
                    rating: 4.7,
                    accountBenefits: isConnected ? [
                        '[DEMO] Mock Zomato Gold Benefit: ₹60 Off'
                    ] : []
                })
            ];
        }
        return [];
    }
}
class FoodProviderC extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$FoodProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FoodProvider"] {
    constructor(){
        super('food-c', '[MOCK] EatSure Clone');
    }
    async fetchFoodOptions(query) {
        if (query.term.toLowerCase().includes('biryani')) {
            return [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMockResult"])(this.config.id, this.config.name, 'b1', {
                    title: 'Chicken Biryani (Behrouz Biryani)',
                    category: 'food',
                    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateFinalPrice"])(260, 0, 0, 13, 0, 0, 0),
                    originalPrice: 260,
                    estimatedTimeMins: 25,
                    rating: 4.8
                })
            ];
        }
        return [];
    }
}
class GroceryProviderA extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$GroceryProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GroceryProvider"] {
    constructor(){
        super('groc-a', '[MOCK] Blinkit Clone');
    }
    async fetchGroceryOptions(query) {
        if (query.term.toLowerCase().includes('milk') || query.term.toLowerCase().includes('grocery')) {
            return [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMockResult"])(this.config.id, this.config.name, 'm1', {
                    title: 'Milk 1L',
                    brand: 'Amul',
                    quantity: 1,
                    size: '1L',
                    category: 'grocery',
                    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateFinalPrice"])(68, 15, 2, 0, 0, 2, 0),
                    originalPrice: 68,
                    estimatedTimeMins: 10
                })
            ];
        }
        return [];
    }
}
class GroceryProviderB extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$GroceryProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GroceryProvider"] {
    constructor(){
        super('groc-b', '[MOCK] Instamart Clone');
    }
    async fetchGroceryOptions(query) {
        if (query.term.toLowerCase().includes('milk') || query.term.toLowerCase().includes('grocery')) {
            return [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMockResult"])(this.config.id, this.config.name, 'm1', {
                    title: 'Milk 1L',
                    brand: 'Amul',
                    quantity: 1,
                    size: '1L',
                    category: 'grocery',
                    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateFinalPrice"])(68, 25, 4, 0, 0, 0, 0),
                    originalPrice: 68,
                    estimatedTimeMins: 15
                })
            ];
        }
        return [];
    }
}
class ShoppingProviderA extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$ShoppingProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShoppingProvider"] {
    constructor(){
        super('shop-a', '[MOCK] Amazon Clone');
    }
    async fetchShoppingOptions(query) {
        const isConnected = query.connectedProviders?.includes(this.config.id);
        if (query.term.toLowerCase().includes('iphone 16') || query.term.toLowerCase().includes('fashion')) {
            const deliveryFee = isConnected ? 0 : 500;
            const eta = isConnected ? 1440 : 2880; // 1 day vs 2 days
            return [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMockResult"])(this.config.id, this.config.name, 'ip1', {
                    title: 'Apple iPhone 16 (128GB)',
                    brand: 'Apple',
                    model: 'iPhone 16',
                    size: '128GB',
                    category: 'electronics',
                    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateFinalPrice"])(79900, deliveryFee, 0, 14382, 5000, 0, 0),
                    originalPrice: 79900,
                    estimatedTimeMins: eta,
                    accountBenefits: isConnected ? [
                        '[DEMO] Mock Prime Benefit: 1-Day ETA'
                    ] : []
                })
            ];
        }
        return [];
    }
}
class ShoppingProviderB extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$ShoppingProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ShoppingProvider"] {
    constructor(){
        super('shop-b', '[MOCK] Flipkart Clone');
    }
    async fetchShoppingOptions(query) {
        if (query.term.toLowerCase().includes('iphone 16') || query.term.toLowerCase().includes('fashion')) {
            return [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMockResult"])(this.config.id, this.config.name, 'ip1', {
                    title: 'Apple iPhone 16 (128GB)',
                    brand: 'Apple',
                    model: 'iPhone 16',
                    size: '128GB',
                    category: 'electronics',
                    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateFinalPrice"])(79900, 40, 29, 14382, 6500, 99, 0),
                    originalPrice: 79900,
                    estimatedTimeMins: 4320
                })
            ];
        }
        return [];
    }
}
class CabProviderA extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$CabProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CabProvider"] {
    constructor(){
        super('cab-a', '[MOCK] Uber Clone');
    }
    async fetchCabOptions(query) {
        const isConnected = query.connectedProviders?.includes(this.config.id);
        if (query.term.toLowerCase().includes('airport') || query.term.toLowerCase().includes('cab')) {
            const discount = isConnected ? 100 : 0; // Flat â‚¹100 off if connected
            return [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMockResult"])(this.config.id, this.config.name, 'c1', {
                    title: 'Airport Ride (Sedan)',
                    category: 'cab',
                    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateFinalPrice"])(850, 0, 0, 42, discount, 0, 0),
                    originalPrice: 850,
                    estimatedTimeMins: 5,
                    distanceKm: 22.4,
                    accountBenefits: isConnected ? [
                        '[DEMO] Mock Uber One Benefit: â‚¹100 Off'
                    ] : []
                })
            ];
        }
        return [];
    }
}
class CabProviderB extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$CabProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CabProvider"] {
    constructor(){
        super('cab-b', '[MOCK] Ola Clone');
    }
    async fetchCabOptions(query) {
        if (query.term.toLowerCase().includes('airport') || query.term.toLowerCase().includes('cab')) {
            return [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMockResult"])(this.config.id, this.config.name, 'c1', {
                    title: 'Airport to City',
                    category: 'cab',
                    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateFinalPrice"])(790, 0, 0, 39, 100, 0, 0),
                    originalPrice: 790,
                    estimatedTimeMins: 12,
                    distanceKm: 22.1
                })
            ];
        }
        return [];
    }
}
class CabProviderC extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$CabProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CabProvider"] {
    constructor(){
        super('cab-c', '[MOCK] BluSmart Clone');
    }
    async fetchCabOptions(query) {
        if (query.term.toLowerCase().includes('airport') || query.term.toLowerCase().includes('cab')) {
            return [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMockResult"])(this.config.id, this.config.name, 'c1', {
                    title: 'Airport Premium Ride',
                    category: 'cab',
                    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateFinalPrice"])(950, 0, 0, 47, 0, 0, 0),
                    originalPrice: 950,
                    estimatedTimeMins: 20,
                    distanceKm: 22.5
                })
            ];
        }
        return [];
    }
}
class TravelProviderA extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$TravelProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TravelProvider"] {
    constructor(){
        super('travel-a', '[MOCK] MakeMyTrip Clone');
    }
    async fetchTravelOptions(query) {
        if (query.term.toLowerCase().includes('hotel') || query.term.toLowerCase().includes('travel')) {
            return [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMockResult"])(this.config.id, this.config.name, 't1', {
                    title: 'Taj Hotel (Deluxe Room)',
                    category: 'travel',
                    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateFinalPrice"])(5000, 0, 0, 900, 1000, 0, 0),
                    originalPrice: 5000,
                    rating: 4.9
                })
            ];
        }
        return [];
    }
}
class JobProviderA extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$JobProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["JobProvider"] {
    constructor(){
        super('job-a', '[MOCK] Naukri Clone');
    }
    async fetchJobOptions(query) {
        if (query.term.toLowerCase().includes('job') || query.term.toLowerCase().includes('developer')) {
            return [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMockResult"])(this.config.id, this.config.name, 'j1', {
                    title: 'Senior Frontend Developer',
                    category: 'jobs',
                    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateFinalPrice"])(0, 0, 0, 0, 0, 0, 0),
                    originalPrice: 0,
                    description: 'React, Next.js, 5+ years experience. Remote.'
                })
            ];
        }
        return [];
    }
}
class EducationProviderA extends __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$categories$2f$EducationProvider$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EducationProvider"] {
    constructor(){
        super('edu-a', '[MOCK] Udemy Clone');
    }
    async fetchEducationOptions(query) {
        if (query.term.toLowerCase().includes('course') || query.term.toLowerCase().includes('learn')) {
            return [
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMockResult"])(this.config.id, this.config.name, 'e1', {
                    title: 'Next.js 16 Full Masterclass',
                    category: 'education',
                    price: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$providers$2f$mocks$2f$mockUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["calculateFinalPrice"])(3499, 0, 0, 629, 2900, 0, 0),
                    originalPrice: 3499,
                    rating: 4.7
                })
            ];
        }
        return [];
    }
}
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
        deepLinkUrl: data.deepLinkUrl || `https://example.com/redirect?provider=${providerId}&item=${id}`,
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

//# sourceMappingURL=_0zoaw63._.js.map