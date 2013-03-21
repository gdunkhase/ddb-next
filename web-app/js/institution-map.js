window.ddbAddOnloadListener(function() {
  
    mapInitializer();
  
});

function mapInitializer(){
  $('#institution-map').removeClass('off');
  $('#institution-list').addClass('off');
  
  $('input:checkbox').click(function() {
      applyFilters();
  });
  
  function applyFilters() {
    var sectors = ddb.getSelectedSectors();
    alert(sectors);
  }


};
