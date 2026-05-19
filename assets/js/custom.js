(function ($) {
  "use strict";

  $(window).on('load', function () {

    var $grid = $('.properties-box').isotope({
      itemSelector: '.properties-items',
      layoutMode: 'fitRows'
    });

    $('.properties-filter a').on('click', function (e) {
      e.preventDefault();
      $('.properties-filter a').removeClass('is_active');
      $(this).addClass('is_active');

      var filterValue = $(this).attr('data-filter');
      $grid.isotope({ filter: filterValue });
    });

    $("#js-preloader").addClass("loaded");

    $("#preloader").animate({ opacity: "0" }, 600, function () {
      setTimeout(function () {
        $("#preloader").css("visibility", "hidden").fadeOut();
      }, 300);
    });
  });

  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    var box = $(".header-text").height();
    var header = $("header").height();

    if (scroll >= box - header) {
      $("header").addClass("background-header");
    } else {
      $("header").removeClass("background-header");
    }
  });

  $(document).ready(function () {
    $(".owl-banner").owlCarousel({
      center: true,
      items: 1,
      loop: true,
      nav: true,
      dots: true,
      autoplay: true,
      autoplayTimeout: 5000,
      autoplayHoverPause: true,
      navText: [
        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        '<i class="fa fa-angle-right" aria-hidden="true"></i>',
      ],
      margin: 30,
      responsive: {
        992: { items: 1 },
        1200: { items: 1 },
      },
    });
  });

  var width = $(window).width();
  $(window).resize(function () {
    if (width > 767 && $(window).width() < 767) {
      location.reload();
    } else if (width < 767 && $(window).width() > 767) {
      location.reload();
    }
  });

  if ($(".menu-trigger").length) {
    $(".menu-trigger").on("click", function () {
      $(this).toggleClass("active");
      $(".header-area .nav").slideToggle(200);
    });
  }

  $(".scroll-to-section a[href*='#']:not([href='#'])").on("click", function () {
    if (
      location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") &&
      location.hostname == this.hostname
    ) {
      var target = $(this.hash);
      target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
      if (target.length) {
        var width = $(window).width();
        if (width < 991) {
          $(".menu-trigger").removeClass("active");
          $(".header-area .nav").slideUp(200);
        }
        $("html,body").animate({ scrollTop: target.offset().top - 80 }, 700);
        return false;
      }
    }
  });

})(window.jQuery);
