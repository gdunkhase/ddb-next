<meta name="layout" content="main" />
<link type="text/css" href="${resource(dir: 'css', file: 'item.css')}">
<!-- TODO: change .culturalItem to .cultural-item -->
<div class="widget object-display-widget culture-item-page">

  <g:render template="controls" />
  <g:render template="institution" />
  
  <h2>${item.title}</h2>
  
  <g:render template="fields" />
  
  <g:render template="rights" />
  
  <g:render template="origin" />
</div>
