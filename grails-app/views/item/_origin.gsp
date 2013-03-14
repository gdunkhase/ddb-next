<div class="row">
  <div class="span7 origin">
    <g:if test="${!item.origin?.toString().isEmpty()}">
      <span class="has-origin">
        <a href="${item.origin.a}" title="<g:message code="ddbnext.stat_008" />">
          <g:message code="ddbnext.CulturalItem_LinkToOriginalItem_Label" />
        </a>
      </span>
    </g:if>
    <g:else>
      <span><g:message code="ddbnext.Link_to_data_supplier_not_available" /></span>
    </g:else>
  </div>
</div>
