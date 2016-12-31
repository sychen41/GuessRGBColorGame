weatherApp.service('cityService', function(){
    this.city = 'Newark, Delaware';
});

weatherApp.service('weatherService', ['$resource', '$http', function($resource, $http){
    this.weatherAPI = function(url) {
        return $http.get(url);
        //return $resource('http://api.openweathermap.org/data/2.5/forecast/daily?appid=fb667e32eb6a1b247b8463c26b2dedec', 
        //                        {callback: 'JSON_CALLBACK'}, {get: {method: 'JSONP'}});
    };
}]);