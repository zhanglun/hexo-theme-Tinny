/**
 * Created by CrispElite on 2015/1/29 0029.
 */

$(document).ready(function () {
    //back to top
    function backToTop() {
        var buttonToTop = $('.back-top');
        $(function () {
            $(window).scroll(function () {
                if ($(this).scrollTop() > 200) {
                    buttonToTop.fadeIn();
                } else {
                    buttonToTop.fadeOut();
                }
            });
            // scroll body to 0px on click
            buttonToTop.click(function () {
                $('body,html').animate({
                    scrollTop: 0
                }, 800);
                return false;
            });
        });
    }

    backToTop();
});
