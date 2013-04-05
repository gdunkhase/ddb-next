<div class="row">
  <div class="span12 institution">
    <div class="row">
        <div class="span9">
            <div><g:message code="ddbnext.Institution" /></div>
            <g:link class="institution-name" controller="institution" action="showInstitutionsTreeByItemId" params="[id: institution.id]">
            ${institution.name}
            </g:link>
            <a class="institution-link" href="${institution.uri}">${institution.uri}</a>
        </div>
        <div class="span3">
            <img alt="${institution.name}" src="${institution.logo.a}" />
        </div>
    </div>
      <g:if test="${!item.origin?.toString().isEmpty() || !viewerUri?.isEmpty()}">
        <div class="origin">
            <g:if test="${!item.origin?.toString().isEmpty()}">
                    <a target="_blank" class="show-origin" href="${item.origin.a}" title="<g:message code="ddbnext.stat_008" />">
                    <span class="has-origin"><g:message code="ddbnext.CulturalItem_LinkToOriginalItem_Label" /></span>
                    </a>
            </g:if>
            <!-- (DFG) viewer -->
            <g:if test="${!viewerUri?.isEmpty()}">
                <a target="_blank" href="${viewerUri}">
                  <span class="viewer dfg"><g:message code="ddbnext.ObjectViewer_dfgKey" /></span>
                </a>
            </g:if>
        </div>
      </g:if>
  </div>
</div>
<!-- /end of institution -->
