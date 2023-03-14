import 'owl.carousel';
import 'bootstrap-slider';
import AOS from 'aos';
import KUTE from 'kute.js';
import 'waypoints/lib/jquery.waypoints.min';
import 'waypoints/lib/shortcuts/inview.min';
import L from 'leaflet';
import 'malihu-custom-scrollbar-plugin';


AOS.init();

// codigo mapa 

if ( $('#mapid').length ) {
    let markers = [];

    var map = L.map('mapid').setView([4.680584, -74.060593], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGFuaWVseWwxMjMiLCJhIjoiY2t2MnhjeGkxNzBhbTJ2dDk2eXg4OGR5eCJ9.tN3Wf9ObG7_cP1OR0__isQ', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);

    var marker;
    
    locations.forEach(function(element, index) {
        console.log("#element", element);

        marker = new L.marker([element[1], element[2]])
        .bindPopup(element[0])
        .addTo(map);

        markers[element[3]] = marker;
    });

    $('.searchm').on('change',function() {
        map.closePopup();

        let selectedOption = $(this).find('option:selected');
        let lat = selectedOption.attr('data-lat');
        let log = selectedOption.attr('data-log');

        $('.marker').show();
        if (lat == undefined || log == undefined) {
            map.setView([4.680584, -74.060593], 7);

            return;
        }

        let selectedCityClass = '.city-' + selectedOption.attr('data-city-id');
        $('div.marker').not(selectedCityClass).hide();

        map.setView([lat,log], 12);
    });
    
    $('.bottom .marker').on('click', function() {
        let id = $(this).attr('data-id');

        if (isNaN(id)) return;
        let clickedMarker = markers[id];

        if (clickedMarker == null || clickedMarker == undefined) return;
        map.closePopup();
        clickedMarker.fire('click');

        let lat = $(this).attr('data-lat');
        let log = $(this).attr('data-log');


        map.setView([lat,log], 17);
    })
}

$('.my-position').on('click', function(e) {
    e.preventDefault();

    if (map === undefined) return;

    map.locate({setView : true});
});

// fin codigo mapa
$(function(){
    $(".bottom").mCustomScrollbar();
});

//menu
$('.hamburger').on('click', function() {
    $(this).toggleClass('close-mini');
    if($(this).hasClass('close-mini')) {
        $('.menu-mobile').fadeIn(400).css('display', 'flex');
        $('html, body').addClass('scroll-none');
        $('header').removeClass('header-scroll');
    } else {
        $('.menu-mobile').fadeOut(400);
        $('html, body').removeClass('scroll-none');
        $('header').removeClass('header-scroll');
    }
});

if ( $('.page-general__our-products--int').length ) {
    var inview = new Waypoint.Inview({
        element: $('.page-general__our-products--int')[0],
        enter: function(direction) {
          console.log('Enter triggered with direction ' + direction)
          
        },
        entered: function(direction) {
          console.log('Entered triggered with direction ' + direction);
          if(direction == "down") {
            $('.products-hidden').slideUp(400);
          }
          if(direction == "up") {
            $('.products-hidden').slideUp(400);
          }
        },
        exit: function(direction) {
          console.log('Exit triggered with direction ' + direction);
          if(direction == "down") {
            $('.products-hidden').slideDown(400);
          }
        },
        exited: function(direction) {
          console.log('Exited triggered with direction ' + direction);
        }
    });
}


$(window).on('load', function() {
    setTimeout(function() {
        $('.load-page').addClass('active-animation');
    }, 300);
    setTimeout(function() {
        if ( $('.load-page').length ) {
            var tween = KUTE.to('#Combined-Shape', { path: '#Combined-Shape1' }, { duration: 900 });
            if (tween.element !== null) tween.start();
        }
        if ($('.page-general__slider-home').length) {
            var tween2 = KUTE.to('#white-shape', { path: '#white-shape1' }, { easing: 'easingCubicInOut', duration: 2000 });
            if (tween2.element !== null) tween2.start();
        
            var tween3 = KUTE.to('#green-shape', { path: '#green-shape1' }, { easing: 'easingCubicInOut', duration: 2000 });
            if (tween3.element !== null) tween3.start();
            
            var tween4 = KUTE.to('#move1', 
                { path: '#move2' }, 
                { easing: 'easingElasticIn', duration: 4000, yoyo: true, repeat: 500, 
            });
            if (tween4.element !== null) tween4.start();
        
            var tween5 = KUTE.to('#green1', 
                { path: '#green2' }, 
                { easing: 'easingElasticIn', duration: 3000, yoyo: true, repeat: 500, 
            });
            if (tween5.element !== null) tween5.start();
        }
    }, 300);
    $('.load-page').on('transitionend webkitTransitionEnd', function() {
        setTimeout(function() {
            $('.box-slider-fake').addClass('product-animation');
        }, 100);
    });
    $('.next-image').on('transitionend webkitTransitionEnd', function() {
        $('.deco-banner').addClass('deco-show');
    });
    $('.flotante4').on('animationend webkitAnimationEnd', function() {
        $('.start-section').addClass('show');
    });
    $('.start-section').on('transitionend webkitTransitionEnd', function() {
        $('.page-general__text-description .container').addClass('show');
    });
    $('.page-general__parent-main .main-product').eq(0).css('display', 'flex').fadeIn(0);
});

var sync1 = $(".slider-image-home .owl-carousel");
var sync2 = $(".text-slider-home .owl-carousel");
var slidesPerPage = 1;
var syncedSecondary = true;
sync1.owlCarousel({
    items: 1,
    slideSpeed: 2000,
    nav: false,
    dots: true,
    loop: true,
    animateOut: 'fadeOut',
    responsiveRefreshRate: 200,
    mouseDrag: false,
}).on('changed.owl.carousel', syncPosition);

$('.text-slider-home .btn-custom, .text-slider-home .btn-blue').on('click', function(e) {
    //console.log('#CLICK!');
    let $this = $(this);
    if ($this.attr('href') == '#') return;

    urlRedirect($this.attr('href'), $this.attr('target'));
    //window.location.href = $this.attr('href');
})

function urlRedirect(url, target = '') {
    let a = document.createElement('a');

    a.target = target;
    a.href = url;

    a.click();
}

sync2
    .on('initialized.owl.carousel', function() {
        sync2.find(".owl-item").eq(0).addClass("current");
    })
    .owlCarousel({
        items: slidesPerPage,
        dots: true,
        nav: true,
        smartSpeed: 200,
        slideSpeed: 500,
        autoHeight: true,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        animateOut: 'fadeOut',
        slideBy: slidesPerPage,
        responsiveRefreshRate: 100
    }).on('changed.owl.carousel', syncPosition2);

function syncPosition(el) {
    var count = el.item.count - 1;
    var current = Math.round(el.item.index - (el.item.count / 2) - .5);
    if (current < 0) {
        current = count;
    }
    if (current > count) {
        current = 0;
    }
    sync2
        .find(".owl-item")
        .removeClass("current")
        .eq(current)
        .addClass("current");
    var onscreen = sync2.find('.owl-item.active').length - 1;
    var start = sync2.find('.owl-item.active').first().index();
    var end = sync2.find('.owl-item.active').last().index();

    if (current > end) {
        sync2.data('owl.carousel').to(current, 100, true);
    }
    if (current < start) {
        sync2.data('owl.carousel').to(current - onscreen, 100, true);
    }
}

function syncPosition2(el) {
    if (syncedSecondary) {
        var number = el.item.index;
        sync1.data('owl.carousel').to(number, 100, true);
        $('.text-slider-home').attr('id','text-position-'+number);
        $('.header').attr('id','header-position-'+number);
        $('.page-general__parent-main .main-product').fadeOut(0);
        $('.page-general__parent-main .main-product').eq(number).css('display', 'flex').fadeIn(0);
    }
}

sync2.on("click", ".owl-item", function(e) {
    e.preventDefault();
    var number = $(this).index();
    sync1.data('owl.carousel').to(number, 300, true);
});

$(window).on('load', function() {
    setTimeout(function() {
    var syncbig1 = $(".slider-nutricional .owl-carousel");
    var syncbig2 = $(".slider-image-mini .owl-carousel");
    var slidesPerPage2 = 1;
    var syncedSecondary2 = true;

    syncbig1.owlCarousel({
        items: 1,
        slideSpeed: 2000,
        nav: false,
        autoplay: false,
        dots: true,
        loop: false,
        responsiveRefreshRate: 200,
        mouseDrag: false,
    }).on('changed.owl.carousel', syncPositionbig);

    syncbig2
        .on('initialized.owl.carousel', function() {
            syncbig2.find(".owl-item").eq(0).addClass("current");
        })
        .owlCarousel({
            items: slidesPerPage2,
            dots: true,
            nav: true,
            smartSpeed: 200,
            slideSpeed: 500,
            autoHeight: false,
            lazyLoad: true,
            slideBy: slidesPerPage2,
            responsiveRefreshRate: 100
        }).on('changed.owl.carousel', syncPositionbig2);

    function syncPositionbig(el) {
        var count = el.item.count - 1;
        var current = Math.round(el.item.index - (el.item.count / 2) - .5);
        if (current < 0) {
            current = count;
        }
        if (current > count) {
            current = 0;
        }
        syncbig2
            .find(".owl-item")
            .removeClass("current")
            .eq(current)
            .addClass("current");
        var onscreen = syncbig2.find('.owl-item.active').length - 1;
        var start = syncbig2.find('.owl-item.active').first().index();
        var end = syncbig2.find('.owl-item.active').last().index();

        if (current > end) {
            syncbig2.data('owl.carousel').to(current, 100, true);
        }
        if (current < start) {
            syncbig2.data('owl.carousel').to(current - onscreen, 100, true);
        }
    }

    function syncPositionbig2(el) {
        if (syncedSecondary2) {
            var number = el.item.index;
            syncbig1.data('owl.carousel').to(number, 100, true);
        }
    }

    syncbig2.on("click", ".owl-item", function(e) {
        e.preventDefault();
        var number = $(this).index();
        syncbig1.data('owl.carousel').to(number, 300, true);
    });
    },1000);
});

// slider world
$('.world-slider .owl-carousel').owlCarousel({
    loop: true,
    nav: true,
    dots: true,
    margin: 30,
    smartSpeed: 1500,
    responsive: {
        0: {
            items: 1,
            loop: activateCarouselLoop($('.world-slider .owl-carousel'), 1)
        },
        680: {
            items: 2,
            loop: activateCarouselLoop($('.world-slider .owl-carousel'), 2)
        },
        1000: {
            items: 3,
            loop: activateCarouselLoop($('.world-slider .owl-carousel'), 3)
        }
    }
});

$('.products-slider .owl-carousel').owlCarousel({
    loop: false,
    nav: true,
    dots: true,
    margin: 30,
    smartSpeed: 1500,
    responsive: {
        0: {
            items: 1,
            stagePadding: 40,
            //loop: activateCarouselLoop($('.products-slider .owl-carousel'), 1)
        },
        690: {
            items: 2,
            stagePadding: 60,
            //loop: activateCarouselLoop($('.products-slider .owl-carousel'), 2)
        },
        960: {
            items: 2,
            stagePadding: 60,
            //loop: activateCarouselLoop($('.products-slider .owl-carousel'), 2)
        },
        1000: {
            items: 4,
            stagePadding: 0,
            //loop: activateCarouselLoop($('.products-slider .owl-carousel'), 4)
        }
    }
});

function activateCarouselLoop(element, singleLimit) {
    //console.log('element', element);

    let $items = $(element).find('.item');
    //console.log('$items.length', $items.length);

    return $items.length > singleLimit;
}

$('.customPrevBtn').on('click',function() {
    $(this).parents('.container').find('.products-slider .owl-carousel').trigger('prev.owl')
});
$('.customNextBtn').on('click',function() {
    $(this).parents('.container').find('.products-slider .owl-carousel').trigger('next.owl')
});
/*
$('.slider-image-mini .owl-carousel').owlCarousel({
    loop: false,
    nav: true,
    dots: true,
    responsive: {
        0: {
            items: 1
        },
        690: {
            items: 1
        }
    }
});
*/

$(function() {
    var lastScrollTop = 0,
    delta = 10;
    $(window).scroll(function() {
        var nowScrollTop = $(this).scrollTop();
        if (Math.abs(lastScrollTop - nowScrollTop) >= delta) {
            if (nowScrollTop > lastScrollTop) {
                $('.header').addClass('header-scroll');
            } else {
                if(nowScrollTop < 10) {
                    $('.header').removeClass('header-scroll');
                }
            }
            lastScrollTop = nowScrollTop;
        }
        var theta = $(window).scrollTop() / 10;
		$(".effect-rotate").css({ transform: "rotate(" + theta + "deg)" });
        $(".effect-rotate-2").css({ transform: "rotate(-" + theta + "deg)" });
    });
});

//modal video 
$('.page-general__video-section').on('click', function(e) {
    e.preventDefault();

    var urliframe = $('.modals__modal-video iframe').attr('data-url');
    $('.modals__modal-video iframe').attr('src', urliframe);
    $('.modals__modal-video').fadeIn(600).css('display','flex');
});
$('.close-m, .capclose').on('click', function(e) {
    e.preventDefault();
    $('.modals__modal-video').fadeOut(600);
    setTimeout(function() {
        $('.modals__modal-video iframe').attr('src', '');
    },600);
});

$('.btn-video').on('click', function(e) {
    e.preventDefault();
    var urliframe = $(this).attr('data-url');
    $('.modals__modal-video iframe').attr('src', urliframe);
    $('.modals__modal-video').fadeIn(600).css('display','flex');
});
$('.close-m, .capclose').on('click', function(e) {
    e.preventDefault();
    $('.modals__modal-video').fadeOut(600);

    setTimeout(function() {
        $('.modals__modal-video iframe').attr('src', '');
    },600);
});

$('.modals__modal-video iframe').on("load", function() {
    let $this = $(this);

    if ($this.attr('src') == "") return;
    $this.attr('data-url', $this.attr('src'));

    if ($('.page-general__video-section h3').text() != '') return;
    $('.page-general__video-section h3').text($this.attr('title'));
});

//slider circular 

var aument = 145;
var num = 0;
/*$('.parent-slider .item').each(function(i) {
    if(i == 0) {
        if($(this).hasClass('initial')) {
            $('.parent-slider .item').last().fadeIn(0);
        }
    }
});*/
function move() {
    $('.parent-slider .item').each(function(i) {
        if(i <= 1) {
            if($(this).hasClass('initial')) {
                $('.parent-slider .item').last().fadeOut(0);
            } 
        } else if (i >= 4) {
            if($(this).hasClass('initial')) {
                $('.parent-slider .item').eq(0).fadeOut(0);
            } 
        } else {
            if($(this).hasClass('initial')) {
                $('.parent-slider .item').last().fadeIn(0);
                $('.parent-slider .item').eq(0).fadeIn(0);
            }
        }
    });
}

$('.parent-slider .item').on('click',function(){
    setTimeout(function(){
        $(this).removeClass('move');
    },300);
    
    move();

    $('.parent-slider .item').not(this).removeClass('initial');
    if($(this).hasClass('move')){
        $(this).removeClass('move').addClass('initial');
        num += 1;
        aument += 55;
    } else if ($(this).hasClass('initial')) {
        $('.parent-slider .item').not(this).removeClass('initial');
        aument += 0;
    } else {
        $(this).addClass('initial');
        $(this).next().addClass('move');
        num -= 1;
        aument -= 55;
    }
    
    $('.slider').css('transform','translate(22%, 0) rotate(-'+aument+'deg)');
});

$('.button-slider .next').on('click', function(){
    var count = $('.parent-slider .item').length - 1;
    var total = 55*count+145;
    if(aument < total) {
        console.log(aument);
        aument += 55;
        num += 1;
        move();
        $('.slider').css('transform','translate(22%, 0) rotate(-'+aument+'deg)');
        $('.parent-slider .item').eq(num).prev().removeClass('move initial');
        $('.parent-slider .item').eq(num).addClass('initial').removeClass('move');  
    } else {
        aument += 0;
    }
});

$('.button-slider .prev').on('click', function(){
    if(aument > 145) {
        aument -= 55;
        num -= 1;
        move();
        $('.parent-slider .item').eq(num).next().addClass('move').removeClass('initial');
        $('.parent-slider .item').eq(num).addClass('initial').removeClass('move');
        $('.slider').css('transform','translate(22%, 0) rotate(-'+aument+'deg)');
    } else {
        aument -= 0;
    }
});

$('.mobile-slider .owl-carousel').owlCarousel({
    loop: true,
    nav: false,
    dots: true,
    margin: 15,
    responsive: {
        0: {
            items: 1,
            stagePadding: 60,
            loop: activateCarouselLoop($('.opinions-slider .owl-carousel'), 1)
        },
        380: {
            items: 1,
            stagePadding: 60,
            loop: activateCarouselLoop($('.opinions-slider .owl-carousel'), 2)
        },
        680: {
            items: 3,
            stagePadding: 20,
            loop: activateCarouselLoop($('.opinions-slider .owl-carousel'), 3)
        }
    }
}).on('changed.owl.carousel initialized.owl.carousel', function (event) {
    $(event.target).find('.owl-item').removeClass('first').eq(event.item.index).addClass('first');
    console.log(event);

    setTimeout(function(){
        if (event.relatedTarget['_drag']['direction'] == "right") {
           $('.mobile-slider .owl-carousel').find('.owl-item .box-main picture img').css('transform', 'rotate(0deg)');
           $('.mobile-slider .owl-carousel').find('.first .box-main picture img').css('transform', 'rotate(180deg)');
           event.relatedTarget['_drag']['direction'] = null;
        } else {
            $('.mobile-slider .owl-carousel').find('.owl-item .box-main picture img').css('transform', 'rotate(0deg)');
            $('.mobile-slider .owl-carousel').find('.first .box-main picture img').css('transform', 'rotate(-180deg)');
        }
    }, 0);
});

$('.slider-tags .owl-carousel').owlCarousel({
    loop: true,
    nav: false,
    dots: true,
    margin: 15,
    autoWidth: true,
    responsive: {
        0: {
            items: 1,
            stagePadding: 20,
        },
        350: {
            items: 2,
            stagePadding: 20,
        },
        680: {
            items: 3,
            stagePadding: 20,
        }
    }
});

$('.links-mini-mobile').owlCarousel({
    loop: true,
    nav: false,
    dots: true,
    margin: 15,
    responsive: {
        0: {
            items: 2,
            stagePadding: 30,
        },
        350: {
            items: 2,
            stagePadding: 30,
        },
        680: {
            items: 3,
            stagePadding: 30,
        }
    }
});

$('.slider-fixed .owl-carousel').owlCarousel({
    loop: true,
    nav: false,
    dots: true,
    margin: 15,
    autoWidth: true,
    responsive: {
        0: {
            items: 1,
            stagePadding: 20,
        },
        350: {
            items: 2,
            stagePadding: 20,
        },
        680: {
            items: 3,
            stagePadding: 20,
        }
    }
});

$('.recipes-search .owl-carousel').owlCarousel({
    loop: true,
    nav: true,
    dots: true,
    margin: 15,
    responsive: {
        0: {
            items: 1,
            stagePadding: 20,
        },
        350: {
            items: 1,
            stagePadding: 20,
        },
        680: {
            items: 1,
            stagePadding: 100,
        },
        1000: {
            items: 3,
            stagePadding: 0,
            loop: activateCarouselLoop($('.recipes-search .owl-carousel'), 3)
        }
    }
});



$('.mobile-slider-recipes-home .owl-carousel').owlCarousel({
    loop: true,
    nav: true,
    dots: true,
    margin: 15,
    responsive: {
        0: {
            items: 1,
            stagePadding: 20,
        },
        350: {
            items: 1,
            stagePadding: 20,
        },
        680: {
            items: 2,
            stagePadding: 20,
        },
        1180: {
            items: 1,
            stagePadding: 100,
        }
    }
});

$('.opinions-slider .owl-carousel').owlCarousel({
    loop: true,
    nav: true,
    dots: true,
    margin: 0,
    center: false,
    responsive: {
        0: {
            margin: 30,
            items: 1,
            stagePadding: 20,
            loop: activateCarouselLoop($('.opinions-slider .owl-carousel'), 1)
        },
        350: {
            margin: 30,
            items: 1,
            stagePadding: 20,
            loop: activateCarouselLoop($('.opinions-slider .owl-carousel'), 1)
        },
        680: {
            margin: 0,
            items: 3,
            stagePadding: 0,
            loop: activateCarouselLoop($('.opinions-slider .owl-carousel'), 3)
        }
    }
});

$('.customPrevBtno').on('click',function() {
    $('.opinions-slider .owl-carousel').trigger('prev.owl')
});
$('.customNextBtno').on('click',function() {
    $('.opinions-slider .owl-carousel').trigger('next.owl')
});

$('.opinions-slider-modal .owl-carousel').owlCarousel({
    loop: true,
    nav: true,
    dots: true,
    margin: 30,
    responsive: {
        0: {
            margin: 20,
            items: 1,
            stagePadding: 20,
            loop: activateCarouselLoop($('.opinions-slider-modal .owl-carousel'), 1)
        },
        350: {
            margin: 20,
            items: 1,
            stagePadding: 20,
            loop: activateCarouselLoop($('.opinions-slider-modal .owl-carousel'), 1)
        },
        680: {
            margin: 30,
            items: 2,
            stagePadding: 0,
            loop: activateCarouselLoop($('.opinions-slider-modal .owl-carousel'), 2)
        }
    }
});

$('.customPrevBtnm').on('click',function() {
    $('.opinions-slider-modal .owl-carousel').trigger('prev.owl')
});
$('.customNextBtnm').on('click',function() {
    $('.opinions-slider-modal .owl-carousel').trigger('next.owl')
});

if ($(window).width() > 1024) {
    $(".fixed-brands").hover(
        function() {
            $('.fixed-brands .general').stop(true, true).slideDown(600);
        },
        function() {
            $('.fixed-brands .general').slideUp(600);
        }
    );
} else {
    $('.fixed-brands').on('click', function() {
        $(this).toggleClass('open');
        if ($(this).hasClass('open')) {
            $('.fixed-brands').addClass('expand');
            $('.fixed-brands .general').stop(true, true).delay(300).slideDown(600);
        } else {
            $('.fixed-brands .general').slideUp(600);
            setTimeout(function(){
                $('.fixed-brands').removeClass('expand');
            }, 600);
        }
    });
}

if($(window).width() > 1100) {
    $('.page-general__our-products--recipes .clickfil').on('click touchend', function(e) {
        e.preventDefault();
        $(this).find('.box-hover').addClass('check-effect');
        $('.page-general__our-products--recipes .clickfil').not(this).find('.box-hover').removeClass('check-effect');
    });
}


$('.select-parent').on('click', function() {
    var total = 0;
    $(this).next().find('.check').each(function(i){
        if(i <= 4) {
            total += $(this).innerHeight();
        }
    });
    $(this).toggleClass('open-nav');
    if($(this).hasClass('open-nav')){
        $(this).next().css('height',total+'px');
    } else {
        $(this).next().css('height','0px');
    }
    $('.select-parent').not(this).next().css('height','0px');
    $('.select-parent').not(this).removeClass('open-nav');
});


$('.acordeon h2').on('click', function() {
    $(this).toggleClass('active');
    if($(this).hasClass('active')) {
        $(this).next().slideDown(300);
    } else {
        $(this).next().slideUp(300);
    }
    $('.acordeon h2').not(this).removeClass('active');
    $('.acordeon h2').not(this).next().slideUp(300);
});

$('.clear').on('click', function(e) {
    e.preventDefault();
    $('input[type=checkbox]:checked').each(function(i) {
        $(this).prop('checked', false);
    });
});

$('.recipes-mobile-filters .clear').on('click', function(e) {
    e.preventDefault();

    //Mobile  
    let $owl = $('.slider-tags .owl-carousel');
    $owl.owlCarousel();

    //Remove tags
    $owl.find('.tag ').remove();
    $('.tags .tag').remove();

    

    //Mobile
    $owl.trigger('refresh.owl.carousel');

    applyRecipeFilter();
});

$('.close-filters').on('click', function(e) {
    e.preventDefault();
    $('.modals__filters').fadeOut(600);
});

$('.btn-filter').on('click', function(e) {
    e.preventDefault();
    $('.modals__filters').fadeIn(600).css('display', 'flex');
});

$('.btn-order').on('click', function(e) {
    e.preventDefault();
    var total = 0;
    $(this).next().find('.check').each(function(i){
        if(i <= 2) {
            total += $(this).innerHeight() * 1.20;
        }
    });
    $(this).toggleClass('open-nav');
    if($(this).hasClass('open-nav')){
        $(this).next().css('height',total+'px');
    } else {
        $(this).next().css('height','0px');
    }
    $('.select-parent').not(this).next().css('height','0px');
    $('.select-parent').not(this).removeClass('open-nav');
});

$('.anchor').on('click', function(e) {
    e.preventDefault();
    $(this).addClass('active');
    $('.anchor').not(this).removeClass('active');
    var num = $('.anchor').index(this);
    if(num == 0) {
        $('.page-general__ingredients-recipes').fadeIn(400);
        $('.page-general__preparation, .page-general__tips-mini').fadeOut(400);
        $('.page-general__map-section #mapid').fadeIn(400);
        $('.page-general__map-section .bottom').fadeOut(400);
    } else {
        $('.page-general__ingredients-recipes').fadeOut(400);
        $('.page-general__preparation, .page-general__tips-mini').fadeIn(400);
        $('.page-general__map-section #mapid').fadeOut(400);
        $('.page-general__map-section .bottom').fadeIn(400);
    }
});

$('.start-section p').on('click', function(e) {
    $('.modals__modal-opinion').fadeIn(400);
});

$('.close-opinions').on('click', function() {
    $('.modals__modal-opinion').fadeOut(400);
    $('html, body').removeClass('scroll-none');
});


$('.social-share').on('click', function() {
    $(this).toggleClass('openshare');
    if($(this).hasClass('openshare')) {
        $('.share-icons').fadeIn(300).css('display', 'flex');
    } else {
        $('.share-icons').fadeOut(300);
    }
});

$('.open-social img').on('click', function() {
    $(this).toggleClass('opensharem');
    var changeimg = $(this).attr('data-change');
    var changeinitial = $(this).attr('data-initial');
    if($(this).hasClass('opensharem')) {
        $(this).attr('src',changeimg);
        $('.icons-social').fadeIn(300).css('display', 'flex');
    } else {
        $('.icons-social').fadeOut(300);
        $(this).attr('src',changeinitial);
    }
});

$('.compartirm').on('click', function() {
    $(this).toggleClass('opensharem');
    var changeimg = $(this).attr('data-change');
    var changeinitial = $(this).attr('data-initial');
    if($(this).hasClass('opensharem')) {
        $(this).attr('src',changeimg);
        $('.social-fixed-mobile').slideDown(300).css('display', 'flex');
        $('.fixed-brands').css('bottom', '15rem');
    } else {
        $('.fixed-brands').css('bottom', '3rem');
        $('.social-fixed-mobile').slideUp(300);
        $(this).attr('src',changeinitial);
    }
});

$('.social-fixed-mobile .title').on('click', function() {
    $('.compartirm').removeClass('opensharem');
    var changeinitial = $('.compartirm').attr('data-initial');
    $('.compartirm').attr('src',changeinitial);
    $('.social-fixed-mobile').slideUp(300);
    $('.fixed-brands').css('bottom', '3rem');
});
$('.social-share-mobile').on('click', function() {
    $('.page-general__modal-shape .social-fixed-mobile').fadeIn(300).css('display','flex');
});

$('.calcular-mobile').on('click', function(e) {
    e.preventDefault();

    let size = parseInt($('#ex1m').val());
    let weight = parseInt($('#ex2m').val());
    
    let imc = calImc(size, weight);
    setCalcDataWithIMC(imc);

    $('.count-box .text-info h5').text(imc);
    $('.box-shape').css('display', 'block');


    $('html, body').addClass('scroll-none');
    $('.page-general__modal-shape').fadeIn(300);
});

$('.close-blue a').on('click', function(e) {
    e.preventDefault();
    $('html, body').removeClass('scroll-none');
    $('.page-general__modal-shape').fadeOut(300);
});

$('.return-calculate').on('click', function(e) {
    e.preventDefault();
    $('html, body').removeClass('scroll-none');
    $('.page-general__modal-shape').fadeOut(300);
});


$( "a.scrollLink" ).on('click', function( e ) {
    e.preventDefault();
    var tops;
    if($(window).width() > 960) {
        tops = 240;
    } else {
        tops = 160
    }
    $("html, body").animate({ scrollTop: $($(this).attr("href")).offset().top - tops }, 1000);
});

$( "a.scrollsearch" ).on('click', function( e ) {
    e.preventDefault();
    var tops;
    if($(window).width() > 960) {
        tops = 140;
    } else {
        tops = 100
    }
    $("html, body").animate({ scrollTop: $($(this).attr("href")).offset().top - tops }, 1000);
});

if ( $('.page-general__nutricional').length ) {
    $(window).on('load', function() {
        setTimeout(function(){

        
        var inview2 = new Waypoint.Inview({
            element: $('.text-info')[0],
            enter: function(direction) {
                console.log('ENTRO COMPLETAMENTE' + direction)
                setTimeout(function() {
                    /*$('.c100').each(function(i) {
                        var datan = $(this).attr('data-num');
                        $(this).addClass('p'+datan); 
                        $(this).removeClass('p0'); 
                    }); */
                    $('.single-chart .circle').addClass('progress');
                },800);
            },
            entered: function(direction) {
                /*console.log('ENTRA COMPLETAMENTE' + direction);
                
                if(direction == "down") {
                    console.log('bajando');
                    //$('.single-chart .circle').removeClass('progress');
                }
                if(direction == "up") {
                    //$('.products-hidden').slideUp(400);
                    
                } 
                setTimeout(function() {
                    /*$('.c100').each(function(i) {
                        var datan = $(this).attr('data-num');
                        $(this).addClass('p'+datan); 
                        $(this).removeClass('p0'); 
                    }); 
                    $('.single-chart .circle').addClass('progress');
                },1000);*/
                
            },
            exit: function(direction) {
                //console.log('SALE ' + direction);
                //$('.single-chart .circle').removeClass('progress');
            },
            exited: function(direction) {
                //console.log('SALE ' + direction);
                //$('.single-chart .circle').removeClass('progress');
                if(direction == "up") {
                    console.log('salio completamente');
                    $('.single-chart .circle').removeClass('progress');
                }
            }
        });
    }, 2000);
    });
}

if ( $('.page-general__filter-big').length ) {
    var inview3 = new Waypoint.Inview({
        element: $('.page-general__filter-big')[0],
        enter: function(direction) {
            console.log('Enter triggered with direction ' + direction)
            $('.button-filter').addClass('active-calculator');
        },
        entered: function(direction) {
            console.log('Entered triggered with direction ' + direction);
        },
        exit: function(direction) {
            console.log('Exit triggered with direction ' + direction);
        },
        exited: function(direction) {
            console.log('Exited triggered with direction ' + direction);
            $('.button-filter').removeClass('active-calculator');
        }
    });
}

//parallax scroll
$(window).on("load scroll", function() {
    var parallaxElement = $(".parallax_scroll"),
    parallaxQuantity = parallaxElement.length;
    window.requestAnimationFrame(function() {
        for (var i = 0; i < parallaxQuantity; i++) {
        var currentElement = parallaxElement.eq(i),
            windowTop = $(window).scrollTop(),
            elementTop = currentElement.offset().top,
            elementHeight = currentElement.height(),
            viewPortHeight = window.innerHeight * 0.5 - elementHeight * 0.5,
            scrolled = windowTop - elementTop + viewPortHeight;
            currentElement.css({
                transform: "translate3d(0," + scrolled * -0.15 + "px, 0)"
            });
        }
    });
});

// slider world
$('.sliderworld2 .owl-carousel').owlCarousel({
    loop: true,
    nav: true,
    dots: false,
    margin: 0,
    smartSpeed: 1000,
    responsive: {
        0: {
            items: 1
        },
        680: {
            items: 1
        },
        1000: {
            items: 1
        }
    }
});

$('.filter-nav a').on('click', function(e){
    e.preventDefault();
    $(this).parent('li').addClass('active');
    $('.filter-nav a').not(this).parent('li').removeClass('active');
});

$('.filter-nav-tabs a').on('click', function(e){
    e.preventDefault();

    let parent = $(this).parents('.tabs-content');

    $(this).parent('li').addClass('active');
    parent.find('.filter-nav-tabs a').not(this).parent('li').removeClass('active');
    var index = $(this).parents('.parent-tabs').find('a').index(this);
    
    console.log('#index', index);

    parent.find('.parent-items-tabs .box-tabs').fadeOut(0);
    parent.find('.parent-items-tabs .box-tabs').eq(index).fadeIn(0);
});

$(window).on('load',function(parent){
    function moveMarker2(parent) {
    
      var activeNav = parent.find('.filter-nav-tabs .active a');

      var activewidth = $(activeNav).width();
      var activePadLeft = parseFloat($(activeNav).css('padding-left'));
      var activePadRight = parseFloat($(activeNav).css('padding-right'));
      var totalWidth = activewidth + activePadLeft + activePadRight;
      
      var precedingAnchorWidth = anchorWidthCounter(parent);

      var activeMarker = parent.find('.filter-nav-tabs .active-marker');

      $(activeMarker).css('display','block');
      
      $(activeMarker).css('width', totalWidth);
  
      $(activeMarker).css('left', precedingAnchorWidth);

      console.log(precedingAnchorWidth);
    }

    moveMarker2($('.tabs-content'));
    
    function anchorWidthCounter(parent) {
      var anchorWidths = 0;
      var a;
      var aWidth;
      var aPadLeft;
      var aPadRight;
      var aTotalWidth;
      parent.find('.filter-nav-tabs li').each(function(index, elem) {
        var activeTest = $(elem).hasClass('active');
        if(activeTest) {
          return false;
        }
  
        a = $(elem).find('a');
        aWidth = a.width();
        aPadLeft = parseFloat(a.css('padding-left'));
        aPadRight = parseFloat(a.css('padding-right'));
        aTotalWidth = aWidth + aPadLeft + aPadRight;
  
        anchorWidths = anchorWidths + aTotalWidth;
      });
  
      return anchorWidths;
    }
    
    $('.filter-nav-tabs a').on('click',function(e) {
        e.preventDefault();
        
        //$('.filter-nav-tabs li').removeClass('active');
        //$(this).parents('li').addClass('active');
        moveMarker2($(this).parents('.tabs-content'));
    });
});


$('.col-social form, .search-btn').on('click', function(e){
    e.preventDefault();
    $('.modals__search').fadeIn(500);
    setTimeout(function(){
        $('.modals__search input').focus(); 
    },320);
});
$('.cap-search, .close-search').on('click touchend', function(e){
    e.preventDefault();

    $('.modals__search').fadeOut(500);
});

$('.comments-number').on('click', function(e){
    $('.modals__modal-opinion').fadeIn(400);
    $('html, body').addClass('scroll-none');
});

let isAjaxCommentRunning = false;
$('.comment-form').on('submit', function(e) {
    e.preventDefault();

    if (isAjaxCommentRunning) return;
    isAjaxCommentRunning = true;

    let $form = $(this);
    var $owl = $('.opinions-slider-modal .owl-carousel');
    $owl.owlCarousel();

    $.ajax({
        method: $form.attr('method'),
        url: $form.attr('action'),
        data: $form.serialize(),
    }).done(function(response) {
        if (response.success) {
            $('.comment-counter').text(response.num_comments + ' comentarios');
            $('.close-opinions').trigger('click');

            $('.post-rating img').remove();
            $('.post-rating').prepend(response.html_stars);


            $owl.trigger('add.owl.carousel', [response.html]).trigger('refresh.owl.carousel');
            $owl.trigger('refresh.owl.carousel');

            $form.find('.comment-field').val('');

            //$form.trigger('reset');
        }
    }).always(function(){
        isAjaxCommentRunning = false;
    });
});

$("#uploadSingleBtn").on('change', function() {
    let currentInputFile = $(this);

    $('#limit-file-error').hide();
    $('.name-image').html('');

    if (!validateFormatByName(currentInputFile.val())) {
        $('#limit-file-error').text('Solo puedes subir imágenes en formato jpg, jpeg y png con un peso máximo de 5 MB.').show();
        return;
    }

    for (var i = 0; i < $(this).get(0).files.length; ++i) {
        let attachmentName = currentInputFile.val().replace(/C:\\fakepath\\/i, '');
        $('.name-image').html(`<li id='preview-${ currentInputFile.attr('id') }' data-assoc-id='${ currentInputFile.attr('id') }' class="col-md-6 parent-dlt-attch"><img src='${ URL.createObjectURL(currentInputFile.prop('files')[0]) }'> <div class="box"><span>${attachmentName}</span> <i class="lni lni-close"></i></div></li>`);
    }
});


if ($('#uploadSingleBtn').length) {
    $('form').on('click', '#attachments li .lni-close', function(e) {
        $(this).parent().remove();

        $('#' + $(this).parent().data('assocId')).val('');
    });
} else {
    $('form').on('click', '.parent-dlt-attch .lni-close', function(e) {
        e.preventDefault();
    
        $('#limit-file-error').hide();
    
        $('#' + $(this).parent().data('assocId')).remove();
        $(this).parents('li').remove();
    
        $('#uploadBtn').val('');
        //$(this).remove();
    });
}

/* show file */
$('#uploadBtn').on('change', function() {
    $('#limit-file-error').hide();

    let $form = $('form.main-form').last() || $('form');
    let $input = $(this);

    let limit = 4;

    let attachments = document.getElementById('uploadBtn');
    let files = attachments.files;
    
    let item = '';
    let list = new DataTransfer;

    for(let i=0; i < files.length; i++) {
        if (typeof files[i] === 'undefined') break;

        list.items.add(files[i])
    }

    attachments.files = list.files;

    //Files
    for (var i = 0; i < files.length; i++) {
        if ($form.find('.attachments').length >= limit) {
            $('#limit-file-error').text('Máximo 4 imágenes').show();
            break;
        }

        let file = attachments.files.item(i);
        if (!validateFormatByName(file.name)) {
            $('#limit-file-error').text('Solo puedes subir imágenes en formato jpg, jpeg y png con un peso máximo de 5 MB.').show();
            continue;
        }

        /*if ($form.find('.attachments').length >= limit) {
            let lastAttachment = $form.find('.attachments').last();
            
            $('#preview-' + lastAttachment.attr('id')).remove();
            lastAttachment.remove();
        }*/

        const input = document.createElement("input");

        input.id = "id" + Math.random().toString(16).slice(2);
        input.name = 'attachments[]';
        input.type = "file";
        input.files = new FileList(file);
        input.className  = "attachments";
        input.style.display='none';
        input.required = this.hasAttribute('required');

        $form.prepend(input);
    }

    let nameImage =  $('.name-image');
    let attachmentFiles = $('.attachments');

    for (var i = 0; i < attachmentFiles.length; i++) {
        let currentInputFile = $(attachmentFiles[i]);
        let attachmentName = currentInputFile.val().replace(/C:\\fakepath\\/i, '');

        item += `<li id='preview-${ currentInputFile.attr('id') }' data-assoc-id='${ currentInputFile.attr('id') }' class="col-md-6 parent-dlt-attch"><img src='${ URL.createObjectURL(currentInputFile.prop('files')[0]) }'> <div class="box"><span>${attachmentName}</span> <i class="lni lni-close"></i></div></li>`;
        
    }

    nameImage.html(item);
    $input.val('');
    //$('#limit-file-error').hide().delay(5000).fadeOut(400);
});

function validateFormatByName(name) {
    let allowed = ['png', 'jpeg', 'jpg'];
    let ext = name.match(/\.([^\.]+)$/)[1];

    return allowed.includes(ext);
}

var position_tooltip;
if($(window).width() > 1100) {
    position_tooltip = 'bottom';
} else {
    position_tooltip = 'top';
}

function clearAttachments() {
    $('#attachments').empty();
    $('li.parent-dlt-attch').remove();
    $('input.attachments').remove();
}

class FileList {
    constructor(...items) {
    // flatten rest parameter
        items = [].concat(...items);
        // check if every element of array is an instance of `File`
        if (items.length && !items.every(file => file instanceof File)) {
            throw new TypeError("expected argument to FileList is File or array of File objects");
        }
        // use `ClipboardEvent("").clipboardData` for Firefox, which returns `null` at Chromium
        // we just need the `DataTransfer` instance referenced by `.clipboardData`
        const dt = new ClipboardEvent("").clipboardData || new DataTransfer();
        // add `File` objects to `DataTransfer` `.items`
        for (let file of items) {
            dt.items.add(file)
        }
        return dt.files;
    }
}


$('#ex1,#ex1m').slider({
    tooltip: 'always',
    tooltip_position: position_tooltip,
    max: 210,
	formatter: function(value) {
		return value + 'cm';
	}
});

$('#ex2,#ex2m').slider({
    tooltip: 'always',
    tooltip_position: position_tooltip,
	formatter: function(value) {
		return value + 'kg';
	}
});

let isCongratulationsAjaxRunning = false;
$('#congratulations-form, #suggestion-form').on('submit', function(e) {
    e.preventDefault();

    $('.ajax-message').hide().removeClass('alert-danger alert-success');

    if (isCongratulationsAjaxRunning) return;
    isCongratulationsAjaxRunning = true;

    let $form = $(this);

    $.ajax({
        method: $form.attr('method'),
        url: $form.attr('action'),
        data: new FormData( this ),
        processData: false,
        contentType: false
    }).done(function(response) {
        if (response.success) {
            $('.ajax-message').text(response.data.message);
            
            clearAttachments();
            $form.trigger('reset');
            $form.find('#uploadBtn').trigger('change');

            $('.hide-with-success-message').hide();

            $('.response span.ajax-response').html(response.data.message);
            $('.form-box .response').show();
            
            $('.ajax-message').addClass('alert-success');
        } else {
            $('.ajax-message').addClass('alert-danger');
        }

        $('.ajax-message').text(response.data.message);

        $('.ajax-message').show();
    }).fail(function() {
        $('.ajax-message').show();
        $('.ajax-message').addClass('alert-danger');
        $('.ajax-message').text('Se ha producido un error inesperado.');
        
    }).always(function() {
        $('.ajax-message').show();
        isCongratulationsAjaxRunning = false;
    });
});

let departments = [];

function loadCountryData(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", themeLink + "/static/colombia.json", true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

loadCountryData(function(response) {
    // Parse JSON string into object
    departments = JSON.parse(response);

    $("#department").empty().append(new Option("Departamento", ""));
    $.each(departments, function(index, department) {
        $('#department').append(`<option value='${department.departamento}' data-id="${department.id}">${department.departamento}</option>`);
    });
});

$('#department').on('change', function(e) {
    let selectedOption = $(this).find(':selected');
    if (selectedOption.data('id') === '') return;

    let id = parseInt(selectedOption.data('id'));

    $("#municipality").empty().append(new Option("Municipio", ""));
    let department = departments[id];

    if (department === undefined) return;

    $.each(department.ciudades, function(index, city) {
        $("#municipality").append(new Option(city, city));
    });
});

$('.copy-href-to-clipboard').on('click', function (e) {
    e.preventDefault();

    var copyText = $(this).attr('href');
    document.addEventListener('copy', function(e) {
       e.clipboardData.setData('text/plain', copyText);
       e.preventDefault();
    }, true);
    var __this = $(this);
    __this.append( "<small>¡Copiado!</small>" );
    setTimeout(function() {
        __this.find("small").remove();
    },1500);
    document.execCommand('copy');
});

$('.filters.search-filters').on( 'change', function(e) {
    console.log('#ch #filter');

    //let $checkbox = $(this);
    let $checked = $('.parent-check input:checked');
    let $containers = $('.result-container');
    let counter = 0;
    
    if ($checked.length > 0) $containers.hide();
    else { 
        $containers.show();
        $.each( $containers, function(index, container) {
            counter += $(container).data('count');
        });
    }

    $.each( $checked, function(index, element) {
        let $chk = $(element);
        let $container = $($('.' + $chk.val()));
        counter += parseInt($container.data('count'));

        $container.show();
    });

    $('#counter').text(counter + ' resultados');
    AOS.refresh();
});

$('.recipe-card-filter, .row-products a.clickfil, .mobile-slider--products a.clickfil').on('click touchend', function(e) {
    let $this = $(this);

    if ($this.prop("tagName") == 'A' && $this.attr('href') != '#') return;
    e.preventDefault();

    console.log('#chkp0', $('#chkp0'));
    $('.all-filters').prop('checked', false).trigger('change');

    console.log('#click');
    
    loadProductFilterByCategoryId($this.data('id'));
});

function loadProductFilterByCategoryId(categoryId) {
    $('.select-parent.open-nav').trigger('click');
    //$('#result-container').html('');

    $('.checksparent.desktop-products').html('');
    $('.checksparent.mobile-products').html('');

    let data = {
        'category_id': categoryId,
        'action': 'async_products_by_category'
    };

    $('#category-id').val(categoryId);

    $.ajax({
        method: 'post',
        url: siteLink + '/wp-admin/admin-ajax.php',
        data: data,
    }).done(function(response) {
        if (response.success) {
            $('.checksparent.desktop-products').html(response.desktop_html);
            $('.checksparent.mobile-products').html(response.mobile_html);
            $('#result-container').html(response.recipe_html);

            if ($("#result-container").length > 0) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $("#result-container").offset().top - 200
                }, 1000);
            }
        }
    });

    loadRelatedProductsByCategoryId(categoryId);
}

