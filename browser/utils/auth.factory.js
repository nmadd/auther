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
		return $http({
			method: "GET",
			url: "/api/users/me"
		})
		.then(function (res) {
			currentUser = res.data;
		})
	}

	return AuthFactory;
})

// 266120484855-qj7nc0ffprs19saq1sn7q9irnlnco84t.apps.googleusercontent.com

// client secret: 3bjpe6XzGq3cOWI4arTH-YpF