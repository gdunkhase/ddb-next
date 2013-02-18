<%@page import="java.awt.event.ItemEvent"%>
<div class="thumbnail-wrapper <g:if test="${viewType != 'grid'}">span2</g:if>">
  <div class="thumbnail">
    <a class="persist" href="/item/${item.id}">
      <img src="<g:if test="${item.preview.thumbnail.contains('binary')}">${confBinary}</g:if>${item.preview.thumbnail}" alt="${item.preview.title.encodeAsHTML()}">
    </a>
  </div>
  <div class="information">
    <div class="hovercard-info-item">
      <h4><g:trunkItemTitle title="${ item.preview.title }"></g:trunkItemTitle></h4>
      <ul class="unstyled">
        <g:each in="${item.properties}">
          <g:if test="${it.toString().replaceAll(it.key+'=','') !='' && it.key != 'last_update'}">
            <li>
              <span class="fieldName"><g:message code="${'ddbnext.facet_'+it.key}" /></span>
              <span class="fieldContent">${it.toString().replaceAll(it.key+'=','').replaceAll('"','')}</span>
            </li>
          </g:if>
        </g:each>
      </ul>
    </div>
  </div>
</div>