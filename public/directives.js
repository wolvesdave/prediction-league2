// DIRECTIVES
predictionApp.directive("userSummary", function() {
   return {
       restrict: 'E',
       templateUrl: 'directives/userSummary.html',
       replace: true,
       scope: {
            user: "=",
            round: "=",
            month: "="
       }
   }
});

predictionApp.directive("predictionList", function() {
   return {
       restrict: 'E',
       templateUrl: 'directives/predictionList.html',
       replace: true,
       scope: {
           predictions: "="
       }
   }
});

predictionApp.directive("predictionTable", function() {
   return {
       restrict: 'E',
       templateUrl: 'directives/predictionTable.html',
       replace: true,
       scope: {
           email: "=",
           round: "=",
           month: "=",
           users: "="
      }
   }
});
