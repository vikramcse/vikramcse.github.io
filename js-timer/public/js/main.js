(function() {
  'use strict';

  // First check if service worker is available or not.
  if (!navigator.serviceWorker) {
    console.log('Service wroker not supported in your browser :(');
    return;
  }

  // Then register Service Worker
  navigator.serviceWorker.register('./sw.js')
    .then(function(reg) {
      console.log('registration successful :)');
    })
    .catch(function(err) {
      console.log("Service worker registration failed : ", err);
    });
})();
