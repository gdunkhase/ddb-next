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
      ddb.filteredEl.css('background-color', 'red');
      ddb.restEl.css('background-color', 'yellow');
    } else {
      // view manipulation
      $('.pagination a').removeClass('selected');
      $('.pagination a[href="' + window.location.hash + '"]')
      .addClass('selected');
    }
  },

  onFilterBySectorChange: function() {
    $('input:checkbox').click(function() {
      // flatten the object of arrays => to the arrays of objects
      // TODO: do it only once, not by every function calls.
      var institutionList = _.chain(ddb.institutionsBySector)
        .values()
        .flatten()
        .value();

      // TODO: not used, remove this
      var allSelectedSectors = $('.sector-facet input:checked');

      var selectedSector = $(this).data('sector');

      var parentList = [];
      var filteredBySector = _.reduce(institutionList, function(memory, institution) {
        if (institution.sector === selectedSector) {
          memory.push(institution);
        }

        if (institution.children && institution.children.length > 0) {
          _.reduce(institution.children, function(otherMemory, child) {
            if (child.sector === selectedSector) {
              otherMemory.push(child);
              // collect the parent
              // TODO: refactor this, it insert the same parent multiple
              // times.
              parentList.push(institution);
            }
          return otherMemory;
          }, memory);
        }
        return memory;
      }, []);

      // TODO: it should not be nesecassry
      parentList = _.uniq(parentList);

      /*
       console.log('<pre>' + JSON.stringify(filteredBySector, null, 4) + '</pre>');
      */
      var visible = _.union(parentList, filteredBySector);

     // disable/enable index
     var hasNoMember = _.reduce(ddb.institutionsBySector, function(memo, array, key) {
       if (_.intersection(array, visible).length === 0) {
         memo.push(key);
       }
       return memo;
     }, []);

      var invisible = _.without(institutionList, visible);
      console.log('# first level institution: ' + institutionList.length);
      console.log('# filtered by sector: ' + filteredBySector.length);
      console.log('# visible: filtered + parents: ' + visible.length);
      console.log('# rest: ' + institutionList.length);

      // console.log('<pre>' + JSON.stringify(invisible, null, 4) + '</pre>');

     // view manipulation
     var filteredBySectorEl = ddb.findElements(filteredBySector);
     filteredBySectorEl.toggleClass('highlight');

     var visibleEl = ddb.findElements(visible);
     visibleEl.css('background-color', 'green');

     var invisibleEl = ddb.findElements(invisible);
     invisibleEl.css('background-color', 'blue');

    // update index view, i.e., A..Z
    _.each(hasNoMember, function(letter) {
      $('.pagination a[href="' + '#' + letter + '"]').parent()
      .addClass('disabled');
    });
  });
},

findElements: function(list) {
  return ddb.all.filter(function() {
    return _.contains(_.pluck(list, 'id'),
    $(this).data('institution-id'));
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
