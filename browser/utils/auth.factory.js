app.factory('AuthFactory', function($http){
	var AuthFactory = {}

	AuthFactory.signup = function(user){
		$http({
			method: "POST",
			url: "/api/users",
			data: user
		})
	};

	AuthFactory.login = function(user){
		$http({
			method: "GET",
			url: "/api/users/login",
			data: user
		})
	};

	return AuthFactory;
})