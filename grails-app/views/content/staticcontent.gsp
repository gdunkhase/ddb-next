<html>
<!-- TODO my do write the head element again? -->
<head>
  <title>${title} - <g:message code="ddbnext.Deutsche_Digitale_Bibliothek"/></title>
  <meta name="page" content="staticcontent" />
  <g:if test="${author}">
    <meta name="author" content="${author}" />
  </g:if>
  <g:if test="${keywords}">
    <meta name="keywords" content="${keywords}" />
  </g:if>
  <g:if test="${robots}">
    <meta name="robots" content="${robots}" />
  </g:if>
    <meta name="layout" content="main" />
  </head>
  <body>${content}</body>
</html>