//Tags
$(document).on('change', '.recipes-desktop-filters input[type=checkbox], .recipes-mobile-filters input[type=checkbox]', function(e) {
    let $this = $(this);

    //console.log('#e.isTrusted', e.originalEvent && e.originalEvent.isTrusted);

    let value = $this.val();

    //alert(value);

    if (value == 0) return;

    let name = $this.data('name');
    let color = $this.data('color');
    let type = $this.data('type');

    let similarCheckboxes = $("input[type='checkbox'][data-type='" + type + "'][value='" + value + "']");

    //alert(name);

    if ($this.is(':checked')) {
        addTag($this.attr('id'), value, name, color);
    } else {
        //Mobile  
        let $owl = $('.slider-tags .owl-carousel');
        $owl.owlCarousel();

        //Remove tags
        $('.tag-' + value).remove();

        //Mobile
        $owl.trigger('refresh.owl.carousel');
    }

    similarCheckboxes.prop('checked', $this.is(":checked"));

    if (!(e.originalEvent && e.originalEvent.isTrusted)) return;
    applyRecipeFilter();
});

function addTag(origenId, classId, text, color = '#EAE2C2') {
    if (color == '' || color == undefined) color = '#EAE2C2';
    let classTagId = `tag-${ classId }`;

    if (classId == 'desc') {
        $('.tag-asc').remove();
    } else if (classId == 'asc') {
        $('.tag-desc').remove();
    }

    //Mobile
    let $owl = $('.slider-tags .owl-carousel');
    $owl.owlCarousel();
    if ($owl.find( `.tag-${ classId }`).length > 0) return;

    let mobileTag = `<a href="#" class="tag tag-${ classId }" data-oid="${ origenId }" style="background: ${ color };">${ text }</a>`;

    $owl.trigger('add.owl.carousel', [mobileTag]).trigger('refresh.owl.carousel');
    $owl.trigger('refresh.owl.carousel');

    //Desktop
    let desktopTag = `
        <div class="tag tag-${ classId }" data-oid="${ origenId }">
            <img src="${ themeLink }/src/assets/images/x.svg" alt="ico">
            ${ text }
        </div>
    `;
    $('.page-general__result-text .tags').append(desktopTag);
}

