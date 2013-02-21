<div class="row"
  <div class="origin">
  <g:if test="${!item.origin?.toString().isEmpty()}">
    <span class="has-origin">
      <a href="${item.origin.a}" 
      title="Click the link to view the object data on the data provider's web site.">
        Data provider's object view
      </a>
    </span>
  </g:if>  
  <g:else>
    <span class="span8 no-origin">Data provider's object view not available</span>
  </g:else>
  </div>
</div>