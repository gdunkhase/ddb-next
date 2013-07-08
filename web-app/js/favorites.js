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
//IMPORTANT FOR MERGING: This is the main function that has to be called when we are in the search results page
$(function() {
	$('#checkall').checkAll('#slaves input:checkbox', {
	    reportTo: function () {
	        var prefix = this.prop('checked') ? 'un' : '';
	        this.next().text(prefix + 'check all');
	    }
	});	
	$('#favorites-remove').submit(function() {
		var selected = new Array();
		$('#slaves input:checked').each(function() {
		    selected.push($(this).attr('name'));
		});
		  jQuery.ajax({
			    type: 'POST',
			    url: "/apis/favorites/_delete",
			    data: JSON.stringify(selected),
			    dataType: "json",
			    success: function(data){ alert(data); }
			});
		  //TODO Reload page
		  return false;
		});
	if (jsPageName == "favorites") {
		// workaround for ffox + ie click focus - prevents links that load dynamic
		// content to be focussed/active.
		$("a.noclickfocus").live('mouseup', function () { $(this).blur(); });

		// Fix for back-button problem with the searchfield: DDBNEXT-389
		if($.browser.msie){
			var queryCache = $("#querycache");
			var queryString = "";
			if(queryCache.length > 0){
				queryString = queryCache.val();
			}
			$("#form-search-header .query").val(queryString);
		}
		//searchResultsInitializer();

//		function stateManager(url){
//		$('#main-container').load(url+' .favorites-results-container', function(){
//		favoritesResultsInitializer();
//		});
//		}
	}

});

function historyManager(path){
	if(historySupport) {
		window.history.pushState({path:path},'',path);
		historyedited = true;
	}else{
		globalUrl = (path.indexOf('?')>-1)?path.split('?')[1]:path;
	}
}

//function favoritesResultsInitializer(){
//$('.results-paginator-options').removeClass('off');
//$('.page-input').removeClass('off');
//$('.page-nonjs').addClass("off");

//$('.page-filter select').change(function(){
//var paramsArray = new Array(new Array('rows', this.value), new Array('offset', 0));
//fetchResultsList(addParamToCurrentUrl(paramsArray));
//$('.clear-filters').attr('href', $('.clear-filters').attr('href').replace(/rows=\d+/g,'rows='+this.value));
//return false;
//});

//TODO CHANGE TO SELECT TO SIMPLE LINKS IMAGES
//$('.sort-results-switch select').change(function(){
//var paramsArray = new Array(new Array('sort', this.value), new Array('offset', 0));
//fetchResultsList(addParamToCurrentUrl(paramsArray));
//$('.clear-filters').attr('href', $('.clear-filters').attr('href').replace(/sort=(RELEVANCE|ALPHA_DESC|ALPHA_ASC)/i,'sort='+this.value));
//return false;
//});

function addParamToCurrentUrl(arrayParamVal, urlString){
	return addParamToUrl(arrayParamVal, null, urlString);
}
//This function will give you back the current url (if no urlParameters is
//setted) plus the new parameters added
//IMPORTANT: remember to pass your arrayParamVal already URL decoded
function addParamToUrl(arrayParamVal, path, urlString){
	var currentUrl = (historySupport)?location.search.substring(1):globalUrl;
	var queryParameters = {}, queryString = (urlString==null)?currentUrl:urlString,
			re = /([^&=]+)=([^&]*)/g, m;
	while (m = re.exec(queryString)) {
		var decodedKey = decodeURIComponent(m[1].replace(/\+/g,'%20'));
		if (queryParameters[decodedKey] == null) {
			queryParameters[decodedKey] = new Array();
		}
		queryParameters[decodeURIComponent(m[1].replace(/\+/g,'%20'))].push(decodeURIComponent(m[2].replace(/\+/g,'%20')));
	}
	$.each(arrayParamVal, function(key, value){
		queryParameters[value[0]] = value[1];
	});
	var tmp = jQuery.param(queryParameters, true);
	updateLanguageSwitch(tmp);
	if (path == null) {
		return window.location.pathname+'?'+tmp;
	}
	else {
		return path+'?'+tmp;
	}
}

function removeParamFromUrl(arrayParamVal, path, urlString){
	var currentUrl = (historySupport)?location.search.substring(1):globalUrl;
	var queryParameters = {}, queryString = (urlString==null)?currentUrl:urlString,
			re = /([^&=]+)=([^&]*)/g, m;
	while (m = re.exec(queryString)) {
		var keyParam = decodeURIComponent(m[1].replace(/\+/g,'%20'));
		if(queryParameters[keyParam]==null){
			queryParameters[keyParam] = new Array();
		}
		queryParameters[keyParam].push(decodeURIComponent(m[2].replace(/\+/g,'%20')));
	}
	$.each(arrayParamVal, function(key, value){
		if(queryParameters[value[0]] && (paramIndex = $.inArray(value[1], queryParameters[value[0]]))>-1){
			queryParameters[value[0]] = jQuery.grep(queryParameters[value[0]], function(cValue){
				return cValue != value[1];
			});
		}
	});
	var tmp = jQuery.param(queryParameters, true);
	updateLanguageSwitch(tmp);
	if (path == null) {
		return window.location.pathname+'?'+tmp;
	}
	else {
		return path+'?'+tmp;
	}
}