$('.tags').on('click', '.tag img', function(e) {
    
    let $this = $(this);
    let classes = $this.parent().prop("classList");

    if (classes.length < 2) return;

    let classId = classes[1];
    $('.' + classId).remove();
    let oid = $this.parent().data('oid');
    let checkbox = $('#' + oid);

    //alert("oid: "+oid);
    console.log("JSON.stringify"+JSON.stringify($this));

    if (oid == undefined) return;

    //Mobile
    let $owl = $('.slider-tags .owl-carousel');
    $owl.owlCarousel();

    //Remove tags
    

    $owl.trigger('refresh.owl.carousel'); //Mobile
    //applyRecipeFilter();

    checkbox.prop('checked', !checkbox.prop("checked"))


    if ($this.is(':checked')) {
        addTag($this.attr('id'), value, name, color);
    } else {
        //Mobile  
        let $owl = $('.slider-tags .owl-carousel');
        $owl.owlCarousel();

        //Remove tags
        $('.tag-' + classId).remove();

        //Mobile
        $owl.trigger('refresh.owl.carousel');
    }

  

    if (!(e.originalEvent && e.originalEvent.isTrusted)) return;


    //if (!(e.originalEvent && e.originalEvent.isTrusted)) return;
    applyRecipeFilter();
});

