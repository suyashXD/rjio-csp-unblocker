self.importScripts('context.js');

const state = () => chrome.storage.local.get({
  'enabled': false,
  'csp-1': true,
  'csp-2': true,
  'csp-3': true,
  'csp-4': true
}, prefs => {
  const o = {
    enableRulesetIds: [],
    disableRulesetIds: []
  };

  if (prefs.enabled) {
    console.log('Setting icon to:', 'data/icons/icon128.png');
    chrome.action.setIcon({
      path: {
        128: 'data/icons/icon128.png'
      }
    });
    o[prefs['csp-1'] ? 'enableRulesetIds' : 'disableRulesetIds'].push('csp-1');
    o[prefs['csp-2'] ? 'enableRulesetIds' : 'disableRulesetIds'].push('csp-2');
    o[prefs['csp-3'] ? 'enableRulesetIds' : 'disableRulesetIds'].push('csp-3');
    o[prefs['csp-4'] ? 'enableRulesetIds' : 'disableRulesetIds'].push('csp-4');
  } else {
    o.disableRulesetIds = ['csp-1', 'csp-2', 'csp-3', 'csp-4'];
    console.log('Setting icon to:', 'data/icons/icon128.png');
    chrome.action.setIcon({
      path: {
        128: 'data/icons/icon128.png'
      }
    });
  }

  chrome.declarativeNetRequest.updateEnabledRulesets(o);
});
state();

chrome.storage.onChanged.addListener(ps => {
  if (ps.enabled || ps['csp-1'] || ps['csp-2'] || ps['csp-3'] || ps['csp-4']) {
    state();
  }
});

chrome.action.onClicked.addListener(() => chrome.storage.local.get({
  enabled: false
}, prefs => chrome.storage.local.set({
  enabled: !prefs.enabled
})));

const { management, runtime: { onInstalled, getManifest }, storage, tabs } = chrome;
if (navigator.webdriver !== true) {
  const { name, version } = getManifest();
  onInstalled.addListener(({ reason, previousVersion }) => {
    management.getSelf(({ installType }) => installType === 'normal' && storage.local.get({
      'faqs': true,
      'last-update': 0
    }, prefs => {
      const doUpdate = (Date.now() - prefs['last-update']) / 1000 / 60 / 60 / 24 > 45;
      if ((reason === 'install' || (prefs.faqs && reason === 'update')) && doUpdate) {
        tabs.query({ active: true, currentWindow: true }, tbs => tabs.create({
          url: `https://google.com?version=${version}${previousVersion ? `&p=${previousVersion}` : ''}&type=${reason}`,
          active: reason === 'install',
          ...(tbs && tbs.length && { index: tbs[0].index + 1 })
        }));
        storage.local.set({ 'last-update': Date.now() });
      }
    }));
  });
}
