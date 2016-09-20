define(function() {
    
   return ['$rootScope', '$state', 'AuthenticationService', function($rootScope, $state, AuthenticationService) {
      $rootScope.$on('$stateChangeStart', function(event, toState) {
         var requireLogin = toState.data['requireLogin'];

         if(requireLogin) {
            var username = localStorage.getItem('username');
            var token = localStorage.getItem('token');

            AuthenticationService.checkToken(username, token, function() {
               event.preventDefault();
               $state.go('home');
            });
         }
      });
   }];
    
});