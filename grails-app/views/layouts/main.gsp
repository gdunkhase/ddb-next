<!DOCTYPE html>
<!--[if lt IE 7 ]> <html lang="en" class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]>    <html lang="en" class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]>    <html lang="en" class="no-js ie8"> <![endif]-->
<!--[if IE 9 ]>    <html lang="en" class="no-js ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!-->
<html lang="en" class="no-js">
<!--<![endif]-->
<head>
<title><g:layoutTitle default="Deutsche Digitale Bibliothek" /></title>
<meta content="charset=utf-8">
<meta name="description" content="Deutsche Digitale Bibliothek">
<link rel="shortcut icon" href="${resource(dir: 'images', file: 'favicon.ico')}"
  type="image/x-icon">
<link rel="stylesheet" href="${resource(dir: 'css', file: 'bootstrap.css')}"
  type="text/css">
<link rel="stylesheet"
  href="${resource(dir: 'css', file: 'bootstrap-responsive.css')}"
  type="text/css">
<link rel="stylesheet" href="${resource(dir: 'css', file: 'ddb.css')}"
  type="text/css">
<link rel="stylesheet" href="${resource(dir: 'css', file: 'item.css')}"
  type="text/css">
<link rel="search" title="Deutsche Digitale Bibliothek"
  href="http://www.deutsche-digitale-bibliothek.de/opensearch.osdx"
  type="application/opensearchdescription+xml" />
<!--[if lt IE 9]>
            <script src="Scripts/html5shim.googlecode.html5.js"> </script>
        <![endif]-->
<g:layoutHead />
<r:layoutResources />
</head>
<body>
  <g:render template="/mainHeader" />
  <div class="container" role="main">
    <g:layoutBody />
  </div>
  <g:render template="/footer" />
</body>
</html>

