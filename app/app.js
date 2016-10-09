var app = angular.module('rideSharingCalculator', ['ngAnimate', 'ngRoute']);

//define all routes below
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/details', {
            templateUrl: 'partials/details.html',
            controller: 'detailsController'
        })
        .when('/charges', {
            templateUrl: 'partials/charges.html',
            controller: 'chargesController'
        })
        .when('/earnings', {
            templateUrl: 'partials/earnings.html',
            controller: 'earningsController'
        })
        .otherwise({
            redirectTo: '/details'
        });
}]);

app.service('rideDataService', function () {
    //empty arrays for rides
    var rides = [];

    //cumulative data object
    var cumulativeData = {
        rideCount: 0,
        tipTotal: 0,
        tipAvg: 0
    };


    return {
        addRide: function (ride) {
            rides.push(ride);
            cumulativeData.rideCount++;
            cumulativeData.tipTotal += ride.tip;
            cumulativeData.tipAvg = (cumulativeData.tipTotal / cumulativeData.rideCount);
        },
        getRides: function () {
            return rides;
        },
        getCumulativeData: function () {
            return cumulativeData;
        },
        resetAll: function () {
            rides.length = 0;
            cumulativeData = {
                rideCount: 0,
                tipTotal: 0,
                tipAvg: 0
            };
        }
    };
});

app.controller('detailsController', function ($scope, rideDataService) {
    $scope.rideCount = 1;
    //get the current ride count when naviating from other view
    $scope.getRideCounts = function () {
        var rides = rideDataService.getRides();
        console.log(rides);
        if (typeof rides != "undefined" && rides !== null && rides.length > 0) {
            $scope.rideCount = rides.length + 1;
        }
    };

    $scope.getRideCounts();

    //Clears form for next ride
    $scope.cancelForm = function () {
        $scope.price = '';
        $scope.tax = '';
        $scope.tip = '';
        $scope.commission = '';


    };

    //Add the ride when 'Add ride' Is clicked
    $scope.addTransaction = function () {
        $scope.rideCount++;
        var price = parseFloat($scope.price);
        var tax = parseFloat($scope.tax);
        var tip = parseFloat($scope.tip);
        var commission = parseFloat($scope.commission);


        //collecting data form current ride prior to sending to service array
        $scope.currentSubtotal = price + (price * (commission / 100));

        //the tip is not including the tax
        $scope.currentTip = price * (tip / 100);
        console.log($scope.commission);
        $scope.currentTotal = ($scope.currentSubtotal + $scope.currentTip) * (1 + ($scope.commission / 100));
        //sending current ride to array of rides in service
        var ride = {
            subtotal: $scope.currentSubtotal,
            tip: $scope.currentTip,
            total: $scope.currentTotal
        };
        console.log(ride);
        rideDataService.addRide(ride);

        //clearing fields for next ride input
        $scope.cancelForm();
    };

});

app.controller('chargesController', function ($scope, rideDataService) {
    $scope.getRides = function () {
        var rides = rideDataService.getRides();
        $scope.rides = rides;
        // console.log($scope.rides);
    };

    $scope.getRides();

    $scope.rideCount = $scope.rides.length;

    $scope.avoidZero = function () {
        if ($scope.rideCount === 0) {
            $scope.rideCount = 1;
        }
    };

    $scope.avoidZero();

    //back button functionality on click - navigates all rides added
    $scope.back = function () {
        // console.log($scope.rideCount);
        if ($scope.rideCount > 1) {
            $scope.rideCount--;
        }
    };

    // forward button functionality on click - navigates all rides added
    $scope.forward = function () {
        // console.log($scope.rideCount);
        if ($scope.rideCount < $scope.rides.length) {
            $scope.rideCount++;
        }
    };

});

app.controller('earningsController', function ($scope, rideDataService) {
    $scope.tipTotal = rideDataService.getCumulativeData().tipTotal;
    $scope.rideCount = rideDataService.getCumulativeData().rideCount;
    $scope.tipAvg = rideDataService.getCumulativeData().tipAvg;
});

app.controller('resetCtrl', function ($scope, rideDataService) {
    //When click reset btn
    $scope.resetAll = function () {
        rideDataService.resetAll();
    };
});


app.controller('navCtrl', function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    $scope.classActive = function (viewLocation) {
        if ($scope.isActive(viewLocation)) {
            return 'active';
        } else {
            return 'inactive';
        }
    };
});
