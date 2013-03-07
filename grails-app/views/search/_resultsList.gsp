<ul class="results-list unstyled  <g:if test="${viewType == 'grid'}">grid</g:if>">
  <g:set var="pageHitCounter" value="${0}"/>
  <g:each in="${results}">
    <g:set var="pageHitCounter" value="${pageHitCounter + 1}" />
    <g:set var="hitNumber" value="${offset + pageHitCounter}"/>
    <li class="item bt">
      <div class="summary <g:if test="${viewType != 'grid'}">row</g:if>">
        <g:if test="${viewType == 'grid'}">
          <g:render template="thumbnailWrapper" model="${[viewType: viewType, item: it, confBinary: confBinary, hitNumber: hitNumber]}" />
          <g:render template="summaryMainWrapper" model="${[viewType: viewType, item: it, urlParams: urlParams, hitNumber: hitNumber]}" />
        </g:if>
        <g:else>
          <g:render template="summaryMainWrapper" model="${[viewType: viewType, item: it, urlParams: urlParams, hitNumber: hitNumber]}" />
          <g:render template="thumbnailWrapper" model="${[viewType: viewType, item: it, confBinary: confBinary, hitNumber: hitNumber]}" />
        </g:else>
      </div>
    </li>
  </g:each>
</ul>