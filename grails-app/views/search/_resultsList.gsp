<ul class="results-list unstyled  <g:if test="${viewType == 'grid'}">grid</g:if>">
  <g:each in="${results}">
    <li class="item bt">
      <div class="summary <g:if test="${viewType != 'grid'}">row</g:if>">
        <g:if test="${viewType == 'grid'}">
          <g:render template="thumbnailWrapper" model="${[viewType: viewType, item: it, confBinary: confBinary]}" />
          <g:render template="summaryMainWrapper" model="${[viewType: viewType, item: it]}" />
        </g:if>
        <g:else>
          <g:render template="summaryMainWrapper" model="${[viewType: viewType, item: it]}" />
          <g:render template="thumbnailWrapper" model="${[viewType: viewType, item: it, confBinary: confBinary]}" />
        </g:else>
        </div>
      </li>
  </g:each>
</ul>