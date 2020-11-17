//IE Polyfill
window.MSInputMethodContext && document.documentMode && document.write('<script src="https://cdn.jsdelivr.net/gh/nuxodin/ie11CustomProperties@4.1.0/ie11CustomProperties.min.js"><\x2fscript>');

$("html,body").css({
    height: $(window).innerHeight()
});


// Variables

var $isMobile = false;
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    $isMobile = true;
}

var hash = window.location.hash; //gets everything after the hashtag i.e. #home
var startHash = false;
if (hash != '#home' && hash.length > 0) {
     startHash = true;
}

var prevScroll = 0;
var stopLogoAnim = false;
var titleAnimated = false;
var randomColor;
var isMenuClick = false;
var pausedVids = [];
var noClick = false;

var titleText, titleVrtStart, titleVrtEnd, titleVrtEnding, titleVrtP, titleVrtP2, titleHrz, titleVrt, titleWrap;



// Functions
	// Remap numbers
	function map_range(value, low1, high1, low2, high2) {
		return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	}

	// Rotation animation
	$.fn.rotation = function(am, dur){
		var scaleX = $(this)[0].getBoundingClientRect().width / $(this).outerWidth();
		$(this).animate(
			{ deg: am },
			{
				duration: dur,
				step: function(now) {
				$(this).css({ transform: 'scale(' + scaleX + ')' + ' rotate(' + now + 'deg)' });
				}
			}
		); 
	};

	// Move Title X axis
	function fixTitle (obj, val){
		var x = (obj.offset().left*-1) + val;
		obj.css({'transform': 'translateX(' + x + 'px)'});
	}

	// Move Title X axis
	function setTitle (title, res){
		title.html(res);
	}


	// Move logo and menu on scroll
	function relocateOnce(shrink, first) {
		shrink = shrink || false;
		first = first || false;

		var logo = $('#logo');
		var logoWrap = $('#logoWrap');
		var target = $('#targetO');

		
		var logoWrapH = logoWrap.outerHeight();
		var logoWrapW = logoWrap.outerWidth();
		var targetH = target.outerHeight();
		var targetW = target.outerWidth();
		
		var vw = $(window).width() / 100;
		var vh = $(window).height() / 100;
		var tSize = (window.innerHeight > window.innerWidth) ? 1.05 * vw : 0.9 * vh;

		var desOffsetTop = !shrink ? $(window).height()/2 - logoWrapH/2 : (tSize * 0.5)  - logoWrapH/2 + targetH/2;
		var desOffsetLeft = !shrink ? $(window).width()/2 -logoWrapW/2 : (tSize * 1.8) - logoWrapW/2 + targetW/2;
		
		var startOffsetTop = !shrink ? target.offset().top - logoWrapH/2 + targetH/2 : $(window).height()/2 -logoWrapH/2;
		var startOffsetLeft = !shrink ? target.offset().left - logoWrapW/2 + targetW/2 : $(window).width()/2 -logoWrapW/2;
		
		var startVal = !shrink ? target.outerHeight() / logoWrap.outerHeight() : 1;
		var destVal = !shrink ? 1 : target.outerHeight() / logoWrap.outerHeight();
		
		var appnd = !shrink ? '#fullpage' : '#menuLogo > a';
		var stroke = !shrink ? '#333' : '';
		
		var clsMenuRem = !shrink ? '' : 'nopointer';
		var clsMenuAdd = !shrink ? 'nopointer' : '';
		
		var clsLogoRem = !shrink ? 'active' : '';
		var clsLogoAdd = !shrink ? '' : 'active';
		
		var wait = $isMobile ? 350 : 800;
		
		if (first == 'resize') {
			logo.css({'--transTime': 0, 'z-index': '1', 'position': 'fixed', 'top': desOffsetTop, 'left': desOffsetLeft, 'transform': 'scale(' + destVal + ')'});
			logo.prependTo(appnd);
			return;
		}
		
		if (first == 'start') {
			logo.css({'z-index': '1', 'position': 'absolute', 'top': desOffsetTop, 'left': desOffsetLeft, 'transform': 'scale(' + destVal + ')' });
			logo.prependTo('#fullpage');
			$('svg.svgArrow polyline.menuLine').css('stroke', '#333');
			return;
		}
		
		$('svg.svgArrow polyline.menuLine').css('stroke', stroke);
		logo.css({'z-index': '999999999999', 'position': 'fixed', 'top': startOffsetTop, 'left': startOffsetLeft, '--transTime': wait});
		logo.css({'transform': 'scale('+destVal+')', top: desOffsetTop, left: desOffsetLeft})
		$('#menuLogo').removeClass(clsMenuRem).addClass(clsMenuAdd);
		window.setTimeout(function () {
			logo.css({'z-index': '1'});
			$('#menu').removeClass(clsLogoRem).addClass(clsLogoAdd);
			logo.prependTo(appnd);
		}, wait);
		
	}

	function relocateLogo(noscroll) {

		var title = $('#title');
		var logo = $('#logo');
		var canvas = $('#logo canvas');

		var noscroll = noscroll || false;
		if (noscroll == true || noscroll == 'resize') {	
			var top = logo.offset().top - (logo.outerHeight());
			var left = logo.offset().left - (logo.outerWidth());
		}
		if (noscroll == true) {	
			logo.wrap('<div id="logoWrap"></div>');
		}
		
		var logoWrap = $('#logoWrap');
		var targetO = $('#targetO');
		
		var docHeight = $(document).height();
		var section = $("section");
		var secLength = section.length;
		var threshold = $(window).height();

		var scroll = $(window).scrollTop();
		var ratio = Math.min(scroll / threshold, 1)
		
		var logoH = logoWrap.outerHeight();
		var logoX = logoWrap.offset().left + $(window).scrollLeft();
		var logoY = logoWrap.offset().top + scroll;
		var desX = targetO.offset().left;
		var desY = targetO.offset().top;
		var moveLogoX = ratio * (desX - logoX);
		var moveLogoY = ratio * (desY - logoY);
		var y = logoY + moveLogoY;
		var x = logoX + moveLogoX;
		var minVal = targetO.outerHeight() / logoH;
		var inflate = map_range(1 - ratio, 0, 1, minVal, 1)
		var transform = 'scale(' + inflate + ')';

		if (noscroll != true) {
			logo.css({
				'-webkit-transform': transform,
				'-moz-transform': transform,
				'transform': transform,
			});
		}

		if (noscroll == true || scroll == 0) {
			logo.appendTo('#logoWrap');
			logo.css({'transform': 'unset', 'top': 'unset', 'left': 'unset'}); 
			logo.css({'position': 'relative', 'z-index': '2'}); 
		}
		
		else if (noscroll == 'resize') {
			if (logo.css('position') == 'fixed') {
				logo.offset(targetO.offset());
			}
			else {
				logo.offset({top: y, left: x});
			}
		}
		
		else if (scroll >= threshold-1) {
			
			if (logo.css('position') != 'fixed') {
				window.setTimeout(function () {
					logo.appendTo('#menuLogo > a');
					logo.css('position', 'fixed');
					logo.offset(targetO.offset());
					$('#menu').addClass('active');
					$('#menuLogo').removeClass('nopointer');
				}, 100);
			}
			return;
		}
		
		else if (scroll < threshold) {
			logo.css({'position': 'absolute', 'z-index': '99999999'});
			logo.prependTo('body');
			logo.offset({top: y, left: x});
			$('#menu').removeClass('active');
			$('#menuLogo').addClass('nopointer');
		}

		$(':root').css('--headScale', inflate);
		prevScroll = scroll;
		
	}

