var webpMachine = new webpHero.WebpMachine();
webpMachine.polyfillDocument();
/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

$('#menu nav ul li a').click(function(){
	if ($(this).hasClass('selected')) {
		event.preventDefault();
		event.stopPropagation(); 
	}
}); 

(function ($) {

	
    var $window = $(window),
        $body = $('body'),
        $wrapper = $('#wrapper'),
        $header = $('#header'),
        $menu = $('#menu'),
        $menu_lists = $menu.find('a'),
        $footer = $('#footer'),
        $main = $('#main'),
        $main_articles = $main.children('article'),
		$projects = $('#projects'),
        $tombaHover = $('#tombaHover'),
        $bubble = $('#bubble');

    // Breakpoints.
    breakpoints({
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: ['481px', '736px'],
        xsmall: ['361px', '480px'],
        xxsmall: [null, '360px']
    });

    // Play initial animations on page load.
    $window.on('load', function () {
        window.setTimeout(function () {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Fix: Flexbox min-height bug on IE.
    if (browser.name == 'ie') {

        var flexboxFixTimeoutId;

        $window.on('resize.flexbox-fix', function () {

            clearTimeout(flexboxFixTimeoutId);

            flexboxFixTimeoutId = setTimeout(function () {

                if ($wrapper.prop('scrollHeight') > $window.height())
                    $wrapper.css('height', 'auto');
                else
                    $wrapper.css('height', '100vh');

            }, 250);

        }).triggerHandler('resize.flexbox-fix');

    }

    // Nav.
    var $nav = $header.children('nav'),
        $nav_li = $nav.find('li');

    // Add "middle" alignment classes if we're dealing with an even number of items.
    if ($nav_li.length % 2 == 0) {

        $nav.addClass('use-middle');
        $nav_li.eq(($nav_li.length / 2)).addClass('is-middle');

    }

    // Main.
    var delay = 325,
        locked = false;

    // Methods.
    $main._show = function (id, initial) {
        var $article = $main_articles.filter('#' + id);
        var $list;
		if (id == 'projects') {
			$list = $menu_lists.filter('#menu_portfolio');
		}
		else {
			$list = $menu_lists.filter('#menu_' + id); 
		}

        // No such article? Bail.
        if ($article.length == 0)
            return;

        // Handle lock.

        // Already locked? Speed through "show" steps w/o delays.
        if (locked || (typeof initial != 'undefined' && initial === true)) {

            // Mark as switching.
            $body.addClass('is-switching');

            // Mark as visible.
            $body.addClass('is-article-visible');

            // Deactivate all articles (just in case one's already active).
            $main_articles.removeClass('active');

            // Hide header, footer.
            $header.hide();
            $footer.hide();

            // Show main, article.
            $main.show();
            $article.show();
            $menu.show();

            // Activate article.
            $article.addClass('active');
            $menu_lists.removeClass('selected');
            $list.addClass('selected');

            // Unlock.
            locked = false;

            // Unmark as switching.
            setTimeout(function () {
                $body.removeClass('is-switching');
            }, (initial ? 1000 : 0));

            return;

        }

        // Lock.
        locked = true;

        // Article already visible? Just swap articles.
        if ($body.hasClass('is-article-visible')) {

            // Deactivate current article.
            var $currentArticle = $main_articles.filter('.active');

            $currentArticle.removeClass('active');

            // Show article.
            setTimeout(function () {

                // Hide current article.
                $currentArticle.hide();

                // Show article.
                $article.show();
                $menu_lists.removeClass('selected');
                $list.addClass('selected');

                // Activate article.
                setTimeout(function () {

                    $article.addClass('active');

                    // Window stuff.
                    $window
                        .scrollTop(0)
                        .triggerHandler('resize.flexbox-fix');

                    // Unlock.
                    setTimeout(function () {
                        locked = false;
                    }, delay);

                }, 25);

            }, delay);

        }

        // Otherwise, handle as normal.
        else {

            // Mark as visible.
            $body
                .addClass('is-article-visible');

            // Show article.
            setTimeout(function () {

                // Hide header, footer.
                $header.hide();
                $footer.hide();

                // Show main, article.
                $main.show();
                $article.show();
                $menu.show();

                // Activate article.
                setTimeout(function () {

                    $article.addClass('active');
                    $menu_lists.removeClass('selected');
                    $list.addClass('selected');

                    // Window stuff.
                    $window
                        .scrollTop(0)
                        .triggerHandler('resize.flexbox-fix');

                    // Unlock.
                    setTimeout(function () {
                        locked = false;
                    }, delay);

                }, 25);

            }, delay);

        }

    };

    $main._hide = function (addState) {

        var $article = $main_articles.filter('.active');

        // Article not visible? Bail.
        if (!$body.hasClass('is-article-visible'))
            return;

        // Add state?
        if (typeof addState != 'undefined'
            && addState === true)
            history.pushState(null, null, '#');

        // Handle lock.

        // Already locked? Speed through "hide" steps w/o delays.
        if (locked) {

            // Mark as switching.
            $body.addClass('is-switching');

            // Deactivate article.
            $article.removeClass('active');

            // Hide article, main.
            $article.hide();
            $main.hide();
            $menu.hide();

            // Show footer, header.
            $footer.show();
            $header.show();

            // Unmark as visible.
            $body.removeClass('is-article-visible');

            // Unlock.
            locked = false;

            // Unmark as switching.
            $body.removeClass('is-switching');

            // Window stuff.
            $window
                .scrollTop(0)
                .triggerHandler('resize.flexbox-fix');

            return;

        }

        // Lock.
        locked = true;

        // Deactivate article.
        $article.removeClass('active');

        // Hide article.
        setTimeout(function () {

            // Hide article, main.
            $article.hide();
            $main.hide();
            $menu.hide();

            // Show footer, header.
            $footer.show();
            $header.show();

            // Unmark as visible.
            setTimeout(function () {

                $body.removeClass('is-article-visible');

                // Window stuff.
                $window
                    .scrollTop(0)
                    .triggerHandler('resize.flexbox-fix');

                // Unlock.
                setTimeout(function () {
                    locked = false;
                }, delay);

            }, 25);

        }, delay);


    };

    // Articles.
    $main_articles.each(function () {
        var $this = $(this);

        // Close.
        if ($this.attr('id') == 'projects') {
			$('<div class="back">Back</div>')
				.appendTo($this)
				.on('click', function () {
					location.hash = '#portfolio';
				});
		}
		else {
			$('<div class="close">Close</div>')
				.appendTo($this)
				.on('click', function () {
					location.hash = '';
				});
		}
        
        //PDF Download
		if ($this.data('pdf') !== undefined) {
			$('<div class="PDF">PDF</div>')
				.appendTo($this)
				.on('click', function () {
					let a= document.createElement('a');
					a.target= '_blank';
					a.href= $this.data('pdf');
					a.click();
				});
		}

        // Prevent clicks from inside article from bubbling.
        $this.on('click', function (event) {
            event.stopPropagation();
        });

    });

    // Events.
/*    $body.on('click', function (event) {

        // Article visible? Hide.
        if ($body.hasClass('is-article-visible'))
            $main._hide(true);

    });*/

    $window.on('keyup', function (event) {
/*        switch (event.keyCode) {

            case 27:

                // Article visible? Hide.
                if ($body.hasClass('is-article-visible'))
                    $main._hide(true);

                break;

            default:
                break;

        }*/

    });

    $window.on('hashchange', function (event) {
		var hashParts = location.hash.split("/");
		var currentArticle = $main_articles.filter('.active');
		var nextArticle = $main_articles.filter(hashParts[0]);
		
        // Empty hash?
        if (hashParts[0] == ''
            || hashParts[0] == '#') {

            // Prevent default.
            event.preventDefault();
            event.stopPropagation();

            // Hide.
            $main._hide();

        }
		
		
        // Otherwise, check for a matching article.
        else if (nextArticle.length > 0 && $(nextArticle).attr('id') != $(currentArticle).attr('id')) {
            // Prevent default.
            event.preventDefault();
            event.stopPropagation();

            // Show article.
            $main._show(hashParts[0].substr(1));
			
			if (hashParts[0] == '#projects' && hashParts.length > 1) {
				window.setTimeout(function () {
					showProject(hashParts[1]);
				}, 300);
			}

        }
		
		$("video").each(function() {
			$(this).get(0).pause();
		});
    });
    
    $tombaHover.hover(function () {
        randomQuote();
        $bubble.css("opacity", "1");
    }, function () {
        $bubble.css("opacity", "0");
    });
    
    $tombaHover.click(function(){
        $bubble.css("opacity", "0");
        randomQuote();
        $bubble.css("opacity", "1");
});
    

    // Scroll restoration.
    // This prevents the page from scrolling back to the top on a hashchange.
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
	}
    else {
        var oldScrollPos = 0,
            scrollPos = 0,
            $htmlbody = $('html,body');

        $window
            .on('scroll', function () {
                oldScrollPos = scrollPos;
                scrollPos = $htmlbody.scrollTop();

            })
            .on('hashchange', function () {
                $window.scrollTop(oldScrollPos);
            });

    }

    // Initialize.
	
    // Hide main, articles.
    $main.hide();
    $main_articles.hide();

    // Initial article.
    if (location.hash != ''
        && location.hash != '#')
        $window.on('load', function () {
			var hashParts = location.hash.split("/");
            $main._show(hashParts[0].substr(1), true);			
			if (hashParts.length > 1) {
				showProject(hashParts[1]);
			}
        });

})(jQuery);