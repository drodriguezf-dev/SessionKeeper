document.getElementById("saveTabs").addEventListener("click", () => {
  chrome.tabs.query({}, (tabs) => {
    const urls = tabs.map(tab => tab.url);
    chrome.storage.local.set({ savedTabs: urls }, () => {
      // Crear notificación
      chrome.notifications.create("tabsSavedNotif", {
        type: "basic",
        iconUrl: "icon.png", // Usa tu icono
        title: "SessionKeeper",
        message: "✅ Pestañas guardadas",
        priority: 2
      }, (notifId) => {
        // Cerrar notificación después de 2 segundos
        setTimeout(() => {
          chrome.notifications.clear(notifId);
        }, 1500);
      });
    });
  });
});
