// Detecta cuando Chrome arranca
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get("savedTabs", (data) => {
    if (data.savedTabs && data.savedTabs.length > 0) {
      // Guardamos la lista en memoria temporal del service worker
      chrome.storage.local.set({ pendingRestore: true });
      
      // Mostramos notificación con botones
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
});

// Maneja el clic en los botones de la notificación
chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => {
  if (notifId === "restoreTabsNotif") {
    if (btnIdx === 0) { // Sí
      chrome.storage.local.get("savedTabs", (data) => {
        if (data.savedTabs) {
          data.savedTabs.forEach(url => chrome.tabs.create({ url }));
          // Limpiamos la lista para que no pregunte de nuevo
          chrome.storage.local.remove("savedTabs");
        }
      });
    } else {
      // Si pulsa "No", simplemente no hacemos nada
    }
    chrome.notifications.clear(notifId);
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "save-tabs") {
    chrome.tabs.query({}, (tabs) => {
      const urls = tabs.map(tab => tab.url);
      chrome.storage.local.set({ savedTabs: urls }, () => {
        console.log("Pestañas guardadas con comando.");
      });
    });
  }
});
