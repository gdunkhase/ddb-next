<html>
<head>
<title><g:message code="error.500.title"/> - Deutsche Digitale Bibliothek</title>

<meta name="layout" content="main" />
<link rel="stylesheet" href="${resource(dir: 'css', file: 'error.css')}" type="text/css" /> 

</head>
<body>

<div class="row">
	<div class="error">
		<g:renderException exception="${exception}" />
	</div>
</div>

</body>
</html>