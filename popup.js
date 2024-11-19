// popup.js
document.addEventListener('DOMContentLoaded', () => {
  const status = document.getElementById('status');
  const domainsList = document.getElementById('domainsList');
  
  function updateDomainsList(domains) {
    domainsList.innerHTML = '';
    domains.forEach(domain => {
      const item = document.createElement('div');
      item.className = 'domain-item';
      item.innerHTML = `
        <span>${domain}</span>
        <button class="remove-btn">Remove</button>
      `;
      
      item.querySelector('.remove-btn').addEventListener('click', () => {
        removeDomain(domain);
      });
      
      domainsList.appendChild(item);
    });
  }

  function addDomain(domain) {
    browser.storage.local.get('activeDomains')
      .then(result => {
        const domains = new Set(result.activeDomains || []);
        domains.add(domain);
        return browser.storage.local.set({
          activeDomains: Array.from(domains)
        });
      })
      .then(() => {
        document.getElementById('newDomain').value = '';
        loadDomains();
      });
  }

  function removeDomain(domain) {
    browser.storage.local.get('activeDomains')
      .then(result => {
        const domains = new Set(result.activeDomains || []);
        domains.delete(domain);
        return browser.storage.local.set({
          activeDomains: Array.from(domains)
        });
      })
      .then(loadDomains);
  }

  function loadDomains() {
    browser.storage.local.get('activeDomains')
      .then(result => {
        updateDomainsList(result.activeDomains || []);
      });
  }

  // Load saved settings
  browser.storage.local.get(['matchPattern', 'replacePattern'])
    .then((result) => {
      document.getElementById('matchPattern').value = result.matchPattern || '';
      document.getElementById('replacePattern').value = result.replacePattern || '';
    });

  loadDomains();

  // Add domain
  document.getElementById('addDomain').addEventListener('click', () => {
    const domain = document.getElementById('newDomain').value.trim();
    if (domain) {
      addDomain(domain);
    }
  });

  // Save patterns
  document.getElementById('saveButton').addEventListener('click', () => {
    const matchPattern = document.getElementById('matchPattern').value;
    const replacePattern = document.getElementById('replacePattern').value;
    
    browser.storage.local.set({
      matchPattern,
      replacePattern
    })
    .then(() => {
      status.style.display = 'block';
      setTimeout(() => {
        status.style.display = 'none';
      }, 2000);
    });
  });
});