'use strict';
$(document).ready(function() {
  // if the User Agent enable JS, show the `filter by sector` checkboxes.
  $('.filter').show();

  var all = $('.institution');
  var allSelected = [];
  var rest;

  // "Filter" by section. It is *not* a reduction filter which combination of
  // filters form a AND relation. The implemented filter has following semantic
  // `show the user all institutions which match filter foo OR filter bar.
  // TODO add class or id to improve readability
  $('input:checkbox').click(function() {

    // the user check one of the filter ==> select
    // TODO: if institution has descendants, show all descendants too but don't
    // highlight them.
    if (this.checked) {
      // only load the data from the server once until page refreshes.
      if (ddb.institutions === null) {
        ddb.institutions = ddb.fetchData();
      }

      // the logic
      var currentSelected = ddb.filterBySection(this);
      allSelected = $.merge(allSelected, currentSelected)
      rest = $(all).not(allSelected);

      // manipulate the view
      // highlight the current selection
      currentSelected.find('a').addClass('highlight');
      $(allSelected).show();
      rest.hide();
    } else {
      // the user uncheck one of the filter ==> remove selection

      // the logic
      var currentSelected = ddb.filterBySection(this);
      allSelected = $(allSelected).not(currentSelected);
      rest = $(all).not(allSelected);

      // the view manipulation
      // un-highlight the selected
      currentSelected.find('a').removeClass('highlight');
      $(allSelected).show();
      rest.hide();
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
