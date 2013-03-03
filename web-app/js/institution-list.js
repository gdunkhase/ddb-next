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
        // TODO: this is slow
        ddb.all.show();
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

    var hash = window.location.hash.substring(1);

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

      if (sectors.length === 0) {
        ddb.all.show();
      } else {
        // TODO: handle hash equals list, [A|a]ll
        var filtered = ddb.filterBySector(institutionList, sectors, hash);

        var visible = _.union(filtered.parentList, filtered.filteredBySector);
        var hasNoMember = ddb.findNoMember(visible);

        // view manipulation
        ddb.findElements(filtered.filteredBySector).addClass('highlight');
        ddb.findElements(visible).show();

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


  // TODO: rename the function.
  // it collects all institution which match sector in sectors. It also
  // collect its parent if any.
  filterBySector: function(institutionList, sectors, firstLetter) {
    var parentList = [];

    var filteredBySector = _.reduce(institutionList, function(memory, institution) {
      if (institution.firstChar === firstLetter && _.contains(sectors, institution.sector)) {
        memory.push(institution);
      }
      ddb.filterDescendants(institution, memory, sectors, parentList, firstLetter);
      return memory;
    }, []);

    // TODO: it should not be necessary
    parentList = _.uniq(parentList);
    return {
      'filteredBySector': filteredBySector,
      'parentList': parentList
    };
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
        window.onhashchange = ddb.onHashChange2;
        // TODO: handle page init, get hash
      });
      // TODO: handle failure.
    }
  },

  onPageLoad: function() {
    console.log('<pre>' + ' Initialize Page Load event listener' + '</pre>');

    var hash = window.location.hash.substring(1);
    var institutionList = _.chain(ddb.institutionsBySector)
      .values()
      .flatten()
      .value();

    if (hash === 'All' || hash === 'ALL' || hash === 'list') {
      // TODO: On page load, this case is _never_ true.
      ddb.firstLetterFilter = '';
    } else {
      var sectors = ddb.getSelectedSectors();
      ddb.filter(institutionList, sectors, hash);
    }
  },

  onFilterSelect: function() {
    console.log('<pre>' + ' Initialize On Filter Select Listener' + '</pre>');
    var hash = window.location.hash.substring(1);

    var institutionList = _.chain(ddb.institutionsBySector)
      .values()
      .flatten()
      .value();
    $('input:checkbox').click(function() {
      if (hash === 'All' || hash === 'ALL' || hash === 'list') {
        // TODO: this is slow.
        ddb.firstLetterFilter = '';
      } else {
        ddb.firstLetterFilter = hash;
        var sectors = ddb.getSelectedSectors();
        ddb.filter(institutionList, sectors, ddb.firstLetterFilter);
      }
    });
  },

  // TODO: rename the function.
  /* Function Callback for the URI's hash change event. */
  onHashChange2: function() {
    console.log('<pre>' + 'Hash change event is fired.'+ '</pre>');
    var hash = window.location.hash.substring(1);

    var institutionList = _.chain(ddb.institutionsBySector)
      .values()
      .flatten()
      .value();
    var sectors = ddb.getSelectedSectors();
    var firstLetter;

    if (hash === 'All' || hash === 'ALL' || hash === 'list') {
      // TODO: this is slow.
      firstLetter = '';
    } else {
      // TODO: do we need to get only the first letter from the hash?
      // The hash can be for example: `#Axsss`, `#avvv`
      firstLetter = hash;
    }

    ddb.filter(institutionList, sectors, firstLetter);
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
    console.log('<pre>' + 'sectors: ' + sectors + '</pre>');
    console.log('<pre>' + 'first letter: ' + firstLetter + '</pre>');
    // reset the view to empty.
    ddb.all.hide();
    ddb.all.removeClass('highlight');

    /*
    When first letter is a space, i.e. firstLetter = ' ' it means `All` or `list`
    is selected. In other words, no filter by first letter should apply.
    */
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

      console.log('<pre>' + JSON.stringify(filteredBySector, undefined, '\t') + '</pre>');

      // view manipulation
      ddb.findElements(filteredBySector).addClass('highlight');
      ddb.findElements(visible).show();

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
      })

      var visible = _.union(parentList, filteredBySector);
      var hasNoMember = ddb.findNoMember(filteredBySector);

      // view manipulation
      ddb.findElements(filteredBySector).addClass('highlight');
      ddb.findElements(visible).show();

      $('.pagination li').removeClass('disabled');
      // update index view, i.e., A..Z
      _.each(hasNoMember, function(letter) {
        $('.pagination a[href="' + '#' + letter + '"]').parent().addClass('disabled');
        $('.pagination a[href="' + '#' + letter + '"]').click(function(e) {
          e.preventDefault();
        });
      });
    } else if (sectors.length === 0 && firstLetter !== '') {
      /*
       When no sector
      selected _and_ one of the first letter is selected.
      e.g. sector = [], index = 'C'
      */
      // TODO: show all root institution starts with first letter == index, and their children.
      ddb.showByFirstLetter(firstLetter);
    } else {
      // the last case: sectors.length === 0 && firstLetter !== ' '.
      // when no sector is selected _and_ no first letter filter.
      // e.g. sector = [], index = All

      // TODO: show all, no highlight <== initial state <=> reset()
      // TODO: check if any still highlighted.
      ddb.all.show();
    }
  },

  // TODO: it should show their descendants.
  showByFirstLetter: function(firstLetter) {
    console.log('<pre>' + 'Show all root institution start with the letter: ' + firstLetter + ' their descendants.'+ '</pre>');

    // get all institution start with the letter `firstLetter`
    var idList = _.pluck(ddb.institutionsBySector[firstLetter], 'id');
    console.log('size: ' + idList.length);

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

    ddb.all.show();
    ddb.restEl.hide();
  }
};

$(function() {
  // When the User Agent enables JS, shows the `filter by sector` Check Boxes.
  $('.filter').show();
  ddb.getInstitutionsBySector(ddb.onFilterSelect, ddb.onPageLoad);
});
