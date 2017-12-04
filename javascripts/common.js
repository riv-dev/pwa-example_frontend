var requestURL = "https://api.kenle.info/pwa-example/api/announcement";

$(function() {
    //1. Get the cached response for cache-then-network strategy
    if ('caches' in window) {
        caches.match(requestURL).then(function(response) {
          if (response) {
            //Process the cached resposne with response.json() to return the data
            response.json().then(function (data) {
              $( "p.announcement" ).html(data.message + " (this is from cache!!!)");
            });
          }
        });
    }

    //2. Get the update-to-date data with cache-then-nework strategy
    $.getJSON(requestURL, function(data) {
        $( "p.announcement" ).html(data.message);
    });
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
} else {
    console.log('Service Worker not Supported');
}