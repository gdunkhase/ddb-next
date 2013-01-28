<!DOCTYPE html>
<!--[if lt IE 7 ]> <html lang="en" class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]>    <html lang="en" class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]>    <html lang="en" class="no-js ie8"> <![endif]-->
<!--[if IE 9 ]>    <html lang="en" class="no-js ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!-->
<html lang="en" class="no-js">
<!--<![endif]-->
<head>
<title><g:layoutTitle default="Deutsche Digitale Bibliothek" /></title>
<meta content="charset=utf-8">
<meta name="description" content="Deutsche Digitale Bibliothek">
<link rel="shortcut icon" href="${resource(dir: 'images', file: 'favicon.ico')}" type="image/x-icon">
<link rel="stylesheet" href="${resource(dir: 'css', file: 'bootstrap-responsive.css')}" type="text/css">
<link rel="stylesheet" href="${resource(dir: 'css', file: 'bootstrap.css')}" type="text/css">
<!-- 
<link rel="stylesheet" href="${resource(dir: 'css', file: 'ddb.min.css')}" type="text/css">
<link rel="stylesheet" href="${resource(dir: 'css', file: 'ddb.css')}" type="text/css">
 -->
 
<link rel="stylesheet" href="${resource(dir: 'css', file: 'item.css')}" type="text/css">

<link rel="search" title="Deutsche Digitale Bibliothek"
  href="http://www.deutsche-digitale-bibliothek.de/opensearch.osdx"
  type="application/opensearchdescription+xml" />
<!--[if lt IE 9]>
            <script src="Scripts/html5shim.googlecode.html5.js"> </script>
        <![endif]-->
<g:layoutHead />
<r:layoutResources />
</head>
<body class="nojs start">
  <g:render template="/mainHeader" />
  <div class="container" role="main">
    <g:layoutBody />
  </div>
  <g:render template="/footer" />
  <!-- TODO merge those scripts -->
  <script type="text/javascript" src="${resource(dir:'js', file:'json2.js')}"></script>
  <script type="text/javascript" src="${resource(dir:'js', file:'jquery-1.7.2.min.js')}"></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'jquery.scrollTo-min.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'rx.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'rx.jQuery.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'jquery.cookies.2.2.0.min.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'underscore-min.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'dateformat.min.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'knockout-latest.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'knockout.mapping-latest.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'jquery.mousewheel.min.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'jquery.microdata.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'amplify.min.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'jquery.carouFredSel-5.6.4-packed.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'jquery.dotdotdot-1.5.1.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'jquery.carouFredSel-5.6.4-packed.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'HomePage.js')}" /></script>
  <script type="text/javascript" src="${resource(dir: 'js', file: 'ddb.min.js')}" /></script>
  <!-- TODO: put following inline scripts to an external file -->
  <script type="text/javascript">
            Ddb.Data.Language = 'en-US';
            Ddb.Data.TwoLetterLanguage = 'en';
            Ddb.Data.NumberFormat = {
                NumberDecimalDigits : 2,
                NumberDecimalSeparator : '.',
                NumberGroupSize : 3,
                NumberNegativePattern : '1',
                NumberGroupSeparator : ','
            };

            (function(old, NumberFormat) {
                var numberFormatRex = new RegExp("(?=(?!^)(?:\\d{"
                        + NumberFormat.NumberGroupSize + "})+(?!\\d))", "g");
                Number.prototype.toLocaleString = function() {
                    var result = this.toFixed(0).replace(numberFormatRex,
                            NumberFormat.NumberGroupSeparator);
                    var f = this.toFixed(NumberFormat.NumberDecimalDigits)
                            .slice(-NumberFormat.NumberDecimalDigits);
                    return result
                            + (parseInt(f, 10) > 0 ? NumberFormat.NumberDecimalSeparator
                                    + f
                                    : "");
                };
            })(Number.prototype.toLocaleString, Ddb.Data.NumberFormat);
        </script>
  <script>
            var global;
            var resources;

            Ddb.siteRoot = 'http://www.deutsche-digitale-bibliothek.de/';

            $(function() {

                // workaround for ffox + ie click focus - prevents links that load dynamic content to be focussed/active. 
                $("a.noclickfocus").live('mouseup', function() {
                    $(this).blur();
                });

                var languageCookie = $.cookies.get('language');
                if (languageCookie
                        && languageCookie != Ddb.Data.TwoLetterLanguage) {
                    $.cookies.set('language', Ddb.Data.TwoLetterLanguage); // restore to valid cookie
                }

                resources = new Resources();
                global = new Global();

                Ddb.Publisher.Get("Search").Skip(1).Subscribe(function() {
                    global.body.find('nav li.search').addClass('active');
                });

                Ddb.Publisher.Get("ObjectQuery").Skip(1).Subscribe(
                        function() {
                            global.body.find('nav li.active').removeClass(
                                    'active').addClass('search');
                        });

                var toolbarNav = $('nav ul.toolbar');
                if (toolbarNav.length) {
                    ko.applyBindings(global, toolbarNav.get(0));
                }

                // register all widgets in page at DOM load
                $(".widget").RegisterWidget();

                // open all external links in a new tab
                // ideally should be find('a[rel=external']) or similar
                global.body.bind('click', function(e) {
                    var target = e.target;
                    if (target) {
                        var closestAnchor = $(target).closest('a');
                        if (closestAnchor.length) {
                            var href = closestAnchor.get(0).href;
                            if (href && href.indexOf('mailto:') !== 0) {
                                var isExternalLink = href
                                        .indexOf(window.location.host) == -1;
                                if (isExternalLink) {
                                    e.preventDefault();
                                    window.open(href);
                                }
                            }
                        }
                    }
                });

            });
        </script>
</body>
</html>

