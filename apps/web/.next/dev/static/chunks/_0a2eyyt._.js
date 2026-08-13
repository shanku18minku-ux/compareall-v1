(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/components/SearchInterface.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SearchInterface
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$location$2f$LocationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/location/LocationContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/storage/src/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/storage/src/web/LocalStorageManager.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function SearchInterface() {
    _s();
    const { location, requestDeviceLocation, setManualLocation, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$location$2f$LocationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocation"])();
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSearching, setIsSearching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sortOrder, setSortOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('price_asc');
    // Filters state
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    // Compare state
    const [compareTray, setCompareTray] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showCompareModal, setShowCompareModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [expandedOfferId, setExpandedOfferId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [wishlistIds, setWishlistIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [manualLocQuery, setManualLocQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Load wishlist on client side only to prevent hydration mismatch
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchInterface.useEffect": ()=>{
            const list = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].getWishlist();
            setWishlistIds(new Set(list.map({
                "SearchInterface.useEffect": (w)=>w.id
            }["SearchInterface.useEffect"])));
        }
    }["SearchInterface.useEffect"], []);
    const handleSearch = async (e, termToSearch, newSortOrder, newFilters)=>{
        if (e) e.preventDefault();
        const query = (termToSearch !== undefined ? termToSearch : searchTerm).trim();
        if (!query) return;
        setSearchTerm(query);
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].addHistory(query);
        setIsSearching(true);
        try {
            const connectedIds = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].getConnections().filter((c)=>c.status === 'connected').map((c)=>c.providerId);
            const res = await fetch('http://localhost:3001/api/compare', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query,
                    location: location || undefined,
                    sortOrder: newSortOrder || sortOrder,
                    filters: newFilters !== undefined ? newFilters : filters,
                    connectedProviderIds: connectedIds
                })
            });
            const json = await res.json();
            if (json.success) {
                setResults(json.results);
            } else {
                console.error("Backend error:", json.error);
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally{
            setIsSearching(false);
        }
    };
    const toggleWishlist = (offer)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].toggleWishlist({
            id: offer.id,
            title: offer.title,
            category: offer.category
        });
        const list = __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$storage$2f$src$2f$web$2f$LocalStorageManager$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LocalStorageManager"].getWishlist();
        setWishlistIds(new Set(list.map((w)=>w.id)));
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "location-picker mb-4",
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "Location: "
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 101,
                                        columnNumber: 13
                                    }, this),
                                    isLoading ? 'Loading...' : location ? location.label || 'Set' : 'Not set'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 100,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: requestDeviceLocation,
                                style: {
                                    color: 'var(--primary)',
                                    fontWeight: 'bold'
                                },
                                children: "Detect GPS"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: '0.5rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Or enter City / Pincode",
                                value: manualLocQuery,
                                onChange: (e)=>setManualLocQuery(e.target.value),
                                style: {
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border)',
                                    flex: 1
                                }
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    if (manualLocQuery) setManualLocation(manualLocQuery);
                                },
                                style: {
                                    background: 'var(--foreground)',
                                    color: 'white',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px'
                                },
                                children: "Set"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 116,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 98,
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
                        lineNumber: 126,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "search-button",
                        disabled: isSearching,
                        children: isSearching ? 'Comparing...' : 'Compare Options'
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 125,
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
                            lineNumber: 142,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 141,
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
                                lineNumber: 145,
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
                                lineNumber: 146,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 144,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 140,
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
                                    lineNumber: 161,
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
                                    lineNumber: 162,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                            lineNumber: 160,
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
                                            lineNumber: 168,
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
                                            lineNumber: 169,
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
                                            lineNumber: 171,
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
                                                            lineNumber: 176,
                                                            columnNumber: 26
                                                        }, this),
                                                        " â‚¹",
                                                        offer.price.basePrice
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 176,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Fees & Taxes:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 177,
                                                            columnNumber: 26
                                                        }, this),
                                                        " â‚¹",
                                                        (offer.price.deliveryFee || 0) + (offer.price.platformFee || 0) + (offer.price.taxes || 0)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Discount:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 178,
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
                                                            lineNumber: 178,
                                                            columnNumber: 53
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 178,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Rating:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 179,
                                                            columnNumber: 26
                                                        }, this),
                                                        " ",
                                                        offer.rating ? `â­ ${offer.rating}` : 'N/A'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 179,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "ETA:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 180,
                                                            columnNumber: 26
                                                        }, this),
                                                        " ",
                                                        offer.estimatedTimeMins ? `${offer.estimatedTimeMins} mins` : 'N/A'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 180,
                                                    columnNumber: 21
                                                }, this),
                                                offer.distanceKm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "Distance:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 181,
                                                            columnNumber: 47
                                                        }, this),
                                                        " ",
                                                        offer.distanceKm,
                                                        " km"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 42
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                            lineNumber: 175,
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
                                            lineNumber: 184,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, offer.id, true, {
                                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                    lineNumber: 167,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                            lineNumber: 165,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                    lineNumber: 159,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 158,
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
                                lineNumber: 197,
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
                                        lineNumber: 207,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "price_desc",
                                        children: "Highest Price First"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 208,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "time_asc",
                                        children: "Fastest Delivery/Arrival"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 209,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "availability_desc",
                                        children: "Highest Availability"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 210,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "rating_desc",
                                        children: "Highest Rating"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 211,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 198,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 196,
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
                                        lineNumber: 217,
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
                                        lineNumber: 218,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 216,
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
                                        lineNumber: 227,
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
                                                lineNumber: 233,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 3,
                                                children: "3+ Stars"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 234,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 4,
                                                children: "4+ Stars"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 235,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: 4.5,
                                                children: "4.5+ Stars"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 236,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 228,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 226,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 215,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 195,
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
                                        lineNumber: 248,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "grouped-result-title",
                                        children: group.title
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 249,
                                        columnNumber: 17
                                    }, this),
                                    group.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            color: 'var(--muted)'
                                        },
                                        children: group.description
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 250,
                                        columnNumber: 39
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 247,
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
                                                lineNumber: 256,
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
                                                lineNumber: 257,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 255,
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
                                                    color: 'var(--muted)',
                                                    display: 'block'
                                                },
                                                children: "You Save"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 262,
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
                                                lineNumber: 263,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 261,
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
                                                lineNumber: 267,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                style: {
                                                    fontSize: '1rem',
                                                    color: '#f59e0b',
                                                    backgroundColor: '#fef3c7',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px'
                                                },
                                                children: "Demo Data"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 268,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 266,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 253,
                                columnNumber: 31
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
                                                                lineNumber: 282,
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
                                                                        children: [
                                                                            offer.providerName,
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "status-badge",
                                                                                style: {
                                                                                    background: offer.status === 'LIVE' ? '#dbeafe' : '#fef3c7',
                                                                                    color: offer.status === 'LIVE' ? '#1e3a8a' : '#92400e'
                                                                                },
                                                                                children: offer.status
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                                lineNumber: 293,
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
                                                                                lineNumber: 294,
                                                                                columnNumber: 40
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                        lineNumber: 291,
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
                                                                        children: isWishlisted ? 'â¤ï¸' : 'ðŸ¤'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                        lineNumber: 296,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 290,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                        lineNumber: 281,
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
                                                                lineNumber: 303,
                                                                columnNumber: 46
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--warning)'
                                                                },
                                                                children: "Unavailable"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 303,
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
                                                                                children: "âš ï¸"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                                lineNumber: 321,
                                                                                columnNumber: 47
                                                                            }, this),
                                                                            benefit
                                                                        ]
                                                                    }, bIdx, true, {
                                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                        lineNumber: 310,
                                                                        columnNumber: 34
                                                                    }, this);
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 306,
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
                                                                lineNumber: 329,
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
                                                                lineNumber: 330,
                                                                columnNumber: 45
                                                            }, this) : null,
                                                            offer.rating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Reputation: â­ ",
                                                                    offer.rating,
                                                                    " (",
                                                                    offer.reviewCount || 0,
                                                                    " reviews)"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 331,
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
                                                                lineNumber: 332,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                        lineNumber: 302,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 280,
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
                                                            children: isExpanded ? 'Hide Details â–²' : 'Show Details â–¼'
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                            lineNumber: 338,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                        lineNumber: 337,
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
                                                                    "Base price: â‚¹",
                                                                    offer.price.basePrice
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 348,
                                                                columnNumber: 27
                                                            }, this),
                                                            (offer.price.deliveryFee || 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Delivery fee: â‚¹",
                                                                    offer.price.deliveryFee
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 349,
                                                                columnNumber: 66
                                                            }, this),
                                                            (offer.price.platformFee || 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Platform fee: â‚¹",
                                                                    offer.price.platformFee
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 350,
                                                                columnNumber: 66
                                                            }, this),
                                                            (offer.price.taxes || 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Taxes: â‚¹",
                                                                    offer.price.taxes
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 351,
                                                                columnNumber: 60
                                                            }, this),
                                                            (offer.price.discount || 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--success)'
                                                                },
                                                                children: [
                                                                    "Discount: -â‚¹",
                                                                    offer.price.discount
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 352,
                                                                columnNumber: 63
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                        lineNumber: 347,
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
                                                                    "â‚¹",
                                                                    offer.originalPrice
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                                lineNumber: 358,
                                                                columnNumber: 28
                                                            }, this),
                                                            "â‚¹",
                                                            offer.price.finalPayablePrice
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                        lineNumber: 356,
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
                                                        lineNumber: 363,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                                lineNumber: 336,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, offer.id, true, {
                                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                        lineNumber: 279,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                                lineNumber: 271,
                                columnNumber: 17
                            }, this)
                        ]
                    }, idx, true, {
                        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                        lineNumber: 246,
                        columnNumber: 13
                    }, this)) : !isSearching && searchTerm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "No results found."
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                    lineNumber: 379,
                    columnNumber: 41
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
                lineNumber: 243,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/components/SearchInterface.tsx",
        lineNumber: 97,
        columnNumber: 5
    }, this);
}
_s(SearchInterface, "blxqTqu0jI8kFN8pfmc5syG7Pi4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$location$2f$LocationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocation"]
    ];
});
_c = SearchInterface;
var _c;
__turbopack_context__.k.register(_c, "SearchInterface");
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

//# sourceMappingURL=_0a2eyyt._.js.map