$(document).ready(function() {
	$('#fullpage').fullpage({
		//Navigation
		menu: '#menu',
		lockAnchors: false,
		anchors:['home', 'animism'],
		navigation: false,
		navigationPosition: 'right',
		navigationTooltips: ['firstSlide', 'secondSlide'],
		showActiveTooltip: false,
		slidesNavigation: false,
		slidesNavPosition: 'bottom',

		//Scrolling
		css3: true,
		scrollingSpeed: 700,
		autoScrolling: true,
		fitToSection: true,
		fitToSectionDelay: 50,
		scrollBar: $isMobile ? false : true,
		easing: 'easeInOutCubic',
		easingcss3: 'cubic-bezier(0.22, 1, 0.36, 1)',
		loopBottom: false,
		loopTop: false,
		loopHorizontal: false,
		continuousVertical: false,
		continuousHorizontal: false,
		scrollHorizontally: false,
		interlockedSlides: false,
		dragAndMove: false,
		offsetSections: false,
		resetSliders: false,
		fadingEffect: false,
		normalScrollElements: '.project, .about',
		scrollOverflow: false,
		scrollOverflowReset: false,
		scrollOverflowOptions: null,
		touchSensitivity: 15,
		bigSectionsDestination: null,

		//Accessibility
		keyboardScrolling: true,
		animateAnchor: true,
		recordHistory: true,

		//Design
		controlArrows: true,
		verticalCentered: true,
//		sectionsColor : ['#ccc', '#fff'],
		paddingTop: '0px',
		paddingBottom: '0px',
//		fixedElements: '#header, .footer',
		responsiveWidth: 0,
		responsiveHeight: 0,
		responsiveSlides: false,
		parallax: false,
		parallaxOptions: {type: 'reveal', percentage: 22, property: 'translate'},
		cards: false,
		cardsOptions: {perspective: 100, fadeContent: true, fadeBackground: true},

		//Custom selectors
		sectionSelector: '.section',
		slideSelector: '.slide',

		lazyLoading: true,

		//events
		onLeave: function(origin, destination, direction){
			if (origin.index == 0 && destination.index > 0) {
				relocateOnce(true);
			}
			if (origin.index > 0 && destination.index == 0) {
				relocateOnce();
			}
		},
		afterLoad: function(origin, destination, direction){
		},
		afterRender: function(){
		},
		afterResize: function(width, height){
			
			var curSection = $('.section.active');
			var curSlide = $('.section.active .slide.active');
			
			updateMainMedia();
			
			if ($('.section').index(curSection) == 0 && $('.section.active .slide').index(curSlide) == 1) {
				relocateOnce(true, 'resize');
			}
			if ($('.section').index(curSection) == 0 && $('.section.active .slide').index(curSlide) == 0) {
				relocateOnce(false, 'resize');
			}
			else {
				stopLogoAnim = true;
				relocateOnce(true, 'resize');
				setTimeout(function() {
					stopLogoAnim = false;
				}, 500);
			}
			window.setTimeout(function () {
				$('.expandable > div').each(function() {
					$(this).css('--origHeight', this.scrollHeight);
				});
			}, 200);
		},
		afterReBuild: function(){},
		afterResponsive: function(isResponsive){},
		afterSlideLoad: function(section, origin, destination, direction){			
			
			if (origin.index == 0 && destination.index > 0) {
				fullpage_api.setAutoScrolling(false);
				fullpage_api.setAllowScrolling(false, 'down, up');
				var trans = $( '.section.active .fp-slidesContainer').css('transition');
				$( '.section.active .fp-slidesContainer').css('transform', 'translate3d(-50%, 0px, 0px)');
			}
		},
		onSlideLeave: function(section, origin, destination, direction){
		
			noClick = true;
			window.setTimeout(function () {
				noClick = false;
			}, 500);
			if (origin.index == 0 && destination.index > 0) {
				$.fn.fullpage.setAutoScrolling(false);
				fullpage_api.setAllowScrolling(false, 'down, up');
				$('html').addClass('hideScroll');
				if (section.index == 0) {					
					var video = document.getElementById('profileVideo');
					video.currentTime = 0;
					if (isMenuClick) { isMenuClick = false; return }
					else { relocateOnce(true, true); }
				}
			}
			if (origin.index > 0) {
				$('html').removeClass('hideScroll');
				$.fn.fullpage.setAutoScrolling(true);
				fullpage_api.setAllowScrolling(true);
				if (section.index == 0) {
					relocateOnce(false);
				}
				return;
			}
		}
	});

	//methods
	$.fn.fullpage.setAllowScrolling(true);
	
});



