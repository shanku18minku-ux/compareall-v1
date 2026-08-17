export interface ProviderMetadata {
    id: string;
    name: string;
    category: string;
    subcategory: string;
    icon: string;
    brandColor?: string;
    authType: 'otp' | 'google' | 'both';
    url: string;
    loginUrl: string;
    checkoutUrl?: string;
    actionTitle?: string;
    desc: string;
    regions: string[];
}

export interface ProviderPacket {
    metadata: ProviderMetadata;

    /**
     * URL pattern to detect successful login WITHOUT any platform API.
     * After login, platforms redirect to their home page — this regex catches that.
     * e.g. Swiggy redirects to swiggy.com (no /login in URL) = logged in.
     */
    successUrlPattern?: RegExp;

    /**
     * A small JS snippet injected on every page to detect login state via DOM.
     * Optional — URL pattern is the primary detection, this is the backup.
     * Must post: { type: 'SUCCESS' } when user is confirmed logged in.
     */
    getLoginDetectionScript: () => string;

    /**
     * Script injected into the WebView to extract search results.
     * Must parse the DOM or internal endpoints and post the results back to the host.
     */
    getExtractorInjection: (searchUrl: string, query?: string, location?: { latitude: number; longitude: number; name: string } | null) => string;

    /**
     * Generates the platform-specific search URL based on the user's query and location.
     */
    getSearchUrl: (query: string, location?: { latitude: number; longitude: number; name: string } | null) => string;
}
