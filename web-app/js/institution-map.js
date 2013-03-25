window.ddbAddOnloadListener(function() {
    mapInitializer();
});

function mapInitializer(){
  $.ajax({
      type: 'GET',
      dataType: 'json',
      async: true,
      url: contextPath + '/apis/institutionsmap?clusterid=1',
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
    var sectors = ddb.getSelectedSectors();
    alert(sectors);
  }


};
