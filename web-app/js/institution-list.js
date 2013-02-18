'use strict';
$(document).ready(function() {
  $('.filter').show();
  
  var all = $('.institution');
  console.log('list: ', all); //.not(filtered).hide();

  $('input:checkbox').click(function() {
    if (this.checked) {
      
      if (ddb.institutions === null) {
        ddb.institutions = ddb.fetchData();
      }
      
      var filtered = ddb.filterBySection(this);
      
      $(filtered).find('a').addClass('highlight');
      
      // TODO: hide unfiltered
      console.log('filtered: ', filtered);
      
      var notFiltered = $(all).not(filtered);
      console.log('filtered: ', notFiltered);
      
      $(all).not(filtered).hide();
      
    } else {
      
      var filtered = ddb.filterBySection(this);
      $(filtered).find('a').removeClass('highlight');
      
      var notFiltered = $(all).not(filtered);
      console.log('filtered: ', notFiltered);
      
      $(all).not(filtered).show();
      
    }
  });
});

var ddb = {

  Config: {
    // TODO: move the url to an external configuration file.
    ddbBackendUrl: 'http://localhost:8080/apis/institutions'
  },
  
  institutions: null,

  filterBySection: function(el) {
    var filterBy = $(el).data('sector');
    var filtered = $('li').filter(function() {
      return $(this).data('sector') === filterBy;
    });
    return filtered;
  },

  fetchData: function() {
    $.getJSON(ddb.Config.ddbBackendUrl, function(data) {
      console.log('the institution: ', data);
    });
  }
}
