app.factory('AuthFactory', function($http, $state){
	var AuthFactory = {}

	var currentUser;

	AuthFactory.signup = function(user){
		$http({
			method: "POST",
			url: "/api/users",
			data: user
		})
		.then(function (res) {
			currentUser = res.data;
			$state.go('home');
		})
	};

	AuthFactory.login = function(user){
		$http({
			method: "POST",
			url: "/api/users/login",
			data: user
		})
		.then(function (res) {
			if (res.status === 200) {
				currentUser = res.data;
				$state.go('home');
			}
		})
	};

	AuthFactory.getCurrentUser = function(){
		return currentUser;
	}

	AuthFactory.setCurrentUser = function(){
		$http({
			method: "GET",
			url: "/api/users/me"
		})
		.then(function (res) {
				currentUser = res.data;
		})
	}

	return AuthFactory;
})