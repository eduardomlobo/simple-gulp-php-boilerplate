'use strict';

/* VARS */
var mqJustDesktop = window.matchMedia( "(min-width: 1280px)" );
var mqDesktop = window.matchMedia( "(min-width: 768px)" );
var mqTabletPortrait = window.matchMedia( "(min-width: 768px) and (max-width: 1279px)" );
var mqMobilePortrait = window.matchMedia( "(max-width: 767px)" );

/* WINDOW LOAD */

window.onload = function() {
  if(/iP(hone|ad)/.test(window.navigator.userAgent)) {
    document.body.addEventListener('touchstart', function() {}, false);
  }
};

/* DOCUMENT READY */

$(document).ready(function() {

	//Remove # from href
	$( document ).on('click', 'a, area', function(event) {
		var ahref = $(this).attr('href');
		if(ahref=="#"){
			event.preventDefault(); 
		}
	});

	// Add touch-device class to body if it is a touch device
	if(isTouchDevice()) {
		$('body').addClass('touch');
	} else {
		$('body').addClass('no-touch');
	}
});

/* FUNCTIONS */

// Detect if it is a touch device
function isTouchDevice() {
	return true == ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch);
}

//ScrollTo
function scrollToElement(element, offset) {
    var target = element;
 
    $('html,body').animate({
        scrollTop: target.offset().top - offset
    }, 500);
 
    return false;
}