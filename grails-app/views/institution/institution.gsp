<%@page import="java.lang.String"%>
<meta name="layout" content="main" />

    <div class="objectDisplayWidget institutionItemPage">
    
       <div class="row"> <!-- class="institution" -->
           <div class="span8"> <!-- class="summary" -->
             <div class="span8"> <!-- class="sector" -->
               ${provInfo.'provider-domains'.'provider-domain'}/${results.'sector'}
             </div>
             <div class="span8">
               <div class="row">
                 <h2>${results.'name'}</h2>
                 <a class="count" href="/searchresults?query=&amp;offset=0&amp;rows=20&amp;facetValues[]=provider_fct=${results.'name'}" 
                      title="Anzahl der verfügbaren Objekte dieser Institution. Klicken Sie auf den Link, um die Objekte anzuzeigen.">
                      <%=countObjcs%> Objekte
                 </a>
               </div>
             </div>
             <div class="span8">
               <a href="${results.'uri' }/">${String.valueOf(results.'uri').trim() }/</a>
             </div>
           </div>
           <div class="span2">
             <img style="text-align: right;" alt="${results.'name'}" class="logo" src="${results.'logo'}">
           </div>
       </div>
       
       <div class="locations">
        <div id="mapLoader" style="display: none;" data-bind="visible: mapLoading">
            <div class="loader"><img alt="" src="/Content/themes/base/icons/loader_small.gif"></div>
        </div>
        <div id="map" data-bind="visible: !mapLoading()"></div>
        <div class="locationContainer">
        
                <div class="location" data-lat="${results.locations.location.geocode.latitude }" data-lon="${results.locations.location.geocode.longitude }">
                    <p class="address">
                        <b>${results.'name'}</b><br>
                        ${results.locations.location.address.street }&nbsp;${results.locations.location.address.houseIdentifier }<br>
                        ${results.locations.location.address.postalCode }&nbsp;${results.locations.location.address.city }
                        ${results.locations.location.address.addressSupplement }
                    </p>
                </div>
            
                <div class="hierarchy">
                  <span class="title">Standorte:</span>
                  <ul>
                    <li>
                      <i class="active"></i>
                      <b>${results.'name'}</b>
                      <ul>
                        <%
                      for (int i = 0; i < subOrg.size(); i++) {
                         %>
                          <li>
                              <a href="/about-us/institutions/item/${subOrg[i].id}">${subOrg[i].label}</a>
                          </li>
                        <%}%> 
                      </ul>
                    </li>
                  </ul>
                </div>
                
        </div>
      </div>
    </div>
