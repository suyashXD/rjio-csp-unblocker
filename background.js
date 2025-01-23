chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed: Ready to dynamically bypass CSP");
  });
  
  chrome.storage.onChanged.addListener(async (changes, area) => {
    if (area === "local" && changes.enabledDomains) {
      const enabledDomains = changes.enabledDomains.newValue || [];
      await updateCspBypassRules(enabledDomains);
    }
  });
  
  async function updateCspBypassRules(enabledDomains) {
    const rules = enabledDomains.map((domain, index) => ({
      id: index + 1,
      priority: 1,
      action: {
        type: "modifyHeaders",
        responseHeaders: [
          { header: "Content-Security-Policy", operation: "remove" }
        ]
      },
      condition: {
        urlFilter: `*://${domain}/*`,
        resourceTypes: ["main_frame"]
      }
    }));
  
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rules.map((rule) => rule.id),
      addRules: rules
    });
  
    console.log("CSP bypass rules updated for domains:", enabledDomains);
  }
  