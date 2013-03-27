<html>
<head>
<title>${selectedOrgXML.name} - <g:message code="ddbnext.Deutsche_Digitale_Bibliothek"/></title>
<meta name="layout" content="main" />
<r:require module="openstreetmap" />
</head>
<body>
    <div class="institution-item-page">

       <div class="row">
         <div class="span12 institution">
           <div class="row">
             <div class="span10">
               <div>
                <g:message code="ddbnext.${selectedOrgXML.sector}"/>
               </div>
               <div>
                   <h2>${selectedOrgXML.name}
                   <g:if test="${(countObjcs > 0)}">
                      <g:set var="facetvalue" value="provider_fct=${selectedOrgXML.name}"/>
                      <g:link class="count" style="color: black; font-size: small;" controller="search" action="results" params="[query: '', offset: '0',
                                 rows: '20', 'facetValues[]': facetvalue]" title="${message(code: 'ddbnext.InstitutionItem_IngestedObjectCountTitleText')}">
                          ${countObjcs}
                          <g:if test="${(countObjcs = 1)}">
                              <g:message code="ddbnext.InstitutionItem_IngestedObjectCountFormat" />
                          </g:if>
                          <g:if test="${(countObjcs > 1)}">
                              <g:message code="ddbnext.InstitutionItem_IngestedObjectCountFormat_Plural" />
                          </g:if>
                       </g:link>
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
         </div>
       </div>
       <div class="row">
         <div class="span12 locations">
         
              <div id="divOSM"></div>
              <script type="text/javascript">
                <!--
                  var ddbInstitution = {};
                  ddbInstitution["longitude"] = ${selectedOrgXML.locations.location.geocode.longitude};
                  ddbInstitution["latitude"] = ${selectedOrgXML.locations.location.geocode.latitude};
                  ddbInstitution["name"] = "${selectedOrgXML.name}";
                  ddbInstitution["street"] = "${selectedOrgXML.locations.location.address.street}";
                  ddbInstitution["housenumber"] = "${selectedOrgXML.locations.location.address.houseIdentifier}";
                  ddbInstitution["postalcode"] = "${selectedOrgXML.locations.location.address.postalCode}";
                  ddbInstitution["city"] = "${selectedOrgXML.locations.location.address.city}";
                //-->
              </script>
              
              <div class="location-container">
                  
                  <div class="location" data-lat="${selectedOrgXML.locations.location.geocode.latitude }" data-lon="${selectedOrgXML.locations.location.geocode.longitude }">
                      <p class="address">
                          <b>${selectedOrgXML.name}</b><br>
                          <span class="space">${selectedOrgXML.locations.location.address.street }</span>${selectedOrgXML.locations.location.address.houseIdentifier }<br>
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
    </div>
</body>
</html>

