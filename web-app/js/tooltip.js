//tooltip function
$(function() {
	$("span.contextual-help").hover(function() {
		var hint = $(this).attr("data-content");
		var tooltip = $(this).siblings("div.tooltip");
		$(this).removeAttr("title");
		tooltip.html(hint).text();
		tooltip.removeClass("off");
		setTimeout(function() {
			$("div.tooltip").addClass("off");
		}, 5000);
	});
});