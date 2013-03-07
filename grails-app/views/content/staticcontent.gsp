<html>
<!-- TODO my do write the head element again? -->
<head>
  <title>${title} - Deutsche Digitale Bibliothek</title>
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
  <link rel="stylesheet" href="${resource(dir: 'css', file: 'staticcontent.css')}" />
</head>
<body>${content}</body>
</html>
