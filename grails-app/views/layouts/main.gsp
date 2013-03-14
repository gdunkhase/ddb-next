<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title><g:layoutTitle default="Deutsche Digitale Bibliothek" /></title>
    <meta name="description" content="Deutsche Digitale Bibliothek" />
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <!-- TODO: uncomment the next two lines, once we find the icons -->
    <!-- link rel="apple-touch-icon" href="/apple-touch-icon.png"/ -->
    <!-- link rel="apple-touch-startup-image" href="320x460-ipad1004x768.png"/ -->
    <link rel="shortcut icon" href="${resource(dir: 'images', file: 'favicon.ico')}" type="image/x-icon">
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'bootstrap.css')}">
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'bootstrap-responsive.css')}">
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'ddb.css')}">
    <link rel="search" title="Deutsche Digitale Bibliothek" href="http://www.deutsche-digitale-bibliothek.de/opensearch.osdx" type="application/opensearchdescription+xml" />
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'institutionList.css')}">
    <link rel="stylesheet" href="${resource(dir: 'css', file: 'item.css')}">
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
  <div id="main-container" class="container" role="main">
    <g:layoutBody/>
  </div>
  <g:render template="/footer" />
    <!-- TODO why do we declare jquery here? Don't we use Grails jQuery Plug-in? -->
    <script src="${resource(dir:'js', file:'json2.js')}"></script>
    <script src="${resource(dir:'js', file:'jquery-1.8.2.min.js')}"></script>
    <script src="${resource(dir: 'js', file: 'jquery.cookies.2.2.0.min.js')}"></script>
    <script src="${resource(dir: 'js', file: 'underscore-min.js')}"></script>
    <script src="${resource(dir: 'js', file: 'jquery.dotdotdot-1.5.1.js')}"></script>
    <script src="${resource(dir: 'js', file: 'jquery.carouFredSel-6.2.0-packed.js')}"></script>
    <script src="${resource(dir: 'js', file: 'bootstrap-collapse.js')}" ></script>
    <script src="${resource(dir: 'js', file: 'large-cookie.js')}"></script>
    <script src="${resource(dir: 'js', file: 'advanced-search-page.js')}"></script>
    <script src="${resource(dir: 'js', file: 'jquery.fancybox.pack.js')}"></script>
    <script src="${resource(dir: 'jwplayer', file: 'jwplayer.js')}"></script>
    <script>jwplayer.key="AUCPxuikvGKUo7iy5PHSNvulij4OHNPvp+v47g=="</script>
    <script src="${resource(dir: 'js', file: 'header.js')}"></script>
    <script src="${resource(dir: 'js', file: 'tooltip.js')}"></script>
    <script src="${resource(dir: 'js', file: 'institution-list.js')}"></script>
    <g:piwik />
  </body>
</html>
