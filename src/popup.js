// popup.js
document.addEventListener("DOMContentLoaded", () => {
  const domainsList = document.getElementById("domainsList");
  const emptyState = document.getElementById("emptyState");

  function updateDomainsList(domains) {
    if (!domains || domains.length === 0) {
      domainsList.style.display = "none";
      emptyState.style.display = "block";
      return;
    }

    domainsList.style.display = "block";
    emptyState.style.display = "none";
    domainsList.innerHTML = "";

    domains.forEach((domain) => {
      const item = document.createElement("div");
      item.className = "domain-item";
      item.innerHTML = `
        <div class="domain-header">
          <strong>${domain}</strong>
          <button class="remove-btn">Remove</button>
        </div>
        <div class="domain-rules">
          <div class="pattern-group">
            <label>Match Pattern (regex):</label>
            <input type="text" class="match-pattern"
                   placeholder="e.g. ^example\\.com$"
                   data-domain="${domain}">
          </div>
          <div class="pattern-group">
            <label>Replace Pattern:</label>
            <input type="text" class="replace-pattern"
                   placeholder="e.g. testexample.com"
                   data-domain="${domain}">
          </div>
        </div>
      `;

      const matchInput = item.querySelector(".match-pattern");
      const replaceInput = item.querySelector(".replace-pattern");

      // Load existing patterns
      browser.storage.local.get(`patterns_${domain}`).then((result) => {
        const patterns = result[`patterns_${domain}`] || {};
        matchInput.value = patterns.match || "";
        replaceInput.value = patterns.replace || "";
      });

      // Save patterns when changed
      [matchInput, replaceInput].forEach((input) => {
        input.addEventListener("change", () => {
          const domain = input.dataset.domain;
          browser.storage.local.set({
            [`patterns_${domain}`]: {
              match: matchInput.value,
              replace: replaceInput.value,
            },
          });
        });
      });

      item.querySelector(".remove-btn").addEventListener("click", () => {
        removeDomain(domain);
      });

      domainsList.appendChild(item);
    });
  }

  function addDomain(domain) {
    browser.storage.local
      .get("activeDomains")
      .then((result) => {
        const domains = new Set(result.activeDomains || []);
        domains.add(domain);
        return browser.storage.local.set({
          activeDomains: Array.from(domains),
        });
      })
      .then(() => {
        document.getElementById("newDomain").value = "";
        loadDomains();
      });
  }

  function removeDomain(domain) {
    browser.storage.local
      .get("activeDomains")
      .then((result) => {
        const domains = new Set(result.activeDomains || []);
        domains.delete(domain);
        return browser.storage.local.set({
          activeDomains: Array.from(domains),
        });
      })
      .then(loadDomains);
  }

  function loadDomains() {
    browser.storage.local.get("activeDomains").then((result) => {
      updateDomainsList(result.activeDomains || []);
    });
  }

  // Load saved settings
  browser.storage.local
    .get(["matchPattern", "replacePattern"])
    .then((result) => {
      document.getElementById("matchPattern").value = result.matchPattern || "";
      document.getElementById("replacePattern").value =
        result.replacePattern || "";
    });

  loadDomains();

  // Add domain
  document.getElementById("addDomain").addEventListener("click", () => {
    const domain = document.getElementById("newDomain").value.trim();
    if (domain) {
      addDomain(domain);
    }
  });

  // Save patterns
  document.getElementById("saveButton").addEventListener("click", () => {
    const matchPattern = document.getElementById("matchPattern").value;
    const replacePattern = document.getElementById("replacePattern").value;

    browser.storage.local
      .set({
        matchPattern,
        replacePattern,
      })
      .then(() => {
        status.style.display = "block";
        setTimeout(() => {
          status.style.display = "none";
        }, 2000);
      });
  });
});
