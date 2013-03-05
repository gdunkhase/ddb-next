// TODO: remove `use strict` via automate script in the production mode.
// SEE: http://scriptogr.am/micmath/post/should-you-use-strict-in-your-production-javascript
'use strict';

// TODO: use other pattern for namespace in JS
// SEE: http://enterprisejquery.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/
var ddb = {

  Config: {
    ddbBackendUrl: '/apis/institutions'
  },

  // cache for all institution, including children and their descendants
  all: $('.institution-listitem'),

  institutionsBySector: null,

  // find index[All| A | B |...| Z | 0-9] with no members after filtered by sectors.
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
      // when a institution has a least one child.
      _.reduce(institution.children, function(otherMemory, child) {
        if (_.contains(selectedSector, child.sector)) {
          otherMemory.push(child);
          // the institution is the parent.
          parentList.push(institution);
        }
        ddb.filterDescendants(child, otherMemory, selectedSector, parentList);
      return otherMemory;
      }, memory);
    }
  },

  findElements: function(list) {
    return ddb.all.filter(function() {
      return _.contains(_.pluck(list, 'id'), $(this).data('institution-id'));
    });
  },

  getInstitutionsBySector: function(onFilterSelect, onPageLoad) {
    if (ddb.institutionsBySector === null) {
      $.getJSON(ddb.Config.ddbBackendUrl, function(response) {
        ddb.institutionsBySector = response.data;

        // call the callbacks, once data is loaded.
        onPageLoad();
        onFilterSelect();
        window.onhashchange = ddb.onHashChange;
      });
      // TODO: handle failure.
    }
  },

  onPageLoad: function() {
    var hash = window.location.hash.substring(1);
    if (hash === 'All' || hash === 'ALL' || hash === 'list') {
      return;
    } else {
      ddb.applyFilter();
    }
  },

  onFilterSelect: function() {
    $('input:checkbox').click(function() {
      ddb.applyFilter();
    });
  },

  /* Function Callback for the URI's hash change event. */
  onHashChange: function() {
    ddb.applyFilter();
  },

  applyFilter: function() {
    var institutionList = ddb.getInstitutionAsList();
    var sectors = ddb.getSelectedSectors();
    var firstLetter = ddb.getFirstLetter();
    ddb.filter(institutionList, sectors, firstLetter);
  },

  getInstitutionAsList: function() {
    if (ddb.institutionList) {
      return ddb.institutionList;
    }

    ddb.institutionList = _.chain(ddb.institutionsBySector)
      .values()
      .flatten()
      .value();

    return ddb.institutionList;
  },

  getFirstLetter: function() {
    var hash = window.location.hash.substring(1);
    if (hash === 'All' || hash === 'ALL' || hash === 'list') {
      return '';
    } else {
      return hash;
    }
  },

  getSelectedSectors: function() {
    var allSelectedSectors = $('.sector-facet input:checked');
    // TODO: use reducer instead.
    var sectors = [];
    _.each(allSelectedSectors, function(el) {
      sectors.push($(el).data('sector'));
    });
    return sectors;
  },

  filter: function(institutionList, sectors, firstLetter) {
    // reset the view to empty.
    ddb.all.hide();
    ddb.all.removeClass('highlight');

    var parentList = [];

    if (sectors.length > 0 && firstLetter === '') {

      // when at least one sector selected _and_ no first letter filter.
      // e.g. sector = ['Media'], index = All
      var filteredBySector = _.reduce(institutionList, function(memory, institution) {
        if (_.contains(sectors, institution.sector)) {
          memory.push(institution);
        }
        ddb.filterDescendants(institution, memory, sectors, parentList);
        return memory;
      }, []);

      // TODO: it should not be necessary
      parentList = _.uniq(parentList);

      var visible = _.union(parentList, filteredBySector);
      var hasNoMember = ddb.findNoMember(visible);

      ddb.showResult(_.union(parentList, filteredBySector), filteredBySector);

      $('.pagination li').removeClass('disabled');
      // update index view, i.e., A..Z
      _.each(hasNoMember, function(letter) {
        $('.pagination a[href="' + '#' + letter + '"]').parent().addClass('disabled');
        $('.pagination a[href="' + '#' + letter + '"]').click(function(e) {
          e.preventDefault();
        });
      });
    } else if (sectors.length > 0 && firstLetter !== '') {
      /*
      when at least one sector selected _and_ one of the first letter is
      selected, e.g.,  sector = ['Library', 'Media'], index = 'B'
      */
      // In this case, we don't need a parent list. TODO: refactor
      var filteredBySector = _.reduce(institutionList, function(memory, institution) {
        if (institution.firstChar === firstLetter && _.contains(sectors, institution.sector)) {
          memory.push(institution);
        }
        ddb.filterDescendants(institution, memory, sectors, parentList, firstLetter);
        return memory;
      }, []);

      parentList = _.filter(parentList, function(parent) {
        return parent.firstChar === firstLetter;
      });

      ddb.showResult(_.union(parentList, filteredBySector), filteredBySector);

    } else if (sectors.length === 0 && firstLetter !== '') {
      /*
       When no sector
      selected _and_ one of the first letter is selected.
      e.g. sector = [], index = 'C'
      */
      ddb.showByFirstLetter(firstLetter);
    } else {
      // the last case: sectors.length === 0 && firstLetter !== ' '.
      // when no sector is selected _and_ no first letter filter.
      // e.g. sector = [], index = All
      ddb.showAll();
    }
  },

  showAll: function() {
    $('#no-match-message').hide();
    // FIXME: this is slow
    ddb.all.show();
  },

  // visible institutions are filtered institutions and their descendants.
  showResult: function(visibleInstitution, filteredBySector) {
    // view manipulation
    if (visibleInstitution.length) {
      $('#no-match-message').hide();
      ddb.findElements(filteredBySector).addClass('highlight');
      ddb.findElements(visibleInstitution).show();
    } else {
      $('#no-match-message').show();
    }
  },

  showByFirstLetter: function(firstLetter) {
    // get all institution start with the letter `firstLetter`
    var idList = _.pluck(ddb.institutionsBySector[firstLetter], 'id');

        // find all institutions match idList
    ddb.filteredEl = ddb.all.filter(function() {
      return _.contains(idList, $(this).data('institution-id'));
    });

    // find all first level institutions which are not start with
    // firstLetter
    var restKeys = _.chain(ddb.institutionsBySector)
      .keys()
      .reject(function(key) { return key === firstLetter; })
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

    ddb.showAll();
    ddb.restEl.hide();
  }
};

$(function() {
  // When the User Agent enables JS, shows the `filter by sector` Check Boxes.
  $('.filter').show();
  ddb.getInstitutionsBySector(ddb.onFilterSelect, ddb.onPageLoad);
});
