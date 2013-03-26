$(function() {
	$("#searchinput").autocomplete(
			{
				source : function(request, response) {		
					$.ajax(
						{
						url : "http://backend.deutsche-digitale-bibliothek.de:9998/search/suggest/",
						url : "/apis/autocomplete/",
						dataType : "jsonp",
						data : {
							query : request.term
						},
						success : function(data) {
							response($.map(data, function(n,i) {
								return {
									label : n.substring(0,45),
									value : n
								}
							}));
						}
					});
				},
				minLength : 2,
				select : function(event, ui) {
					console.log(ui.item ? "Selected: " + ui.item.label
							: "Nothing selected, input was " + this.value);
				},
				open : function() {
					$(this).removeClass("ui-corner-all").addClass(
							"ui-corner-top");
				},
				close : function() {
					$(this).removeClass("ui-corner-top").addClass(
							"ui-corner-all");
				}
			});
});