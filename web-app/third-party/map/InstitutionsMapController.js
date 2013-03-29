
if ( typeof InstitutionsMapController == 'undefined' ) {

    InstitutionsMapController = (function () {

        var _alertTimeStart = (new Date).getTime();
        var _alertTimeSum = 0;
        var _alertMessages = [];

        var f_alert = function(msg,args) {
            var stepTime = (new Date()).getTime() - _alertTimeStart;
            var stepMsg = "  XXXXX " + _alertTimeSum + "ms + " + stepTime + "ms | " + msg;
            _alertTimeSum+=stepTime;

            if (typeof console != 'undefined') {
                console.log((_alertMessages.length) + stepMsg + " -- args: " + args);
            };

            _alertMessages.push((_alertMessages.length) + stepMsg);
              //alert(_alertMessages.join("\n"));

            _alertTimeStart = (new Date()).getTime();
        }

        var setupEventSubscriptions = function () {

            GeoPublisher.GeoSubscribe('GeoTemCoReady', this, function () {
                f_alert("<<< GeoTemCoReady");
                // Publisher.Publish(Events.InstitutionsMapReady, true);
                //var map = InstitutionsMapModel.initialize('mapContainerDiv', 'de');
            });
        };

        var f_startup = function(mapDiv,language) {
            if (!InstitutionsMapModel.isInitialized()) { };
            var map = InstitutionsMapModel.initialize(mapDiv,language);

            MapAdapter.fetchAllInstitutions(f_startup2);
        };

        var f_startup2 = function(mapData) {
            InstitutionsMapModel.prepareInstitutionsData(mapData);
            var sectorSelection = MapAdapter.getSectorSelection();
            f_selectSectors(sectorSelection);
        };

        var f_selectSectors = function(sectorSelection) {
            InstitutionsMapModel.selectSectors(sectorSelection);
        };

        var f_deactivate = function() {
        };
        
        setupEventSubscriptions();

        var getJson = function(url,callbackFn) {
            $.ajax({
                url : url,
                async : true,
                dataType : 'json',
                success : callbackFn
            });
        }

        var sectorsSelected = [
            { sector : 'sec_01', name: 'Archiv'},
            { sector : 'sec_02', name: 'Bibliothek'},
            { sector : 'sec_03', name: 'Denkmalpflege'},
            { sector : 'sec_04', name: 'Forschung'},
            { sector : 'sec_05', name: 'Mediathek'},
            { sector : 'sec_06', name: 'Museum'},
            { sector : 'sec_07', name: 'Sonstige'},
        ];

        var sectorsDeselected = [
        ];

        return {
            logEvent: f_alert,
            startup: f_startup,
            selectSectors: f_selectSectors,
            deactivate: f_deactivate
        };

    })();

}

