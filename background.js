function notifyRestoreIfNeeded() {
  chrome.storage.local.get("savedTabs", (data) => {
    if (data.savedTabs && data.savedTabs.length > 0) {
      chrome.storage.local.set({ pendingRestore: true });
      
      chrome.notifications.create("restoreTabsNotif", {
        type: "basic",
        iconUrl: "icon.png",
        title: "Restaurar pestañas guardadas",
        message: `Tienes ${data.savedTabs.length} pestañas guardadas. ¿Quieres restaurarlas?`,
        buttons: [
          { title: "Sí" },
          { title: "No" }
        ],
        priority: 2
      });
    }
  });
}

// Cuando Chrome se inicia desde cero
chrome.runtime.onStartup.addListener(notifyRestoreIfNeeded);

// Cuando se abre una nueva ventana (por si Chrome estaba en segundo plano)
chrome.windows.onCreated.addListener(notifyRestoreIfNeeded);

chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => {
  if (notifId === "restoreTabsNotif") {
    if (btnIdx === 0) { // Sí
      chrome.storage.local.get("savedTabs", (data) => {
        if (data.savedTabs) {
          data.savedTabs.forEach(url => chrome.tabs.create({ url }));
          chrome.storage.local.remove("savedTabs");
        }
      });
    }
    chrome.notifications.clear(notifId);
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "save-tabs") {
    chrome.tabs.query({}, (tabs) => {
      const urls = tabs.map(tab => tab.url);
      chrome.storage.local.set({ savedTabs: urls }, () => {
        chrome.notifications.create("tabsSavedNotif", {
          type: "basic",
          iconUrl: "icon.png",
          title: "SessionKeeper",
          message: "✅ Pestañas guardadas",
          priority: 2
        }, (notifId) => {
          setTimeout(() => {
            chrome.notifications.clear(notifId);
          }, 1000);
        });
      });
    });
  }
});