// Events
	// On page load
    $(window).on('load', function () {
		
		//if ($isMobile) { openFullscreen(); }
        window.setTimeout(function () {
            $('body').removeClass('is-preload');
			relocateOnce(false, 'start');
        }, 20);
        if (startHash) {
			window.setTimeout(function () {
				$('body').removeClass('is-preload');
				relocateOnce(true);
				startHash = false;
			}, 23);
		}
    });
	

	$(function () {
		$( "table.rows tbody tr:odd" ).addClass('table-odd');
		$( "table.rows tbody tr:even" ).addClass('table-even');
		$( "table.sub tbody tr:odd" ).addClass('table-odd');
		$( "table.sub tbody tr:even" ).addClass('table-even');
		relocateLogo(true);
		$('.fp-controlArrow').append("<svg class='svgArrow' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='20%' height='80%' viewBox='0 0 50 80' preserveAspectRatio='none' xml:space='preserve'><polyline class='menuLine' points='0.375,0.375 45.63,38.087 0.375,75.8 '></polyline></svg>");
		
//		if (!$isMobile) {
//			$('.expandable:first-of-type').addClass('collapsable');
//		}
		
		updateMainMedia();
		

		
		$('.expandable > div').each(function() {
			$(this).css('--origHeight', this.scrollHeight);
		});
		
		
	});

	// On window Scroll
	$(window).scroll(function () { 

/*		if (!stopLogoAnim) {
			relocateLogo();
		}
		else { return; }*/

	});

	// On link click
	

	$( "#menuHome" ).hover(
	  function() {
		$( this ).addClass( "hover" );
	  }, function() {
		$( this ).removeClass( "hover" );
	  }
	);
	
	$( "#menuHome" ).on('click touch', function(e) {
		e.preventDefault();
		$.fancybox.close(true);	
		$('html').removeClass('hideScroll');
		$.fn.fullpage.setAutoScrolling(true);
		fullpage_api.setAllowScrolling(true);
		
		setTimeout(function() {
			var curSection = fullpage_api.getActiveSection().index + 1;
			var curSlide = fullpage_api.getActiveSlide() ? fullpage_api.getActiveSlide().index : 0;
			if (curSection == 1 && curSlide == 0) { relocateOnce(); }
			if (curSection > 0) {
				if (curSlide > 0) {
					fullpage_api.silentMoveTo(curSection, 0);
					setTimeout(function() {
						fullpage_api.moveTo(1);
					}, 50);
				}
				else {
					fullpage_api.moveTo(1);
				}
			}
		}, 50);

	});

	$( "#hiddenMenu > div" ).on('click touch', function(e) {
		e.preventDefault();
		$.fancybox.close(true);	
		
		$('html').removeClass('hideScroll');
		$.fn.fullpage.setAutoScrolling(true);
		fullpage_api.setAllowScrolling(true);
		
		var clickElem = this;
		
		var curSection = fullpage_api.getActiveSection().index + 1;
		var curSlide = fullpage_api.getActiveSlide().index;
		
		var target = $(clickElem).attr('data-target');
		var targetSection = target.split(',')[0];
		var targetSlide = target.split(',')[1];
		
		if (curSection == 1 && curSlide == 0 && target == '1,1') {
			isMenuClick = true;
		}
		
		setTimeout(function() {			
			if (curSection != targetSection && curSlide > 0) {
				fullpage_api.silentMoveTo(curSection, 0);
				setTimeout(function() {
					fullpage_api.silentMoveTo(targetSection, targetSlide);
				}, 50);
			}
			else {
				fullpage_api.silentMoveTo(targetSection, targetSlide);
			}
		}, 50);

	});

	$('#menu #Pages').on('click touch', function (e) {
		e.preventDefault();
		var curSection = fullpage_api.getActiveSection().index + 1;
		var curSlide = fullpage_api.getActiveSlide().index;
		
		if ($(this).hasClass('opened')) {
			$.fancybox.close(true);	
			$('html').removeClass('hideScroll');
			$.fn.fullpage.setAutoScrolling(true);
			fullpage_api.setAllowScrolling(true);
			if (curSection == 1 && curSlide == 0) { relocateOnce() }
		}
		else {
			$('#menu').css({'z-index': '999999'});
			$('#hiddenMenu').addClass('visibleMenu');
			$.fancybox.close(true);
			$('html').addClass('hideScroll');
			$.fn.fullpage.setAutoScrolling(false);
			fullpage_api.setAllowScrolling(false, 'down, up');
			$.fancybox.open({
				src  : '#hiddenMenu',
				type : 'inline',
				toolbar: false,
				smallBtn : false
			});
		}
	});


	$('.expandable > *:first-child').on('click touch', function(e) {
		if (noClick) { return; }
		e.preventDefault();
		var nextDiv = $(this).siblings()[0];
		window.setTimeout(function () {
			$(nextDiv).css('--origHeight', nextDiv.scrollHeight);
			console.log(nextDiv.scrollHeight);
		}, 150);
		if (!$(this).parent().hasClass('collapsable')) {
			$(this).parent().addClass('collapsable');
			$(this).parent().siblings().removeClass('collapsable');
		}
		else {
			$(this).parent().removeClass('collapsable');
		}
	});



	//On window resize
	$(window).resize(function() {
		
	});






