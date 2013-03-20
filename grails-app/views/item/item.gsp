<html>
<head>
<title>${pageLabel} - Deutsche Digitale Bibliothek</title>
<meta name="layout" content="main" />
<r:require module="item"/>

<%-- 
<link rel="stylesheet" href="${resource(dir: 'css', file: 'jquery.fancybox.css')}" />
<link rel="stylesheet" href="${resource(dir: 'css', file: 'viewer.css')}" />
<link rel="stylesheet" href="${resource(dir: 'css', file: 'item-hierarchy.css')}" />
<jawr:script src="/i18n/messages.js"/>
<script src="${resource(dir: 'js', file: 'item-hierarchy.js')}" ></script>
<!-- to remember: there is some js code needed for the institution hierarchy inside the window.onloa code of this file -->
<script src="${resource(dir: 'js', file: 'binaries-viewer.js')}" ></script>
--%>
</head>
<body>
  <g:render template="controls" />
  <g:render template="institution" />
  <div class="row">
    <div class="span7 item-description">
      <h2>${title}</h2>
      <g:render template="fields" />
      <g:render template="rights" />
      <g:render template="origin" />
    </div>
    <div class="span5">
      <g:if test="${binaryList.size != 0}">
        <g:render template="binaries" />
      </g:if>
    </div>
  </div>
  <g:render template="hierarchy" />
</body>
</html>
