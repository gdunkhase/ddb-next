'use strict';
$(document).ready(function(){
  $('.filter').show();
  
  $('input:checkbox').click(function() {
    if(this.checked) {
      var filtered = filterBySection(this);
      filtered.css('background', 'red');
    } else {
      var filtered = filterBySection(this);
      filtered.css('background', 'white');
    }
  });
});

var filterBySection = function(el) {
  var filterBy = $(el).data('sector');
  var filtered = $('li').filter(function() {
    return $(this).data('sector') === filterBy;
  });
  return filtered;
}