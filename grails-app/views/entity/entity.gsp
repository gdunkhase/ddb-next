<html>
<!-- TODO i18n -->
<head>
  <title>${pageLabel} - Deutsche Digitale Bibliothek</title>
  <link rel="stylesheet" href="${resource(dir: 'css', file: 'entity.css')}" />
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
