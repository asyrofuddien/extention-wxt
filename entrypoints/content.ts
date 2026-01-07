export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  main() {
    console.log('Aforsy - YouTube AI Sidekick Content Script Active');

    // Mendengarkan pesan dari Side Panel
    browser.runtime.onMessage.addListener((message) => {
      console.log('Content script received message:', message);

      if (message.action === 'JUMP_TO_TIMESTAMP' && typeof message.seconds === 'number') {
        console.log('Attempting to jump to:', message.seconds);
        const video = document.querySelector('video');
        console.log('Video element found:', !!video);

        if (video) {
          console.log('Current time before jump:', video.currentTime);
          video.currentTime = message.seconds;
          video.play();
          console.log('Current time after jump:', video.currentTime);
        } else {
          console.error('Video element not found on page');
        }
      }
    });
  },
});