$('.all-filters').on('change', function(e) {
    let $this = $(this);
    let $container = $this.closest('.checksparent');

    let checkboxes = $container.find('input[type="checkbox"]');
    
    checkboxes.prop('checked', $this.is(':checked'));
    if (checkboxes.length >= 2) checkboxes.not('.all-filters').trigger('change'); //$(checkboxes[0]).trigger('change');

    if (!(e.originalEvent && e.originalEvent.isTrusted)) return;
    applyRecipeFilter();

});

function applyRecipeFilter() {
    $('.recipes-desktop-filters #current-page-number').val('1').trigger('change');
    $('.recipes-desktop-filters').trigger('submit', false);
}

$('.recipes-desktop-filters').on('submit', function(e, isPageItem) {
    e.preventDefault();

    let $form = $(this);
    //$('#result-container').html('');
    $('#result-counter').text('')
    $('#result-container').html('');

    //alert("$form: "+JSON.stringify($form));

    $.ajax({
        method: $form.attr('method'),
        url: $form.attr('action'),
        data: $form.serialize(),
    }).done(function(response) {
        if (response.success) {
            let $html = $(response.html);

            $('#result-container').html($html);

            let results = $('#result-container .found-posts').val();
            let resultText = $('#result-container .found-posts').val() + ' resultado';

            $("#result-counter").html($('.found-posts').val() + ' resultado');
            
            if (results != 1) resultText += 's';

            $('p#result-counter').text(resultText);
            console.log('resultText: '+resultText);
            $('.page-general__result-text').show();
        }
    }).always(function() {
        if (isPageItem && $("#result-container").length > 0) {
            $([document.documentElement, document.body]).animate({
                scrollTop: $("#result-container").offset().top - 250
            }, 1000);
        }
    });
});

