import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: 'Aforsy - YouTube AI Sidekick',
    version: '0.0.1',
    description: 'Your smart YouTube AI companion. Created by Muhammad Asyrofuddien.',
    permissions: ['sidePanel', 'activeTab', 'scripting'],
    host_permissions: [
      '*://*.youtube.com/*',
      'http://146.190.107.186:3500/*', // Ganti dengan URL backend Anda
      // 'https://api.my-app.com/*' // Jika sudah deploy production
    ],
    action: {}, // Diperlukan untuk men-trigger sidepanel (opsional jika auto-open)
    side_panel: {
      default_path: 'entrypoints/sidepanel/index.html',
    },
  },
});
