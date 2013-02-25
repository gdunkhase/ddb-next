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
      // TODO: get org's descdendants/parents

      // the logic
      var currentSelected = ddb.filterBySection(this);
      allSelected = $.merge(allSelected, currentSelected);

      rest = $(all).not(allSelected);
      console.log('rest withouth all selected: ' , rest.length);

      // manipulate the view
      // highlight the current selection
      $(currentSelected).find('> a').addClass('highlight');

      currentSelected.show();
      rest.hide();
    } else {
      // the user uncheck one of the filter ==> remove selection

      // the logic
      var removedSelection = ddb.filterBySection(this);
      allSelected = $(allSelected).not(removedSelection);
      rest = $(all).not(allSelected);

      // the view manipulation
      // un-highlight the selected
      removedSelection.find('a').removeClass('highlight');
      removedSelection.hide();

      console.log('removed selection: ' , removedSelection.length);
      console.log('all selected: ' , allSelected.length);
      console.log('rest selected: ' , rest.length);
      console.log('all: ' , all.length);

      rest.hide();

      // when all filtered are removed, show all
      if ($(allSelected).length === 0) {
        $(all).show();
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

  getParents: function(currentSelected) {
    // var parentIdList = [];
    var parentList = [];

    currentSelected.each(function(index, val) {
      var parentId = $(val).data('child-of');

      // when the selected institution has parent
      if (parentId) {
        var parent = $('.institution').filter(function() {
          return $(this).data('institution-id') === parentId;
        });
        parentList.push(parent);
      }
    });
    // return parentIdList;
    return parentList;
  },

  getRestWithoutParent: function(rest, parentList) {
    // body...
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
