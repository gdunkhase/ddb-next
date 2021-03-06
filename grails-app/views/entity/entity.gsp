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
<head>
  <title>${entity.title} - <g:message code="ddbnext.Deutsche_Digitale_Bibliothek"/></title>

  <meta name="page" content="entity" />
  <meta name="layout" content="main" />
  
</head> 
<body>
  <div class="entity-page">
    <div id="entity-title" class="off">${entity.title}</div>
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
  </div>
</body>
</html>
