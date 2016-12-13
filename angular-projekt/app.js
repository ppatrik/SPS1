'use strict';

(function(angular) {

	var app = angular.module('AplikaciaSPS', []);

	app.controller('NasaStranka', ['$scope', '$http', function($scope, $http) {
		
		// obsluzny kod pre html
		$scope.model = {
			meno: 'Patrik'
		};
		
	}]);
	
	app.controller('Komentare', ['$scope', function($scope){
		
		$scope.komentare = [];
		$scope.komentare.push({
			Meno: 'Patrik',
			Komentar: 'Ide vam to?'
		});
		$scope.komentare.push({
			Meno: 'Jakub',
			Komentar: 'Ta ne'
		});
		
		$scope.novyKomentar = {
			Meno: '',
			Komentar: ''
		};
		
		$scope.odosli = function () {
			// zapiseme do komentare novy komentar
			$scope.komentare.push($scope.novyKomentar);
			// zresetujeme formular
			$scope.novyKomentar = {
				Meno: '',
				Komentar: ''
			};
		};
		
	}]);
	
})(angular);
