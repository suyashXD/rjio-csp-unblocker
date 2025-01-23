document.addEventListener("DOMContentLoaded", async () => {
  const data = await chrome.storage.local.get("enabledDomains");
  const enabledDomains = data.enabledDomains || [];

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = new URL(tab.url);
  const hostname = url.hostname;

  const toggleButton = document.getElementById("toggle");
  const statusText = document.getElementById("status");

  statusText.textContent = enabledDomains.includes(hostname)
    ? "CSP bypass is ON for this site."
    : "CSP bypass is OFF for this site.";
  toggleButton.textContent = enabledDomains.includes(hostname)
    ? "Disable CSP Bypass"
    : "Enable CSP Bypass";

  toggleButton.addEventListener("click", async () => {
    let updatedDomains;

    if (enabledDomains.includes(hostname)) {
      updatedDomains = enabledDomains.filter((domain) => domain !== hostname);
    } else {
      updatedDomains = [...enabledDomains, hostname];
    }

    await chrome.storage.local.set({ enabledDomains: updatedDomains });

    statusText.textContent = updatedDomains.includes(hostname)
      ? "CSP bypass is ON for this site."
      : "CSP bypass is OFF for this site.";
    toggleButton.textContent = updatedDomains.includes(hostname)
      ? "Disable CSP Bypass"
      : "Enable CSP Bypass";

    console.log(`Updated enabled domains: ${updatedDomains}`);
  });
});
