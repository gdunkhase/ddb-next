<!DOCTYPE html>
<html>
  <head>
    <title><g:layoutTitle default="Deutsche Digitale Bibliothek" /></title>
    <meta charset="utf-8">
    <meta name="description" content="Deutsche Digitale Bibliothek">
    <link rel="shortcut icon" href="${resource(dir: 'images', file: 'favicon.ico')}" type="image/x-icon">
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'bootstrap.css')}">
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'bootstrap-responsive.css')}">
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'ddb.css')}">
    <link rel="search" title="Deutsche Digitale Bibliothek" href="http://www.deutsche-digitale-bibliothek.de/opensearch.osdx" type="application/opensearchdescription+xml">
    <!--[if lt IE 9]>
      <script src="Scripts/html5shim.googlecode.html5.js"> </script>
    <![endif]-->
    <g:layoutHead />
    <r:layoutResources />
  </head>
  <body class="start">
    <noscript>
      <div class="container">
        <div class="row">
          <div class="span12 warning">
            <span><g:message code="ddbnext.Warning_Non_Javascript" /></span>
          </div>
        </div>
      </div>
    </noscript>
    <g:render template="/mainHeader" />
    <div class="container" role="main">
      <g:layoutBody />
    </div>
    <g:render template="/footer" />
    <script src="${resource(dir:'js', file:'json2.js')}"></script>  
    <script src="${resource(dir:'js', file:'jquery-1.8.2.min.js')}"></script>
    <script src="${resource(dir: 'js', file: 'jquery.cookies.2.2.0.min.js')}"></script>
    <script src="${resource(dir: 'js', file: 'underscore-min.js')}"></script>
    <script src="${resource(dir: 'js', file: 'amplify.min.js')}"></script>
    <script src="${resource(dir: 'js', file: 'jquery.dotdotdot-1.5.1.js')}"></script>
    <script src="${resource(dir: 'js', file: 'jquery.carouFredSel-6.2.0-packed.js')}"></script>
    <script src="${resource(dir: 'js', file: 'start-page.js')}"></script>
    <script src="${resource(dir: 'js', file: 'tooltip.js')}"></script>
  </body>
</html>
