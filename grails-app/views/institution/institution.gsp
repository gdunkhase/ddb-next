<%@page import="java.lang.String"%>
<meta name="layout" content="main" />

<!-- div class="container" role="main"-->
    <div class="objectDisplayWidget institutionItemPage">
       <!-- div class="institution"-->
       <div class="row" style="width: 100%">
           <div class="span8">
               <!-- div class="sector" style="text-align: left;">${results.'sector'}</div-->
               <div class="sector" style="text-align: left;">${provInfo.'provider-domains'.'provider-domain'}</div>
               <div class="row" style="width: 100%; text-align: left;">
                 <div>
                   <h2>${results.'name'}</h2>
                   &nbsp;
                   <a class="count" href="http://www.deutsche-digitale-bibliothek.de/searchresults?query=&amp;offset=0&amp;rows=20&amp;facetValues[]=provider_fct=${results.'name'}" 
                      title="Anzahl der verfügbaren Objekte dieser Institution. Klicken Sie auf den Link, um die Objekte anzuzeigen.">2.882.275 Objekte</a>
                 </div>
               </div>
               <div style="text-align: left;">
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
        <div id="map" data-bind="visible: !mapLoading()" style="position: relative;"><div id="mapWindow" style="height: 300px;"><div id="mapContainer" style="position: absolute; z-index: 0; height: 300px;" class="olMap"><div id="OpenLayers.Map_11_OpenLayers_ViewPort" style="position: relative; overflow: hidden; width: 100%; height: 100%;" class="olMapViewport olControlDragPanActive olControlZoomBoxActive olControlPinchZoomActive olControlNavigationActive olControlKeyboardDefaultsActive olControlSelectFeatureActive"><div id="OpenLayers.Map_11_OpenLayers_Container" style="position: absolute; width: 100px; height: 100px; z-index: 749; left: 0px; top: 0px;"><div id="OpenLayers.Layer.OSM_25" style="position: absolute; width: 100%; height: 100%; z-index: 100; left: 0%; top: 0%;" dir="ltr" class="olLayerDiv olLayerGrid"><img class="olTileImage" style="visibility: inherit; opacity: 1; position: absolute; left: 138%; top: -24%; width: 256%; height: 256%;" src="http://a.tile.openstreetmap.org/16/34440/22567.png" crossorigin="anonymous"><img class="olTileImage" style="visibility: inherit; opacity: 1; position: absolute; left: 138%; top: 232%; width: 256%; height: 256%;" src="http://b.tile.openstreetmap.org/16/34440/22568.png" crossorigin="anonymous"><img class="olTileImage" style="visibility: inherit; opacity: 1; position: absolute; left: -118%; top: -24%; width: 256%; height: 256%;" src="http://c.tile.openstreetmap.org/16/34439/22567.png" crossorigin="anonymous"><img class="olTileImage" style="visibility: inherit; opacity: 1; position: absolute; left: 394%; top: -24%; width: 256%; height: 256%;" src="http://a.tile.openstreetmap.org/16/34441/22567.png" crossorigin="anonymous"><img class="olTileImage" style="visibility: inherit; opacity: 1; position: absolute; left: -118%; top: 232%; width: 256%; height: 256%;" src="http://b.tile.openstreetmap.org/16/34439/22568.png" crossorigin="anonymous"><img class="olTileImage" style="visibility: inherit; opacity: 1; position: absolute; left: 394%; top: 232%; width: 256%; height: 256%;" src="http://a.tile.openstreetmap.org/16/34441/22568.png" crossorigin="anonymous"><img class="olTileImage" style="visibility: inherit; opacity: 1; position: absolute; left: 138%; top: 488%; width: 256%; height: 256%;" src="http://b.tile.openstreetmap.org/16/34440/22569.png" crossorigin="anonymous"><img class="olTileImage" style="visibility: inherit; opacity: 1; position: absolute; left: -118%; top: 488%; width: 256%; height: 256%;" src="http://c.tile.openstreetmap.org/16/34439/22569.png" crossorigin="anonymous"><img class="olTileImage" style="visibility: inherit; opacity: 1; position: absolute; left: 394%; top: 488%; width: 256%; height: 256%;" src="http://b.tile.openstreetmap.org/16/34441/22569.png" crossorigin="anonymous"></div><div id="OpenLayers.Layer.Vector_2" style="position: absolute; width: 100%; height: 100%; z-index: 726; left: 0px; top: 0px;" dir="ltr" class="olLayerDiv"><svg id="OpenLayers.Layer.Vector_2_svgRoot" style="display: block;" width="476" height="300" viewBox="0 0 476 300"><g id="OpenLayers.Layer.Vector_2_root" style="visibility: visible;" transform=""><g id="OpenLayers.Layer.Vector_2_vroot"></g><g id="OpenLayers.Layer.Vector_2_troot"></g></g></svg></div><div id="OpenLayers.Layer.Markers_8" style="position: absolute; width: 100%; height: 100%; z-index: 727;" dir="ltr" class="olLayerDiv"><div id="OL_Icon_70" style="position: absolute; opacity: 0.9; width: 38px; height: 45px; left: 219px; top: 105px;"><img id="OL_Icon_70_innerImage" style="position: relative; width: 38px; height: 45px;" class="olAlphaImg" src="http://www.deutsche-digitale-bibliothek.de/ThirdParty/Map/images/ddb_marker_final.png"></div></div></div><div id="OpenLayers.Control.DrawFeature_27" style="position: absolute; z-index: 1003;" class="olControlDrawFeaturePolygon olControlNoSelect" unselectable="on"></div><div id="OpenLayers.Control.DrawFeature_33" style="position: absolute; z-index: 1004;" class="olControlDrawFeaturePolygon olControlNoSelect" unselectable="on"></div><div id="OpenLayers.Control.DrawFeature_39" style="position: absolute; z-index: 1005;" class="olControlDrawFeaturePolygon olControlNoSelect" unselectable="on"></div><div id="OpenLayers.Control.DragFeature_45" style="position: absolute; z-index: 1006;" class="olControlDragFeature olControlNoSelect" unselectable="on"></div><div id="OpenLayers.Control.ModifyFeature_49" style="position: absolute; z-index: 1007;" class="olControlModifyFeature olControlNoSelect" unselectable="on"></div><div id="OpenLayers.Control.SelectFeature_56" style="position: absolute; z-index: 1008;" class="olControlSelectFeature olControlNoSelect" unselectable="on"></div><div id="OpenLayers.Control.SelectFeature_58" style="position: absolute; z-index: 1009;" class="olControlSelectFeature olControlNoSelect" unselectable="on"></div></div></div><div class="osmLink" style="visibility: visible;">© <a href="http://www.openstreetmap.org/">OpenStreetMap contributors</a>, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a></div></div><table class="absoluteToolbar ddbToolbar" style="display: none;"><tr><td>Institute</td></tr><tr><td><div class="ddbElementsCount"></div></td></tr></table><div class="sliderStyle-vertical" style="left: 20px; top: 40px;"><div class="zoomSliderContainer-vertical"><div tabindex="1" class="vertical dynamic-slider-control "><div></div><div class="line" style="left: 10px; top: 6px; height: 109px;"><div style="height: 107px;"></div></div><div class="handle" title="Zoomregler" style="left: 0px; top: 23.421000000000006px;"><div>&nbsp;</div></div></div></div><img src="http://www.deutsche-digitale-bibliothek.de/ThirdParty/Map/images/ddb_zoom_in.png" class="zoomSliderIn-vertical" title="Vergrößern"><img src="http://www.deutsche-digitale-bibliothek.de/ThirdParty/Map/images/ddb_zoom_out.png" class="zoomSliderOut-vertical" title="Verkleinern"></div><div class="mapHome" title="Zurücksetzen zur initialen Sicht" style="left: 20px; top: 215px;"></div></div>
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
                <b>Landesarchiv Baden-Württemberg</b>

    <ul>
        <li>
                <i></i>
                <a href="http://www.deutsche-digitale-bibliothek.de/about-us/institutions/item/PM354GTOYOLJTGJDFV4KMC72XPJ7OTE4">Landesarchiv Baden-Württemberg. Abt. 1: Verwaltung</a>    

        </li>
    </ul>
    <ul>
        <li>
                <i></i>
                <a href="http://www.deutsche-digitale-bibliothek.de/about-us/institutions/item/ACU2MG4DQZP335OCHDKUHFERHKXJP4S6">Landesarchiv Baden-Württemberg. Abt. 2: Fachprogramme und Bildungsarbeit</a>    

        </li>
    </ul>
    <ul>
        <li>
                <i></i>
                <a href="http://www.deutsche-digitale-bibliothek.de/about-us/institutions/item/Y25NL67XMWL3BPN46DJGZFWPCYUOBYKZ">Landesarchiv Baden-Württemberg. Abt. 2: Grundbuchzentralarchiv</a>    

        </li>
    </ul>
    <ul>
        <li>
                <i></i>
                <a href="http://www.deutsche-digitale-bibliothek.de/about-us/institutions/item/TX2FQ77N5YACCJWZ7HKICYAIOHHW4PXA">Landesarchiv Baden-Württemberg. Abt. 3: Staatsarchiv Freiburg</a>    

        </li>
    </ul>
    <ul>
        <li>
                <i></i>
                <a href="http://www.deutsche-digitale-bibliothek.de/about-us/institutions/item/GZLZSHPIBU5V37BJPJKM3NW5LJFK67CA">Landesarchiv Baden-Württemberg. Abt. 4: Generallandesarchiv Karlsruhe</a>    

        </li>
    </ul>
    <ul>
        <li>
                <i></i>
                <a href="http://www.deutsche-digitale-bibliothek.de/about-us/institutions/item/QPQJFV3ZOCCJM5DYJVEBOU6CAB5GFCGS">Landesarchiv Baden-Württemberg. Abt. 5: Außenstelle Hohenlohe - Zentralarchiv Neuenstein</a>    

        </li>
    </ul>
    <ul>
        <li>
                <i></i>
                <a href="http://www.deutsche-digitale-bibliothek.de/about-us/institutions/item/CXJ4BSIGUOKFRVHWFN24C2JEHXSTZKHP">Landesarchiv Baden-Württemberg. Abt. 5: Staatsarchiv Ludwigsburg</a>    

        </li>
    </ul>
    <ul>
        <li>
                <i></i>
                <a href="http://www.deutsche-digitale-bibliothek.de/about-us/institutions/item/ZJXSQ2WBGS5ITAE43NZJZFLYRABOQH7C">Landesarchiv Baden-Württemberg. Abt. 6: Staatsarchiv Sigmaringen</a>    

        </li>
    </ul>
    <ul>
        <li>
                <i></i>
                <a href="http://www.deutsche-digitale-bibliothek.de/about-us/institutions/item/BK4TL6WN32LHK4KQ5SJK4MUFC4S5757A">Landesarchiv Baden-Württemberg. Abt. 7: Hauptstaatsarchiv Stuttgart</a>    

        </li>
    </ul>
    <ul>
        <li>
                <i></i>
                <a href="http://www.deutsche-digitale-bibliothek.de/about-us/institutions/item/KOGPVMUDJQHC76KACXJZRDGRVQOTP56I">Landesarchiv Baden-Württemberg. Abt. 8: Staatsarchiv Wertheim</a>    

        </li>
    </ul>
    <ul>
        <li>
                <i></i>
                <a href="http://www.deutsche-digitale-bibliothek.de/about-us/institutions/item/QCEIRIEOZOKR7TLQEY6VMAZ76FRNT5LP">Landesarchiv Baden-Württemberg. Abt. 9: Institut für Erhaltung von Archiv- und Bibliotheksgut</a>    

        </li>
    </ul>
    <ul>
        <li>
                <i></i>
                <a href="http://www.deutsche-digitale-bibliothek.de/about-us/institutions/item/JF2NLWDTKIA67F7SJO7D7UIDJIM6DCQP">Landesarchiv Baden-Württemberg. Abteilung Staatsarchiv Sigmaringen</a>    

        </li>
    </ul>
        </li>
    </ul>

                </div>
        </div>
    </div>
      
    </div>
<!--  /div-->