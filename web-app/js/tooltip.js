//tooltip function
$(function() {
	var lock = false;
	$("span.contextual-help").hover(function() {
		var hint = $(this).attr("data-content");
		var tooltip = $(this).siblings("div.tooltip");
		$(this).removeAttr("title");
		tooltip.html(hint).text();
		if(!lock){
		  lock=true;
		  tooltip.removeClass("off");
		  setTimeout(function() {
			  $("div.tooltip").addClass("off");
			  lock=false;
		  }, 5000);
		}
	});
});