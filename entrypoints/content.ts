export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  main() {
    console.log('Aforsy - YouTube AI Sidekick Content Script Active');

    // Mendengarkan pesan dari Side Panel
    browser.runtime.onMessage.addListener((message) => {
      if (message.action === 'JUMP_TO_TIMESTAMP' && typeof message.seconds === 'number') {
        const video = document.querySelector('video');
        if (video) {
          video.currentTime = message.seconds;
          video.play();
        }
      }
    });
  },
});
