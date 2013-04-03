<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title><g:layoutTitle default="Deutsche Digitale Bibliothek" /></title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="Deutsche Digitale Bibliothek" />
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />

    <!-- TODO: uncomment the next two lines, once we find the icons -->
    <!-- link rel="apple-touch-icon" href="/apple-touch-icon.png"/ -->
    <!-- link rel="apple-touch-startup-image" href="320x460-ipad1004x768.png"/ -->

    <link rel="search" title="Deutsche Digitale Bibliothek" href=${resource(dir: '/', file: 'opensearch.osdx')} type="application/opensearchdescription+xml" />
    <script>
        var contextPath="${request.contextPath}";
        var lang="<g:message code="ddbnext.language"/>";
    </script>
    <r:require module="ddbnext" />
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
    <jawr:script src="/i18n/messages.js"/>
    <r:layoutResources />
    <g:piwik />
  </body>
</html>
