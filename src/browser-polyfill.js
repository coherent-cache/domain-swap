// browser-polyfill.js
// A simple compatibility layer for browser extensions
// that works in both Firefox and Chrome

// Create a browserAPI object that maps to the appropriate browser API
const browserAPI = typeof browser !== "undefined" ? browser : chrome;

// Set up Promise-based API for Chrome (which uses callbacks)
if (typeof browser === "undefined") {
  // For Chrome's callback-based API, create Promise wrappers
  browserAPI.storage = {
    local: {
      get: (...args) => {
        return new Promise((resolve) => {
          chrome.storage.local.get(...args, resolve);
        });
      },
      set: (...args) => {
        return new Promise((resolve) => {
          chrome.storage.local.set(...args, resolve);
        });
      },
      remove: (...args) => {
        return new Promise((resolve) => {
          chrome.storage.local.remove(...args, resolve);
        });
      }
    },
    onChanged: chrome.storage.onChanged
  };
}

// Export for use in other files
if (typeof window !== "undefined") {
  window.browserAPI = browserAPI;
}