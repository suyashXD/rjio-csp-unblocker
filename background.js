chrome.webRequest.onHeadersReceived.addListner(
    (details) => {
        const url = new url(details.url);

        if (url.hostname.startsWith("") || url.hostname.match(/bmc-/)) {
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