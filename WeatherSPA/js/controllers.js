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
    var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?appid=fb667e32eb6a1b247b8463c26b2dedec&cnt=' + $scope.days + '&q=' + $scope.city;
    //console.log(url);
    
    if ('caches' in window) {
        caches.match(url).then(function(response) {
            if(response) {
                response.json().then(function updateFromCache(json) {
                    $scope.weatherResult = json;
                });
            } else {
                $scope.fetchingFromAPI = true;
                $scope.message = 'no data found in cache, checking weather API for you...'
            }
        });
    }
    weatherService.weatherAPI(url)
        .then(function(res){
            $scope.fetchingFromAPI = false;
            $scope.weatherResult = res.data;
        });
    //$scope.weatherResult = weatherService.weatherAPI().get({q:$scope.city, cnt: $scope.days});
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
