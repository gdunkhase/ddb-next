
if ( typeof InstitutionsMapController === 'undefined' ) {

    InstitutionsMapController = (function () {

        var setupEventSubscriptions = function () {
            GeoPublisher.GeoSubscribe('GeoTemCoReady', this, function () {
                if (typeof console == "undefined") {
                    console.log("InstitutionsMapController <<< GeoTemCoReady");
                }
                // Publisher.Publish(Events.InstitutionsMapReady, true);
                //var map = InstitutionsMapModel.initialize('mapContainerDiv', 'de');
            });
        };

        var f_startup = function( mapDiv, language, startupOptions ) {
            var map = InstitutionsMapModel.initialize(mapDiv,language,startupOptions);
            MapAdapter.fetchAllInstitutions(f_startup2);
        };

        var f_startup2 = function( mapData ) {
            InstitutionsMapModel.prepareInstitutionsData(mapData);
            var sectorSelection = MapAdapter.getSectorSelection();
            f_selectSectors(sectorSelection);
        };

        var f_selectSectors = function( sectorSelection ) {
            InstitutionsMapModel.selectSectors(sectorSelection);
        };

        var f_deactivate = function() {
        };
        
        setupEventSubscriptions();

        var getJson = function( url, callbackFn ) {
            $.ajax({
                url : url,
                async : true,
                dataType : 'json',
                success : callbackFn
            });
        }

        return {
            startup: f_startup,
            selectSectors: f_selectSectors,
            deactivate: f_deactivate
        };

    })();

}

