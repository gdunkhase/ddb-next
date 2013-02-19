<div class="page-info-nav">
  <div class="page-info">
    <span id="results-overall-index">${navData.resultsOverallIndex}</span>
    <span><g:message code="ddbnext.Of" /></span>
    <span><b><span id="results-total">${navData.numberOfResults}</span></b></span>
    <span><g:message code="ddbnext.Results_lowercase" /></span>
  </div>
  <div class="page-nav">
    <ul class="inline">
      <g:if test="${navData.paginationURL.firstPg ==null}">
        <g:set var="displayLeftPagination" value="off"></g:set>
      </g:if>
      <g:if test="${navData.paginationURL.lastPg ==null}">
        <g:set var="displayRightPagination" value="off"></g:set>
      </g:if>
      <li class="first-page ${displayLeftPagination}">
        <a href="${navData.paginationURL.firstPg}"><g:message code="ddbnext.First_Label" /></a>  
      </li>
      <li class="prev-page br ${displayLeftPagination}">
        <a href="${navData.paginationURL.prevPg}"><g:message code="ddbnext.Previous_Label" /></a> 
      </li>
      <li class="pages-overall-index">
        <span>${navData.pagesOverallIndex}</span>
      </li>
      <li class="next-page bl ${displayRightPagination}">
        <a href="${navData.paginationURL.nextPg}"><g:message code="ddbnext.Next_Label" /></a> 
      </li>
      <li class="last-page ${displayRightPagination}">
        <a href="${navData.paginationURL.lastPg}"><g:message code="ddbnext.Last_Label" /></a> 
      </li>
    </ul>
  </div>
</div>