<!DOCTYPE html>
<html>
  <head>
    <title><g:layoutTitle default="Deutsche Digitale Bibliothek" /></title>
    <meta content="charset=utf-8">
    <link rel="shortcut icon" href="${resource(dir: 'images', file: 'favicon.ico')}" type="image/x-icon">
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'bootstrap.css')}" type="text/css">
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'bootstrap-responsive.css')}" type="text/css">
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'ddb.css')}" type="text/css">
    <link rel="search" title="Deutsche Digitale Bibliothek" href="http://www.deutsche-digitale-bibliothek.de/opensearch.osdx" type="application/opensearchdescription+xml" />
<link rel="stylesheet" href="${resource(dir: 'css', file: 'item.css')}"
  type="text/css">
    <!--[if lt IE 9]>
      <script src="Scripts/html5shim.googlecode.html5.js"> </script>
    <![endif]-->
    <g:layoutHead />
    <r:layoutResources />
  </head>
  <body>
    <noscript>
      <div class="container">
        <div class="row">
          <div class="span12 warning">
            <span><g:message code="ddbnext.Warning_Non_Javascript"/></span>
          </div>
        </div>
      </div>
    </noscript>
  <g:render template="/mainHeader" />
  <div class="container" role="main">
    <g:layoutBody/>
  </div>
  <g:render template="/footer" />
  <!-- TODO: remove inline style from html  -->
  <div class="widget tooltip" data-widget="TooltipWidget"
    data-bind="style: { 
                      'display' : isVisible() ? 'block' : 'none',
                      'left': xpx,
                      'top': ypx,
                      'position': positionMode
                      },
                      attr: { 'class': 'widget tooltip ' +layout() }">
  <div data-bind="html: content"></div>
  </div>
  <!--  TODO which script do we really use? -->
  <!--  TODO why do we declare jquery here? Don't we use Grails jQuery Plug-in? -->
  <script type="text/javascript" src="${resource(dir:'js', file:'json2.js')}"></script>  
  <script type="text/javascript" src="${resource(dir:'js', file:'jquery-1.8.2.min.js')}"></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'jquery.scrollTo-min.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'rx.jQuery.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'jquery.cookies.2.2.0.min.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'underscore-min.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'dateformat.min.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'knockout-latest.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'knockout.mapping-latest.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'jquery.mousewheel.min.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'jquery.microdata.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'amplify.min.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'jquery.dotdotdot-1.5.1.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'ddb.min.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'large-cookie.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'advanced-search-page.js')}" /></script>
  </body>
</html>