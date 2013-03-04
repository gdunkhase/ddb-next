<meta name="layout" content="main" />

<h2>Institutions</h2>

<!-- TODO: id and class contain the same value, i.e., institution-list -->
<div id="institution-list" class="row">
  <div class="span9">
  <g:render template="pagination" />
    <div id="no-match-message">
      <g:message code="ddbnext.InstitutionPage_NoMatches" />
    </div>
    <ol class="institution-list">
      <g:each in="${ all }">
      <li class="institution" data-first-letter="${ it?.firstChar }" data-sector="${ it?.sector }" data-institution-id="${ it?.id }">
        <i class="icon-institution"></i>
        <g:render template="listItem" model="['item': it]"/>
        <g:render template="children" model="['children': it?.children]"/>
      </li>
      </g:each>
    </ol>
  </div>
  <div class="span3">
    <g:render template="filter" />
  </div>
</div>