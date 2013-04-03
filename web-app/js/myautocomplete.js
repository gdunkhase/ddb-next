/*
 * Copyright (C) 2013 FIZ Karlsruhe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
$(function() {
  $('input.query').autocomplete(
    {
	  source : function(request, response) {		
		$.ajax(
		  {
			url : "http://backend.deutsche-digitale-bibliothek.de:9998/search/suggest/",
			url : "apis/autocomplete/",
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
	  open : function() {
	    $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
	  },
	  close : function() {
	    $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
	  }
	});
});
