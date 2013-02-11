<div class="page-info-nav">
  <div class="page-info">
    <span id="results-overall-index">${navData.resultsOverallIndex}</span>
    <span><g:message code="ddbnext.Of" /></span>
    <span><b><span id="results-total">${navData.numberOfResults}</span></b></span>
    <span><g:message code="ddbnext.Results_lowercase" /></span>
  </div>
  <div class="page-nav">
    <ul class="inline">
      <g:if test="${navData.paginationURL.firstPg !=null}">
        <li class="first-page">
          <a href="${navData.paginationURL.firstPg}"><g:message code="ddbnext.First_Label" /></a>  
        </li>
        <li class="prev-page br">
          <a href="${navData.paginationURL.prevPg}"><g:message code="ddbnext.Previous_Label" /></a> 
        </li>
      </g:if>
      <li class="pages-overall-index">
        <span>${navData.pagesOverallIndex}</span>
      </li>
      <g:if test="${navData.paginationURL.lastPg !=null}">
        <li class="next-page bl">
          <a href="${navData.paginationURL.nextPg}"><g:message code="ddbnext.Next_Label" /></a> 
        </li>
        <li class="last-page">
          <a href="${navData.paginationURL.lastPg}"><g:message code="ddbnext.Last_Label" /></a> 
        </li>
      </g:if>
    </ul>
  </div>
</div>