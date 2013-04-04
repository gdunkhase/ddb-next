/*
* MapWidget_IE8Gen.js
*
* used to generated the map without zoom control
* and without OSM links.
*
* modfied copy of
* MapWidget.js
*
* Copyright (c) 2012, Stefan Jänicke. All rights reserved.
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU Lesser General Public
* License as published by the Free Software Foundation; either
* version 3 of the License, or (at your option) any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
* Lesser General Public License for more details.
*
* You should have received a copy of the GNU Lesser General Public
* License along with this library; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
* MA 02110-1301  USA
*/

/**
 * @class MapWidget
 * MapWidget Implementation
 * @author Stefan Jänicke (stjaenicke@informatik.uni-leipzig.de)
 * @release 1.0
 * @release date: 2012-07-27
 * @version date: 2012-07-27
 *
 * @param {MapWrapper} core wrapper for interaction to other widgets
 * @param {HTML object} div parent div to append the map widget div
 * @param {JSON} options user specified configuration that overwrites options in MapConfig.js
 */

MapWidget_IE8Gen_onClusterClick = function(pixelX, pixelY, clusterIndex) {
        if (typeof console != 'undefined') {
            console.log("global onClusterClick(" + pixelX + ', ' + pixelY + ', ' + clusterIndex + ')');
        }
        InstitutionsMapModel.mapWidget().onClusterClick(pixelX,pixelY,clusterIndex);
}

function MapWidget_IE8Gen(core, div, options) {

	this.core = core;
	this.core.setWidget(this);
	this.openlayersMap
	this.baseLayers
	this.objectLayer

	this.drawPolygon
	this.drawCircle
	this.selectCountry
	this.dragArea
	this.selectFeature
	this.navigation

	this.div = div;

	this.options = (new MapConfig(options)).options;
	this.formerCP = this.options.circlePackings;
	this.gui = new MapGui_IE8Gen(this, this.div, this.options);

	this.initialize();
}

MapWidget_IE8Gen.prototype = {

	/**
	 * initializes the map for the Spatio Temporal Interface.
	 * it includes setting up all layers of the map and defines all map specific interaction possibilities
	 */
	initialize : function() {

		var map = this;

        if (typeof console != "undefined") {
            console.warn("MapWidget_IE8Gen.initialize()");
        }

	},

	onClusterClick : function(pixelX, pixelY, clusterIndex) {
		var map = this;
        map.reset();

        if (typeof console != 'undefined') {
            console.log("onClusterClick(" + pixelX + ', ' + pixelY + ', ' + clusterIndex + ')');
        }

        if (map.popup) {
            map.popup.reset();
        }
        map.popup = new PlacenamePopup_IE8Gen(map);
        map.popup.createPopup(pixelX, pixelY, clusterIndex);
    },


	/**
	 * draws the object layer.
	 * @param {boolean} zoom if there was a zoom; if not, the new boundary of the map is calculated
	 */
	drawObjectLayer : function(mapClusterSet) {
        if (typeof console != "undefined") {
            console.log("drawObjectLayer");
        }
        this.gui.changeMap(mapClusterSet);
	},

	/**
	 * initializes the object layer.
	 * all point representations for all zoom levels are calculated and initialized
	 * @param {MapObject[][]} mapObjects an array of map objects from different (1-4) sets
	 */
	initWidget : function(mapClusterSet) {
        if (typeof console != "undefined") {
            console.log("initWidget -" + mapClusterSet + '-' + (typeof mapClusterSet) + '+');
            console.dir(mapClusterSet);
        }

		this.clearMap();

		this.drawObjectLayer(mapClusterSet);
	},

	/**
	 * resets the map by destroying all additional elements except the point objects, which are replaced
	 */
	reset : function() {
		if (this.popup) {
			this.popup.reset();
		}
	},

	/**
	 * resets the map by destroying all elements
	 */
	clearMap : function() {
		this.reset();
	},

	/**
	 * updates the proportional selection status of a point object
	 * @param {PointObject} point the point to update
	 * @param {OpenLayers.Geometry.Polygon} polygon the actual displayed map polygon
	 */
	updatePoint : function(point, polygon) {
	},

	/**
	 * updates the the object layer of the map after selections had been executed in timeplot or table or zoom level has changed
	 */
	highlightChanged : function(mapObjects) {
	},

	selectionChanged : function(selection) {
	},

	mapSelection : function() {
	},

	deselection : function() {
	},

	filtering : function() {
	},

	inverseFiltering : function() {
	},

	mapCircleHighlight : function(circle, undo) {
	},


	/**
	 * performs a zoom on the map
	 * @param {int} delta the change of zoom levels
	 */
	zoom : function(delta) {
	},

	deactivateCountrySelector : function() {
	},

	activateCountrySelector : function(layer) {
	},

	setMap : function(index) {
	},


	getZoom : function() {
		return 5;
	},

	getLevelOfDetail : function() {
			return 2;
	}

}
