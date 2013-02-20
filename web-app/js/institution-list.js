'use strict';
$(document).ready(function() {
  $('.filter').show();

  var all = $('.institution');
  console.log('list: ', all); //.not(filtered).hide();

  // "Filter" by section. It is *not* a reduction filter which combination of
  // filters form a AND relation. The implemented filter has following semantic
  // `show the user all institutions which match filter foo OR filter bar.
  // TODO add class or id to improve readability
  $('input:checkbox').click(function() {
    if (this.checked) {

      // only load the data from the server once until page refreshes.
      if (ddb.institutions === null) {
        ddb.institutions = ddb.fetchData();
      }

      var filtered = ddb.filterBySection(this);

      // highlight the filtered institutions
      $(filtered).find('a').addClass('highlight');
      console.log('filtered: ', filtered);
      
      
      // hide others
      var notFiltered = $(all).not(filtered);
      console.log('filtered: ', notFiltered);

      $(all).not(filtered).hide();

    } else {
      // if uncheck a section filter

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