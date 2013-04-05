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

var InstitutionsMapAdapter = (function ( $, undefined ) {

    //var osmTileServer = "openstreetmap.org";
    //var osmTileServer = "opencyclemap.org/cycle";

    var osmTileServer = "maps.deutsche-digitale-bibliothek.de";
    var osmTileset = [ "http://a.tile." + osmTileServer + "/${z}/${x}/${y}.png",
                       "http://b.tile." + osmTileServer + "/${z}/${x}/${y}.png",
                       "http://c.tile." + osmTileServer + "/${z}/${x}/${y}.png" ];

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

    Public.drawInstitutions = function ( mapDiv, lang) {
        if (typeof console != "undefined") {
            console.log("startup");
        }

        _setupDom4MapDisplay();

        InstitutionsMapController.startup(mapDiv,lang,institutionsMapOptions);
    };

    Public.drawInstitution = function ( mapDiv, lang, lon, lat) {
        if (typeof console != "undefined") {
            console.log("startup");
        }

        InstitutionItemMapController.drawMap( mapDiv, lang, lon, lat, institutionMapOptions );
    };

    Public.selectSectors = function () {
        var sectors = _getSectorSelection();
        InstitutionsMapController.selectSectors(sectors);
    };

    var _getSectorSelection = function () {
        var sectors = {};
        sectors["selected"] = [];
        sectors["deselected"] = [];
        $('.sector-facet').each(function () {
            var sectorData = {};
            sectorData["sector"] = $(this).find('input').data('sector');
            sectorData["name"] = $(this).children('label').text().trim();
            if ($(this).find('input').is(":checked")) {
                sectors["selected"].push(sectorData);
            } else {
                sectors["deselected"].push(sectorData);
            }
        });
        if (sectors["selected"].length == 0) {
            sectors["selected"] = sectors["deselected"];
            sectors["deselected"] = [];
        }
        return sectors;
    }


    Public.fetchAllInstitutions = function ( successFn ) {
        _fetchDataAjax(INSTITUTIONS_MAP_REF + '?clusterid=-1', successFn);
    };

    var _fetchDataAjax = function (a_url,a_successFn) {
        $.ajax({
            type : 'GET',
            dataType : 'json',
            async : true,
            url : a_url,
            success : a_successFn
        });
    };
    
    var _enableListView = function() {
        $('.view-type-switch').removeClass('off');
        $('#first-letter-index').removeClass('off');

        $('#view-institution-list').addClass('selected');
        $('#view-institution-map').removeClass('selected');

        $('#institution-map').addClass('off');
        $('#institution-list').removeClass('off');

        $('#main-container').removeClass('map');
        $('#main-container').addClass('list');
    }

    var _enableMapView = function() {
        $('.view-type-switch').removeClass('off');
        $('#first-letter-index').addClass('off');
        
        $('#view-institution-map').addClass('selected');
        $('#view-institution-list').removeClass('selected');
        
        $('#institution-map').removeClass('off');
        $('#institution-list').addClass('off');

        $('#main-container').addClass('map');
        $('#main-container').removeClass('list');
    }

    var _setupDom4MapDisplay = function () {
    	
    	var hash = window.location.hash.substring(1);
        if (typeof console != "undefined") {
            console.log("Anchor-tag: '"+hash+"'");
        }
    	if(hash === "list"){
    		_enableListView();
    	}else{
    		_enableMapView();
    	}    	

        $('#view-institution-list').click(function () {
    		_enableListView();
        });

        $('#view-institution-map').click(function () {
    		_enableMapView();
        });

        $('input:checkbox').click(function () {
            Public.selectSectors();
        });
    };

    return Public;

})(jQuery);

$(document).ready(function () {
    INSTITUTIONS_MAP_REF = jsContextPath + INSTITUTIONS_MAP_REF;
    MAP_DIR = jsContextPath + MAP_DIR;
    GeoTemCoMinifier_urlPrefix = window.document.location.protocol + "//" + window.document.location.host + MAP_DIR;
    if (jsPageName == INSTITUTION_PAGE_NAME) {
        InstitutionsMapAdapter.drawInstitution(INSTITUTION_DIV, jsLanguage, jsLongitude, jsLatitude);
    }
    else if (jsPageName == INSTITUTIONLIST_PAGE_NAME) {
        InstitutionsMapAdapter.drawInstitutions(INSTITUTIONLIST_DIV, jsLanguage);
    }
    return;
});

