app.controller('LoginController', function($scope, AuthFactory, $rootScope){
	$scope.login =function(){
		AuthFactory.login($scope.user)
	}
	$rootScope.currentUser = AuthFactory.getCurrentUser;
});