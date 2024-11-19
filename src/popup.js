// popup.js
document.addEventListener("DOMContentLoaded", () => {
  const domainsList = document.getElementById("domainsList");
  const emptyState = document.getElementById("emptyState");

  function createDomainElement(domain) {
    // Create main container
    const item = document.createElement("div");
    item.className = "domain-item";

    // Create domain header
    const header = document.createElement("div");
    header.className = "domain-header";

    // Add domain text
    const domainText = document.createElement("strong");
    domainText.textContent = domain;

    // Add remove button
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => removeDomain(domain));

    // Create patterns container
    const rulesContainer = document.createElement("div");
    rulesContainer.className = "domain-rules";

    // Create match pattern group
    const matchGroup = document.createElement("div");
    matchGroup.className = "pattern-group";

    const matchLabel = document.createElement("label");
    matchLabel.textContent = "Match Pattern (regex):";

    const matchInput = document.createElement("input");
    matchInput.type = "text";
    matchInput.className = "match-pattern";
    matchInput.placeholder = "e.g. ^example\\.com$";
    matchInput.dataset.domain = domain;

    // Create replace pattern group
    const replaceGroup = document.createElement("div");
    replaceGroup.className = "pattern-group";

    const replaceLabel = document.createElement("label");
    replaceLabel.textContent = "Replace Pattern:";

    const replaceInput = document.createElement("input");
    replaceInput.type = "text";
    replaceInput.className = "replace-pattern";
    replaceInput.placeholder = "e.g. testexample.com";
    replaceInput.dataset.domain = domain;

    // Add event listeners for pattern changes
    [matchInput, replaceInput].forEach((input) => {
      input.addEventListener("change", () => {
        browser.storage.local.set({
          [`patterns_${domain}`]: {
            match: matchInput.value,
            replace: replaceInput.value,
          },
        });
      });
    });

    // Load existing patterns
    browser.storage.local.get(`patterns_${domain}`).then((result) => {
      const patterns = result[`patterns_${domain}`] || {};
      matchInput.value = patterns.match || "";
      replaceInput.value = patterns.replace || "";
    });

    // Assemble the DOM structure
    header.appendChild(domainText);
    header.appendChild(removeBtn);

    matchGroup.appendChild(matchLabel);
    matchGroup.appendChild(matchInput);

    replaceGroup.appendChild(replaceLabel);
    replaceGroup.appendChild(replaceInput);

    rulesContainer.appendChild(matchGroup);
    rulesContainer.appendChild(replaceGroup);

    item.appendChild(header);
    item.appendChild(rulesContainer);

    return item;
  }

  function updateDomainsList(domains) {
    // Clear existing content
    while (domainsList.firstChild) {
      domainsList.removeChild(domainsList.firstChild);
    }

    if (!domains || domains.length === 0) {
      domainsList.style.display = "none";
      emptyState.style.display = "block";
      return;
    }

    domainsList.style.display = "block";
    emptyState.style.display = "none";

    domains.forEach((domain) => {
      domainsList.appendChild(createDomainElement(domain));
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
