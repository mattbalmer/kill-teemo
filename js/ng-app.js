var app = angular.module('kill-teemo', []);

app.controller('Game', function($scope) {
    $scope.cursorEnabled = true;

    $scope.canvasClasses = {
        cursorEnabled: !!$scope.cursorEnabled
    };
});