<g:set var="facetsList" value="${['time_fct', 'place_fct', 'affiliate_fct', 'keywords_fct', 'language_fct', 'type_fct', 'sector_fct', 'provider_fct']}"></g:set>
<html>
<head>
<title>${title} - <g:message code="ddbnext.OpenSearch_Plugin_ShortName_Max16CharsNoHtml"/></title>
<meta name="layout" content="main" />
<jawr:script src="/i18n/messages.js"/>
<script src="${resource(dir: 'js', file: 'search-results.js')}"></script>
</head>

<body>
  <div class="row search-results-container">
  
    <div class="span3 facets-container hidden-phone">
      <div class="facets-head">
        <h3><g:message code="ddbnext.SearchResultsFacetHeading_Filter_Results" /></h3>
        <span class="contextual-help hidden-phone hidden-tablet" title="" data-content='<g:message code="ddbnext.SearchResultsFacetHeading_TooltipContent" />'></span>
      </div>
      <div class="facets-list bt bb">
        <g:each in="${facetsList}" var="mit">
          <g:each in="${(facets.selectedFacets)}">
            <g:if test="${mit == it.field}">
              <div class="facets-item ${(it.facetValues.size() > 0)?'active':'' } bt bb bl br">
                <a class="h3" href="${facets.mainFacetsUrl[it.field]}" data-fctName="${it.field}"><g:message code="ddbnext.facet_${it.field}" /></a>
                <g:if test="${it.facetValues.size() > 0}">
                  <ul class="unstyled">
                    <g:facetListRender facetValues="${facets.subFacetsUrl[it.field]}" facetType="${it.field}"></g:facetListRender>
                  </ul>
                </g:if>
              </div>
            </g:if>
          </g:each>
        </g:each>
      </div>
      <a href="${clearFilters}" class="clear-filters button" ><g:message code="ddbnext.Clear_filters"/></a>
    </div>
    
    <div class="span9 search-results-content">
      <div class="off result-pages-count">${totalPages}</div>
    
      <g:resultsPaginatorOptionsRender paginatorData="${resultsPaginatorOptions}"></g:resultsPaginatorOptionsRender>
      
      <g:pageInfoNavRender navData="${[resultsOverallIndex: resultsOverallIndex, numberOfResults: numberOfResultsFormatted, page: page, totalPages: totalPages, paginationURL: paginationURL]}"></g:pageInfoNavRender>
      
      <div class="row">
        <div class="span9">
          <div class="results-paginator-view off">
            <div class="group-actions">
              <input id="thumbnail-filter" type="checkbox" <g:if test='${isThumbnailFiltered == 'true'}'>checked</g:if>>
              <label for="thumbnail-filter" title="<g:message code="ddbnext.Show_items_with_thumbnails" />"><g:message code="ddbnext.Show_items_with_thumbnails" /></label>
              <input class="disabled" id="toggle-cluster" type="checkbox" disabled="disabled">
              <label class="disabled" for="toggle-cluster" title="<g:message code="ddbnext.View_as_Cluster" />"><g:message code="ddbnext.View_as_Cluster" /></label>
            </div>
            <div class="view-type-switch">
              <button id="view-list" type="button" class="<g:if test='${viewType != 'grid'}'>selected</g:if>" title="<g:message code="ddbnext.View_as_List" />"><g:message code="ddbnext.View_as_List" /></button>
              <button id="view-grid" type="button" class="<g:if test='${viewType == 'grid'}'>selected</g:if>" title="<g:message code="ddbnext.View_as_Grid" />"><g:message code="ddbnext.View_as_Grid" /></button>
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
      
      <g:pageInfoNavRender navData="${[resultsOverallIndex: resultsOverallIndex, numberOfResults: numberOfResultsFormatted, page: page, totalPages: totalPages, paginationURL:paginationURL]}"></g:pageInfoNavRender>
      
    </div>
  </div>
</body>
</html>
