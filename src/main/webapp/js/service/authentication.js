myApp.factory('authentication', ['$rootScope', '$firebaseObject', '$firebaseAuth', '$location', 'FIREBASE_URL',
	function($rootScope, $firebaseObject, $firebaseAuth, $location, firebase_url) {
		var myObject = {
			login: function(user) {
				firebase.auth().signInWithEmailAndPassword(
					user.email,
					user.password
				).then(function(regUser) {
					if (regUser) {
						var userRef = firebase.database().ref('users/' + regUser.uid);
						userRef.on('value', function(user) {
							$rootScope.currentUser = user.val();
						});
					} else {
						$rootScope.currentUser = '';
					}
					$location.path("/success");
				}).catch(function(error) {
					$rootScope.message = error.message;
				});
			},

			logout: function() {
				return firebase.auth().signOut().then(function() {
					$rootScope.currentUser = '';
					$rootScope.message = "Logged out successfully";
				}, function(error) {
					$rootScope.message = error.message;
				});
			},

			register: function(user) {
				firebase.auth().createUserWithEmailAndPassword(
					user.email,
					user.password
				).then(function(regUser) {
					var registration = {
						date: firebase.database.ServerValue.TIMESTAMP,
						firstname: user.firstName,
						lastname: user.lastName,
						email: user.email
					}
					firebase.database().ref('users/' + regUser.uid).set(registration);
					myObject.login(user);
				}).catch(function(error) {
					$rootScope.message = error.message;
				})
			}, // createUser

			requireAuth: function() {
					firebase.auth().onAuthStateChanged(function(user) {
						if (!user) {
							throw "AUTH_REQUIRED";
						} else {
							var userRef = firebase.database().ref('users/' + user.uid);
							userRef.on('value', function(user) {
								$rootScope.currentUser = user.val();
								$rootScope.$apply();
							});
						}
					});
				} // require authentication
		};

		return myObject;
	}
]); // controller