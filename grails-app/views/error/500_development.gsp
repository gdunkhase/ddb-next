<html>
<head>
<title><g:message code="error.500.title"/> - Deutsche Digitale Bibliothek</title>

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
