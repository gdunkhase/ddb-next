<div class="row">
  <div class="span7 origin">
    <g:if test="${!item.origin?.toString().isEmpty()}">
        <a target="_blank" class="show-origin" href="${item.origin.a}" title="<g:message code="ddbnext.stat_008" />">
          <span class="has-origin"><g:message code="ddbnext.CulturalItem_LinkToOriginalItem_Label" /></span>
        </a>
    </g:if>
    <g:else>
      <span><g:message code="ddbnext.Link_to_data_supplier_not_available" /></span>
    </g:else>
  </div>
</div>
