<%--
Copyright (C) 2013 FIZ Karlsruhe
 
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
--%>
<!DOCTYPE html>
<html>
  <head>
    <title><g:message code="ddbnext.Deutsche_Digitale_Bibliothek"/></title>

    <meta charset="utf-8" />
    <meta name="description" content="Deutsche Digitale Bibliothek"/>
    <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="default"/>

    <r:require module="pdf" />

    <r:layoutResources />
  </head>
  <body class="print">
    <header class="header fixprintwidth">
      <r:img dir="images" file="logo_header.png" class="siteLogo" alt="Deutsche Digitale Bibliothek"/>
    </header>
    <div class="container fixprintwidth" role="print">
      
      <div class="row institution borderbottom printrow">
        <div class="institution_text">
          <div><g:message code="ddbnext.Institution" /></div>
          <span class="institution-name">
            ${institution.name}
          </span>
          <span class="institution-link">${institution.url}</span>
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
              <div class="value fieldvalue"><g:removeTags>${item.rights}</g:removeTags></div>
            </div>
          </div>
      </div>
      <div class="row deeplink borderbottom printrow">
        <div><strong><g:message code="ddbnext.CulturalItem_Deeplink" />:</strong></div>
        <div class="value">${grailsApplication.config.ddb.frontend.url}${itemUri}</div>
      </div>
      <g:hasHierarchy item="${itemId}">
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
      </g:hasHierarchy>
    </div>
    <r:layoutResources />
  </body>
</html>
