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
      // TODO: get org by sector
      // TODO: get org's descdendants
      // TODO: 
      // the logic
      var currentSelected = ddb.filterBySection(this);
      allSelected = $.merge(allSelected, currentSelected);

      /*
      console.log('current selected: ' , currentSelected.length);
      console.log('all selected: ' ,allSelected.length);
      console.log('rest selected: ' , rest.length);
      console.log('all: ' , all.length);
      */

      var parents = [];

      // get all parent from current selected
      currentSelected.each(function(index, val) {
        var parentId = $(val).data('child-of');
        if (parentId) {
          var parent = $('*[data-institution-id="' + parentId + '"]');
          $(parent).css('background-color', 'white');
          parents.push(parent);
        }
      });

      rest = $(all).not(currentSelected);
      console.log('rest, ', rest.length);

      $.merge(rest, parents);
      console.log('rest, ', rest.length);

      // manipulate the view
      // highlight the current selection
      $(currentSelected).find('> a').addClass('highlight');

      // TODO: rest select parent and its descendants too
      $(rest).css('background-color', 'red');
      $(allSelected).show();

      $(parents).each(function(index, val) {
        console.log(val);
      });
      $(parents).css('background-color', 'white');
      $(allSelected).css('background-color', 'white');
    } else {
      // the user uncheck one of the filter ==> remove selection

      // the logic
      var currentSelected = ddb.filterBySection(this);
      allSelected = $(allSelected).not(currentSelected);
      rest = $(all).not(allSelected);

      // the view manipulation
      // un-highlight the selected
      currentSelected.find('a').removeClass('highlight');

      // when all filtered are removed, show all
      if ($(allSelected).empty()) {
        $(all).show();
      } else {
        $(allSelected).show();
        rest.hide();
      }
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
    console.log('selected sector: ' + filterBy);

    var filtered = $('.institution').filter(function() {
      return $(this).data('sector') === filterBy;
    });

    filtered.each(function(index, val) {
      console.log($(val).data('sector'));
    });
    return filtered;
  },

  fetchData: function() {
    if (ddb.institutions === null) {
      $.getJSON(ddb.Config.ddbBackendUrl, function(data) {
        console.log('the institution: ', data);
        ddb.institutions = data;
      });
    }
  }
};
