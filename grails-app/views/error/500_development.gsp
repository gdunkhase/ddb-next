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
<title><g:message code="error.500.title"/> - <g:message code="ddbnext.Deutsche_Digitale_Bibliothek"/></title>

<meta name="page" content="error500" />
<meta name="layout" content="main" />

</head>
<body>

<div class="row">
  <div class="error">
    <g:if test="${exception}">
      <g:renderException exception="${exception}" />
    </g:if>
    <g:else>
      <b>DEV-Message:</b> No stacktrace available. Most likely, it was already consumed and logged to your console.
    </g:else>  
  </div>
</div>

</body> 
</html> 
