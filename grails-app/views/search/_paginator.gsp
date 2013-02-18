<div class="results-paginator-options bb off">
  <div class="page-filter">
    <label><g:message code="ddbnext.SearchResultsPagination_Display" /></label>
    <span>
      <select class="select">
        <g:each in="${paginatorData.pageFilter}">
          <option value="${it}" <g:if test="${paginatorData.pageFilterSelected == it}">selected</g:if> >${it}</option>
        </g:each>
      </select>
    </span>
  </div>
  <div class="sort-results-switch">
    <label><g:message code="ddbnext.SearchResultsPagination_Sort_By" /></label>
    <span>
      <select class="select">
        <option value="RELEVANCE" <g:if test="${paginatorData.sortResultsSwitch == 'RELEVANCE'}">selected</g:if>><g:message code="ddbnext.Sort_RELEVANCE" /></option>
        <option value="ALPHA_ASC" <g:if test="${paginatorData.sortResultsSwitch == 'ALPHA_ASC'}">selected</g:if>><g:message code="ddbnext.Sort_ALPHA_ASC" /></option>
        <option value="ALPHA_DESC" <g:if test="${paginatorData.sortResultsSwitch == 'ALPHA_DESC'}">selected</g:if>><g:message code="ddbnext.Sort_ALPHA_DESC" /></option>
      </select>
    </span>
  </div>
</div>