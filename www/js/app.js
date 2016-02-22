
angular.module('ionicspotify', ['ionic', 'ionicspotify.controllers', 'ngCordova', 'ngCordovaOauth', 'spotify'])

  .constant('spotifySetting', {
    clientId: '912ff53170b941929e9e19b6bad4a71a',
    scope: 'playlist-read-private playlist-read-collaborative user-follow-modify user-follow-read user-library-read user-read-email',
  })

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {

      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, SpotifyProvider, spotifySetting) {

    SpotifyProvider.setClientId(spotifySetting.clientId);
    SpotifyProvider.setRedirectUri('http://localhost:8100/templates/callback.html');
    SpotifyProvider.setScope(spotifySetting.scope);

    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
          }
        }
      })

      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html',
            controller: 'SearchCtrl'
          }
        }
      })

      .state('app.followed-artists', {
        url: '/followed-artists',
        views: {
          'menuContent': {
            templateUrl: 'templates/followed-artists.html',
            controller: 'FollowedArtistsCtrl'
          }
        }
      })
      .state('app.playlists', {
        url: '/playlists',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlists.html',
            controller: 'PlaylistsCtrl'
          }
        }
      })

      .state('app.single', {
        url: '/playlists/:playlistId/:userId/:playlistName',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlist.html',
            controller: 'PlaylistCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/app/login');
  });
