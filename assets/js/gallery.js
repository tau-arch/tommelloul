$.fancybox.defaults.animationEffect = "zoom";
$.fancybox.defaults.animationDuration = "450";
$.fancybox.defaults.transitionEffect = "slide";



$.fancybox.defaults.infobar = false;
$.fancybox.defaults.toolbar = false;
$.fancybox.defaults.buttons = [
	//"zoom",
    //"share",
    //"slideShow",
    //"fullScreen",
    //"download",
    //"thumbs",
    //"close"
];

$.fancybox.defaults.btnTpl.close = false;

$.fancybox.defaults.btnTpl.arrowLeft = '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}">' +
		'<div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 864"><polyline class="fancybox-svg-arrow" points="360.44 706.94 12.88 417.32 360.44 127.68"/></svg></div>' +
		"</button>";

$.fancybox.defaults.btnTpl.arrowRight = '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}">' +
		'<div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 864"><polyline class="fancybox-svg-arrow" points="12.88 127.68 360.44 417.31 12.88 706.94"/></svg></div>' +
		"</button>";

$(window).resize(function() {

});


$(function() {
	
	updateMainMedia();
	
	$("video.vidBack").each(function() {
		var video = this;
		var poster = $( video ).prop( 'poster' );
		$(this).css('background-image', 'url('+poster+')');
		$( video ).removeAttr( 'poster' );
	});
	
	$(".projectGallery > video").each(function() {
		var video = this;
		var poster = $( video ).prop( 'poster' );
		$(this).css('background-image', 'url('+poster+')');
		if ( poster ) {
			var image = new Image();
			$(image).one('load', function() {
				var w = image.width;
				var h = image.height;
				fixVideo(video, w, h);
			});
			image.src = poster;
		}
		$( video ).removeAttr( 'poster' );
	});
	$(".projectGallery > img").one('load', function() {
		var w = this.naturalWidth;
		var h = this.naturalHeight;
		fixImg(this, w, h);
	});
});

function updateMainMedia() {
	$(".mediaMain video").each(function() {
		var video = this;
		var parent = $(video).closest('.mediaMain');
		var poster = $( video ).prop( 'poster' );
		//$(video).css('background-image', 'url('+poster+')');
		if ( poster ) {
			var image = new Image();
			$(image).one('load', function() {
				var w = image.width;
				var h = image.height;
				parent.find('>div').css('min-height', parent.width()*h/w);
				//$( video ).removeAttr( 'poster' );
			});
			image.src = poster;
		}

	});
}
$( window ).on( "orientationchange", function( event ) {
  updateMainMedia();
});
function fixImg(el, w, h) {
	var flexGrow,
		flexBasis,
		paddingBottom,
		maxHeight;

	var imgGallery = $(el).parents('.projectGallery').attr('id');
	var imgCaption = el.alt;
	var imgSrc = $(el).attr('data-src') || el.src;
	var iframeSrc = $(el).attr('data-iframe');
	var dataCSize = $(el).attr('data-cSize') || false;
	var boxSrc = iframeSrc || imgSrc.substring(0, imgSrc.lastIndexOf('/')) + '/HD' + imgSrc.substring(imgSrc.lastIndexOf('/'));
	var dataType = (typeof(iframeSrc) != "undefined") ? 'iframe' : 'image';

	$(el).wrap('<figure>').before('<i>');
	var figure = $(el).parent('figure');
	if (!dataCSize == false) { figure.addClass('cSize').css('--cSize', dataCSize); }

	$(figure).attr({
		'data-type':		dataType,
		'data-src':			boxSrc,
		'data-fancybox':	imgGallery,
		'data-caption':		imgCaption,						
	});

	$(figure).append('<div class="caption">' + imgCaption + '</div>');
	
	$(figure).css({'--origW': w, '--origH': h});

/*	flexGrow = (w * 200) / h;
	flexBasis = (w * 280) / h;

	paddingBottom = (h / w) * 100;

	figure.css({
			'flex-grow': 		flexGrow / sizeRatio,
			'flex-shrink': 		flexGrow / sizeRatio * 2,
			'flex-basis': 		flexBasis / sizeRatio + 'px',
			'max-height': 		maxHeight,
			'cursor': 			'pointer',
		})
		.find('i').css({
			'padding-bottom': paddingBottom + '%'
	});

	$(el).css({
		'max-height':	h,
		'max-width':	w
	});*/

	figure.addClass('loaded');
}

