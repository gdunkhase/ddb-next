<html>
<head>
  <title>${pageLabel} - <g:message code="ddbnext.Deutsche_Digitale_Bibliothek"/></title>

  <meta name="page" content="entity" />
  <meta name="layout" content="main" />
  
</head> 
<body>
  <g:render template="controls" />
  <div class="row">
    <div class="span9">
      <g:render template="name" />
      <g:render template="dates" />
      <hr>
      <g:render template="objects" />
      <g:render template="works" />
      <g:render template="themes" />
    </div>
    <div class="span3">
      <g:render template="thumb" />
      <g:render template="search" />
      <g:render template="externalLinks" />
    </div>
  </div>
</body>
</html>
