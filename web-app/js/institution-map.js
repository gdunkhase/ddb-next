var institutionsMapRef = contextPath + '/apis/institutionsmap';

window.ddbAddOnloadListener(function() {
    mapInitializer();
});

function mapInitializer(){
  $.ajax({
      type: 'GET',
      dataType: 'json',
      async: true,
      url: institutionsMapRef + '?clusterid=1',
      success: function (data) {
          mapWidget.showMap(data);
      }
  });
  
  $('#institution-list').addClass('off');
  $('#institution-map').removeClass('off');
  $('.view-type-switch').removeClass('off');
  
  
  $('#view-list').click(function(){
    $('#view-list').addClass('selected');
    $('#view-map').removeClass('selected');
    $('#institution-map').addClass('off');
    $('#institution-list').removeClass('off');
  });

  $('#view-map').click(function(){
    $('#view-map').addClass('selected');
    $('#view-list').removeClass('selected');
    $('#institution-list').addClass('off');
    $('#institution-map').removeClass('off');
  });

  $('input:checkbox').click(function() {
      applyFilters();
  });
  
  function applyFilters() {
    var sectors = getSectorMap();
  }

  function getSectorMap() {
    var sectors = {};
    sectors["selected"] = [];
    sectors["deselected"] = [];
    $('.sector-facet').each(function () {
        var sectorData = {};
        sectorData["sector"] = $(this).find('input').data('sector');
        sectorData["name"] = $(this).children('label').text().trim();
        if ($(this).find('input').is(":checked")) {
            sectors["selected"].push(sectorData);
        }
        else {
            sectors["deselected"].push(sectorData);
        }
    });
    if (sectors["selected"].length == 0) {
        sectors["selected"] = sectors["deselected"];
        sectors["deselected"] = [];
    }
    return sectors;
  }
};
