<html>
<head>
<title>${title} - <g:message code="ddbnext.Deutsche_Digitale_Bibliothek"/></title>

<meta name="page" content="item" />
<meta name="layout" content="main" />

</head>
<body>
  <g:render template="controls" />
  <g:render template="institution" />
  <div class="row">
    <div class="<g:if test="${binaryList.size != 0}">span7</g:if><g:else>span12</g:else>item-description">
      <h2>${title}</h2>
      <g:render template="fields" />
      <g:render template="rights" />
      <g:render template="origin" />
    </div>
    <g:if test="${binaryList.size != 0}">
      <div class="span5">
        <g:render template="binaries" />
      </div>
    </g:if>
  </div>
  <g:render template="hierarchy" />
</body>
</html>