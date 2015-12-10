app.controller('SignupController', function($scope, AuthFactory){
	$scope.signup =function(){
		AuthFactory.signup($scope.user)
	}
});