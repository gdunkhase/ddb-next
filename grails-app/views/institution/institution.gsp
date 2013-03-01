<%@page import="de.ddb.next.ApiInstitution"%>
<%@page import="java.lang.String"%>
<meta name="layout" content="main" />
<link rel="stylesheet" href="${resource(dir: 'css', file: 'institution.css')}" type="text/css" />
<!-- link rel="stylesheet" href="/css/institution.css" type="text/css" /-->

<script type="text/javascript" src="http://www.openlayers.org/api/OpenLayers.js"></script>
<script type="text/javascript" src="http://www.openstreetmap.org/openlayers/OpenStreetMap.js"></script>
<!-- script type="text/javascript" src="/js/ddb.osm.institutiondetailview.js"></script-->
<script type="text/javascript" src="${resource(dir: 'js', file: 'ddb.osm.institutiondetailview.js')}"></script>
<script type="text/javascript">
<!--
//-->
</script>

    <div class="institutionItemPage">
    
       <div class="row-fluid" style="padding-bottom: 10px; margin-bottom: 10px; border-bottom-style: solid; border-bottom-width: 4px; border-bottom-color: silver;">
       <!-- div class="institution"-->
           <div class="span10"> <!-- class="summary" -->
             <div> <!-- class="sector" {provInfo.'provider-domains'.'provider-domain'} -->
               <g:message code="ddbnext.${results.'sector'}"/>
             </div>
             <div>
                 <h2>${results.name}
                 <g:if test="${(countObjcs > 0)}">
                     <a class="count" style="color: black; font-size: small;" href="/searchresults?query=&amp;offset=0&amp;rows=20&amp;facetValues[]=provider_fct=${results.'name'}" 
                        title="<g:message code="ddbnext.InstitutionItem_IngestedObjectCountTitleText" />">
                        ${countObjcs}&nbsp;
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
               <a href="${results.uri }/">${String.valueOf(results.uri).trim() }/</a>
             </div>
           </div>
           <div class="span2">
             <img style="text-align: right;" alt="${results.name}" class="logo" src="${results.logo}">
           </div>
       </div>
       
       <div class="locations">
       
            <div id="divOSM"></div>
            <script type="text/javascript">
              <!--
              //drawmap(${results.locations.location.geocode.longitude},${results.locations.location.geocode.latitude}, "${results.name}", "${results.locations.location.address.street}", "${results.locations.location.address.houseIdentifier}", "${results.locations.location.address.postalCode}", "${results.locations.location.address.city}");
              //-->
            </script>
            
            <div class="locationContainer">
            
                <div class="location" style="margin-bottom: 30px;" data-lat="${results.locations.location.geocode.latitude }" data-lon="${results.locations.location.geocode.longitude }">
                    <p class="address">
                        <b>${results.'name'}</b><br>
                        ${results.locations.location.address.street }&nbsp;${results.locations.location.address.houseIdentifier }<br>
                        ${results.locations.location.address.postalCode }&nbsp;${results.locations.location.address.city }
                        ${results.locations.location.address.addressSupplement }
                    </p>
                </div>
                
                <g:if test="${((subOrg != null)&&(subOrg.size() > 0))}">
                    <div class="hierarchy">
                      <span class="title"><g:message code="ddbnext.InstitutionItem_OtherLocations" /></span>
                      <ul>
                        <li>
                          <i class="active"></i>
                          <b>${results.name}</b>
                          <g:render template="subinstitutions" />
                        </li>
                      </ul>
                    </div>
                </g:if>
                
            </div>
      </div>
    </div>
    
