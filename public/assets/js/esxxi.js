// Loading Page
    $(window).on('load', function() {
        window.setTimeout(function() {
            $(document.body).removeClass('loading');
        }, 80);
    });
// Loading Page

// Is Mobile
(function(a) {
	window.isMobile = /\bi?Phone\b|(?=.*\bAndroid\b)(?=.*\bMobile\b)|(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i.test(a);
})(navigator.userAgent || navigator.vendor || window.opera);
//

// Video Background
if (window.isMobile){
    $('.wrapper video').remove();
}
//

// Smooth Scrolling
    $(function () {
        $('a[href*="#"]:not([href="#"])').click(function () {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 2000);
                    return false;
                }
            }
        });
    });
// Smooth Scrolling

// Header

    $(function($) {
        
        var $header = $('#header');
        var $win = $(window);

        var validateHeader = function() {
            var hide = $header.hasClass("hide");
            if ($(this).scrollTop() < $(this).height() - 75) {
                if (!hide)
                    $header.addClass("hide");
            } else {
                if (hide)
                    $header.removeClass("hide");
            }
        } 

        validateHeader();

        $win.on("scroll", function () {
            validateHeader();
        });

    }); 
// Header

// Menu
    
    var $btnMenu = $("#btnMenu");
    var $iMenu = $("#iMenu");
    var $navMenu = $("#navMenu");
    var $bkgMenu = $(".menu-bkg");
    var bkgActive = false;

    var toggleMenu = function () {
        // $iMenu.addClass("fa-pulse");
        bkgActive = $bkgMenu.hasClass("active");
        $navMenu.toggleClass("active");
        if (bkgActive) {            
            window.setTimeout(function() {
                $bkgMenu.toggleClass("active");
            }, 670);
        }
        else {
            $bkgMenu.toggleClass("active");
        }

        $btnMenu.addClass("active");

        window.setTimeout(function() {
            $btnMenu.removeClass("active");
            $iMenu.toggleClass("fa-bars");
            $iMenu.toggleClass("fa-close");
            $iMenu.toggleClass("fa-lg");
        }, 450);

        // window.setTimeout(function() {
        //     $iMenu.removeClass("fa-pulse");
        // }, 700);
    }
    var showMenu = function () {
        // $iMenu.addClass("fa-pulse");
        $navMenu.addClass("active");
        $bkgMenu.addClass("active");
        $btnMenu.addClass("active");

        window.setTimeout(function() {
            $btnMenu.removeClass("active");
            $iMenu.removeClass("fa-bars");
            $iMenu.addClass("fa-close");
            $iMenu.addClass("fa-lg");
        }, 450);

        // window.setTimeout(function() {
        //     $iMenu.removeClass("fa-pulse");
        // }, 700);
    }
    var hideMenu = function () {
        // $iMenu.addClass("fa-pulse");
        $navMenu.removeClass("active");
        $btnMenu.addClass("active");
        
        window.setTimeout(function() {
            $bkgMenu.removeClass("active");
        }, 670);

        window.setTimeout(function() {
            $btnMenu.removeClass("active");
            $btnMenu.addClass("fa-bars");
            $iMenu.removeClass("fa-close");
            $iMenu.removeClass("fa-lg");
        }, 450);

        // window.setTimeout(function() {
        //     $iMenu.removeClass("fa-pulse");
        // }, 700);
    }

    $btnMenu.on("click", toggleMenu);
    $bkgMenu.on("click", toggleMenu);

    function swipeMenu($element) {
        gestos = new Hammer(document.body);

        gestos.on('swiperight', hideMenu);
        gestos.on('swipeleft', showMenu);
    }
// Menu
