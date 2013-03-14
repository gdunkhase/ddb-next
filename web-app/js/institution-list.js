// TODO: remove `use strict` via automate script in the production mode.
// SEE: http://scriptogr.am/micmath/post/should-you-use-strict-in-your-production-javascript
'use strict';

// TODO: use other pattern for namespace in JS
// SEE: http://enterprisejquery.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/
var ddb = {

  Config: {
    ddbBackendUrl: '/apis/institutions'
  },

  // TODO: does not work => cache for all institution, including children and their descendants
  $all: $('li.institution-listitem'),

  institutionsByFirstChar: null,

  $index: null,

  // find index[All| A | B |...| Z | 0-9] with no members after filtered by sectors.
  findNoMember: function(visible) {
    return _.reduce(ddb.institutionsByFirstChar, function(memo, array, key) {
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
    return $('li.institution-listitem').filter(function() {
      return _.contains(_.pluck(list, 'id'), $(this).data('institution-id'));
    });
  },

  getInstitutionsByFirstChar: function(onFilterSelect, onPageLoad) {
    console.log('get institutions by first char.');
    if (ddb.institutionsByFirstChar === null) {
      console.log('fetch data from server.');
      $.getJSON(ddb.Config.ddbBackendUrl, function(response) {
        ddb.institutionsByFirstChar = response.data;

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
    // TODO: add id
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

  // TODO: only calculate it once.
  getInstitutionAsList: function() {
    ddb.institutionList = _.chain(ddb.institutionsByFirstChar)
      .values()
      .flatten()
      .value();
    return ddb.institutionList;
  },

  getFirstLetter: function() {
    var hash = window.location.hash.substring(1);
    if (hash === '' || hash === 'All' || hash === 'All' || hash === 'ALL' || hash === 'list') {
      return '';
    } else {
      return hash;
    }
  },

  getSelectedSectors: function() {
    // TODO: check, if there is more efficient way to formulate the selector.
    var allSelectedSectors = $('.sector-facet input:checked');
    return _.reduce(allSelectedSectors, function(sectors, el) {
      sectors.push($(el).data('sector'));
      return sectors;
    },[]);
  },

  filter: function(institutionList, sectors, firstLetter) {
    // reset the view to empty.
    $('li.institution-listitem').css('display', 'none');
    $('li.institution-listitem').removeClass('highlight');

    var parentList = [];
    console.log('apply filter');

    if (sectors.length > 0 && firstLetter === '') {

      console.log('Only filter by sectors, _not_ first character.');
      console.log('sectors: ', sectors);

      // when at least one sector selected _and_ no first letter filter.
      // e.g. sector = ['Media'], index = All
      var filteredBySector = ddb.filterBySectors(institutionList, sectors, parentList);
      var visible = _.union(_.uniq(parentList), filteredBySector);

      var hasNoMember = ddb.findNoMember(visible);
      ddb.showResult(_.union(parentList, filteredBySector), filteredBySector);
      ddb.updateIndex(hasNoMember);
    } else if (sectors.length > 0 && firstLetter !== '') {
      /*
      when at least one sector selected _and_ one of the first letter is
      selected, e.g.,  sector = ['Library', 'Media'], index = 'B'
      */
      // In this case, we don't need a parent list. TODO: refactor
      console.log('first char selected: ' + firstLetter);
      console.log('sectors: ', sectors);

      /*
      1. we collect all root institutions start with the selected firstLetter,
        for example 'W', including their children. The children do *not* have
        to start with the selected first letter.

      2. we start to apply the sector filter, for example [Library] to all
        institutions(roots and their children) collected from the first step.
      */

      var filteredByFirstLetter = ddb.institutionsByFirstChar[firstLetter];
      // console.log('filtered by first char:' + firstLetter, JSON.stringify(filteredByFirstLetter , null, ' ', 2));


      var filteredBySector = _.reduce(filteredByFirstLetter , function(memory, institution) {
        // assert
        if (institution.firstChar !== firstLetter) {
          console.log(institution);
        } else {
          if (_.contains(sectors, institution.sector)) {
            memory.push(institution);
          }

          ddb.filterDescendants(institution, memory, sectors, parentList);
        }

        return memory;
      }, []);

      console.log('filtered by sector and first char', JSON.stringify(filteredBySector, null, ' ', 2));

      parentList = _.filter(parentList, function(parent) {
        return parent.firstChar === firstLetter;
      });

      var visible = _.union(parentList, filteredBySector);
      ddb.showResult(visible, filteredBySector);

      // find all root institutions filtered by sectors.
      // get the first letter, e.g., only As and Ls
      // show only A and L in Index.
      var filtered = ddb.filterBySectors(institutionList, sectors, parentList);
      var hasNoMember = ddb.findNoMember(_.union(_.uniq(parentList), filtered));
      ddb.updateIndex(hasNoMember);
    } else if (sectors.length === 0 && firstLetter !== '') {
      /*
      When no sector selected _and_ one of the first letter is selected.
      e.g. sector = [], index = 'C'
      */
      ddb.showByFirstLetter(firstLetter);
      ddb.updateIndex();
    } else {
      // the last case: sectors.length === 0 && firstLetter === ''.
      // when no sector is selected _and_ no first letter filter.
      // e.g. sector = [], index = All
      //ddb.showAll();
      $('#institution-list')
        .empty()
        .html(ddb.$institutionList.html());
      ddb.updateIndex();
    }
  },

  filterBySectors: function(institutionList, sectors, parentList) {
    return _.reduce(institutionList, function(memory, institution) {
      if (_.contains(sectors, institution.sector)) {
        memory.push(institution);
      }
      ddb.filterDescendants(institution, memory, sectors, parentList);
      return memory;
    }, []);
  },

  showAll: function() {
    $('#no-match-message').css('display', 'none');
    $('.institution-listitem').css('display','');
  },

  updateIndex: function(hasNoMember) {
    if (hasNoMember) {
      console.log('has no member', hasNoMember);
      // enable all index. It means visually that the index all not grey.
      // TODO: do we need it? Is it not better to take the ddb.$index?
      $('#first-letter-index li').removeClass('disabled');

      // update index view, i.e., A..Z
      _.each(hasNoMember, function(letter) {
        var $aHref = $('#first-letter-index a[href="' + '#' + letter + '"]');
        $aHref.parent().addClass('disabled');
        $aHref.click(function(e) {
          e.preventDefault();
        });
      });
    } else {
      var $currentIndex = $('#first-letter-index');
      $currentIndex.empty();
      $currentIndex.html(ddb.$index.html());
    }
  },

  // visible institutions are filtered institutions and their descendants.
  showResult: function(visibleInstitution, filteredBySector) {
    console.log('show results...');
    // TODO: clear the message when sectors=[] and firstLetter !== ''
    var $msg = $('#no-match-message');

    // view manipulation
    if (visibleInstitution.length) {
      console.log('has visible institutions: ' + visibleInstitution.length);
      console.log('visible institutions: ', visibleInstitution);

      // hide the 'no result' message
      console.log('hide the no result message');
      $msg.css('display', 'none');

      ddb.findElements(filteredBySector).addClass('highlight');

      var $visible = ddb.findElements(visibleInstitution);
      $visible.css('display','');

      console.log('has visible elements: ' , $visible);
    } else {
      console.log('all elements are invisible');
      $msg.css('display', 'block');
    }
  },

  // TODO: we should *not* this extra function. We can reuse the logic in
  // if (sectors.length > 0 && firstLetter !== '') {...} with sectors empty
  showByFirstLetter: function(firstLetter) {
    // get all institution start with the letter `firstLetter`
    var idList = _.pluck(ddb.institutionsByFirstChar[firstLetter], 'id');

    // find all institutions match idList
    ddb.filteredEl = $('li.institution-listitem').filter(function() {
      return _.contains(idList, $(this).data('institution-id'));
    });

    // find all first level institutions which are not start with
    // firstLetter
    var restKeys = _.chain(ddb.institutionsByFirstChar)
      .keys()
      .reject(function(key) { return key === firstLetter; })
      .value();

    // get all values from restKeys
    var restIdList = _.chain(ddb.institutionsByFirstChar)
      .filter(function(val, key) { return _.contains(restKeys, key); })
      .flatten()
      .pluck('id')
      .value();

    // collect the HTML elements that match id in the restIdList
    ddb.restEl = $('li.institution-listitem').filter(function() {
      return _.contains(restIdList, $(this).data('institution-id'));
    });

    $('#no-match-message').css('display', 'none');
    ddb.showAll();
    ddb.restEl.css('display', 'none');
  }
};

$(function() {
  console.log('init');
  /* TODO: only execute all JS when the user is on the instution list page.
  Approaches:
  - use Web Browser's URI, i.e. when the URI is `//about-us/institutions#*`
  - use jQuery to check, if $('#institution-page') is not undefined
  */

  // When the User Agent enables JS, shows the `filter by sector` Check Boxes.
  $('.filter').show();

  ddb.$index = $('#first-letter-index').clone(true);
  ddb.$institutionList = $('#institution-list').clone();

  ddb.getInstitutionsByFirstChar(ddb.onFilterSelect, ddb.onPageLoad);
});
