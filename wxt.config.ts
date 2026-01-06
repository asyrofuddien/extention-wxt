import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: 'Aforsy - YouTube AI Sidekick',
    permissions: ['sidePanel', 'activeTab', 'scripting'],
    host_permissions: ['*://*.youtube.com/*'],
    action: {}, // Diperlukan untuk men-trigger sidepanel (opsional jika auto-open)
    side_panel: {
      default_path: 'entrypoints/sidepanel/index.html',
    },
  },
});
