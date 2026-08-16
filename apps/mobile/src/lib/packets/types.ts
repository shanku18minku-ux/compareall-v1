export interface ProviderMetadata {
    id: string;
    name: string;
    category: string;
    subcategory: string;
    icon: string;
    authType: 'otp' | 'google' | 'both';
    url: string;
    loginUrl: string;
    desc: string;
    regions: string[];
}

export interface ProviderPacket {
    metadata: ProviderMetadata;
    /**
     * Script injected into the WebView to handle the login flow (e.g., fast OTP polling).
     * Must listen for NATIVE_ACTION events and post SUCCESS/ERROR back to the host.
     */
    getLoginInjection: () => string;
    /**
     * Script injected into the WebView to extract search results.
     * Must parse the DOM and post the results back to the host.
     */
    getExtractorInjection: (searchUrl: string) => string;
    /**
     * Generates the platform-specific search URL based on the user's query.
     */
    getSearchUrl: (query: string) => string;
}
