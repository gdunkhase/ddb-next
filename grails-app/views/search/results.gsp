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
  $(".results-paginator-options").removeClass("off");
  $(".results-paginator-view").removeClass("off");
  $(".page-nav a").click(function(){
	fetchResultsList(this.href);
    return false;
  });
  function fetchResultsList(url){
    $('.search-results').empty();
    var imgLoader = document.createElement('img');
    imgLoader.src = "${resource(dir: 'images/icons', file: 'loader_small.gif')}";
    $('.search-results').prepend(imgLoader);
    var request = $.ajax({
      type: 'GET',
      dataType: 'json',
      async: false,
      url: url+'&reqType=ajax',
      complete: function(data){
        var JSONresponse = jQuery.parseJSON(data.responseText);
        console.log(jQuery.parseJSON(data.responseText));
        $('.search-results').html(JSONresponse.results);
        $('#results-overall-index').html(JSONresponse.resultsOverallIndex);
        $('.pages-overall-index').html(JSONresponse.pagesOverallIndex);
        console.log($('.next-page a'))
        if(JSONresponse.paginationURL.nextPg){
          $(".page-nav .next-page").removeClass("off");
          $(".page-nav .last-page").removeClass("off");
          $('.page-nav .next-page a').attr('href', JSONresponse.paginationURL.nextPg);
          $('.page-nav .last-page a').attr('href', JSONresponse.paginationURL.lastPg);
        }else{
          $(".page-nav .next-page").addClass("off");
          $(".page-nav .last-page").addClass("off");
        }
        if(JSONresponse.paginationURL.firstPg){
          $(".page-nav .prev-page").removeClass("off");
          $(".page-nav .first-page").removeClass("off");
          $('.page-nav .prev-page a').attr('href', JSONresponse.paginationURL.prevPg);
          $('.page-nav .first-page a').attr('href', JSONresponse.paginationURL.firstPg);
        }else{
          $(".page-nav .prev-page").addClass("off");
          $(".page-nav .first-page").addClass("off");
        }
        window.history.pushState({path:url},'',url);
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
        <h3><g:message code="ddbnext.SearchResultsFacetHeading_Filter_Results" /></h3>
        <span class="contextual-help" title="" data-content='<g:message code="ddbnext.SearchResultsFacetHeading_TooltipContent" />'>
      </div>
      <div class="facets-list bt bb">
        <div class="facets-item bt bb bl br">
          <a class="h3" href="#"><g:message code="ddbnext.facet_time" /></a>
        </div>
        <div class="facets-item bt bb bl br">
          <a class="h3" href="#"><g:message code="ddbnext.facet_place" /></a>
        </div>
        <div class="facets-item bt bb bl br">
          <a class="h3" href="#"><g:message code="ddbnext.facet_affiliate" /></a>
        </div>
        <div class="facets-item bt bb bl br">
          <a class="h3" href="#"><g:message code="ddbnext.facet_keywords" /></a>
        </div>
        <div class="facets-item bt bb bl br">
          <a class="h3" href="#"><g:message code="ddbnext.facet_language" /></a>
        </div>
        <div class="facets-item bt bb bl br">
          <a class="h3" href="#"><g:message code="ddbnext.facet_type" /></a>
        </div>
        <div class="facets-item bt bb bl br">
          <a class="h3" href="#"><g:message code="ddbnext.facet_sector" /></a>
        </div>
        <div class="facets-item bt bb bl br">
          <a class="h3" href="#"><g:message code="ddbnext.facet_provider" /></a>
        </div>
      </div>
    </div>
    
    <div class="span9 search-results-content">
    
      <g:resultsPaginatorOptionsRender paginatorData="${resultsPaginatorOptions}"></g:resultsPaginatorOptionsRender>
      
      <g:pageInfoNavRender navData="${[resultsOverallIndex: resultsOverallIndex, numberOfResults: results.numberOfResults, pagesOverallIndex: pagesOverallIndex, paginationURL: paginationURL]}"></g:pageInfoNavRender>
      
      <div class="row">
        <div class="span9">
          <div class="results-paginator-view off">
            <div class="group-actions">
              <input id="thumbnail-filter" type="checkbox">
              <label for="thumbnail-filter" title="<g:message code="ddbnext.Show_items_with_thumbnails" />"><g:message code="ddbnext.Show_items_with_thumbnails" /></label>
              <input id="toggle-cluster" type="checkbox">
              <label for="toggle-cluster" title="<g:message code="ddbnext.View_as_Cluster" />"><g:message code="ddbnext.View_as_Cluster" /></label>
            </div>
            <div class="view-type-switch">
              <button id="view-list" type="button" class="selected" title="<g:message code="ddbnext.View_as_List" />"><g:message code="ddbnext.View_as_List" /></button>
              <button id="view-grid" type="button" class="" title="<g:message code="ddbnext.View_as_Grid" />"><g:message code="ddbnext.View_as_Grid" /></button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="span9">
          <div class="search-results">
            <g:if test="${results}">
			 <g:itemResultsRender results="${results.results["docs"]}"></g:itemResultsRender>
            </g:if>
          </div>
        </div>
      </div>
      
      <g:pageInfoNavRender navData="${[resultsOverallIndex: resultsOverallIndex, numberOfResults: results.numberOfResults, pagesOverallIndex: pagesOverallIndex, paginationURL:paginationURL]}"></g:pageInfoNavRender>
      
    </div>
  </div>
</body>
</html>