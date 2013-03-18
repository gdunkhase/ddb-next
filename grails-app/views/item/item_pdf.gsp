<html>
  <head>
    <meta name="layout" content="pdf" />
  </head>
  <body>
    <div class="row institution borderbottom printrow">
      <div class="institution_text">
        <div><g:message code="ddbnext.Institution" /></div>
        <span class="institution-name">
          ${institution.name}
        </span>
        <span class="institution-link">${institution.uri}</span>
      </div>
      <div class="institution_logo">
        <img alt="${institution.name}" src="${institution.logo.a}" />
      </div>
    </div>
    <div class="row item borderbottom printrow">
      <div class="row printrow">
        <h2><g:removeTags>${title}</g:removeTags></h2>
      </div>
      
      <div class="row printrow previewrow">
        <g:each in="${binaryList}">
          <div class="row">
            <img src="${it.preview.uri}" alt="<g:removeTags>${it.orig.title}</g:removeTags>" />
          </div>
          <div class="row printrow label">
            <g:removeTags>${it.orig.title}</g:removeTags>
          </div>
        </g:each>
      </div>
          
      <g:each in="${fields}">
        <div class="row printrow">
          <div class="fieldtitle"><strong><g:message code="${'ddbnext.'+ it.@id}" />: </strong></div>
          <div class="value fieldvalue"><g:removeTags>${it.value}</g:removeTags></div>
        </div>
      </g:each>
        <div class="row printrow">
          <div class="rights">
            <div class="fieldtitle"><strong><g:message code="ddbnext.stat_007" />: </strong></div>
            <div class="value fieldvalue">${item.rights}</div>
          </div>
        </div>
    </div>
    <div class="row deeplink borderbottom printrow">
      <div><strong><g:message code="ddbnext.CulturalItem_Deeplink" />:</strong></div>
      <div class="value">${grailsApplication.config.ddb.frontend.url}${itemUri}</div>
    </div>
    <div class="row hierarchy printrow">
      <div class="row item-hierarchy off printrow">
        <div class="field-header">
            <span><strong><g:message code="ddbnext.View_related_objects" />:</strong></span>
        </div>
      
        <div class="row printrow">
          <div class="item-hierarchy-result printrow fixprintwidth" >
            <g:renderHierarchy item="${itemId}" />
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
