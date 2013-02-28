<%@page import="java.awt.event.ItemEvent"%>
<div class="thumbnail-wrapper <g:if test="${viewType != 'grid'}">span2</g:if>">
  <div class="thumbnail">
    <a class="persist" href="/item/${item.id}?<g:convertMapToGetParameters map='${itemDetailGetParams}'/>&hitNumber=${hitNumber}">
      <img src="<g:if test="${item.preview.thumbnail.contains('binary')}">${confBinary}</g:if>${item.preview.thumbnail}" alt="${item.preview.title.encodeAsHTML()}">
    </a>
  </div>
  <div class="information">
    <div class="hovercard-info-item">
      <h4><g:truncateItemTitle title="${ item.preview.title }"></g:truncateItemTitle></h4>
      <ul class="unstyled">
        <g:each in="${item.properties}">
          <g:if test="${item.properties[it.key] && it.key != 'last_update'}">
            <li>
              <span class="fieldName"><g:message code="${'ddbnext.facet_'+it.key}" /></span>
              <span class="fieldContent">
              <g:each status="i" in="${item.properties[it.key]}" var="key">
                <g:if test="${(i!=0)}">
                  ,
                </g:if>
                <g:if test="${it.key == 'affiliate_fct' || it.key == 'keywords_fct' || it.key == 'place_fct' || it.key == 'provider_fct'}">
                    ${key}
                </g:if>
                <g:if test="${it.key == 'type_fct' }">
                  <g:message code="ddbnext.type_fct_${key}"/>
                </g:if>
                <g:if test="${it.key == 'time_fct' }">
                  <g:message code="ddbnext.time_fct_${key}"/>
                </g:if>
                <g:if test="${it.key == 'language_fct' }">
                  <g:message code="ddbnext.language_fct_${key}"/>
                </g:if>
                <g:if test="${it.key == 'sector_fct' }">
                  <g:message code="ddbnext.sector_fct_${key}"/>
                </g:if>
              </g:each>
              </span>
            </li>
          </g:if>
        </g:each>
      </ul>
    </div>
  </div>
</div>