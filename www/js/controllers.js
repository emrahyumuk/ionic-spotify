angular.module('ionicspotify.controllers', [])

  .controller('AppCtrl', function ($scope) {

  })

  .controller('LoginCtrl', function ($scope, $rootScope, $state, $ionicHistory, $cordovaOauth, Spotify, spotifySetting) {

    $scope.loginFromBrowser = function () {
      Spotify.login().then(function () {
        var token = window.localStorage.getItem('spotify-token');
        $scope.completeLogin(token);
      });
    };

    $scope.loginFromCordova = function () {
      var scopeArray = spotifySetting.scope.split(' ');
      $cordovaOauth.spotify(spotifySetting.clientId, scopeArray).then(function (result) {
        window.localStorage.setItem('spotify-token', result.access_token);
        $scope.completeLogin(result.access_token);
      }, function (error) {
        console.log("Error -> " + error);
      });
    };

    $scope.completeLogin = function (token) {

      Spotify.setAuthToken(token);

      Spotify.getCurrentUser().then(function (data) {
        $rootScope.userId = data.id;

        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $state.go('app.playlists', {}, {location: 'replace'});
      });

    };

    $scope.login = function () {
      if (ionic.Platform.isWebView())
        $scope.loginFromCordova();
      else
        $scope.loginFromBrowser();
    };

    ionic.Platform.ready(function () {
      var token = window.localStorage.getItem('spotify-token');
      if (token !== null) {
        $scope.completeLogin(token);
      }
    });

  })

  .controller('PlaylistsCtrl', function ($scope, $rootScope, Spotify) {

    $scope.getUserPlaylists = function () {
      Spotify.getUserPlaylists($rootScope.userId).then(function (data) {
        $scope.playlists = data.items;
      });
    };

    ionic.Platform.ready(function () {
      $scope.getUserPlaylists();
    });

  })

  .controller('PlaylistCtrl', function ($scope, $stateParams, Spotify) {

    $scope.listname = $stateParams.listname;

    $scope.audio = new Audio();

    $scope.getPlaylist = function () {
      Spotify.getPlaylist($stateParams.userId, $stateParams.playlistId).then(function (data) {
        $scope.tracks = data.tracks.items;
      });
    };

    $scope.playTrack = function (trackInfo) {
      $scope.audio.src = trackInfo.track.preview_url;
      $scope.audio.play();
    };

    $scope.openSpotify = function (link) {
      window.open(link, '_blank', 'location=yes');
    };

    $scope.stop = function () {
      if ($scope.audio.src) {
        $scope.audio.pause();
      }
    };

    $scope.play = function () {
      if ($scope.audio.src) {
        $scope.audio.play();
      }
    };

    ionic.Platform.ready(function () {
      $scope.getPlaylist();
    });
  })
  .controller('SearchCtrl', function ($scope, Spotify) {
    $scope.query = "";
    $scope.search = function (query) {
      Spotify.search(query, 'artist').then(function (data) {
        $scope.results = data.artists.items;
      });
    };
  })
  .controller('FollowedArtistsCtrl', function ($scope, Spotify) {

    $scope.getFollowedArtists = function () {
      Spotify.following('artist', {limit: 50}).then(function (data) {
        $scope.artists = data.artists.items;
      });
    };

    ionic.Platform.ready(function () {
      $scope.getFollowedArtists();
    });
  });




