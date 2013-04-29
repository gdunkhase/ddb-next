<%--
Copyright (C) 2013 FIZ Karlsruhe
 
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
--%>
<html>
<!-- TODO my do write the head element again? -->
<head>
  <title>${title} - <g:message code="ddbnext.Deutsche_Digitale_Bibliothek"/></title>
  <meta name="page" content="staticcontent" />
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
  </head>
  <body>${content}</body>
</html>
