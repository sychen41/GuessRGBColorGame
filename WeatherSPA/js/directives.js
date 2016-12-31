weatherApp.directive('weatherReport', function(){
    return {
        restrict: 'E',
        templateUrl: 'directives/weatherReport.htm',
        replace: true,
        scope: {
            weatherDay: '=', //pass a object
            convertToStandard1: '&',//pass a function
            convertToStandard2: '&',
            convertToDate: '&',
            dateFormat: '@' //pass a string
        }
    }
});