// load Background SVG
	$(document).on('beforeClose.fb', function( e, instance, slide ) {
		$('#menu #Pages').toggleClass('opened');
		$('#menu #Pages').attr('aria-expanded', $('#menu #Pages').hasClass('opened'));

		$.each( pausedVids, function( i, video ){
			if (video.paused) { video.play(); }
		});
	});
	$(document).on('afterClose.fb', function( e, instance, slide ) {
		$('#menu').css('z-index', '2');
		$('#hiddenMenu').removeClass('visibleMenu');
		var curSection = fullpage_api.getActiveSection().index + 1;
		var curSlide = fullpage_api.getActiveSlide().index;
		if (curSlide < 1) {
			$.fn.fullpage.setAutoScrolling(true);
			fullpage_api.setAllowScrolling(true);
			$('html').removeClass('hideScroll');
		}
		else if (!isMenuClick) {
			$.fn.fullpage.setAutoScrolling(false);
			fullpage_api.setAllowScrolling(false, 'down, up');
			$('html').addClass('hideScroll');
		}
	});
	
	$(document).on('onInit.fb', function( e, instance, slide ) {
		pausedVids.length = 0;
		$("video").each(function() {
			var video = $(this).get(0);
			if (!video.paused) {pausedVids.push(video); video.pause(); }			
		});
		var curSection = fullpage_api.getActiveSection().index + 1;
		var curSlide = fullpage_api.getActiveSlide().index;
		if (curSection == 1 && curSlide == 0) { relocateOnce(true) }
		$('#menu #Pages').toggleClass('opened');
		$('#menu #Pages').attr('aria-expanded', $('#menu #Pages').hasClass('opened'));
		$.fn.fullpage.setAutoScrolling(false);
		fullpage_api.setAllowScrolling(false, 'down, up');
		$('#menu').css({'z-index': '999999'});
	});

	$(document).on('afterLoad.fb', function( e, instance, slide ) {
/*		$('video.fancybox-video').mediaelementplayer({
			pluginPath: "/path/to/shims/",
			stretching: "responsive",
		// When using jQuery's `mediaelementplayer`, an `instance` argument
		// is available in the `success` callback
			success: function(mediaElement, originalNode, instance) {
				// do things
			}
		});*/
	});

	$(".mediaMain video").on("play", function (e) {
		var curVideo = $(this).get(0);
		pausedVids.length = 0;
		$("video").each(function() {
			var video = $(this).get(0);
			if (!video.paused && video != curVideo) {pausedVids.push(video); video.pause(); }
		});
	});

	$(".mediaMain video").on("pause", function (e) {
		$.each( pausedVids, function( i, video ){
			if (video.paused) { video.play(); }
		});
	});

/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}