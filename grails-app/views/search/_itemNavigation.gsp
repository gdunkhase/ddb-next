<g:set var="prevId" value="${navData.results.results["docs"][0].id}" />
<g:set var="nextId" value="nodisplay" />
<g:if test="${navData.hitNumber == 1}">
<g:set var="displayLeftPagination" value="off" />
</g:if>
<g:if test="${navData.hitNumber == navData.results["numberOfResults"] || navData.results["numberOfResults"] == 1}">
<g:set var="displayRightPagination" value="off" />
</g:if>

<g:if test="${navData.hitNumber == 1 && navData.results["numberOfResults"] > 1}">
<g:set var="nextId" value="${navData.results.results["docs"][1].id}" />
</g:if>
<g:elseif test="${navData.hitNumber == navData.results["numberOfResults"]}">
<g:set var="nextId" value="${navData.results.results["docs"][0].id}" />
</g:elseif>
<g:else>
<g:set var="nextId" value="${navData.results.results["docs"][2].id}" />
</g:else>

<ul class="inline">
  <li class="first-item ${displayLeftPagination}">
    <g:link controller="item" action="findById" params="[id: navData.firstHit, hitNumber: '1']"><g:message code="ddbnext.First_Label" /></g:link>
  </li>
  <li class="prev-item br-white ${displayLeftPagination}">
    <g:link controller="item" action="findById" params="[id: prevId, hitNumber: navData.hitNumber - 1]"><g:message code="ddbnext.Previous_Label" /></g:link>
  </li>
  <li>
    <span><g:message code="ddbnext.Hit" /> ${navData.hitNumber} <g:message code="ddbnext.Of" /> ${navData.results["numberOfResults"]}</span>
  </li>
  <li class="next-item bl-white ${displayRightPagination}">
    <g:link controller="item" action="findById" params="[id: nextId, hitNumber: navData.hitNumber + 1]"><g:message code="ddbnext.Next_Label" /></g:link>
  </li>
  <li class="last-item ${displayRightPagination}">
    <g:link controller="item" action="findById" params="[id: navData.lastHit, hitNumber: navData.results['numberOfResults']]"><g:message code="ddbnext.Last_Label" /></g:link>
  </li>
</ul>
