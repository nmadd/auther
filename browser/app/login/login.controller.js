app.controller('LoginController', function($scope, AuthFactory){
	$scope.login =function(){
		AuthFactory.login($scope.user)
	}
});