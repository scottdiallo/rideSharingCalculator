var app = angular.module('waitstaff', ['ngAnimate', 'ngRoute']);

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

app.service('mealDataService', function () {
    //empty arrays for meals
    var meals = [];

    //cumulative data object
    var cumulativeData = {
        mealCount: 0,
        tipTotal: 0,
        tipAvg: 0
    };


    return {
        addMeal: function (meal) {
            meals.push(meal);
            cumulativeData.mealCount++;
            cumulativeData.tipTotal += meal.tip;
            cumulativeData.tipAvg = (cumulativeData.tipTotal / cumulativeData.mealCount);
        },
        getMeals: function () {
            return meals;
        },
        getCumulativeData: function () {
            return cumulativeData;
        },
        resetAll: function () {
            meals.length = 0;
            cumulativeData = {
                mealCount: 0,
                tipTotal: 0,
                tipAvg: 0
            };
        }
    };
});

app.controller('detailsController', function ($scope, mealDataService) {
    $scope.mealCount = 1;
    //get the current meal count when naviating from other view
    $scope.getMealCounts = function () {
        var meals = mealDataService.getMeals();
        console.log(meals);
        if (typeof meals != "undefined" && meals !== null && meals.length > 0) {
            $scope.mealCount = meals.length + 1;
        }
    };

    $scope.getMealCounts();

    //Clears form for next meal
    $scope.cancelForm = function () {
        $scope.price = '';
        $scope.tax = '';
        $scope.tip = '';
    };

    //Add the meal when 'Add Meal' Is clicked
    $scope.addTransaction = function () {
        $scope.mealCount++;
        var price = parseFloat($scope.price);
        var tax = parseFloat($scope.tax);
        var tip = parseFloat($scope.tip);

        //collecting data form current meal prior to sending to service array
        $scope.currentSubtotal = price + (price * (tax / 100));

        //the tip is not including the tax
        $scope.currentTip = price * (tip / 100);
        $scope.currentTotal = $scope.currentSubtotal + $scope.currentTip;

        //sending current meal to array of meals in service
        var meal = {
            subtotal: $scope.currentSubtotal,
            tip: $scope.currentTip,
            total: $scope.currentTotal
        };
        console.log(meal);
        mealDataService.addMeal(meal);

        //clearing fields for next meal input
        $scope.cancelForm();
    };

});

app.controller('chargesController', function ($scope, mealDataService) {
    $scope.getMeals = function () {
        var meals = mealDataService.getMeals();
        $scope.meals = meals;
        // console.log($scope.meals);
    };

    $scope.getMeals();

    $scope.mealCount = $scope.meals.length;

    $scope.avoidZero = function () {
        if ($scope.mealCount === 0) {
            $scope.mealCount = 1;
        }
    };

    $scope.avoidZero();

    //back button functionality on click - navigates all meals added
    $scope.back = function () {
        // console.log($scope.mealCount);
        if ($scope.mealCount > 1) {
            $scope.mealCount--;
        }
    };

    // forward button functionality on click - navigates all meals added
    $scope.forward = function () {
        // console.log($scope.mealCount);
        if ($scope.mealCount < $scope.meal.length) {
            $scope.mealCount++;
        }
    };

});

app.controller('earningsController', function ($scope, mealDataService) {
    $scope.tipTotal = mealDataService.getCumulativeData().tipTotal;
    $scope.mealCount = mealDataService.getCumulativeData().mealCount;
    $scope.tipAvg = mealDataService.getCumulativeData().tipAvg;
});

app.controller('resetCtrl', function ($scope, mealDataService) {
    //When click reset btn
    $scope.resetAll = function () {
        mealDataService.resetAll();
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



//myApp.controller('waitCtrl', ['$scope', function ($scope) {
//
//    $scope.resetDetails = function () {
//        $scope.mealPrice = '';
//        $scope.taxRate = '';
//        $scope.tipPercentage = '';
//    };
//
//    $scope.initCharges = function () {
//        $scope.subtotal = 0;
//        $scope.tip = 0;
//        $scope.total = 0;
//    };
//
//    $scope.initEarnings = function () {
//        $scope.tipTotal = 0;
//        $scope.mealCount = 0;
//    };
//
//    $scope.init = function () {
//        $scope.formError = "";
//        $scope.resetDetails();
//        $scope.initCharges();
//        $scope.initEarnings();
//    };
//
//    $scope.init();
//
//    $scope.submitDetails = function () {
//        if ($scope.enterPriceForm.$invalid) {
//            $scope.formError = "Please enter valid values ";
//        } else {
//            $scope.formError = "";
//            $scope.tipTotal += $scope.tip;
//            $scope.mealCount++;
//        }
//    };
//
//    $scope.$watchGroup(['mealPrice', 'taxRate', 'tipPercentage'], function (newValues, oldValues, scope) {
//        if ($scope.enterPriceForm.$invalid) {
//            $scope.initCharges();
//
//        } else {
//            $scope.formError = "";
//            $scope.subtotal = $scope.mealPrice + ($scope.mealPrice * ($scope.taxRate / 100));
//            $scope.tip = $scope.mealPrice * ($scope.tipPercentage / 100);
//            $scope.total = $scope.subtotal + $scope.tip;
//        }
//    });
//
//    $scope.$watchGroup(['tipTotal', 'mealCount'], function (newValues, oldValues, scope) {
//        if ($scope.mealCount != 0) {
//            $scope.avgTipPerMeal = $scope.tipTotal / $scope.mealCount;
//        } else {
//            $scope.avgTipPerMeal = 0;
//        }
//
//    });
//
//
//
//
//}]);
