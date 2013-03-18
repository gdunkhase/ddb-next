<!DOCTYPE html>
<html>
  <head>
    <title><g:layoutTitle default="Deutsche Digitale Bibliothek" /></title>
    <meta charset="utf-8" />
    <meta name="description" content="Deutsche Digitale Bibliothek"/>
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="default"/>

    <!-- TODO: uncomment the next two lines, once we find the icons -->
    <!-- link rel="apple-touch-icon" href="/apple-touch-icon.png"/ -->
    <!-- link rel="apple-touch-startup-image" href="320x460-ipad1004x768.png"/ -->

    <link rel="search" title="Deutsche Digitale Bibliothek" href="http://www.deutsche-digitale-bibliothek.de/opensearch.osdx" type="application/opensearchdescription+xml" />

    <r:require module="ddbnext" />
    <g:layoutHead />
    <r:layoutResources />
  </head>
  <body class="print">
    <g:render template="/pdfHeader" />
    <div class="container fixprintwidth" role="pdf">
      <g:layoutBody/>
    </div>
    <r:layoutResources />
  </body>
</html>
