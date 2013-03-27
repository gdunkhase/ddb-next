
var INSTITUTION_ITEM_MAP_DIV = 'divOSM';

function drawmap(lon, lat, instName, street, houseIdentifier, postalCode, city) {
    var textHtml = "<font color=\"black\"><b>"
                    + "lon: " + lon + "  lat: " + lat
                    + instName + "</br>" + street + "&nbsp;" + houseIdentifier + "</br>"
                    + postalCode + "&nbsp;" + city
                    + "</b></font>";

    console.log("called: drawmap(..) " + textHtml);
    $('#'+INSTITUTION_ITEM_MAP_DIV).innerHtml = textHtml;
}


if ( typeof InstitutionItemMapController == 'undefined' ) {
/*

    InstitutionItemMapController = (function () {

        var Events = {
            /// event that notifies the subscribers that the detail map is ready
            /// this should trigger subscriber to start listening to map events
            /// accepts non-null param (true)
            InstitutionItemMapReady: "InstitutionDetailMapReady",

            /// event to startup and position the map to coordinate
            /// accepts param (args) {
            ///             "language": "en|de",
            ///             "mapDiv": "<DOM id for map>",
            ///             "position": {
            ///                 "longitude": <longitude with decimal fraction>,
            ///                 "latitude": <latitude with decimal fraction>
            ///              }
            ///         }
            InstitutionItemMapActivate: "InstitutionDetailMapActivate"

        };

        var setupEventSubscriptions = function () {

            GeoPublisher.GeoSubscribe('GeoTemCoReady', this, function () {

                if (typeof console != 'undefined') {
                    console.log("InstitutionItemMapController  - received: GeoTemCoReady");
                };

                Ddb.Publisher.Publish(Events.InstitutionItemMapReady, true);
                
                // now map resources have loaded, start listening for map activation...
                Ddb.Publisher.Subscribe(Events.InstitutionItemMapActivate, function (args) {
                    if (args) {
                        if (typeof console !== 'undefined') {
                            console.log("InstitutionItemMapModel isInitialized:" + InstitutionItemMapModel.isInitialized());
                        }

                        if (!InstitutionItemMapModel.isInitialized()) {
                            var position =  { longitude: 7.2, latitude: 51.2 };
                            if (args.position) {
                                position = args.position;
                            };
                            InstitutionItemMapModel.initialize(args.mapDiv, args.language, position);
                        }
                    }
                });
            });
        };

        setupEventSubscriptions();

        return {
            Events: Events
        };

    })();

*/
}

