// background.js
let domainPatterns = new Map();

// Use browserAPI from polyfill or create it if running in Chrome service worker
const browserAPI = typeof browser !== 'undefined' ? browser : 
                  (typeof chrome !== 'undefined' ? chrome : null);

// Load patterns on startup
function loadPatterns() {
  browserAPI.storage.local.get().then((result) => {
    Object.keys(result).forEach((key) => {
      if (key.startsWith("patterns_")) {
        const domain = key.replace("patterns_", "");
        domainPatterns.set(domain, result[key]);
        
        // For Chrome, update declarativeNetRequest rules
        if (isChrome()) {
          updateRule(domain, result[key]);
        }
      }
    });
  }).catch(error => {
    console.error("Error loading patterns:", error);
  });
}

// Listen for storage changes
browserAPI.storage.onChanged.addListener((changes) => {
  Object.keys(changes).forEach((key) => {
    if (key.startsWith("patterns_")) {
      const domain = key.replace("patterns_", "");
      if (changes[key].newValue) {
        domainPatterns.set(domain, changes[key].newValue);
        
        // For Chrome, update rules
        if (isChrome()) {
          updateRule(domain, changes[key].newValue);
        }
      } else {
        domainPatterns.delete(domain);
        
        // For Chrome, remove rules
        if (isChrome()) {
          removeRule(domain);
        }
      }
    }
  });
});

// Helper function to detect if we're running in Chrome
function isChrome() {
  return typeof browser === 'undefined' && typeof chrome !== 'undefined' && 
         typeof chrome.declarativeNetRequest !== 'undefined';
}

// Rule management for Chrome's declarativeNetRequest
async function updateRule(domain, patterns) {
  if (!isChrome() || !patterns?.match || !patterns?.replace) return;
  
  try {
    const ruleId = stringToHash(domain);
    
    // Remove old rule if exists
    await removeRule(domain);
    
    // Create new rule with declarativeNetRequest
    const rule = {
      id: ruleId,
      priority: 1,
      action: {
        type: "redirect",
        redirect: {
          regexSubstitution: `https://${patterns.replace}/$1`
        }
      },
      condition: {
        regexFilter: `^https?://${patterns.match}/(.*)`,
        resourceTypes: ["main_frame"]
      }
    };
    
    // Add the rule
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [rule],
      removeRuleIds: [ruleId]
    });
    
  } catch (error) {
    console.error("Error updating rule:", error);
  }
}

async function removeRule(domain) {
  if (!isChrome()) return;
  
  try {
    const ruleId = stringToHash(domain);
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [ruleId]
    });
  } catch (error) {
    console.error("Error removing rule:", error);
  }
}

// Helper to generate a numeric hash from a string
function stringToHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Ensure positive value between 1 and 2^24
  return Math.abs(hash % 16777215) + 1;
}

// Setup webRequest listener for Firefox
if (typeof browser !== 'undefined' && browser.webRequest) {
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
    ["blocking"]
  );
}

// Initialize
loadPatterns();