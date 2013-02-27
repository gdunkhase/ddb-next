<g:set var="facetsList" value="${['time_fct', 'place_fct', 'affiliate_fct', 'keywords_fct', 'language_fct', 'type_fct', 'sector_fct', 'provider_fct']}"></g:set>
<html>
<head>
<title><%=title%></title>
<meta name="author" content="${author}" />
<meta name="keywords" content="${keywords}" />
<meta name="robots" content="${robots}" />
<meta name="layout" content="main" />
<link rel="stylesheet" href="${resource(dir: 'css', file: 'results.css')}" />
<script>
window.onload=function(){
  $('.results-paginator-options').removeClass('off');
  $('.results-paginator-view').removeClass('off');
  
  $('.page-filter select').change(function(){
    var paramsArray = new Array(new Array('rows', this.value), new Array('offset', 0));
    fetchResultsList(addParamToCurrentUrl(paramsArray));
    return false;
  });
  
  $('.sort-results-switch select').change(function(){
    var paramsArray = new Array(new Array('sort', this.value), new Array('offset', 0));
    fetchResultsList(addParamToCurrentUrl(paramsArray));
    return false;
  });

  function addParamToCurrentUrl(arrayParamVal, urlParameters){
    var queryParameters = {}, queryString = (urlParameters==null)?location.search.substring(1):urlParameters,
      re = /([^&=]+)=([^&]*)/g, m;
    while (m = re.exec(queryString)) {
        queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    $.each(arrayParamVal, function(key, value){
      queryParameters[value[0]] = value[1];
    });
    var tmp = jQuery.param(queryParameters, true);
    return window.location.pathname+'?'+decodeURIComponent(tmp);
  }
  
  $('.page-nav a').click(function(){
    fetchResultsList(this.href);
    return false;
  });
  $('#view-list').click(function(){
    $('.summary-main .title a').each(function(index,value){
        var newTitle = (value.title.length>100)?value.title.substring(0,96)+'...':value.title;
        $(this).closest('.summary-main').find('.matches li span strong').each(function(sindex, svalue){
          newTitle = newTitle.replace(new RegExp(svalue.innerHTML, 'g'),'<strong>'+svalue.innerHTML+'</strong>'); 
        });
        value.innerHTML = newTitle;
    });
    $('#view-list').addClass('selected');
    $('#view-grid').removeClass('selected');
    $('.search-results').fadeOut('fast', function(){
      $('.results-list .summary').addClass('row');
      $('.summary-main-wrapper').addClass('span7');
      $('.thumbnail-wrapper').addClass('span2');
      $('.results-list').removeClass("grid");
      $('.search-results').fadeOut('fast');
      $('.summary .thumbnail-wrapper').each(function(){
        $(this).appendTo(this.parentNode);
      });
      $('.search-results').fadeIn('fast');
    });
    var paramsArray = new Array(new Array('viewType', 'list'));
    var newUrl = addParamToCurrentUrl(paramsArray);
    $('.page-nav a').each(function(){
      this.href = addParamToCurrentUrl(paramsArray, this.href.split("?")[1]);
    });
    window.history.pushState({path:newUrl},'',newUrl);
  });
  $('#thumbnail-filter').click(function(){
    var valueCheck = $(this);
    if(valueCheck.is(':checked'))
      var paramsArray = new Array(new Array('isThumbnailFiltered', 'true'));
    else
      var paramsArray = new Array(new Array('isThumbnailFiltered', 'false'));
    var newUrl = addParamToCurrentUrl(paramsArray);
    fetchResultsList(newUrl);
    window.history.pushState({path:newUrl},'',newUrl);
  });
  $('#view-grid').click(function(){
    $('.summary-main .title a').each(function(index,value){
        var newTitle = (value.title.length>53)?value.title.substring(0,50)+'...':value.title;
        $(this).closest('.summary-main').find('.matches li span strong').each(function(sindex, svalue){
          newTitle = newTitle.replace(new RegExp(svalue.innerHTML, 'g'),'<strong>'+svalue.innerHTML+'</strong>'); 
        });
        value.innerHTML = newTitle;
    });
    var newTitle = $('.summary-main .title a').title;
    $('#view-list').removeClass('selected');
    $('#view-grid').addClass('selected');
    $('.search-results').fadeOut('fast', function(){
      $('.results-list .summary').removeClass('row');
      $('.summary-main-wrapper').removeClass('span7');
      $('.thumbnail-wrapper').removeClass('span2');
      $('.results-list').addClass("grid");
      $('.search-results').fadeOut('fast');
      $('.summary .summary-main-wrapper').each(function(){
        $(this).appendTo(this.parentNode);
      });
      $('.search-results').fadeIn('fast');
    });
    var paramsArray = new Array(new Array('viewType', 'grid'));
    var newUrl = addParamToCurrentUrl(paramsArray);
    $('.page-nav a').each(function(){
      this.href = addParamToCurrentUrl(paramsArray, this.href.split("?")[1]);
    });
    window.history.pushState({path:newUrl},'',newUrl);
  });
  function fetchResultsList(url){
    console.log(url)
    $('.search-results').empty();
    var imgLoader = document.createElement('img');
    imgLoader.src = "${resource(dir: 'images/icons', file: 'loader_small.gif')}
    ";
            $('.search-results').prepend(imgLoader);
            var request = $
                    .ajax({
                        type : 'GET',
                        dataType : 'json',
                        async : true,
                        url : url + '&reqType=ajax',
                        complete : function(data) {
                            $('.search-results')
                                    .fadeOut(
                                            'fast',
                                            function() {
                                                var JSONresponse = jQuery
                                                        .parseJSON(data.responseText);
                                                console
                                                        .log(jQuery
                                                                .parseJSON(data.responseText));
                                                $('.search-results').html(
                                                        JSONresponse.results);
                                                $('#results-overall-index')
                                                        .html(
                                                                JSONresponse.resultsOverallIndex);
                                                $('.pages-overall-index')
                                                        .html(
                                                                JSONresponse.pagesOverallIndex);
                                                $('#results-total')
                                                        .html(
                                                                JSONresponse.numberOfResults);
                                                console.log($('.next-page a'))
                                                if (JSONresponse.paginationURL.nextPg) {
                                                    $(".page-nav .next-page")
                                                            .removeClass("off");
                                                    $(".page-nav .last-page")
                                                            .removeClass("off");
                                                    $('.page-nav .next-page a')
                                                            .attr(
                                                                    'href',
                                                                    JSONresponse.paginationURL.nextPg);
                                                    $('.page-nav .last-page a')
                                                            .attr(
                                                                    'href',
                                                                    JSONresponse.paginationURL.lastPg);
                                                } else {
                                                    $(".page-nav .next-page")
                                                            .addClass("off");
                                                    $(".page-nav .last-page")
                                                            .addClass("off");
                                                }
                                                if (JSONresponse.paginationURL.firstPg) {
                                                    $(".page-nav .prev-page")
                                                            .removeClass("off");
                                                    $(".page-nav .first-page")
                                                            .removeClass("off");
                                                    $('.page-nav .prev-page a')
                                                            .attr(
                                                                    'href',
                                                                    JSONresponse.paginationURL.prevPg);
                                                    $('.page-nav .first-page a')
                                                            .attr(
                                                                    'href',
                                                                    JSONresponse.paginationURL.firstPg);
                                                } else {
                                                    $(".page-nav .prev-page")
                                                            .addClass("off");
                                                    $(".page-nav .first-page")
                                                            .addClass("off");
                                                }
                                                window.history.pushState({
                                                    path : url
                                                }, '', url);
                                                $('.search-results').fadeIn(
                                                        'fast');
                                            });
                        }
                    });
        }
    };
</script>
</head>
<body>
    <div class="row search-results-container">

        <div class="span3 facets-container hidden-phone">
            <div class="facets-head">
                <h3>
                    <g:message code="ddbnext.SearchResultsFacetHeading_Filter_Results" />
                </h3>
                <span class="contextual-help" title=""
                    data-content='<g:message code="ddbnext.SearchResultsFacetHeading_TooltipContent" />'>
            </div>
            <div class="facets-list bt bb">
                <g:each in="${facetsList}" var="mit">
                    <g:each in="${(results.facets)}">
                        <g:if test="${mit == it.field}">
                            <div
                                class="facets-item ${(it.facetValues.size() > 0)?'active':'' } bt bb bl br">
                                <a class="h3" href="${facets.mainFacetsUrl[it.field]}"><g:message
                                        code="ddbnext.facet_${it.field}" /></a>
                                <g:if test="${it.facetValues.size() > 0}">
                                    <ul class="unstyled">
                                        <g:facetListRender
                                            facetValues="${facets.subFacetsUrl[it.field]}"
                                            facetType="${it.field}"></g:facetListRender>
                                    </ul>
                                </g:if>
                            </div>
                        </g:if>
                    </g:each>
                </g:each>
            </div>
            <a href="${clearFilters}" class="clear-filters button"><g:message
                    code="ddbnext.Clear_filters" /></a>
        </div>

        <div class="span9 search-results-content">

            <g:resultsPaginatorOptionsRender
                paginatorData="${resultsPaginatorOptions}"></g:resultsPaginatorOptionsRender>

            <g:pageInfoNavRender
                navData="${[resultsOverallIndex: resultsOverallIndex, numberOfResults: numberOfResultsFormatted, pagesOverallIndex: pagesOverallIndex, paginationURL: paginationURL]}"></g:pageInfoNavRender>

            <div class="row">
                <div class="span9">
                    <div class="results-paginator-view off">
                        <div class="group-actions">
                            <input id="thumbnail-filter" type="checkbox"
                                <g:if test='${isThumbnailFiltered == 'true'}'>checked</g:if>>
                            <label for="thumbnail-filter"
                                title="<g:message code="ddbnext.Show_items_with_thumbnails" />"><g:message
                                    code="ddbnext.Show_items_with_thumbnails" /></label> <input
                                id="toggle-cluster" type="checkbox"> <label
                                for="toggle-cluster"
                                title="<g:message code="ddbnext.View_as_Cluster" />"><g:message
                                    code="ddbnext.View_as_Cluster" /></label>
                        </div>
                        <div class="view-type-switch">
                            <button id="view-list" type="button"
                                class="<g:if test='${viewType != 'grid'}'>selected</g:if>"
                                title="<g:message code="ddbnext.View_as_List" />">
                                <g:message code="ddbnext.View_as_List" />
                            </button>
                            <button id="view-grid" type="button"
                                class="<g:if test='${viewType == 'grid'}'>selected</g:if>"
                                title="<g:message code="ddbnext.View_as_Grid" />">
                                <g:message code="ddbnext.View_as_Grid" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="span9">
                    <div class="search-results">
                        <g:if test="${results}">
                            <g:itemResultsRender results="${results.results["docs"]}"
                                itemDetailGetParams="${itemDetailGetParams}"></g:itemResultsRender>
                        </g:if>
                    </div>
                </div>
            </div>

            <g:pageInfoNavRender
                navData="${[resultsOverallIndex: resultsOverallIndex, numberOfResults: numberOfResultsFormatted, pagesOverallIndex: pagesOverallIndex, paginationURL:paginationURL]}"></g:pageInfoNavRender>

        </div>
    </div>
</body>
</html>