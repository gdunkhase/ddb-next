/**
 * built according to "Revealing Module Pattern (Public & Private)"
 * http://enterprisejquery.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/
 */
//URI to institutions-data
var INSTITUTIONS_MAP_REF = '/apis/institutionsmap';

//Directory where map-application is located
var MAP_DIR = '/third-party/map/';

//name of page where map with all institutions is written in
var INSTITUTIONLIST_PAGE_NAME = 'institutionList';

//name of page where map for 1 institution is written in
var INSTITUTION_PAGE_NAME = 'institution';

//div where map with all institutions is written in
var INSTITUTIONLIST_DIV = 'mapContainerDiv';

//div where map for 1 institution is written in
var INSTITUTION_DIV = 'divOSM';

//only initialize map once, then remember in this variable
var mapInitialized = false;

var InstitutionsMapAdapter = (function($, undefined) {
    'use strict';

    var osmTileServer = 'openstreetmap.org';
    //var osmTileServer = "opencyclemap.org/cycle";
    //var osmTileServer = 'maps.deutsche-digitale-bibliothek.de';
    var osmTileset = ['http://a.tile.' + osmTileServer + '/${z}/${x}/${y}.png',
                       'http://b.tile.' + osmTileServer + '/${z}/${x}/${y}.png',
                       'http://c.tile.' + osmTileServer + '/${z}/${x}/${y}.png'];

    var institutionsMapOptions = {
        resetMap: true,
        mapHeight: false,
        mapWidth: false,
        osmTileset: osmTileset
    };

    var institutionMapOptions = {
        osmTileset: osmTileset
    };

    var Public = {}; // for public properties. avoid the reserved keyword "public"

    Public.drawInstitution = function(mapDiv, lang, lon, lat) {
        InstitutionItemMapController.drawMap(mapDiv, lang, lon, lat, institutionMapOptions);
    };

    Public.selectSectors = function() {
        var sectors = _getSectorSelection();
        InstitutionsMapController.selectSectors(sectors);
    };

    var _getSectorSelection = function() {
        var sectors = {};
        sectors['selected'] = [];
        sectors['deselected'] = [];
        $('.sector-facet').each(function() {
            var sectorData = {};
            sectorData['sector'] = $(this).find('input').data('sector');
            sectorData['name'] = $.trim($(this).children('label').text());
            if ($(this).find('input').is(':checked')) {
                sectors['selected'].push(sectorData);
            } else {
                sectors['deselected'].push(sectorData);
            }
        });
        return sectors;
    };


    Public.fetchAllInstitutions = function(successFn) {
        _fetchDataAjax(INSTITUTIONS_MAP_REF + '?clusterid=-1', successFn);
    };

    var _fetchDataAjax = function(a_url, a_successFn) {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            async: true,
            url: a_url,
            success: a_successFn
        });
    };

    var _enableListView = function() {
        $('#institution-map').addClass('off');
        $('#institution-list').removeClass('off');

        $('.view-type-switch').removeClass('off');
        $('#first-letter-index').removeClass('off');

        $('#view-institution-list').addClass('selected');
        $('#view-institution-map').removeClass('selected');

        $('#main-container').removeClass('map');
        $('#main-container').addClass('list');
    };

    var _enableMapView = function() {
        $('#institution-list').addClass('off');
        $('#institution-map').removeClass('off');

        $('.view-type-switch').removeClass('off');
        $('#first-letter-index').addClass('off');

        $('#view-institution-map').addClass('selected');
        $('#view-institution-list').removeClass('selected');

        $('#main-container').addClass('map');
        $('#main-container').removeClass('list');

        _initializeMap();

        $('input:checkbox').click(function() {
            Public.selectSectors();
        });
    };

    var _initializeMap = function() {
        if (!mapInitialized) {
            InstitutionsMapController.startup(INSTITUTIONLIST_DIV, jsLanguage,
                institutionsMapOptions);
            mapInitialized = true;
        }
    };

    var _getWindowWidth = function() {
        if (window.innerWidth) {
            return window.innerWidth;
        }
        else if (window.document.documentElement &&
            window.document.documentElement.clientWidth) {
            return window.document.documentElement.clientWidth;
        }
        else {
            return window.document.body.offsetWidth;
        }
    };

    Public.setupDom4MapDisplay = function() {
        // We hide the loader image.
        $('.loader').addClass('off');

        var hash = window.location.hash.substring(1);

        /*
         * Depends on the hash, we decide to the shows the map or the list view.
         */
        // TODO: why we need _getWindowWidth ?
        if ((hash === 'map' || hash === '') && (_getWindowWidth() > 767)) {
            _enableMapView();
        }else {
            _enableListView();
        }

        $('#view-institution-list').click(function() {
            _enableListView();
        });

        $('#view-institution-map').click(function() {
            _enableMapView();
        });

    };

    return Public;

})(jQuery);

$('#institution-list').ready(function() {
    $('#institution-list').addClass('off');
    return;
});

$(function() {
    INSTITUTIONS_MAP_REF = jsContextPath + INSTITUTIONS_MAP_REF;
    MAP_DIR = jsContextPath + MAP_DIR;
    GeoTemCoMinifier_urlPrefix = window.document.location.protocol + '//' +
        window.document.location.host + MAP_DIR;
    if (jsPageName === INSTITUTION_PAGE_NAME) {
        /* We execute this function in the institution page, for example:
         * //about-us/institutions/item/CGTOW3JCT4TEG3FIU6KI3TMAGEC4DJJR
         */
        InstitutionsMapAdapter.drawInstitution(INSTITUTION_DIV, jsLanguage,
            jsLongitude, jsLatitude);
    }
    else if (jsPageName === INSTITUTIONLIST_PAGE_NAME) {
        /* We execute this function in the institution list or map page, for example:
         * - //about-us/institutions
         * - //about-us/institutions#list
         * - //about-us/institutions#Z
         */
        // We set the institution list and map adapter.
        InstitutionsMapAdapter.setupDom4MapDisplay();
    }
    return;
});
