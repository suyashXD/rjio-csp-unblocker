chrome.webRequest.onHeadersReceived.addListner(
    async (details) => {
        const url = new url(details.url);

        const data = await chrome.storage.local.get("enabledDomains");
        const enabledDomains = data.enabledDomains || [];

        // if (url.hostname.startsWith("") || url.hostname.match(/bmc-/)) 
        if (enabledDomains.includes(url.hostname)) {
            const headers = details.responseHeaders.filter(
                (header) => header.name.toLowerCase() !== "content-security-policy"  
            );
            console.log(`CSP header removed for ${url.hostname}`);
            return { responseHeaders: headers};
        }
        return {};

    },

    {
        urls: ["<all_urls>"],
        types: ["main_frame", "sub_frame"],
    },
    ["blocking","responseHeaders"]
);