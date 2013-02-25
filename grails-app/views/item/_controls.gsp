<!-- TODO: rewrite the class controls, disable back to results -->

<div class="row object-controls">
  <!-- buttons -->
  <div class="span6">
    <a class="back-to-list" href="#" title="<g:message code="ddbnext.CulturalItem_ReturnToSearchResults_Title" />"> 
      <span><g:message code="ddbnext.CulturalItem_ReturnToSearchResults_Label" /></span>
    </a> 
    <a class="page-link" href="${itemUri}" 
       title="<g:message code="ddbnext.stat_006" />">
      <span><g:message code="ddbnext.CulturalItem_LinkToThisPage_Label" /></span>
    </a>
  </div>
  <!-- (DFG) viewer -->
  <g:if test="${!viewerUri?.isEmpty()}">
    <div class="span6 viewers">
      <span class="viewer dfg">
      <a target="about:blank" href="${viewerUri}"><g:message code="ddbnext.ObjectViewer_dfgKey" /></a></span>
    </div>
  </g:if>
</div>
