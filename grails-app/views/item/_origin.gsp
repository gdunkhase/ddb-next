<div class="row">
  <div class="origin">
    <g:if test="${!item.origin?.toString().isEmpty()}">
      <span class="has-origin">
        <a href="${item.origin.a}" title="Click the link to view the object data on the data provider's web site.">
          <g:message code="ddbnext.CulturalItem_LinkToOriginalItem_Label" />
        </a>
      </span>
    </g:if>
    <g:else>
      <span class="span8 no-origin"><g:message code="ddbnext.Link_to_data_supplier_not_available" /></span>
    </g:else>
  </div>
</div>
