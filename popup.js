document.getElementById("saveTabs").addEventListener("click", () => {
  chrome.tabs.query({}, (tabs) => {
    const urls = tabs.map(tab => tab.url);
    chrome.storage.local.set({ savedTabs: urls }, () => {
      alert("✅ Pestañas guardadas");
    });
  });
});
