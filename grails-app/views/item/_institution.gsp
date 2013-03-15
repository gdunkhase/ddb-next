<div class="row institution">
  <div class="span12">
    <div class="row">
        <div class="span10">
            <div><g:message code="ddbnext.Institution" /></div>
            <a class="institution-name" href="/about-us/institutions/item/${institution.id}">
            ${institution.name}
            </a>
            <a class="institution-link" href="${institution.uri}>">${institution.uri}</a>
        </div>
        <div class="span2">
            <img alt="${institution.name}" src="${institution.logo.a}" />
        </div>
    </div>
      <div class="origin">
          <g:if test="${!item.origin?.toString().isEmpty()}">
              <span class="has-origin">
                  <a class="show-origin" href="${item.origin.a}" title="<g:message code="ddbnext.stat_008" />">
                  <g:message code="ddbnext.CulturalItem_LinkToOriginalItem_Label" />
                  </a>
              </span>
          </g:if>
          <g:else>
              <span><g:message code="ddbnext.Link_to_data_supplier_not_available" /></span>
          </g:else>
          <!-- (DFG) viewer -->
          <g:if test="${!viewerUri?.isEmpty()}">
              <span class="viewer dfg">
                  <a target="about:blank" href="${viewerUri}"><g:message code="ddbnext.ObjectViewer_dfgKey" /></a>
              </span>
          </g:if>
      </div>
  </div>
</div>
<!-- /end of institution -->
