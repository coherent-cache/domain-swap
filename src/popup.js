// popup.js
const DEFAULT_DOMAINS = [
  {
    domain: "medium.com",
    match: "^(.*\\.)?medium\\.com$",
    replace: "readmedium.com",
  },
  {
    domain: "towardsdatascience.com",
    match: "^towardsdatascience\\.com$",
    replace: "readmedium.com",
  },
  {
    domain: "hackernoon.com",
    match: "^hackernoon\\.com$",
    replace: "readmedium.com",
  },
  {
    domain: "medium.freecodecamp.org",
    match: "^medium\\.freecodecamp\\.org$",
    replace: "readmedium.com",
  },
];

// Use browserAPI from polyfill
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

document.addEventListener("DOMContentLoaded", async () => {
  // Theme handling
  function setTheme(theme) {
    const html = document.documentElement;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    let activeTheme = theme;
    if (theme === "system") {
      activeTheme = prefersDark ? "dark" : "light";
    }

    html.setAttribute("data-theme", activeTheme);
    document.querySelectorAll(".theme-button").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.getElementById(`${theme}Theme`).classList.add("active");

    // Update all themed icons
    document.querySelectorAll("img[data-theme-light]").forEach((img) => {
      const themeVariant = activeTheme === "dark" ? "dark" : "light";
      img.src =
        img.dataset[
          `theme${themeVariant.charAt(0).toUpperCase() + themeVariant.slice(1)}`
        ];
    });

    browserAPI.storage.local.set({ theme });
  }

  // Load saved theme
  try {
    const { theme } = await browserAPI.storage.local.get("theme");
    if (theme) {
      setTheme(theme);
    }
  } catch (error) {
    console.error("Error loading theme:", error);
  }

  // Theme button listeners
  ["light", "dark", "system"].forEach((theme) => {
    document
      .getElementById(`${theme}Theme`)
      .addEventListener("click", () => setTheme(theme));
  });

  // Status message handling
  function showStatus(message, type = "success") {
    const statusEl = document.getElementById("statusMessage");
    statusEl.textContent = message;
    statusEl.className = `status-message status-${type}`;
    statusEl.style.display = "block";
    setTimeout(() => {
      statusEl.style.display = "none";
    }, 3000);
  }

  // Initialize default domains if not already set
  try {
    const { initialized } = await browserAPI.storage.local.get("initialized");
    if (!initialized) {
      for (const domain of DEFAULT_DOMAINS) {
        await browserAPI.storage.local.set({
          [`patterns_${domain.domain}`]: {
            match: domain.match,
            replace: domain.replace,
          },
        });
      }
      await browserAPI.storage.local.set({
        initialized: true,
        activeDomains: DEFAULT_DOMAINS.map((d) => d.domain),
      });
    }
  } catch (error) {
    console.error("Error initializing default domains:", error);
    showStatus("Error initializing default domains", "error");
  }

  // Update domains list
  async function updateDomainsList() {
    const domainsList = document.getElementById("domainsList");
    try {
      const { activeDomains = [] } =
        await browserAPI.storage.local.get("activeDomains");

      domainsList.innerHTML = "";

      if (!activeDomains.length) {
        domainsList.innerHTML = `
              <div class="empty-state">
                  No domains added yet. Add a domain to start creating redirect rules.
              </div>
          `;
        return;
      }

      for (const domain of activeDomains) {
        const { [`patterns_${domain}`]: patterns } =
          await browserAPI.storage.local.get(`patterns_${domain}`);
        if (!patterns) continue;

        const domainGroup = document.createElement("div");
        domainGroup.className = "domain-group";

        const currentTheme =
          document.documentElement.getAttribute("data-theme") === "dark"
            ? "dark"
            : "light";

        domainGroup.innerHTML = `
              <div class="domain-header">
                  <div class="domain-name">
                      <img src="icons/actions/expand-${currentTheme}.png" alt="Expand" class="expand-icon icon"
                          data-theme-light="icons/actions/expand-light.png"
                          data-theme-dark="icons/actions/expand-dark.png">
                      ${domain}
                  </div>
                  <div class="actions">
                      <button class="edit-btn">
                          <img src="icons/actions/edit-${currentTheme}.png" alt="Edit" class="icon"
                              data-theme-light="icons/actions/edit-light.png"
                              data-theme-dark="icons/actions/edit-dark.png">
                          <span class="sr-only">Edit</span>
                      </button>
                      <button class="danger remove-btn">
                          <img src="icons/actions/remove-${currentTheme}.png" alt="Remove" class="icon"
                              data-theme-light="icons/actions/remove-light.png"
                              data-theme-dark="icons/actions/remove-dark.png">
                          <span class="sr-only">Remove</span>
                      </button>
                  </div>
              </div>
              <div class="domain-content">
                  <div class="pattern-group">
                      <div class="pattern-label">Match Pattern</div>
                      <div class="pattern-value">${patterns.match}</div>
                  </div>
                  <div class="pattern-group">
                      <div class="pattern-label">Replace Pattern</div>
                      <div class="pattern-value">${patterns.replace}</div>
                  </div>
              </div>
          `;

        // Add event listeners
        const header = domainGroup.querySelector(".domain-header");
        const content = domainGroup.querySelector(".domain-content");

        header.addEventListener("click", (e) => {
          if (!e.target.closest(".actions")) {
            header.classList.toggle("expanded");
            content.classList.toggle("expanded");
          }
        });

        domainGroup
          .querySelector(".remove-btn")
          .addEventListener("click", () => removeDomain(domain));
        domainGroup
          .querySelector(".edit-btn")
          .addEventListener("click", () => editDomain(domain, patterns));

        domainsList.appendChild(domainGroup);
      }
    } catch (error) {
      console.error("Error updating domains list:", error);
      showStatus("Error loading domains", "error");
    }
  }

  // Add domain
  async function addDomain(domain, match, replace) {
    try {
      const { activeDomains = [] } =
        await browserAPI.storage.local.get("activeDomains");

      await browserAPI.storage.local.set({
        [`patterns_${domain}`]: { match, replace },
        activeDomains: [...new Set([...activeDomains, domain])],
      });

      showStatus("Domain added successfully");
      updateDomainsList();
      return true;
    } catch (error) {
      console.error("Error adding domain:", error);
      showStatus("Error adding domain", "error");
      return false;
    }
  }

  // Remove domain
  async function removeDomain(domain) {
    try {
      const { activeDomains = [] } =
        await browserAPI.storage.local.get("activeDomains");
      await browserAPI.storage.local.remove(`patterns_${domain}`);
      await browserAPI.storage.local.set({
        activeDomains: activeDomains.filter((d) => d !== domain),
      });
      showStatus("Domain removed successfully");
      updateDomainsList();
    } catch (error) {
      console.error("Error removing domain:", error);
      showStatus("Error removing domain", "error");
    }
  }

  // Edit domain
  function editDomain(domain, patterns) {
    document.getElementById("newDomain").value = domain;
    document.getElementById("matchPattern").value = patterns.match;
    document.getElementById("replacePattern").value = patterns.replace;
  }

  // Form handlers
  document.getElementById("addDomain").addEventListener("click", async () => {
    const domain = document.getElementById("newDomain").value.trim();
    const match = document.getElementById("matchPattern").value.trim();
    const replace = document.getElementById("replacePattern").value.trim();

    if (!domain || !match || !replace) {
      showStatus("Please fill in all fields", "error");
      return;
    }

    if (await addDomain(domain, match, replace)) {
      document.getElementById("newDomain").value = "";
      document.getElementById("matchPattern").value = "";
      document.getElementById("replacePattern").value = "";
    }
  });

  document.getElementById("resetForm").addEventListener("click", () => {
    document.getElementById("newDomain").value = "";
    document.getElementById("matchPattern").value = "";
    document.getElementById("replacePattern").value = "";
    showStatus("Form reset successfully");
  });

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (document.documentElement.getAttribute("data-theme") === "system") {
        setTheme("system");
      }
    });

  // Initial load
  updateDomainsList();
});