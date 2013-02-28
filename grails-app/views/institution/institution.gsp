<%@page import="de.ddb.next.ApiInstitution"%>
<%@page import="java.lang.String"%>
<meta name="layout" content="main" />
<!-- link rel="stylesheet" href="${resource(dir: 'css', file: 'institution.css')}" type="text/css" /-->
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
 
#header {
  font-family: Verdana, Arial;
  font-size: 1em;
  overflow: hidden;
  color: #ffffff;
}
 
#map {
  height: 86%;
  width: 96%;
  padding: 0; margin: 0;
}
 
#content {
  font-size: 1em;
}
 
#osm {
  font-size: 0.7em;
  font-style: italic;
  margin-bottom: 20px;
}

-->
</style>

<script type="text/javascript" src="http://www.openlayers.org/api/OpenLayers.js"></script>
<script type="text/javascript" src="http://www.openstreetmap.org/openlayers/OpenStreetMap.js"></script>

<script type="text/javascript">
<!--
// --- Deutschlands- Zonen 32 und 33:
// EPSG:25832 = ETRS89, UTM, Zone 32
// EPSG:25833 = ETRS89, UTM, Zone 33
//var fromProjection = new OpenLayers.Projection("EPSG:25832"); // Transform from WGS 1984
var fromProjection = new OpenLayers.Projection("EPSG:4326"); // Transform from WGS 1984
var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
//var toProjection = new OpenLayers.Projection("EPSG:25833"); // to Spherical Mercator Projection
var extent = new OpenLayers.Bounds(-1.32,51.71,-1.18,51.80).transform(fromProjection,toProjection);
//-- Zoomstufe der Karte
var zoom = 16;
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
    
// http://wiki.openstreetmap.org/wiki/Die_JavaScript_Dateien
var map;
var layer_mapnik;
var layer_tah;
var layer_markers;

function drawmap(lon, lat) {
    // Popup und Popuptext mit evtl. Grafik
    var popuptext="<font color=\"black\"><b>${results.'name'}<br>${results.locations.location.address.street }&nbsp;${results.locations.location.address.houseIdentifier }<br>${results.locations.location.address.postalCode }&nbsp;${results.locations.location.address.city }</b></font>";
    OpenLayers.Lang.setCode('de');
    
    map = new OpenLayers.Map('divOSM', {
        projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.LayerSwitcher(),
            new OpenLayers.Control.PanZoomBar()],
        maxExtent:
            new OpenLayers.Bounds(-20037508.34,-20037508.34,
                                    20037508.34, 20037508.34),
        numZoomLevels: 18,
        maxResolution: 156543,
        units: 'meters'
    });
    layer_mapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
    layer_markers = new OpenLayers.Layer.Markers("Address", { projection: new OpenLayers.Projection("EPSG:4326"), 
                                                  visibility: true, displayInLayerSwitcher: false });
    map.addLayers([layer_mapnik, layer_markers]);
    jumpTo(lon, lat, zoom);
    
    // Position des Markers
    addMarker(layer_markers, lon, lat, popuptext);
}

function jumpTo(lon, lat, zoom) {
    var x = Lon2Merc(lon);
    var y = Lat2Merc(lat);
    map.setCenter(new OpenLayers.LonLat(x, y), zoom);
    return false;
}
 
function Lon2Merc(lon) {
    return 20037508.34 * lon / 180;
}
 
function Lat2Merc(lat) {
    var PI = 3.14159265358979323846;
    lat = Math.log(Math.tan( (90 + lat) * PI / 360)) / (PI / 180);
    return 20037508.34 * lat / 180;
}
 
function addMarker(layer, lon, lat, popupContentHTML) {
 
    var ll = new OpenLayers.LonLat(Lon2Merc(lon), Lat2Merc(lat));
    var feature = new OpenLayers.Feature(layer, ll); 
    feature.closeBox = true;
    feature.popupClass = OpenLayers.Class(OpenLayers.Popup.FramedCloud, {minSize: new OpenLayers.Size(300, 180) } );
    feature.data.popupContentHTML = popupContentHTML;
    feature.data.overflow = "hidden";
 
    var marker = new OpenLayers.Marker(ll);
    marker.feature = feature;
 
    var markerClick = function(evt) {
        if (this.popup == null) {
            this.popup = this.createPopup(this.closeBox);
            map.addPopup(this.popup);
            this.popup.show();
        } else {
            this.popup.toggle();
        }
        OpenLayers.Event.stop(evt);
    };
    marker.events.register("mousedown", feature, markerClick);
 
    layer.addMarker(marker);
    map.addPopup(feature.createPopup(feature.closeBox));
}
 
function getCycleTileURL(bounds) {
   var res = this.map.getResolution();
   var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
   var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
   var z = this.map.getZoom();
   var limit = Math.pow(2, z);
 
   if (y < 0 || y >= limit)
   {
     return null;
   }
   else
   {
     x = ((x % limit) + limit) % limit;
 
     return this.url + z + "/" + x + "/" + y + "." + this.type;
   }
}
//-->
</script>

    <div class="objectDisplayWidget institutionItemPage">
    
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
                        <%=countObjcs%>&nbsp;
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
       
            <div id="divOSM" style="position: relative;"></div>
            <script type="text/javascript">
              <!--
              //drawmap(${results.locations.location.geocode.longitude},${results.locations.location.geocode.latitude});
              //XXXmapLoading("${results.locations.location.geocode.longitude}","${results.locations.location.geocode.latitude}");
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
    
