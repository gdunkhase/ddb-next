/**
 * built according to "Revealing Module Pattern (Public & Private)"
 * http://enterprisejquery.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/
 */
var INSTITUTIONS_MAP_REF = contextPath + '/apis/institutionsmap';

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

    var mapDivId;
    var language;

    var Public = {}; // for public properties. avoid the reserved keyword "public"

    Public.startup = function ( mapDiv, lang) {
        if (typeof console != "undefined") {
            console.log("startup");
        }

        mapDivId = "#" + mapDiv;
        language = lang;

        _setupDom4MapDisplay();

        InstitutionsMapController.startup(mapDiv,lang,institutionsMapOptions);

        //fetchAllInstitutions(_displayAllInstitutionsData);
    };

    Public.selectSectors = function () {
        var sectors = this._getSectorSelection();
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


    var _fetchAllInstitutions = function ( successFn ) {
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

    var _setupDom4MapDisplay = function () {
        $('#institution-list').addClass('off');
        $('#institution-map').removeClass('off');
        $('.view-type-switch').removeClass('off');

        $('#view-list').click(function () {
            $('#view-list').addClass('selected');
            $('#view-map').removeClass('selected');
            $('#institution-map').addClass('off');
            $('#institution-list').removeClass('off');
        });

        $('#view-map').click(function () {
            $('#view-map').addClass('selected');
            $('#view-list').removeClass('selected');
            $('#institution-list').addClass('off');
            $('#institution-map').removeClass('off');
        });

        $('input:checkbox').click(function () {
            //_displaySectorSelection();
            Public.selectSectors();
        });
    };



    var _displaySectorSelection = function () {
        console.log("XXX _displaySectorSelection");
        var sectors = _getSectorSelection();
        var info_html = "<pre>\n" + JSON.stringify(sectors,null,2) + "\n</pre>"; 
        $(mapDivId).html(info_html);
    };

    var _displayAllInstitutionsData = function ( jsonData ) {
        var info_txt = "XXX  map-widget-test.js: jsonData.size == " + jsonData.size;
        console.log(info_txt);
        $(mapDivId).html(info_txt);
    };

    return Public;

})(jQuery);

window.ddbAddOnloadListener(function () {
    InstitutionsMapAdapter.startup("mapContainerDiv",'de');
    return;
});

