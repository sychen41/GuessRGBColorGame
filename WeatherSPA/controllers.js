weatherApp.controller('homeController', ['$scope', '$location', 'cityService', function($scope, $location, cityService) {
    $scope.city = cityService.city;
    $scope.$watch('city', function() {
        cityService.city = $scope.city;
    });
    $scope.submit = function() {
        $location.path('/forecast'); //will be received by routes.js
    };
}]);

weatherApp.controller('forecastController', ['$scope', '$resource', '$routeParams', 'cityService', function($scope, $resource, $routeParams, cityService) {
    $scope.city = cityService.city;
    $scope.days = $routeParams.days || '2';
    $scope.weatherAPI = $resource('http://api.openweathermap.org/data/2.5/forecast/daily?appid=fb667e32eb6a1b247b8463c26b2dedec', {callback: 'JSON_CALLBACK'}, {get: {method: 'JSONP'}});
    $scope.weatherResult = $scope.weatherAPI.get({q:$scope.city, cnt: $scope.days});
    $scope.convertToCelsius = function(kelvin) {
        return Math.round(kelvin - 273.15);
    };
    $scope.convertToFahrenheit = function(kelvin) {
        return Math.round(1.8*(kelvin - 273.15)+32);
    };
    $scope.convertToDate = function(dt) {
        return new Date(dt*1000);
    };
    
}]);
