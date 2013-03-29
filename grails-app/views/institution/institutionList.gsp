<meta name="layout" content="main" />
<r:require module="institutionlist" />

<h1><g:message code="ddbnext.Institutions" /></h1>

<div class="row">
  <div class="view-type-switch span12 off">
    <button id="view-map" class="selected" type="button" title="<g:message code="ddbnext.InstitutionsList_ViewAsMapButton_Title" />"><g:message code="ddbnext.InstitutionsList_ViewAsMapButton_Label" /></button>
    <button id="view-list" type="button" title="<g:message code="ddbnext.InstitutionsList_ViewAsListButton_Title" />"><g:message code="ddbnext.InstitutionsList_ViewAsListButton_Label" /></button>
  </div>
</div>
<div class="row">
  <div id="institution-list" class="span9">
    <g:render template="pagination" />
    <div id="no-match-message">
      <g:message code="ddbnext.InstitutionPage_NoMatches" />
    </div>
    <ol id="institution-list">
      <g:each in="${ all }">
      <li class="institution-listitem" data-sector="${ it?.sector }" 
        data-institution-id="${ it?.id }">
        <i class="icon-institution"></i>
        <g:render template="listItem" model="['item': it]"/>
        <g:render template="children" model="['children': it?.children]"/>
      </li>
      </g:each>
    </ol>
  </div>
  <div id="institution-map" class="span9 off">
    <div id="mapview">
      <div id="mapContainerDiv"></div>
    </div>
  </div>
  <div class="span3">
    <g:render template="filter" />
  </div>
</div>
