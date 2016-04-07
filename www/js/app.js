var sj311 = angular.module('starter', ['ionic', 'ngCordova', 'firebase'])

sj311.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
sj311.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  .state('tab.calendar', {
    url: '/calendar',
    views: {
      'tab-calendar': {
        templateUrl: 'templates/tab-calendar.html',
        controller: 'CalendarCtrl'
      }
    }
  })
  .state('tab.new', {
      url: '/new',
      views: {
        'tab-new': {
          templateUrl: 'templates/tab-new.html',
          controller: 'NewCtrl'
        }
      }
    })
  .state('tab.status', {
      url: '/status',
      views: {
        'tab-status': {
          templateUrl: 'templates/tab-status.html',
          controller: 'StatusCtrl'
        }
      }
    })
  .state('tab.contacts', {
      url: '/contacts',
      views: {
        'tab-contacts': {
          templateUrl: 'templates/tab-contacts.html',
          controller: 'ContactsCtrl'
        }
      }
    })
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });
  $urlRouterProvider.otherwise('/tab/new');
});

sj311.controller('CalendarCtrl', function($scope, $http, $state) {
    $http.get('js/calendar.json').success(function(data) {
      $scope.calendar = data.calendar;
    })
})

sj311.controller('NewCtrl', function($scope, $state, $ionicModal, $cordovaGeolocation, $firebaseObject, $firebase) {
  $scope.caseImage = 'img/default-placeholder.png';
  $ionicModal.fromTemplateUrl('templates/photo-view.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openPhotoView = function () {
    $scope.modal.show();
  };
  $scope.closePhotoView = function () {
    $scope.modal.hide();
  };
  $scope.addresses = [
        {'state': 'antigraffiti@sanjoseca.gov'},
    ];

    $scope.lov_state = [
        {'lookupCode': 'antigraffiti@sanjoseca.gov', 'description': 'Graffiti'},
        {'lookupCode': 'antigraffiti@sanjoseca.gov', 'description': 'Illegal Dumping'},
        {'lookupCode': 'outreach@homefirstscc.org', 'description': 'Homeless Outreach'},
        {'lookupCode': 'drought@valleywater.org', 'description': 'Water Waste'},
        {'lookupCode': 'TBA', 'description': 'Abandoned Carts'},
        {'lookupCode': 'antigraffiti@sanjoseca.gov', 'description': 'Littering'},
    ];
  var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
  $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      google.maps.event.addListenerOnce($scope.map, 'idle', function(){
      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });      
      var infoWindow = new google.maps.InfoWindow({
        content: "Here I am!"
      });
        google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open($scope.map, marker);
        });
      });
      },function(error){
        console.log("Could not get location");
        })

  var firebaseUrl = "https://sj311app.firebaseio.com/";
  
  var firebaseRef = new Firebase(firebaseUrl);

  // Set the URL of the link element to be the Firebase URL
  document.getElementById("firebaseRef").setAttribute("href", firebaseUrl);

  // Create a new GeoFire instance at the random Firebase location
  var geoFire = new GeoFire(firebaseRef);

  /* Uses the HTML5 geolocation API to get the current user's location */
  var getLocation = function() {
    if (typeof navigator !== "undefined" && typeof navigator.geolocation !== "undefined") {
      navigator.geolocation.getCurrentPosition(geolocationCallback, errorHandler);
    } else {
      log("Your browser does not support the HTML5 Geolocation API, so this demo will not work.")
    }
  };

  /* Callback method from the geolocation API which receives the current user's location */
  var geolocationCallback = function(location) {
    var latitude = location.coords.latitude;
    var longitude = location.coords.longitude;
    log("[" + latitude + ", " + longitude + "]");

    var location = "LatLng";
    geoFire.set(location, [latitude, longitude]).then(function() {

      // When the user disconnects from Firebase (e.g. closes the app, exits the browser),
      // remove their GeoFire entry
    }).catch(function(error) {
      log("Error adding user " + location + "'s location to GeoFire");
    });
  }

  /* Handles any errors from trying to get the user's current location */
  var errorHandler = function(error) {
    if (error.code == 1) {
      log("Error: PERMISSION_DENIED: User denied access to their location");
    } else if (error.code === 2) {
      log("Error: POSITION_UNAVAILABLE: Network is down or positioning satellites cannot be reached");
    } else if (error.code === 3) {
      log("Error: TIMEOUT: Calculating the user's location too took long");
    } else {
      log("Unexpected error code")
    }
  };

  // Get the current user's location
  getLocation();
  
  function generateRandomString(length) {
      var text = "";
      var validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for(var i = 0; i < length; i++) {
          text += validChars.charAt(Math.floor(Math.random() * validChars.length));
      }

      return text;
  }

  /* Logs to the page instead of the console */
  function log(message) {
    var childDiv = document.createElement("div");
    var textNode = document.createTextNode(message);
    childDiv.appendChild(textNode);
    document.getElementById("log").appendChild(childDiv);
  }
  //$binding 
      var ref = new Firebase("https://sj311app.firebaseio.com/");
  // download the data into a local object
      var syncObject = $firebaseObject(ref);
  // synchronize the object with a three-way data binding
  // click on `index.html` above to see it used in the DOM!
      syncObject.$bindTo($scope, "data");
})

sj311.controller('StatusCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

sj311.controller('ContactsCtrl', function($scope, $http, $state) {   
    $http.get('js/contacts.json').success(function(data) {
      $scope.contacts = data.contacts;
    })
})
sj311.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

