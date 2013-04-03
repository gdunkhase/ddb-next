
if ( typeof InstitutionsMapModel == 'undefined' ) {

    InstitutionsMapModel = (function () {

        var _initialized = false;
        var _urlPrefix;

        var _deBoundaries = {
            minLat: 46.69258,
            minLon: 2.48328,
            maxLat: 55.86127,
            maxLon: 18.5233
        };

        var _mapWidget;         // 
        var _allMapData;        // array of institutionData
        var _institutionsById;  // an object/map: institutionData.id->institutionData

        var _sectorSelection;   // as last published on InstitutionsSectors
        var _selectedSectors;   // an object to identify the selected sectors
        var _filterSectors;     // sectors used for filtering
        var _sectorsMapData;    // the data to display depending on selected sectors
        var _allSectors;        // count and name of sectors selected

        var _isIE8; // is this script running in MS Internetexplorer Version 8 or less
        var _clusterSet; // the set of clustered institutions

        // Returns the version of Internet Explorer or -1
        // (indicating the use of another browser).
        var f_getInternetExplorerVersion = function () {
            var rv = -1; // Return value assumes failure.
            if (navigator.appName == 'Microsoft Internet Explorer')
            {
                var ua = navigator.userAgent;
                var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                if (re.exec(ua) != null)
                rv = parseFloat( RegExp.$1 );
            }
            return rv;
        }

        var f_isInitialized = function() {
            return _initialized;
        };

        /**
         * @param {string} mapDivId the id if the div to display the map in.
         * @param {language} "en" or "de".
         * @param {object} optional. specific Map options
         */
        var f_initialize = function (mapDivId, language, startupOptions) {

            GeoTemConfig.determineAndSetUrlPrefix("InstitutionsMapModel.js");

            var MSVersion = f_getInternetExplorerVersion();

            _isIE8 = ( MSVersion > -1 && MSVersion <= 8.0 );
            if (_isIE8 && typeof console != "undefined") {
                console.warn("running Internet Explorer 8 or less");
            }
            
            if (typeof console != 'undefined') {
                console.log("f_initialize mapDivId=" + mapDivId + " language=" + language);
                console.log("f_initialize _urlPrefix=" + f_getUrlPrefix());
            }

            GeoTemConfig.language = language;
            GeoTemConfig.allowFilter = false;

            var mapDiv = document.getElementById(mapDivId);

            var map = new WidgetWrapper();

            if (_isIE8) {
                _mapWidget = new MapWidget_IE8Gen(map, mapDiv);
            } else {
                var mapWidget = new MapWidget(map, mapDiv, $.extend({
                    mapTitle: GeoTemConfig.getString('institutes'),
                    mapHeight: false, // '670px', // false or desired height css definition for the map
                    showDescriptions: false,
                    olNavigation: false, // show/hide OpenLayers navigation panel
                    mapSelectionTools: false, // show/hide map selector tools
                    labelGrid: false, // enables, disables hove
                    countrySelect: false,
                    resetMap: true,
                    mapSelection: false, // disable background map selection
                    boundaries: _deBoundaries,
                    maxPlaceLabels: 0, // unlimited
                    circleTransparency: true,
                    geoLocation: false
                },startupOptions));
            }

            if (typeof console != 'undefined') {
                console.log("MapWidget displayed");
            }

            _initialized = true;

            $('.absoluteToolbar').css("display", "none");
            return map;
        };

        var f_makeSectorsObject = function (selectorList) {
            var sectorObject = {};
            for (var xel = 0; xel < selectorList.length; xel++) {
                var el = selectorList[xel];
                sectorObject[el.sector] = {count: 0, name: el.name};
            };
            return sectorObject;
        };

        var f_selectSectors = function (aSectorSelection) {
            if (typeof console != 'undefined') {
                console.log("sectors selected: " + aSectorSelection.selected.length + " deselected: " + aSectorSelection.deselected.length);
            }
            _sectorSelection = aSectorSelection; // save the published state

            var time0 = (new Date()).getTime();

            _selectedSectors = f_makeSectorsObject(_sectorSelection.selected);
            var deselectedSectors = f_makeSectorsObject(_sectorSelection.deselected);
            _allSectors = {};
		    $.extend(_allSectors, _selectedSectors);
		    $.extend(_allSectors, deselectedSectors);

            _filterSectors = (_sectorSelection.selected.length === 0) ? deselectedSectors:_selectedSectors;
            if (_isIE8) {
                _clusterSet = f_getMapNameAndClusterSet(_filterSectors);
                var arr = [];
                arr.push(_clusterSet);
                GeoPublisher.GeoPublish('filter', arr, null);
            } else {
                _sectorsMapData = [];
                for (var xel = 0; xel <_allMapData.length; xel++) {
                    var el = _allMapData[xel];
                    var elSector = el.description.node.sector;
                    if (_filterSectors[elSector] !== undefined) {
                        _sectorsMapData.push(el);
                        _filterSectors[elSector].count++;
                    };
                };

                var datasets = [];
                datasets.push(new Dataset(_sectorsMapData, "institutions"));
                GeoPublisher.GeoPublish('filter', datasets, null);
            }

        };

        var f_sectorName = function(sectorId) {
            if (_allSectors) {
                return _allSectors[sectorId].name;
            } else {
                return undefined;
            }
        };

        var f_isSelected = function(sectorId) {
            if (_selectedSectors) {
                return _selectedSectors[sectorId];
            } else {
                return undefined;
            }
        }

        var f_getMapNameAndClusterSet = function(filterSet) {
            var urlPrefix = GeoTemConfig.urlPrefix + "ddb-map/";
            var sectorsName = "";
            var sortedSectorNames = [];
            for (var fkey in filterSet) {
                sortedSectorNames.push(fkey.replace('_',''));
            }
            sortedSectorNames.sort();
            sectorsName = ('_' + sortedSectorNames.join('_'));

            var clusterUrl = urlPrefix + "cluster" + sectorsName + ".json";
            var mapUrl = urlPrefix + "map" + sectorsName + ".jpg";
            if (typeof console != "undefined") {
                console.log(clusterUrl);
            }
            clusterSet = GeoTemConfig.getJson(clusterUrl);
            if (typeof console != "undefined") {
                console.log("clusterSet name: " + clusterSet.name);
                console.log("clusterSet size: " + clusterSet.clusters.length + " clusters");
            }

            _ie8MapCluster = {
                clusterUrl: clusterUrl,
                mapUrl: mapUrl,
                clusterSet: clusterSet
            };
            return _ie8MapCluster;
        };

        /**
         * process the data about all institutions and build the structures needed
         * for map presentation and sorting subsets of all institutions
         */
        var f_prepareInstitutionsData = function (institutionMapData) {

            var allInstitutionsArray = flatten(institutionMapData.institutions);

            _allMapData = GeoTemConfig.loadJson(allInstitutionsArray);

            _institutionsById = {};
            for (var xel = 0; xel < _allMapData.length; xel++) {
                el = _allMapData[xel];
                _institutionsById[el.description.node.id] = el;
            };

            /*
             * make an object that can be handled by
             * GeoTemCoConfig.loadJSON(:Array)
             */
            function tree2mapElement(treeNode,superNode,number,indentLevel) {
                var latitude = treeNode.latitude;
                var longitude = treeNode.longitude;
                if (latitude < _deBoundaries.minLat || latitude > _deBoundaries.maxLat
                    || longitude < _deBoundaries.minLon || longitude > _deBoundaries.maxLon
                   ) {
                    return null;
                }

                var descr = {
                    indentLevel: indentLevel,
                    number: number,
                    node: treeNode,
                    superNode: superNode
                }

                return { // contains required elements and element 'description'
                    id: treeNode.id,
                    place: treeNode.name,
                    sector: treeNode.sector,
                    lat: latitude,
                    lon: longitude,
                    description: descr
                }
            };

            function flatten(aTree) {
                var result = flatten_r(aTree,null,0,{count: 0, list: []});
                if (typeof console != 'undefined') {
                    console.log("number of institutions: " + result.count);
                }
                return result.list;
            }
            function flatten_r(aTree, superNode, level, result) {
                for (var i = 0; i < aTree.length; i++) {
                    var treeNode = aTree[i];
                    if (treeNode !== null) {
                        var mapElement = tree2mapElement(treeNode,
                                                         superNode,
                                                         result.count,
                                                         level);
                        result.count++;
                        if (mapElement !== null) {
                            result.list.push(mapElement);
                        } else {
                            if (typeof console !== "undefined") {
                                console.log("out of germanys bounding box:");
                                console.dir(treeNode);
                            }
                        }
                        var children = treeNode.children;
                        if (children instanceof Array) {
                            flatten_r(children, mapElement.id, level+1, result);
                        }
                    }
                }
                return result;
            };
        };

        var f_filterSectors = function() {
            if (_filterSectors) {
                return _filterSectors;
            } else {
                return undefined;
            }
        };

        var f_getUrlPrefix = function() {
            return GeoTemConfig.urlPrefix;
        }

        var f_mapWidget = function() {
            return _mapWidget;
        }

        var f_getCluster = function(index) {
            return _clusterSet.clusterSet.clusters[index];
        }

        var f_getNode = function(id) {
            return _institutionsById[id];
        }

        return {
            initialize: f_initialize,
            isInitialized: f_isInitialized,
            getUrlPrefix: f_getUrlPrefix,
            prepareInstitutionsData: f_prepareInstitutionsData,
            selectSectors: f_selectSectors,
            isSelected: f_isSelected,
            sectorName: f_sectorName,
            filterSectors: f_filterSectors,
            getNode : f_getNode,
            getCluster : f_getCluster,
            mapWidget : f_mapWidget
        };
    })();
}

