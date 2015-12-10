app.factory('AuthFactory', function($http, $state){
	var AuthFactory = {}

	AuthFactory.signup = function(user){
		$http({
			method: "POST",
			url: "/api/users",
			data: user
		})
		.then(function (res) {
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
				$state.go('home');
			}
		})
	};

	return AuthFactory;
})