// TODO: remove `use strict` via automate script in the production mode.
// SEE: http://scriptogr.am/micmath/post/should-you-use-strict-in-your-production-javascript
'use strict';

// TODO: use other pattern for namespace in JS
// SEE: http://enterprisejquery.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/
var ddb = {

  Config: {
    ddbBackendUrl: '/apis/institutions'
  },

  all: $('.institution'),

  institutionsBySector: null,

  // TODO: combine `filter by sector` and `filter by first letter`
  // TODO: refactor the function to smaller functions
  onHashChange: function() {
    var hash = window.location.hash.substring(1);

    if (hash === 'All' || hash === 'ALL' || hash === 'list') {
      ddb.firstLetterFilter = '';
      if (ddb.filteredEl) {

        // view manipulation, it resets the view to the initial state.
        ddb.filteredEl.css('background-color', 'white');
        ddb.restEl.css('background-color', 'white');
      }
    } else if (ddb.institutionsBySector[hash]) {
      var idList = _.pluck(ddb.institutionsBySector[hash], 'id');
      // find all institutions match idList
      ddb.filteredEl = ddb.all.filter(function() {
        return _.contains(idList, $(this).data('institution-id'));
      });

      // find all first level institutions which are not start with
      // firstLetter
      var restKeys = _.chain(ddb.institutionsBySector)
        .keys()
        .reject(function(key) { return key === hash; })
        .value();

      // get all values from restKeys
      var restIdList = _.chain(ddb.institutionsBySector)
        .filter(function(val, key) { return _.contains(restKeys, key); })
        .flatten()
        .pluck('id')
        .value();

      // collect the HTML elements that match id in the restIdList
      ddb.restEl = ddb.all.filter(function() {
        return _.contains(restIdList, $(this).data('institution-id'));
      });

      // view manipulation
      //ddb.filteredEl.css('background-color', 'red');
      //ddb.restEl.css('background-color', 'yellow');

      ddb.filteredEl.show();
      ddb.restEl.hide();
    } else {
      // view manipulation
      $('.pagination a').removeClass('selected');
      $('.pagination a[href="' + window.location.hash + '"]')
      .addClass('selected');
    }
  },

  onFilterBySectorChange: function() {
    var institutionList = _.chain(ddb.institutionsBySector)
      .values()
      .flatten()
      .value();

    $('input:checkbox').click(function() {
      console.log('(un/)checked: ' + $(this).data('sector'));

      // reset the view to empty.
      ddb.all.hide();
      ddb.all.removeClass('highlight');

      var allSelectedSectors = $('.sector-facet input:checked');
      var sectors = [];
      _.each(allSelectedSectors, function(el) {
        sectors.push($(el).data('sector'));
      });

      if(sectors.length === 0) {
        ddb.all.show();
      } else {
        var filtered = ddb.filterBySector(institutionList, sectors);
        var visible = _.union(filtered.parentList, filtered.filteredBySector);
        var invisible = _.without(institutionList, visible);
        var hasNoMember = ddb.findNoMember(visible);

        // view manipulation
        var allFilteredEl = ddb.findElements(filtered.filteredBySector);
        allFilteredEl.addClass('highlight');

        var visibleEl = ddb.findElements(visible);
        visibleEl.show();

        $('.pagination li').removeClass('disabled');
        // update index view, i.e., A..Z
        _.each(hasNoMember, function(letter) {
          $('.pagination a[href="' + '#' + letter + '"]').parent().addClass('disabled');
          $('.pagination a[href="' + '#' + letter + '"]').click(function(e) {
            e.preventDefault();
          });
        });
      }
    });
  },

  // find first letter indext with no members after filtered.
  findNoMember: function(visible) {
    return _.reduce(ddb.institutionsBySector, function(memo, array, key) {
      if (_.intersection(array, visible).length === 0) {
       memo.push(key);
    }
     return memo;
    }, []);
  },

  filterDescendants: function(institution, memory, selectedSector, parentList) {
      if (institution.children && institution.children.length > 0) {
        _.reduce(institution.children, function(otherMemory, child) {
          if (_.contains(selectedSector, child.sector)) { //} === selectedSector) {
            otherMemory.push(child);
            parentList.push(institution);
          }
          ddb.filterDescendants(child, otherMemory, selectedSector, parentList);
        return otherMemory;
        }, memory);
      }
  },

  // TODO: rename the function.
  // it collects all institution which match sector in selectedSector. It also
  // collect its parent if any.
  filterBySector: function(institutionList, selectedSector) {
    var parentList = [];

    var filteredBySector = _.reduce(institutionList, function(memory, institution) {
      if (_.contains(selectedSector, institution.sector)) {
        memory.push(institution);
      }
      ddb.filterDescendants(institution, memory, selectedSector, parentList);
      return memory;
    }, []);

    // TODO: it should not be nesecassry
    parentList = _.uniq(parentList);
    return {
      'filteredBySector': filteredBySector,
      'parentList': parentList
    }
  },

  findElements: function(list) {
    return ddb.all.filter(function() {
      return _.contains(_.pluck(list, 'id'), $(this).data('institution-id'));
    });
  },

  getInstitutionsBySector: function(onHashChange, onFilterBySectorChange) {
    if (ddb.institutionsBySector === null) {
      $.getJSON(ddb.Config.ddbBackendUrl, function(data) {
        ddb.institutionsBySector = data;

        // call the callbacks, once data is loaded.
        onHashChange();
        onFilterBySectorChange();
        window.onhashchange = onHashChange;
      });
    }
  }
};

$(function() {
  // if the User Agent enables JS, show the `filter by sector` checkboxes.
  $('.filter').show();
  ddb.getInstitutionsBySector(ddb.onHashChange, ddb.onFilterBySectorChange);
});
