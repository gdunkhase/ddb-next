var global;
var resources;

Ddb.siteRoot = 'http://www.deutsche-digitale-bibliothek.de/';

$(function() {

  // workaround for ffox + ie click focus - prevents links that load dynamic content to be focussed/active. 
  $("a.noclickfocus").live('mouseup', function() {
    $(this).blur();
  });

  var languageCookie = $.cookies.get('language');
  if (languageCookie && languageCookie != Ddb.Data.TwoLetterLanguage) {
    $.cookies.set('language', Ddb.Data.TwoLetterLanguage); // restore to valid cookie
  }

  resources = new Resources();
  global = new Global();

  Ddb.Publisher.Get("Search").Skip(1).Subscribe(function() {
    global.body.find('nav li.search').addClass('active');
  });

  Ddb.Publisher.Get("ObjectQuery").Skip(1).Subscribe(function() {
    global.body.find('nav li.active').removeClass('active').addClass('search');
  });

  var toolbarNav = $('nav ul.toolbar');
  if (toolbarNav.length) {
    ko.applyBindings(global, toolbarNav.get(0));
  }

  // register all widgets in page at DOM load
  $(".widget").RegisterWidget();

  // open all external links in a new tab
  // ideally should be find('a[rel=external']) or similar
  global.body.bind('click', function( e ) {
    var target = e.target;
    if (target) {
      var closestAnchor = $(target).closest('a');
      if (closestAnchor.length) {
        var href = closestAnchor.get(0).href;
        if (href && href.indexOf('mailto:') !== 0) {
          var isExternalLink = href.indexOf(window.location.host) == -1;
          if (isExternalLink) {
            e.preventDefault();
            window.open(href);
          }
        }
      }
    }
  });
});