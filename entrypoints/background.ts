export default defineBackground(() => {
  // Mengizinkan sidepanel terbuka saat ikon diklik
  browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});
