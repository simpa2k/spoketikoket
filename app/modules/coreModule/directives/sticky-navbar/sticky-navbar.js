define(function() {

   var stickyNavbar = function() {

       return {
           restrict: 'E',
           replace: true,
           scope: {
               headings: '=',
               socialmedia: '='
           },
           templateUrl: 'app/modules/coreModule/directives/sticky-navbar/sticky-navbar.html',
           link: function($scope, element, attributes) {
               $scope.socialMedia = $scope.$eval(attributes.socialMedia);

               var elementToStickTo = $('#' + attributes.elementToStickTo);
               var collapsedNavbarHeight = element.height();
               var expandedNavbarHeight;

               var fixatedTop = false;
               var fixatedBottom = true;

               var navbarPositionListener = function() {
                   var navbarHeight = element.hasClass('expanded') ? expandedNavbarHeight : collapsedNavbarHeight;
                   var elementToStickToY = elementToStickTo.offset().top;
                   var topOfWindowAlignsWithTopOfNavbar= $(window).scrollTop() > (elementToStickToY - navbarHeight);

                   if(topOfWindowAlignsWithTopOfNavbar) {
                       fixateElementPositionTop(element, navbarHeight);
                   } else {
                       fixateElementPositionBottom(element, elementToStickToY);
                   }

               };

               var fixateElementPositionTop = function(element, elementHeight) {
                   fixatedTop = true;
                   fixatedBottom = false;

                   element.css({
                       'z-index': '10',
                       'position': 'fixed',
                       'top': '0',
                       'height': String(elementHeight) + 'px'
                   });
               };

               var fixateElementPositionBottom = function(element, bottomOffset) {
                   fixatedTop = false;
                   fixatedBottom = true;

                   element.css({
                       'z-index': '10',
                       'position': 'absolute',
                       'bottom': String(bottomOffset),
                       'top': ''
                   });
               };

               /*
                * Sets the enclosing nav element's height to that of the enclosed .container-fluid,
                * which is what is actually taking the size and padding/margin of the <p>'s or <a>'s into account
                */

               var setNavbarHeight = function() {
                   var correctHeight = $(element).children('.container-fluid').height();

                   if(element.hasClass('expanded')) {
                       expandedNavbarHeight = correctHeight;
                       $(element).css('height', expandedNavbarHeight);
                   } else {
                       collapsedNavbarHeight = correctHeight;
                       $(element).css('height', collapsedNavbarHeight);
                   }
               };

               /*
                * If the navbar is expanded so that its upper edge
                * is off screen, the window has to be scrolled up to account
                * for this.
                */

               var checkNavbarUpperEdge = function() {
                   var navbarY = $(element).offset().top;

                   if(navbarY < window.scrollY) {
                       $('html, body').scrollTop(navbarY);
                   }
               };

               /*
                * If the navbar is fixed to the top and it's height changes so that it
                * still is fixed to the top, despite the lower edge hanging above the element
                * that it should stick to, it has to be moved down.
                */

               var checkNavbarLowerEdge = function() {
                   var elementBottom = $(element).offset().top + $(element).height();

                   if(elementBottom < elementToStickTo.offset().top) {
                       fixateElementPositionBottom($(element), elementToStickTo.offset().top);
                   }
               };

               /*
                * If the navbar height is not constantly checked on resize
                * the .container-fluid might get bigger than the navbar, resulting in ugliness.
                * The position of the navbar might also change if it gets smaller, resulting in it
                * being placed above the element that it should stick to.
                */

               var resizeHandler = function() {
                   setNavbarHeight();
                   checkNavbarUpperEdge();
                   checkNavbarLowerEdge();
               };

               $scope.goToSection = function(sectionId) {
                   $('html, body').animate({
                       scrollTop: $(sectionId).offset().top
                   });
               };

               $scope.toggleNavbar = function() {
                   var navbarButton = $('#navbar-button');

                   if(element.hasClass('expanded')) {
                       element.removeClass('expanded');
                       element.css('height', String(collapsedNavbarHeight) + 'px');

                       checkNavbarLowerEdge();

                       navbarButton.removeClass('active');
                   } else {
                       element.addClass('expanded');
                       expandedNavbarHeight = $(element).children('.container-fluid').height();
                       element.css('height', String(expandedNavbarHeight) + 'px');

                       checkNavbarUpperEdge();

                       navbarButton.addClass('active');
                   }

               };

               var extractFilenameFromPath = function(path) {

                   var splitPath = path.split('/');
                   var filename = splitPath[splitPath.length - 1];

                   return filename;
               };

               var removeFileExtension = function(filename, isFullPath = false) {

                   if(isFullPath) {
                       filename = extractFilenameFromPath(filename)
                   }

                   var filenameWithoutExtension = filename.split('.')[0];

                   return filenameWithoutExtension;

               };

               var positionNewElement = function(element, elementToPositionRelativeTo, offset) {

                   var top = $(elementToPositionRelativeTo).offset().top + offset;
                   var left = $(elementToPositionRelativeTo).position().left;

                   $(element).css({
                       "position": "absolute",
                       "z-index": "100",
                       "width": "50px",
                       "top": top,
                       "left": left
                   });

               };

               $scope.appendSocialMediaText = function($event, textImagePath) {

                   var imageFilename = removeFileExtension(textImagePath, true);

                   var clickedElement = $($event.currentTarget);
                   clickedElement.parents('#navbar').after(
                       "<img id='" + imageFilename + "' src='" + textImagePath + "'>"
                   );

                   var imageTextElement = ($('#' + imageFilename));
                   if(fixatedTop) {
                       positionNewElement(imageTextElement, clickedElement, 50);
                   } else {
                       positionNewElement(imageTextElement, clickedElement, -50);
                   }


               };

               $scope.removeSocialMediaText = function(textImagePath) {

                   var imageFilename = removeFileExtension(textImagePath, true);

                   $('#' + imageFilename).remove();

               };


               if(elementToStickTo.length == 0) {
                   fixatedTop = true;
                   $(element).css({
                       'position': 'static'
                   });

                   $(window).resize(function() {
                       setNavbarHeight();

                   });
               } else {
                   $(window).scroll(navbarPositionListener);
                   $(window).resize(function() {
                       setNavbarHeight();
                       checkNavbarUpperEdge();
                       checkNavbarLowerEdge();

                       if($(window).width() >= 931 && element.hasClass('expanded')) {
                           $scope.toggleNavbar();
                       }

                   });
               }
           }
       }

   };

   angular.module('coreModule')
       .directive('stickyNavbar', stickyNavbar);
});