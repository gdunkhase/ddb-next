<meta name="layout" content="main" />
<link rel="stylesheet" href="${resource(dir: 'css', file: 'error.css')}" type="text/css" /> 

 
<div class="row">
	<div class="error">
		<g:renderException exception="${exception}" />
	</div>
</div>
