/*
* MapGui_IE8Gen.js
*
* used to generated the map without zoom control
* and without OSM links.
*
* modfied copy of
* MapGui.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*/

/**
 * @class MapGui
 * Map GUI Implementation
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 *
 * @param {MapWidget} parent map widget object
 * @param {HTML object} div parent div to append the map gui
 * @param {JSON} options map configuration
 */
MapGui_IE8CanvasEmulation = false; // XXX experiment

function MapGui_IE8Gen(map, div, options) {

//    if (typeof console != "undefined") {
//        console.warn("MapGui_IE8 created");
//    }
	this.map = map;

	this.container = div;
	this.container.style.position = 'relative';

	this.mapWindow = document.createElement("div");
	this.mapWindow.id = "mapWindow";
	this.container.appendChild(this.mapWindow);

    
	$(window).resize(function(){
	});

    this.changeMap = function(mapClusterSetArr) {
        var mapClusterSet = mapClusterSetArr[0];
        if (this.mapWindow.hasChildNodes()) {
            this.mapWindow.removeChild(this.mapImg);
            this.mapWindow.removeChild(this.mapClickAreas);
        }
        this.mapImg = document.createElement('img');
        this.mapImg.setAttribute('src', mapClusterSet.mapUrl);
        this.mapImg.setAttribute('width', '730px');
        this.mapImg.setAttribute('height', '670px');
        this.mapImg.setAttribute('usemap', '#ddbmap');
        this.mapWindow.appendChild(this.mapImg);

        this.mapClickAreas = document.createElement('map');
        this.mapClickAreas.setAttribute('name', 'ddbmap');

        var clusters = mapClusterSet.clusterSet.clusters;
        for ( var clusterIndex = 0; clusterIndex < clusters.length; clusterIndex++) {
            var area = document.createElement('area');
            var cluster = clusters[clusterIndex];
            var x = cluster.x;
            var y = cluster.y;
            var radius = cluster.radius;
            area.setAttribute('shape', 'circle');
            area.setAttribute('coords', x + ',' + y + ',' + radius);
            area.setAttribute('alt', ' :-( ');
            area.setAttribute('onclick', 'MapWidget_IE8Gen_onClusterClick(' + x + ',' + y + ',' + clusterIndex + ')');
            this.mapClickAreas.appendChild(area);
        }
        this.mapWindow.appendChild(this.mapClickAreas);
    };
};
