<div class="page-info-nav">
  <div class="page-info">
    <span class="results-overall-index">${navData.resultsOverallIndex}</span>
    <span><g:message code="ddbnext.Of" /></span>
    <span><b><span class="results-total" id="results-total">${numberOfResultsFormatted}</span></b></span>
    <g:if test="${numberOfResultsFormatted == '1'}">
        <span id="results-label"><g:message code="ddbnext.Result_lowercase" /></span>
    </g:if>
    <g:else>
        <span id="results-label"><g:message code="ddbnext.Results_lowercase" /></span>
    </g:else>
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
        <a class="page-nav-result" href="${navData.paginationURL.firstPg}"><g:message code="ddbnext.First_Label" /></a>  
      </li>
      <li class="prev-page br ${displayLeftPagination}">
        <a class="page-nav-result" href="${navData.paginationURL.prevPg}"><g:message code="ddbnext.Previous_Label" /></a> 
      </li>
      <li class="pages-overall-index">
        <span>
            <g:message code="ddbnext.Page" /> 
            <input type="text" class="page-input off" maxlength="10" value="${navData.page}"/>
            <span class="page-nonjs">${navData.page}</span> 
            <g:message code="ddbnext.Of" /> 
            <span class="total-pages"><g:localizeNumber>${navData.totalPages}</g:localizeNumber></span>
        </span>
      </li>
      <li class="next-page bl ${displayRightPagination}">
        <a class="page-nav-result" href="${navData.paginationURL.nextPg}"><g:message code="ddbnext.Next_Label" /></a> 
      </li>
      <li class="last-page ${displayRightPagination}">
        <a class="page-nav-result" href="${navData.paginationURL.lastPg}"><g:message code="ddbnext.Last_Label" /></a> 
      </li>
    </ul>
  </div>
</div>