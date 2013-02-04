<html>
<head>
<title><%=title%></title>
<meta name="author" content="${author}" />
<meta name="keywords" content="${keywords}" />
<meta name="robots" content="${robots}" />
<meta name="layout" content="main" />
<link rel="stylesheet" href="${resource(dir: 'css', file: 'results.css')}" />
</head>
<body>
  <div class="row search-results-container">
  
    <div class="span3 facets-container">
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
    
      <div class="results-paginator-options bb">
        <div class="page-filter">
          <label><g:message code="ddbnext.SearchResultsPagination_Display" /></label>
          <span>
            <select class="select">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="20">40</option>
              <option value="20">60</option>
              <option value="20">100</option>
            </select>
          </span>
        </div>
        <div class="sort-results-switch">
          <label><g:message code="ddbnext.SearchResultsPagination_Sort_By" /></label>
          <span>
            <select class="select">
              <option value="RELEVANCE"><g:message code="ddbnext.Sort_RELEVANCE" /></option>
              <option value="ALPHA_ASC"><g:message code="ddbnext.Sort_ALPHA_ASC" /></option>
              <option value="ALPHA_DESC"><g:message code="ddbnext.Sort_ALPHA_DESC" /></option>
            </select>
          </span>
        </div>
      </div>
      
      <div class="row page-info-nav">
        <div class="span3 page-info">
          <span id="results-overall-index">1 - 20</span>
          <span><g:message code="ddbnext.Of" /></span>
          <span><b><span id="results-total"><%= results.size() %></span></b></span>
          <span><g:message code="ddbnext.Results_lowercase" /></span>
        </div>
        <div class="span6 page-nav">
          <ul class="inline">
            <li class="first-page">
              <a href="#"><g:message code="ddbnext.First_Label" /></a>  
            </li>
            <li class="prev-page br">
              <a href="#"><g:message code="ddbnext.Previous_Label" /></a> 
            </li>
            <li class="pages-overall-index">
              <span><%= pagesOverallIndex %></span>
            </li>
            <li class="next-page bl">
              <a href="#"><g:message code="ddbnext.Next_Label" /></a> 
            </li>
            <li class="last-page">
              <a href="#"><g:message code="ddbnext.Last_Label" /></a> 
            </li>
          </ul>
        </div>
      </div>
      
      <div class="row">
        <div class="span9">
          <div class="results-paginator-view">
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
			 <g:itemResultRender results="${results}"></g:itemResultRender>
            </g:if>
          </div>
        </div>
      </div>
      
      <div class="row page-info-nav">
        <div class="span3 page-info">
          <span id="results-overall-index">1 - 20</span>
          <span><g:message code="ddbnext.Of" /></span>
          <span><b><span id="results-total"><%= results.size() %></span></b></span>
          <span><g:message code="ddbnext.Results_lowercase" /></span>
        </div>
        <div class="span6 page-nav">
          <ul class="inline">
            <li class="first-page">
              <a href="#"><g:message code="ddbnext.First_Label" /></a>  
            </li>
            <li class="prev-page br">
              <a href="#"><g:message code="ddbnext.Previous_Label" /></a> 
            </li>
            <li class="pages-overall-index">
              <span><%= pagesOverallIndex %></span>
            </li>
            <li class="next-page bl">
              <a href="#"><g:message code="ddbnext.Next_Label" /></a> 
            </li>
            <li class="last-page">
              <a href="#"><g:message code="ddbnext.Last_Label" /></a> 
            </li>
          </ul>
        </div>
      </div>
      
    </div>
  </div>
</body>
</html>