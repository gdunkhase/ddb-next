<meta name="layout" content="main" />
<!-- TODO: change .culturalItem to .cultural-item -->
<div class="culture-item-page">
  <g:render template="controls" />
  <g:render template="institution" />
  <div class="row">
    <div class="span8">
      <h2>${item.title}</h2>
      <g:render template="fields" />
      <g:render template="rights" />
      <g:render template="origin" />
    </div>
    <div class="span4"></div>
  </div>
</div>
