// content.js - Injected into compareall.in and localhost:3000
console.log("[CompareAll] Extension Content Script Injected");

// Tell the Web App that the extension is active
document.documentElement.setAttribute('data-compareall-extension', 'true');
window.postMessage({ type: "COMPAREALL_EXTENSION_READY" }, "*");

// Listen for messages from the Web App
window.addEventListener("message", (event) => {
  // We only accept messages from ourselves
  if (event.source !== window) return;

  const data = event.data;

  // The Web App wants to perform a live search
  if (data && data.type === "COMPAREALL_LIVE_SEARCH") {
    console.log("[CompareAll] Received search request from Web App:", data.payload);
    
    // Forward the request to the Extension Background Script
    chrome.runtime.sendMessage({
      action: "PERFORM_LIVE_SEARCH",
      payload: data.payload
    }, (response) => {
      // Send the response back to the Web App
      console.log("[CompareAll] Received response from Background Script", response);
      window.postMessage({
        type: "COMPAREALL_LIVE_SEARCH_RESULT",
        results: response.results,
        error: response.error
      }, "*");
    });
  }
});
