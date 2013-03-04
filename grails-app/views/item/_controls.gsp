<!-- TODO: rewrite the class controls, disable back to results -->
<!-- search results navigation -->
<g:if test="${hitNumber != null}">
    <div class="row page-nav">
        <div class="span12">
            <g:itemDetailInfoNavRender navData="${[itemDetailGetParams: itemDetailGetParams, hitNumber: hitNumber, results: results]}"></g:itemDetailInfoNavRender>
        </div>
    </div>
</g:if>
<div class="row object-controls">
  <!-- buttons -->
  <div class="span6">
    <g:if test="${searchResultUri != null}">
        <a class="back tools" href="${searchResultUri}" title="<g:message code="ddbnext.CulturalItem_ReturnToSearchResults_Title" />">
            <span><g:message code="ddbnext.CulturalItem_ReturnToSearchResults_Label" /></span>
        </a>
    </g:if>
    <a class="back-to-list" href="#" title="<g:message code="ddbnext.CulturalItem_ReturnToSearchResults_Title" />"> 
      <span><g:message code="ddbnext.CulturalItem_ReturnToSearchResults_Label" /></span>
    </a> 
    <a class="page-link" href="${itemUri}" 
       title="<g:message code="ddbnext.CulturalItem_LinkToThisPage_Title" />">
      <span><g:message code="ddbnext.CulturalItem_LinkToThisPage_Label" /></span>
    </a>
  </div>
  <!-- (DFG) viewer -->
  <g:if test="${!viewerUri?.isEmpty()}">
    <div class="span6 viewers">
      <span class="viewer dfg">
        <a target="about:blank" href="${viewerUri}"><g:message code="ddbnext.ObjectViewer_dfgKey" /></a>
      </span>
    </div>
  </g:if>
</div>