//Ajax pagination result-container
$('#result-container').on('click', '.page-number', function(e) {
    e.preventDefault();

    console.log('#RCS');

    let _this = $(this);
    if (_this.hasClass('current')) return;

    let clickedPage = _this.text();

    let pagination = _this.parent().parent();
    let currents = pagination.find('.current');
    currents.removeClass('current');

    //_this.parent().addClass('current');

    $('#current-page-number').val(clickedPage).trigger('change');
    $('.recipes-desktop-filters, .ajax-form').trigger('submit', true);
    //loadFilterResults();
});

//Next button
$('#result-container').on('click', '.page-item.last', function(e) {
    e.preventDefault();

    let currentPage = $('#current-page-number');
    let nextPageNumber = parseInt(currentPage.val()) + 1;

    currentPage.val(nextPageNumber);
    currentPage.trigger( 'change');

    $('.recipes-desktop-filters, .ajax-form').trigger('submit', true);
    //loadFilterResults();
});

//Previous button
$('#result-container').on('click', '.page-item.first', function(e) {
    e.preventDefault();

    let currentPage = $('#current-page-number');
    let previousPageNumber = parseInt(currentPage.val()) + -1;

    currentPage.val(previousPageNumber);
    currentPage.trigger( 'change');
    $('.recipes-desktop-filters, .ajax-form').trigger('submit', true);
    //loadFilterResults();
});

