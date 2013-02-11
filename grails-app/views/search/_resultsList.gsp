<ul class="results-list unstyled">
  <g:each in="${results}">
    <li class="item bt">
      <div class="summary row">
          <div class="span7">
            <div class="summary-main">
              <h2 class="title">
                <a class="persist" href="/item/${it.id}" title="${it.label}">${it.preview.title.replaceAll('match', 'strong')}</a>
              </h2>
              <div class="subtitle">${it.preview.subtitle}</div>
              <ul class="matches unstyled">
                <li class="matching-item">
                  <span>
                    <g:each var="match" in="${it.view}">
                      ...${match.replaceAll('match', 'strong')}...
                    </g:each>
                  </span>
                </li>
              </ul>
            </div>
            <div class="extra">
              <ul class="types unstyled inline">
              <g:each var="mediaType" in="${it.preview.media}">
                <g:set var="mediaTitle"><g:message code="ddbnext.type_fct_mediatype_007" /></g:set>
                <g:if test="${mediaType == 'audio'}">
                  <g:set var="mediaTitle"><g:message code="ddbnext.type_fct_mediatype_001" /></g:set>
                </g:if>
                <g:if test="${mediaType == 'image'}">
                  <g:set var="mediaTitle"><g:message code="ddbnext.type_fct_mediatype_002" /></g:set>
                </g:if>
                <g:if test="${mediaType == 'text'}">
                  <g:set var="mediaTitle"><g:message code="ddbnext.type_fct_mediatype_003" /></g:set>
                </g:if>
                <g:if test="${mediaType == 'fullText'}">
                  <g:set var="mediaTitle"><g:message code="ddbnext.type_fct_mediatype_004" /></g:set>
                </g:if>
                <g:if test="${mediaType == 'video'}">
                  <g:set var="mediaTitle"><g:message code="ddbnext.type_fct_mediatype_005" /></g:set>
                </g:if>
                <g:if test="${mediaType == 'other'}">
                  <g:set var="mediaTitle"><g:message code="ddbnext.type_fct_mediatype_006" /></g:set>
                </g:if>
                <li class="${mediaType}" classname="${mediaType}" title="${mediaTitle}">${mediaTitle}</li>
              </g:each>
              </ul>
            </div>
          </div>
          <div class="span2">
            <div class="thumbnail">
              <a class="persist" href="/item/${it.id}">
                <img src="<g:if test="${it.preview.thumbnail.contains('binary')}">${confBinary}</g:if>${it.preview.thumbnail}" alt="${it.preview.title}">
              </a>
            </div>
            <div class="information"></div>
          </div>
        </div>
      </li>
  </g:each>
</ul>