<%@page import="java.lang.String"%>
<meta name="layout" content="main" />

<style>
<!--
.institutionItemPage .locations #divOSM {
float: right;
clear: right;
width: 476px;
height: 300px;
margin:0px;
background-color: blue; 
}

.institutionItemPage .institution {
border-color: #efebe8;
border-style: solid;
border-width: 0 0 5px 0;
padding: 0 0 18px 0;
overflow: hidden;
}

-->
</style>

<script src="http://www.openlayers.org/api/OpenLayers.js"></script>
<!-- OpenStreetMap OpenLayers layers.
        Diese Datei bevorzugt aus dem Internet laden um sie aktuell zu halten 
     -->
<script src="http://www.openstreetmap.org/openlayers/OpenStreetMap.js"></script>
<script type="text/javascript">
<!--
//var fromProjection = new OpenLayers.Projection("EPSG:28992"); // transform from new RD
var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
var extent = new OpenLayers.Bounds(-1.32,51.71,-1.18,51.80).transform(fromProjection,toProjection);
var zoom = 13;
function mapLoading(lon, lat) {
    var options = {
          restrictedExtent: extent,
          controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.Attribution()
          ]
        };
        
      //map = new OpenLayers.Map("divOSM");
      map = new OpenLayers.Map("divOSM", options);
      
      var mapnik = new OpenLayers.Layer.OSM();
      //var mapnik = new OpenLayers.Layer.OSM("New Layer", "URL_TO_TILES/${z}/${x}/${y}.png", {numZoomLevels: 19});
      
      var position = new OpenLayers.LonLat(lon, lat).transform(
                          fromProjection, 
                          //toProjection
                          map.getProjectionObject() // to Spherical Mercator Projection
                          );
      //var position = new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection, 0); // 0=relative zoom level
      //var position = new OpenLayers.LonLat("7°57'129", "50°34'278");
      
      map.addLayer(mapnik);
      
      var markers = new OpenLayers.Layer.Markers( "Markers" );
      map.addLayer(markers);
      markers.addMarker(new OpenLayers.Marker(position));
    
      map.setCenter(position, zoom);
      //map.zoomToMaxExtent();
      
    }
//-->
</script>

    <div class="objectDisplayWidget institutionItemPage">
    
       <div class="row-fluid" style="margin-bottom: 8px; border-bottom-style: solid; border-bottom-width: 4px; border-bottom-color: silver;">
       <!-- div class="institution"-->
           <div class="span9"> <!-- class="summary" -->
             <div> <!-- class="sector" {provInfo.'provider-domains'.'provider-domain'} -->
               <g:message code="ddbnext.${results.'sector'}"/>
             </div>
             <div class="row-fluid">
                 <div><h2>${results.'name'}</h2></div>
                 <div><a class="count" href="/searchresults?query=&amp;offset=0&amp;rows=20&amp;facetValues[]=provider_fct=${results.'name'}" 
                      title="Anzahl der verfügbaren Objekte dieser Institution. Klicken Sie auf den Link, um die Objekte anzuzeigen.">
                      <%=countObjcs%> Objekte</a>
                 </div>
             </div>
             <div>
               <a href="${results.'uri' }/">${String.valueOf(results.'uri').trim() }/</a>
             </div>
           </div>
           <div class="span3">
             <img style="text-align: right;" alt="${results.'name'}" class="logo" src="${results.'logo'}">
           </div>
       </div>
       
       <div class="locations">
       
        <!-- div id="mapLoader" style="display: none;" data-bind="visible: mapLoading">
            <div class="loader"><img alt="" src="/Content/themes/base/icons/loader_small.gif"></div>
        </div-->
        <!-- div id="XdivMap" data-bind="visible: !mapLoading(${results.locations.location.geocode.longitude}, ${results.locations.location.geocode.latitude})"></div-->
        
        <div id="divOSM" style="position: relative;"></div>
          <script type="text/javascript">
            <!--
            //mapLoading(${results.locations.location.geocode.longitude}, ${results.locations.location.geocode.latitude});
            //-->
          </script>
        
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
    
