<!-- TODO: rewrite the class controls, disable back to results -->
<div class="row">
  <div class="span12 object-controls">
    <!-- buttons -->
    <div class="span6 item-nav-left">
      <g:if test="${searchResultUri != null}">
          <a class="back-to-list" href="${searchResultUri}" title="<g:message code="ddbnext.CulturalItem_ReturnToSearchResults_Title" />">
              <span><g:message code="ddbnext.CulturalItem_ReturnToSearchResults_Label" /></span>
          </a>
      </g:if> 
      <g:else>
          <span class="back-to-list-greyed-out"><g:message code="ddbnext.CulturalItem_ReturnToSearchResults_Label" /></span>
      </g:else>
        <a class="page-link" href="${itemUri}" title="<g:message code="ddbnext.CulturalItem_LinkToThisPage_Title" />">
        <span><g:message code="ddbnext.CulturalItem_LinkToThisPage_Label" /></span>
      </a>
    </div>
    <!-- search results navigation -->
    <g:if test="${hitNumber != null}">
      <div class="span6 item-nav fr">
          <g:itemDetailInfoNavRender navData="${[firstHit: firstHit, lastHit: lastHit, hitNumber: hitNumber, results: results]}"></g:itemDetailInfoNavRender>
      </div>
    </g:if>
    <g:else>
      <div class="span5 item-nav fr">
        <ul class="inline">
          <li class="items-overall-index">
              <span><g:message code="ddbnext.Hit" /> 1 <g:message code="ddbnext.Of" /> 1</span>
          </li>
        </ul>
      </div>
    </g:else>
  </div>
</div>
