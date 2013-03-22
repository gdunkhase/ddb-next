<div class="row institution">
  <div class="span12">
    <div class="row">
        <div class="span10">
            <div><g:message code="ddbnext.Institution" /></div>
            <g:link class="institution-name" controller="institution" action="readByItemId" params="[id: institution.id]">
            ${institution.name}
            </g:link>
            <a class="institution-link" href="${institution.uri}>">${institution.uri}</a>
        </div>
        <div class="span2">
            <img alt="${institution.name}" src="${institution.logo.a}" />
        </div>
    </div>
      <div class="origin">
          <g:if test="${!item.origin?.toString().isEmpty()}">
                  <a target="_blank" class="show-origin" href="${item.origin.a}" title="<g:message code="ddbnext.stat_008" />">
                  <span class="has-origin"><g:message code="ddbnext.CulturalItem_LinkToOriginalItem_Label" /></span>
                  </a>
          </g:if>
          <g:else>
              <span><g:message code="ddbnext.Link_to_data_supplier_not_available" /></span>
          </g:else>
          <!-- (DFG) viewer -->
          <g:if test="${!viewerUri?.isEmpty()}">
              <a target="_blank" href="${viewerUri}">
                <span class="viewer dfg"><g:message code="ddbnext.ObjectViewer_dfgKey" /></span>
              </a>
          </g:if>
      </div>
  </div>
</div>
<!-- /end of institution -->
