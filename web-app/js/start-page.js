/// <reference path="/Scripts/jquery.carouFredSel-6.2.0-packed.js"/>
/// <reference path="/Scripts/jquery.dotdotdot-1.5.1.js"/>
window.ddbAddOnloadListener(function() {
	$(function() {
		$('div.carousel').show();
		$(".article .caption").dotdotdot({});
		var carouselItems = $("#articles");
		if (carouselItems.length) {
			carouselItems.carouFredSel({
				auto : {
					items : 1,
					duration: 1000,
					easing : "linear",
					timeoutDuration : 0
				}
			}).trigger("pause");
	
			$("#articles-prev").hover(function() {
				carouselItems.trigger("configuration", [ "direction", "right" ]);
				carouselItems.trigger("play");
			}, function() {
				carouselItems.trigger("pause");
			}).click(function() {
				return false;
			});
	
			$("#articles-next").hover(function() {
				carouselItems.trigger("configuration", [ "direction", "left" ]);
				carouselItems.trigger("play");
			}, function() {
				carouselItems.trigger("pause");
			}).click(function() {
				return false;
			});
		}
	});
});