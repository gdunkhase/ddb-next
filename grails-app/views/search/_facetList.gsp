<g:set var="upperBound" value="${(facetValues.size()<10)?facetValues.size():10}"></g:set>
<g:set var="i" value="0"></g:set>
<g:each var="i" in="${ (0..<upperBound) }">
  <li>
    <a href="${facetValues[i]['url']}" class="${facetValues[i]['selected']}">
      <span class="count">(${facetValues[i]['cnt']})</span>
      <g:if test="${facetType == 'affiliate_fct' || facetType == 'keywords_fct' || facetType == 'place_fct' || facetType == 'provider_fct'}">
        <span class="label">${facetValues[i]['fctValue']}</span>
      </g:if>
      <g:if test="${facetType == 'type_fct' }">
        <span class="label"><g:message code="${'ddbnext.type_fct_'+facetValues[i]['fctValue']}" /></span>
      </g:if>
      <g:if test="${facetType == 'time_fct' }">
        <span class="label"><g:message code="${'ddbnext.time_fct_'+facetValues[i]['fctValue']}" /></span>
      </g:if>
      <g:if test="${facetType == 'language_fct' }">
        <span class="label"><g:message code="${'ddbnext.language_fct_'+facetValues[i]['fctValue']}" /></span>
      </g:if>
      <g:if test="${facetType == 'sector_fct' }">
        <span class="label"><g:message code="${'ddbnext.sector_fct_'+facetValues[i]['fctValue']}" /></span>
      </g:if>
    </a>
  </li>
</g:each>
