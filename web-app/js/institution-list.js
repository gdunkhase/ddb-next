'use strict';
$(document).ready(function() {
  // if the User Agent enable JS, show the `filter by sector` checkboxes.
  $('.filter').show();

  // pass callback function onHashChange, onFilterBySectorChange
  ddb.fetchData(ddb.onHashChange, ddb.onFilterBySectorChange);
});

var ddb = {

  Config: {
    // TODO: move the url to an external configuration file.
    ddbBackendUrl: 'http://localhost:8080/apis/institutions'
  },

  all: $('.institution'),

  institutions: null,

  onHashChange: function() {
    var hash = window.location.hash.substring(1);
    console.log('hash change to: ' + hash);

    if (hash === 'All' || hash === 'ALL' || hash === 'list') {
      ddb.firstLetterFilter = '';
      console.log('show all');
      if (ddb.filteredEl) {

        // view manipulation
        // reset to initial state
        ddb.filteredEl.css('background-color', 'white');
        ddb.restEl.css('background-color', 'white');
      }
    } else if (ddb.institutions[hash]) {
      var idList = _.pluck(ddb.institutions[hash], 'id');
      // find all institutions match idList
      ddb.filteredEl = ddb.all.filter(function() {
        return _.contains(idList, $(this).data('institution-id'));
      });

      // find all first level institutions which are not start with
      // firstLetter
      var restKeys = _.chain(ddb.institutions)
        .keys()
        .reject(function(key) { return key === hash; })
        .value();

      // get all values from restKeys
      var restIdList = _.chain(ddb.institutions)
        .filter(function(val, key) {
          return _.contains(restKeys, key);
        })
        .flatten()
        .pluck('id')
        .value();

      // collect all ids and return as array
      ddb.restEl = ddb.all.filter(function() {
        return _.contains(restIdList, $(this).data('institution-id'));
      });

      // view manipulation
      ddb.filteredEl.css('background-color', 'red');
      ddb.restEl.css('background-color', 'yellow');
    } else {
      $('.pagination a').removeClass('selected');
      $('.pagination a[href="' + window.location.hash + '"]')
        .addClass('selected');
    }
  },

  onFilterBySectorChange: function() {
    $('input:checkbox').click(function() {
      console.log('filter selected');

      var checked = $('.sector-facet input:checked');
      var sector = $(this).data('sector');

     // flatten the map of arrays => arrays of objects
     // TODO: find better solution.
     var list = [];
     _.each(ddb.institutions, function(value, key) {
       list.push(value);
     });
     list = _.flatten(list);

     // by objects which match sector, return as array
     var parents = [];
     var filtered = _.reduce(list, function(memory, object) {
       if (object.sector === sector) {
         memory.push(object);
       }

       if (object.children && object.children.length > 0) {
         _.reduce(object.children, function(otherMemory, child) {
           if (child.sector === sector) {
             otherMemory.push(child);
             parents.push(object);
           }
           return otherMemory;
         }, memory);
       }

       return memory;
     }, []);
     parents = _.uniq(parents);


     /*
     console.log('<pre>' + JSON.stringify(filtered, null, 4) + '</pre>');
     console.log(filtered.length);
     */

     var visible = _.union(parents, filtered);

     // TODO: disable/enable index
     var hasNoMember = _.reduce(ddb.institutions, function(memo, array, key) {
       if (_.intersection(array, visible).length === 0) {
         memo.push(key);
       }
       return memo;
     }, []);

     console.log(hasNoMember);

     // find all institutions match idList
     var matched = ddb.all.filter(function() {
       return _.contains(_.pluck(filtered, 'id'),
                         $(this).data('institution-id'));
     });
     matched.css('color', 'red');

     var visibleEl = ddb.all.filter(function() {
       return _.contains(_.pluck(visible, 'id'),
                         $(this).data('institution-id'));
     });
     visibleEl.css('background-color', 'green');

     _.each(hasNoMember, function(letter) {
      $('.pagination a[href="' + '#' + letter + '"]').parent()
        .addClass('disabled');
     });

    });
  },

  fetchData: function(onHashChange, onFilterBySectorChange) {
    if (ddb.institutions === null) {
      $.getJSON(ddb.Config.ddbBackendUrl, function(data) {
        console.log('the institution: ', data);
        ddb.institutions = data;

        // call the callbacks, once data is loaded.
        onHashChange();
        onFilterBySectorChange();
        window.onhashchange = onHashChange;
      });
    }
  }
};


/*
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
*/