function loadRelatedProductsByCategoryId(categoryId) {
    let data = {
        'category_id': categoryId,
        'action': 'async_related_products_by_category'
    };

    $.ajax({
        method: 'post',
        url: siteLink + '/wp-admin/admin-ajax.php',
        data: data,
    }).done(function(response) {
        if (response.success) {
            var $owl = $('.page-general__releated-recipes .owl-carousel');
            $owl.owlCarousel();
            $owl.trigger('replace.owl.carousel', [response.html]).trigger('refresh.owl.carousel');
            $(".page-general__result-text").css('display','none');
        }
    });
}
    
$('.button-filter').on('click', function (e) {
    $('.page-general__filter-big').addClass('active-calculator');
    $(this).fadeOut(0);
});

$('.hidden-btn').on('click', function (e) {
    $('.page-general__filter-big').removeClass('active-calculator');
    $('.button-filter').fadeIn(0);
});
var globalOrderfilter;
$('.order-filter').on('change', function(e) {
    let $this = $(this);
    let orderFilter = $('.order-filter:checked');
    let categoryId = $('.filter-nav .active').data('categoryId');
    
    globalOrderfilter=$this.attr('value');

    console.log( $(this).prop('checked'));

    if ($(this).prop('checked')== true ) {
        $(".btn-order").removeClass("open-nav");
        $(".parent-desck").css('height','0');
    };

    jQuery('.close-filters').click()

    orderFilter.not($this).prop('checked', false);

    if (!(e.originalEvent && e.originalEvent.isTrusted)) return;
    loadNewsByCategoryId(categoryId);
});

