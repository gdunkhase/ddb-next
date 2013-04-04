var MAP_DIR = '/third-party/map/';

function drawmap( itemDiv, language, lon, lat ) {
    if (typeof console != 'undefined') {
    //  console.log("called: drawmap('" + itemDiv + "','" + language + "', " + lon + ", " + lat + ") ");
    }

    //var osmTileServer = "openstreetmap.org";
    //var osmTileServer = "opencyclemap.org/cycle";

    var osmTileServer = "maps.deutsche-digitale-bibliothek.de";
    var osmTileset = [ "http://a.tile." + osmTileServer + "/${z}/${x}/${y}.png",
                       "http://b.tile." + osmTileServer + "/${z}/${x}/${y}.png",
                       "http://c.tile." + osmTileServer + "/${z}/${x}/${y}.png" ];

    var mapOptions = {
        osmTileset: osmTileset
    };

    InstitutionItemMapController.drawMap( itemDiv, language, lon, lat, mapOptions );
}

