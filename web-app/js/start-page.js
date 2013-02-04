/// <reference path="/Scripts/jquery.carouFredSel-6.2.0-packed.js"/>
/// <reference path="/Scripts/jquery.dotdotdot-1.5.1.js"/>

$(function () {
    $('body.js.start').show();
    var carouselItems = $("#carouselItems");
    if (carouselItems.length) {
        carouselItems.carouFredSel({
            auto: {
                items: 1,
                duration: 1000,
                easing: "linear",
                pauseDuration: 0
            }
        }).trigger("pause");

        $("#carouselPrev").hover(function () {
            carouselItems.trigger("configuration", ["direction", "right"]);
            carouselItems.trigger("play");
        }, function () {
            carouselItems.trigger("pause");
        }).click(function () {
            return false;
        });

        $("#carouselNext").hover(function () {
            carouselItems.trigger("configuration", ["direction", "left"]);
            carouselItems.trigger("play");
        }, function () {
            carouselItems.trigger("pause");
        }).click(function () {
            return false;
        });

        $(".article .caption").dotdotdot({});
    }
});