/*$('#order-asc').on('change', function() {
    let $this = $(this);
    let $desc = $('#order-desc');

    $desc.prop('checked', false);
});

$('#order-desc').on('change', function() {
    let $this = $(this);
    let $asc = $('#order-asc');

    $asc.prop('checked', false);
});*/

$('.news-categories .filters').on('change', function(e) {
    let $this = $(this);
    let checkboxes = $('.order-filter:checked');
    console.log($this.attr('value'));
    checkboxes.not($this).prop('checked', false);
    loadNewsByCategoryId($this.attr('value'));
    
    jQuery( "#chk-24" ).prop( "checked", false );
    jQuery( "#chk-25" ).prop( "checked", false );
    jQuery( "#chk-13" ).prop( "checked", false ); 
    jQuery('.close-filters').click()
});

$('.circle-images a.circle').on('click', function(e) {
    e.preventDefault();

    let $this = $(this);
    let $tab = $($('.tab-' + $this.data('id')));

    console.log('#tab', $tab);
    
    $tab.trigger('click');
});

function loadNewsByCategoryId(categoryId) {
    if (categoryId == '' || categoryId == undefined) categoryId = '';
    $('#result-container').html('');

    let page = $("#current-page-number").val();

    let data = {
        'category_id': categoryId,
        'page': page,
        'action': 'async_news_by_category'
    };

    let orderFilter = $('.order-filter:checked');
    if (orderFilter.length) {
        data['order'] = $(orderFilter[0]).val();
    }

    $.ajax({
        method: 'post',
        url: siteLink + '/wp-admin/admin-ajax.php',
        data: data,
    }).done(function(response) {
        if (response.success) {
            $('#result-container').html(response.html);
        }
    }).always(function() {
        if ($(".parent-filter-nav").length > 0) {
            $([document.documentElement, document.body]).animate({
                scrollTop: $(".parent-filter-nav").offset().top - 200
            }, 1000);
        }
    })
}

$('.healthy-world-result #current-page-number').on('change', function(e) {
    console.log('#NMBR');
    let categoryId = $('.filter-nav .active').data('categoryId');
    loadNewsByCategoryId(categoryId);
});

