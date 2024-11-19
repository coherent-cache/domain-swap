// background.js
let redirectRules = {
  matchPattern: "",
  replacePattern: "",
};

// Load settings on startup
browser.storage.local.get(["matchPattern", "replacePattern"]).then((result) => {
  redirectRules = {
    matchPattern: result.matchPattern || "",
    replacePattern: result.replacePattern || "",
  };
});

// Listen for storage changes
browser.storage.onChanged.addListener((changes) => {
  if (changes.matchPattern) {
    redirectRules.matchPattern = changes.matchPattern.newValue;
  }
  if (changes.replacePattern) {
    redirectRules.replacePattern = changes.replacePattern.newValue;
  }
});

// Use webRequest for more reliable redirection
browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    try {
      const url = new URL(details.url);
      if (redirectRules.matchPattern && redirectRules.replacePattern) {
        const regex = new RegExp(redirectRules.matchPattern);
        const newDomain = url.hostname.replace(
          regex,
          redirectRules.replacePattern,
        );

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
