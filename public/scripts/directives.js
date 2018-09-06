(function(){
angular.module('app')
.directive('record', record);

function record() {
    return{
        scope : {
            records : "="
        },
        templateUrl: 'templates/record.html',

    }
};

})();