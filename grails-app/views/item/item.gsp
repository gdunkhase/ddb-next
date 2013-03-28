<html>
<head>
<title>${pageLabel} - <g:message code="ddbnext.Deutsche_Digitale_Bibliothek"/></title>
<meta name="layout" content="main" />
</head>
<body>
  <g:render template="controls" />
  <g:render template="institution" />
  <div class="row">
    <div class="span7 item-description">
      <h2>${title}</h2>
      <g:render template="fields" />
      <g:render template="rights" />
      <g:render template="origin" />
    </div>
    <div class="span5">
      <g:if test="${binaryList.size != 0}">
        <g:render template="binaries" />
      </g:if>
    </div>
  </div>
  <g:render template="hierarchy" />
</body>
</html>
