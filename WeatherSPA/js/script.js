// Service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('../service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
}
// MODULE
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

//Routes in routes.js

//Services in services.js

//CONTROLLERS in controllers.js

//Directives in directives.js
