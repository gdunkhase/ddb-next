
var INSTITUTION_ITEM_MAP_DIV = 'divOSM';

function drawmap(itemDiv,language,lon, lat, instName, street, houseIdentifier, postalCode, city) {
    console.log("xxx called: drawmap('" + itemDiv + "','" + language + "') ");

    var position =  { longitude: lon, latitude: lat };
    InstitutionItemMapModel.initialize(itemDiv, language, position);
}


