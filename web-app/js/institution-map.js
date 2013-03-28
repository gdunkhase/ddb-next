var institutionsMapRef = contextPath + '/apis/institutionsmap';

window.ddbAddOnloadListener(function () {
    MapAdapter.startup("mapContainerDiv",'de');
    return;
});

var MapAdapter = (function ( $ ) {

    var mapDivId;
    var language;

    var startup = function ( mapDiv, lang) {
        console.log("startup");

        mapDivId = "#" + mapDiv;
        language = lang;

        _setupDom4MapDisplay();

        fetchAllInstitutions(_displayAllInstitutionsData);
    };

    var fetchAllInstitutions = function ( successFn ) {
        $.ajax({
            type : 'GET',
            dataType : 'json',
            async : true,
            url : institutionsMapRef + '?clusterid=-1',
            success : successFn
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
            _displaySectorSelection();
        });
    };

    var getSectorSelection = function () {
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



    var _displaySectorSelection = function () {
        console.log("XXX _displaySectorSelection");
        var sectors = getSectorSelection();
        var info_html = "<pre>\n" + JSON.stringify(sectors,null,2) + "\n</pre>"; 
        $(mapDivId).html(info_html);
    };

    var _displayAllInstitutionsData = function ( jsonData ) {
        var info_txt = "XXX  map-widget-test.js: jsonData.size == " + jsonData.size;
        console.log(info_txt);
        $(mapDivId).html(info_txt);
    };


    return {
        startup: startup,
        fetchAllInstitutions: fetchAllInstitutions,
        getSectorSelection: getSectorSelection
    }

})(jQuery);

