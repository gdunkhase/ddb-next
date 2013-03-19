<meta name="layout" content="main" />
<r:require module="institution" />
<%-- 
<link rel="stylesheet" href="${resource(dir: 'css', file: 'institution.css')}" />
<script src="http://www.openlayers.org/api/OpenLayers.js"></script>
<script src="http://www.openstreetmap.org/openlayers/OpenStreetMap.js"></script>
<script src="${resource(dir: 'js', file: 'ddb.osm.institutiondetailview.js')}"></script>
--%>
<title>"${selectedOrgXML.name} - Deutsche Digitale Bibliothek"</title>

    <div class="institution-item-page">
    
       <div class="row institution">
           <div class="span10">
             <div>
              <g:message code="ddbnext.${selectedOrgXML.sector}"/>
             </div>
             <div>
                 <h2>${selectedOrgXML.name}
                 <g:if test="${(countObjcs > 0)}">
                     <a class="count" href="/searchresults?query=&amp;offset=0&amp;rows=20&amp;facetValues[]=provider_fct=${selectedOrgXML.name}" 
                        title="<g:message code="ddbnext.InstitutionItem_IngestedObjectCountTitleText" />">
                        ${countObjcs}
                        <g:if test="${(countObjcs = 1)}">
                            <g:message code="ddbnext.InstitutionItem_IngestedObjectCountFormat" />
                        </g:if>
                        <g:if test="${(countObjcs > 1)}">
                            <g:message code="ddbnext.InstitutionItem_IngestedObjectCountFormat_Plural" />
                        </g:if>
                     </a>
                 </g:if>
                 </h2>
             </div>
             <div>
               <a href="${selectedOrgXML.uri }/">${String.valueOf(selectedOrgXML.uri).trim() }</a>
             </div>
           </div>
           <div class="span2">
             <img class="logo" alt="${selectedOrgXML.name}" src="${selectedOrgXML.logo}">
           </div>
       </div>
            
       <div class="locations">
       
            <div id="divOSM"></div>
            <script type="text/javascript">
              <!--
              <%--
              $("#divOSM").onload(function(){
                drawmap(${selectedOrgXML.locations.location.geocode.longitude},${selectedOrgXML.locations.location.geocode.latitude}, "${selectedOrgXML.name}", "${selectedOrgXML.locations.location.address.street}", "${selectedOrgXML.locations.location.address.houseIdentifier}", "${selectedOrgXML.locations.location.address.postalCode}", "${selectedOrgXML.locations.location.address.city}");
              });
              --%>
              window.ddbAddOnloadListener(function() {
                drawmap(${selectedOrgXML.locations.location.geocode.longitude},${selectedOrgXML.locations.location.geocode.latitude}, "${selectedOrgXML.name}", "${selectedOrgXML.locations.location.address.street}", "${selectedOrgXML.locations.location.address.houseIdentifier}", "${selectedOrgXML.locations.location.address.postalCode}", "${selectedOrgXML.locations.location.address.city}");
              });
              //-->
            </script>
            
            <div class="location-container">
                
                <div class="location" data-lat="${selectedOrgXML.locations.location.geocode.latitude }" data-lon="${selectedOrgXML.locations.location.geocode.longitude }">
                    <p class="address">
                        <b>${selectedOrgXML.name}</b><br>
                        <span>${selectedOrgXML.locations.location.address.street }</span>${selectedOrgXML.locations.location.address.houseIdentifier }<br>
                        <g:if test="${(selectedOrgXML.addressSupplement)&&(selectedOrgXML.addressSupplement.text().length() > 0)}">
                            (${(selectedOrgXML.addressSupplement)})<br>
                        </g:if>
                        <span class="space">${selectedOrgXML.locations.location.address.postalCode }</span>${selectedOrgXML.locations.location.address.city }
                        ${selectedOrgXML.locations.location.address.addressSupplement }
                    </p>
                </div>
                
                <g:if test="${((subOrg)&&(subOrg.size() > 0)&&(!(parentOrg[parentOrg.size() - 1].aggregationEntity)))}">
                    <div class="hierarchy">
                      <span class="title"><g:message code="ddbnext.InstitutionItem_OtherLocations" /></span>
                      <ol class="institution-list">
                        <li class="institution-listitem">
                          <g:if test="${(selectedItemId == itemId)}">
                              <i class="icon-institution"></i>
                              <b>${parentOrg[parentOrg.size() - 1].label}</b>
                          </g:if>
                          <g:else>
                              <i class="icon-child-institution"></i>
                              <a href="/about-us/institutions/item/${parentOrg[parentOrg.size() - 1].id}">${parentOrg[parentOrg.size() - 1].label}</a>
                          </g:else>
                          <g:render template="subinstitutions" />
                        </li>
                      </ol>
                    </div>
                </g:if>
                
            </div>
      </div>
      
    </div>
    
