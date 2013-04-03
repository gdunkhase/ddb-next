<html>
<head>
<title><g:message code="ddbnext.Institutions" /> - <g:message code="ddbnext.Deutsche_Digitale_Bibliothek" /></title>
<meta name="layout" content="main" />
</head>
<body>
  <h1><g:message code="ddbnext.Institutions" /></h1>
  <div class="row">
    <div class="span9">
    <g:render template="filterPhone" />
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
    <div class="span3">
      <g:render template="filterNotPhone" />
    </div>
  </div>
</body>
</html>