$(window).on('load',function(){
    function moveMarker() {
      var activeNav = $('.filter-nav .active a');
      var activewidth = $(activeNav).width();
      var activePadLeft = parseFloat($(activeNav).css('padding-left'));
      var activePadRight = parseFloat($(activeNav).css('padding-right'));
      var totalWidth = activewidth + activePadLeft + activePadRight;
      
      var precedingAnchorWidth = anchorWidthCounter();
      var activeMarker = $('.filter-nav .active-marker');
      $(activeMarker).css('display','block');
      
      $(activeMarker).css('width', totalWidth);
  
      $(activeMarker).css('left', precedingAnchorWidth);
    }
    moveMarker();
    
    function anchorWidthCounter() {
      var anchorWidths = 0;
      var a;
      var aWidth;
      var aPadLeft;
      var aPadRight;
      var aTotalWidth;
      $('.filter-nav li').each(function(index, elem) {
        var activeTest = $(elem).hasClass('active');
        if(activeTest) {
          return false;
        }
  
        a = $(elem).find('a');
        aWidth = a.width();
        aPadLeft = parseFloat(a.css('padding-left'));
        aPadRight = parseFloat(a.css('padding-right'));
        aTotalWidth = aWidth + aPadLeft + aPadRight;
  
        anchorWidths = anchorWidths + aTotalWidth;
      });
  
      return anchorWidths;
    }
    
    $('.filter-nav a').on('click',function(e) {
        e.preventDefault();
        
        $('.filter-nav li').removeClass('active');
        $(this).parents('li').addClass('active');
        moveMarker();
    });
});

$('.filter-nav a').on('click', function() {

    if ($(this).data('redirect')) { 
        console.log('#redirect');
        location.href = $(this).attr('href');
        
        return;
    }

    console.log('#no redirect');

    $("#current-page-number").val(1);

    console.log('categoryId', $(this).data('categoryId'));
    loadNewsByCategoryId($(this).data('categoryId'));
});

let isConsumerAjaxRunning = false;
$('#consumer-step-2').on('submit', function(e) {
    e.preventDefault();

    $('.ajax-message').hide().removeClass('alert-danger alert-success');

    if (isConsumerAjaxRunning) return;
    isConsumerAjaxRunning = true;

    let $form = $(this);
    let formData = new FormData(this);

    //alert("formData: "+formData);

    $.ajax({
        method: $form.attr('method'),
        url: $form.attr('action'),
        data: formData,
        contentType: "application/json",
        dataType: "json",
        processData: false,
        contentType: false
    }).done(function(response) {
        if (response.success) {
            console.log('#success');
            $('.ajax-message').text(response.data.message);

            clearAttachments();
            $form.trigger('reset');
            $form.find('#uploadBtn').trigger('change');

            $('.hide-with-success-message').hide();

            $('.response span.ajax-response').html(response.data.message);
            $('.form-box .response').show();

            $('.ajax-message').addClass('alert-success');
        } else {
            $('.ajax-message').text(response.data.message);
            $('.ajax-message').addClass('alert-danger');
        }

        $('.ajax-message').show();
    }).fail(function() {
        $('.ajax-message').addClass('alert-danger');
    }).always(function() {
        $('.ajax-message').show();
        isConsumerAjaxRunning = false;
    });
});

let isConsumerReportAjaxRunning = false;
$('#consumer-report-form').on('submit', function(e) {
    e.preventDefault();

    $('.ajax-message').hide().removeClass('alert-danger alert-success');
    
    if (isConsumerReportAjaxRunning) return;
    isConsumerReportAjaxRunning = true;

    let $form = $(this);
    

    $.ajax({
        method: $form.attr('method'),
        url: $form.attr('action'),
        data: new FormData( this ),
        processData: false,
        contentType: false
    }).done(function(response) {
        if (response.success) {
            $('.ajax-message').text(response.data.message);

            clearAttachments();
            $form.trigger('reset');
            $form.find('#uploadBtn').trigger('change');
            
            $('.hide-with-success-message').hide();

            $('.response span.ajax-response').html(response.data.message);
            $('.form-box .response').show();

            $('.ajax-message').addClass('alert-success');

        } else {
            $('.ajax-message').addClass('alert-danger');
            $('.ajax-message').text(response.data.message);
        }
    }).fail(function() {
        $('.ajax-message').addClass('alert-danger');
        $('.ajax-message').text('Se ha producido un error inesperado.');
    }).always(function() {
        $('.ajax-message').show();
        isConsumerReportAjaxRunning = false;
    });
});

$('a.back').not('.ignore-event').on('click', function(e) {
    if (document.referrer.indexOf(window.location.host) !== -1){ 
        e.preventDefault(); history.back(); 
    }
});


$('#calc-imc .btn-blue').on('click', function () {
    let size = parseInt($('#ex1').val());
    let weight = parseInt($('#ex2').val());
    
    let imc = calImc(size, weight);
    setCalcDataWithIMC(imc);
    //let testF = ((input - min) * 100) / (max - min);
    

    $('.count-box .text-info h5').text(imc);
    
    // (Increased Value-Original value)/Original value × 100


    //range = Math.abs(range);

    //console.log("#range", range);

    $('#calc-imc .btn-blue').text('VOLVER A CALCULAR');
    $('.box-shape').css('display', 'block');

    
    $("html, body").animate({
        scrollTop: $('.container .box-shape').offset().top
    }, 1000);

});

function setCalcDataWithIMC(imc) {
    let range = 1;
    if (imc < 18.5) {
        if (imc < 5) range = 10;
        else if (imc < 9) range = 20;
        else if (imc < 14) range = 30;
        else range = 40;

        $('.text-title').text('Bajo peso');
        $('.text-description').text(`Su IMC es ${imc},  indica que su peso es bajo para  su estatura.`);

        $('.text-message strong').text(`Te sugerimos consultar con un nutricionista para que elabore un diagnóstico completo de tu estado nutricional.`);
    }
    else if (imc > 18.5 && imc <= 24.9) {
        $('.text-title').text('Peso normal');
        $('.text-description').text(`Su IMC es ${imc},  indica que su peso es adecuado  para  su estatura.`);

        $('.text-message strong').text(`Procura mantener  un peso normal haciendo  actividad  física  y consumiendo una  alimentación balanceada.`);

        if (imc < 19) range = 41;
        else if (imc < 20) range = 50;
        else if (imc < 22) range = 70;
        else range = 81;
    }
    else if (imc >= 25 && imc <= 29.9) {
        $('.text-title').text('Sobrepeso');
        $('.text-description').text(`Su IMC es ${imc},  indica que su peso para su  estatura  clasifica como sobrepeso`);

        $('.text-message strong').text(`Te sugerimos consultar con un nutricionista para que elabore un diagnóstico completo de tu estado nutricional.`);

        if (imc < 26) range = 89;
        else if (imc < 27) range = 90;
        else if (imc < 28) range = 115;
        else range = 137;
    }
    else  { 
        $('.text-title').text('Obesidad');
        $('.text-description').text(`Su IMC es ${imc},  indica que el peso para su  estatura  clasifica como obesidad`);

        $('.text-message strong').text(`Te sugerimos consultar con un nutricionista para que elabore un diagnóstico completo de tu estado nutricional.`);

        if (imc < 31) range = 138;
        else if (imc < 32) range = 150;
        else if (imc < 34) range = 160;
        else range = 173;
    }

    range = Math.round(Math.abs(range));
    rotateElement($('.circle-move'), range);
}

//$('#calc-imc .btn-blue').trigger('click');

function calImc(size, weight) {
    if (weight == 0 || size == 0) return;

    let mts = size / 100;
    
    return parseFloat((weight / Math.pow(mts, 2)).toFixed(2)) + 0;
}

$('.modal-form').on('click', function(e) {
    e.preventDefault();
    $(".modals__modal-form-simple").fadeIn(400).css('display','flex');
});
$('.close-simple, .modals__modal-form-simple .cap-close').on('click', function(e) {
    e.preventDefault();
    $(".modals__modal-form-simple").fadeOut(400);
});

function rotateElement($el, degrees) {
    $el.css({
  '-webkit-transform' : 'rotate('+degrees+'deg)',
     '-moz-transform' : 'rotate('+degrees+'deg)',  
      '-ms-transform' : 'rotate('+degrees+'deg)',  
       '-o-transform' : 'rotate('+degrees+'deg)',  
          'transform' : 'rotate('+degrees+'deg)',  
               'zoom' : 1

    });
}

$(function(){
    if ( typeof termid !== 'undefined' ) {
        loadNewsByCategoryId(termid);
        $(window).scrollTop(0);
    }
});