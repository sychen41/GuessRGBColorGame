weatherApp.controller('homeController', ['$scope', '$location', 'cityService', function($scope, $location, cityService) {
    $scope.city = cityService.city;
    $scope.$watch('city', function() {
        cityService.city = $scope.city;
    });
    $scope.submit = function() {
        $location.path('/forecast'); //will be received by routes.js
    };
}]);

weatherApp.controller('forecastController', ['$scope', '$routeParams', 'cityService', 'weatherService', 
                       function($scope, $routeParams, cityService, weatherService) {
    $scope.city = cityService.city;
    $scope.days = $routeParams.days || '2';
    $scope.weatherResult = weatherService.weatherAPI().get({q:$scope.city, cnt: $scope.days});
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
