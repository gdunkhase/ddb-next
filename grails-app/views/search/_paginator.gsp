<%--
Copyright (C) 2013 FIZ Karlsruhe
 
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
--%>
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