function updateLanguageSwitch(params) {
	params = params.replace(/\&?lang=[^\&]*/g, '');
	if (params.length > 0) {
		params += '&'
	}
	if (params.indexOf('&') == 0) {
		params = params.substring(1);
	}
	var pattern = /(.*?\?).*?(lang=\w*)/;
	$('.language-wrapper .selector').find('a[href]').each(function(){
		var matches = pattern.exec($(this).attr('href'));
		$(this).attr('href', matches[1] + params + matches[2]);
	}); 
}

$('.page-nav-result').click(function(){
	fetchResultsList(this.href);
	return false;
});

$('.page-input').keyup(function(e){
	if(e.keyCode == 13) {
		if (/^[0-9]+$/.test(this.value)) {
			if (parseInt(this.value) <= 0) {
				this.value = 1;
			}
			else if (parseInt(this.value) > parseInt($('.result-pages-count').text())) {
				this.value = $('.result-pages-count').text();
			}
		}
		else {
			this.value = 1;
		}
		$('.page-input').attr('value', this.value);
		var paramsArray = new Array(new Array('offset', (this.value - 1) * $('.page-filter').find("select").val()));
		var newUrl = addParamToCurrentUrl(paramsArray);
		fetchResultsList(newUrl);
	}
});

//function fetchResultsList(url){

//var divFavoritesResultsOverlayModal = $(document.createElement('div'));
//divFavoritesResultsOverlayModal.addClass('favorites-results-overlay-modal');
//var divFavoritesResultsOverlayWaiting = $(document.createElement('div'));
//divFavoritesResultsOverlayWaiting.addClass('favorites-results-overlay-waiting');
//var divSearchResultsOverlayImg = $(document.createElement('div'));
//divSearchResultsOverlayImg.addClass('small-loader');
//divFavoritesResultsOverlayWaiting.append(divSearchResultsOverlayImg);

//$('.favorites-results').append(divFavoritesResultsOverlayModal);
//$('.favorites-results').append(divFavoritesResultsOverlayWaiting);

//var request = $.ajax({
//type: 'GET',
//dataType: 'json',
//async: true,
//url: url+'&reqType=ajax',
//complete: function(data){
//$('.favorites-results-list').fadeOut('fast', function(){
//var JSONresponse = jQuery.parseJSON(data.responseText);
//if(JSONresponse.numberOfResults==0){
//$('.favorites-noresults-content').removeClass("off");
//$('.favorites-results-content').addClass("off");
//}else{
//$('.favorites-noresults-content').addClass("off");
//$('.favorites-results-content').removeClass("off");
//}
//$('.favorites-results-list').html(JSONresponse.results);
//$('.results-overall-index').html(JSONresponse.resultsOverallIndex);
//$('.page-input').attr("value", JSONresponse.page);
//$('.page-nonjs').html(JSONresponse.page);
//$('.total-pages').html(JSONresponse.totalPages);
//$('.result-pages-count').html(JSONresponse.totalPages);
//$('.results-total').html(JSONresponse.numberOfResults);
//if (JSONresponse.numberOfResults == "1") {
//$('#results-label').html(messages.ddbnext.Result_lowercase);
//}
//else {
//$('#results-label').html(messages.ddbnext.Results_lowercase);
//}
//if(JSONresponse.paginationURL.nextPg){
//$(".page-nav .next-page").removeClass("off");
//$(".page-nav .last-page").removeClass("off");
//$('.page-nav .next-page a').attr('href', JSONresponse.paginationURL.nextPg);
//$('.page-nav .last-page a').attr('href', JSONresponse.paginationURL.lastPg);
//}else{
//$(".page-nav .next-page").addClass("off");
//$(".page-nav .last-page").addClass("off");
//}
//if(JSONresponse.paginationURL.firstPg){
//$(".page-nav .prev-page").removeClass("off");
//$(".page-nav .first-page").removeClass("off");
//$('.page-nav .prev-page a').attr('href', JSONresponse.paginationURL.prevPg);
//$('.page-nav .first-page a').attr('href', JSONresponse.paginationURL.firstPg);
//}else{
//$(".page-nav .prev-page").addClass("off");
//$(".page-nav .first-page").addClass("off");
//}
//historyManager(url);
//$('.search-results-list').fadeIn('fast');

//divSearchResultsOverlayImg.remove();
//divFavoritesResultsOverlayWaiting.remove();
//divFavoritesResultsOverlayModal.remove();

//});
//}
//});
//}
//};
