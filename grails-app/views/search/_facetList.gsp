<g:set var="upperBound" value="${(facetValues.size()<10)?facetValues.size():10}"></g:set>
<g:set var="i" value="0"></g:set>
<g:each var="i" in="${ (0..<upperBound) }">
  <g:set var="lanCode" value="${'ddbnext.'+facetValues[i]['fctValue']}"></g:set>
  <li>
    <a href="${facetValues[i]['url']}" class="${facetValues[i]['selected']}">
      <span class="count">(${facetValues[i]['cnt']})</span>
      <span class="label"><g:message code="${'ddbnext.time_fct_'+facetValues[i]['fctValue']}" /></span>
    </a>
  </li>
</g:each>