function fixIframe(el) {
	var title = $(el).attr('title');

	$(el).wrap('<figure class="big"><div class="projectPres"></div></figure>');


	$(el).parent().append('<div class="projectPresNav"><span class="presNav prev"></span>' + title + '<span class="presNav next"></span><span class="fullScr"></span></div>');

	figure = $(el).parent().parent();

	$(figure).append('<div class="caption">' + title + '</div>');

	$('div.projectPresNav span.fullScr').on('click touch', function (e) {
			if (noClick) { return; }
		var targetDiv = e.target.parentElement.parentElement
		if (screenfull.isEnabled) {
			if (screenfull.isFullscreen) {
				$(targetDiv).removeClass('fullscreen')
			}
			else {
				$(targetDiv).addClass('fullscreen')
			}
			screenfull.toggle(targetDiv);
		}
	});

	$('div.projectPresNav span.presNav.next').on('click touch', function (e) {
		var url = e.target.parentElement.previousElementSibling.src;
		var urlLeft = url.split('#slide=id.p')[0];
		var urlRight = url.split('#slide=id.p')[1];

		urlRight = (typeof urlRight === 'undefined') ? 2 : parseInt(urlRight, 10) + 1;

		e.target.parentElement.previousElementSibling.src = urlLeft + '#slide=id.p' + urlRight;
	});

	$('div.projectPresNav span.presNav.prev').on('click touch', function (e) {
		var url = e.target.parentElement.previousElementSibling.src;
		var urlLeft = url.split('#slide=id.p')[0];
		var urlRight = url.split('#slide=id.p')[1];

		urlRight = (typeof urlRight === 'undefined') ? 1 : parseInt(urlRight, 10) - 1;

		e.target.parentElement.previousElementSibling.src = urlLeft + '#slide=id.p' + urlRight;
	});

	figure.addClass('loaded');
}

function fixVideo(el, w, h) {
	var sizeRatio = window.innerWidth <= 900 ? window.innerWidth / 380 : 1;
	var flexGrow,
		flexBasis,
		paddingBottom,
		maxHeight;

	var imgGallery = $(el).parents('.projectGallery').attr('id');
	var imgCaption = $(el).attr('alt');
	var boxSrc = $(el).attr('data-boxsrc') || $(el).find('Source:first').attr('src') || $(el).find('Source:first').attr('data-src');
	var dataType = 'video';

	$(el).wrap('<figure>').before('<i>');
	var figure = $(el).parent('figure');

	$(figure).attr({
		'data-type':		dataType,
		'data-src':			boxSrc,
		'data-fancybox':	imgGallery,
		'data-caption':		imgCaption,						
	});

	$(figure).append('<div class="caption">' + imgCaption + '</div>');
	
	$(figure).css({'--origW': w, '--origH': h});

/*
	flexGrow = (w * 200) / h;
	flexBasis = (w * 280) / h;

	paddingBottom = (h / w) * 100;

	figure.css({
			'flex-grow': 		flexGrow / sizeRatio,
			'flex-shrink': 		flexGrow / sizeRatio * 2,
			'flex-basis': 		flexBasis / sizeRatio + 'px',
			'max-height': 		maxHeight,
			'cursor': 			'pointer',
		})
		.find('i').css({
			'padding-bottom': paddingBottom + '%'
	});
*/

	figure.addClass('loaded');
}


$('.view-right').on('click touch', function (e) {
	if (noClick) { return; }
	e.preventDefault();
	fullpage_api.moveSlideRight();
});
$('.view-down').on('click touch', function (e) {
	if (noClick) { return; }
	e.preventDefault();
	fullpage_api.moveSectionDown();
});

$('.projectText').on('click touch', function (e) {
	if (noClick) { return; }
	var hasAfter = window.getComputedStyle(this, ':after').getPropertyValue('content');
	if (hasAfter != 'none') {
		$.fancybox.open({
			src:		$(this)[0].outerHTML,
			type:		'html',
			toolbar:	false,
			smallBtn:	false
		});
	}
});




$('.mediaMain video').mediaelementplayer({
	pluginPath: "/path/to/shims/",
	stretching: "responsive",
// When using jQuery's `mediaelementplayer`, an `instance` argument
// is available in the `success` callback
	success: function(mediaElement, originalNode, instance) {
		// do things
	}
});