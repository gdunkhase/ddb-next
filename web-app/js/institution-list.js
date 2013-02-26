'use strict';
$(document).ready(function() {
  // if the User Agent enable JS, show the `filter by sector` checkboxes.
  $('.filter').show();

  var all = $('.institution');
  var allSelected = [];
  var rest;

  // find the current path
  ddb.windowHash = window.location.hash;
  ddb.filterByHash(ddb.windowHash.substring(1), allSelected, all);

  // "Filter" by section. It is *not* a reduction filter which combination of
  // filters form a AND relation. The implemented filter has following semantic
  // `show the user all institutions which match filter foo OR filter bar.
  // TODO add class or id to improve readability
  $('input:checkbox').click(function() {

    // the user check one of the filter ==> select
    // TODO: if institution has descendants, show all descendants too but don't
    // highlight them.
    if (this.checked) {
      // the logic
      var currentSelected = ddb.filterBySection(this);
      allSelected = $.merge(allSelected, currentSelected);
      rest = $(all).not(allSelected);

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
      // un-highlight the selected.
      removedSelection.find('a').removeClass('highlight');
      removedSelection.hide();

      // when all filtered are removed, show all.
      // TODO: the performace is bad, when the user removes all filters.
      if ($(allSelected).length === 0) {
        $(all).show();
      }
    }
  });

  // TODO add listener for first letter index.
  // TODO when `All` is selected, show all institutions.
  // TODO when an index is selected.
  // 1. show all institution starting with the selected index character.
  // 2. hide the rest = {all} \ {selected}
  $('div.pagination a').click(function(e) {
    e.preventDefault();

    var selectedHash = e.target.innerHTML;

    // TODO: bad performance
    if (selectedHash === 'All') {
      $(all).show();
    } else {
      if (allSelected.length === 0) {
        var filteredByFirstLetter = $(all).filter(function() {
          var firstLetter = $(this).data('first-letter');
          return firstLetter === selectedHash;
        });

        filteredByFirstLetter.show();
        $(all).not(filteredByFirstLetter).hide();
      } else {
        ddb.filterByHash(selectedHash, allSelected);
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
    return parentList;
  },

  fetchData: function() {
    if (ddb.institutions === null) {
      $.getJSON(ddb.Config.ddbBackendUrl, function(data) {
        console.log('the institution: ', data);
        ddb.institutions = data;
      });
    }
  },

  filterByHash: function(selectedHash, allSelected, all) {
    console.log('filtered by hash: ' + selectedHash);

    switch (selectedHash) {
      case 'list':
      case 'ALL':
      case 'all':
        break;
      default: {
        console.log('filter by first letter');
        var temp = allSelected;
        if (allSelected.length === 0) {
          console.log('nothing is selected.');
          temp = all;
        }

        var filteredByFirstLetter = $(temp).filter(function() {
          var firstLetter = $(this).data('first-letter');
          return firstLetter === selectedHash;
        });

        console.log('found: ' + filteredByFirstLetter.length);
        if (filteredByFirstLetter.length === 0) {
          $('.institution-list')
          .html('No institutions match your search criteria.');
        } else {
          filteredByFirstLetter.show();
          $(temp).not(filteredByFirstLetter).hide();
        }
      }
    }
  }

};
