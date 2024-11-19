// background.js
let domainPatterns = new Map();

// Load patterns on startup
browser.storage.local.get().then((result) => {
  Object.keys(result).forEach((key) => {
    if (key.startsWith("patterns_")) {
      const domain = key.replace("patterns_", "");
      domainPatterns.set(domain, result[key]);
    }
  });
});

// Listen for storage changes
browser.storage.onChanged.addListener((changes) => {
  Object.keys(changes).forEach((key) => {
    if (key.startsWith("patterns_")) {
      const domain = key.replace("patterns_", "");
      if (changes[key].newValue) {
        domainPatterns.set(domain, changes[key].newValue);
      } else {
        domainPatterns.delete(domain);
      }
    }
  });
});

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    try {
      const url = new URL(details.url);
      const patterns = domainPatterns.get(url.hostname);

      if (patterns?.match && patterns?.replace) {
        const regex = new RegExp(patterns.match);
        const newDomain = url.hostname.replace(regex, patterns.replace);

        if (newDomain !== url.hostname) {
          url.hostname = newDomain;
          return { redirectUrl: url.toString() };
        }
      }
    } catch (error) {
      console.error("Error processing URL:", error);
    }
    return { cancel: false };
  },
  { urls: ["<all_urls>"] },
  ["blocking"],
);
